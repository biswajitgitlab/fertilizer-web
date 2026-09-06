import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, User, Globe, Menu, X,
  LogOut, Package, Calendar, Stethoscope, ChevronDown, LayoutDashboard, Sun, Moon, Sprout,
  Bell, CheckCheck, Clock, Truck, Tag, Sparkles, AlertCircle, Copy, Check, ArrowRight, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useUIStore } from '../../store/uiStore';
import { useTranslation } from 'react-i18next';
import {
  AnimatedLeaf,
  AnimatedCart,
  AnimatedShield,
  AnimatedSparkles,
  AnimatedSearch
} from './AnimatedIcons';
import { productApi } from '../../api/productApi';
import { userNotificationApi, UserNotification } from '../../api/userNotificationApi';
import { echo } from '../../utils/echo';
import { Logo } from './Logo';
import { TopCouponMarquee } from './TopCouponMarquee';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, toggleDrawer, applyCoupon } = useCart();
  const {
    language, setLanguage, theme, toggleTheme,
    sidebarOpen: mobileMenuOpen, setSidebarOpen: setMobileMenuOpen,
    notifOpen, setNotifOpen, notifFilter, setNotifFilter
  } = useUIStore();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifVisibleCount, setNotifVisibleCount] = useState(6);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Body scroll lock on mobile when notification drawer is open
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (notifOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, [notifOpen]);

  useEffect(() => {
    if (!notifOpen) {
      setNotifVisibleCount(6);
    }
  }, [notifOpen]);

  const fetchNotifications = async () => {
    if (isAdmin) return;
    const res = await userNotificationApi.getNotifications();
    setNotifications(Array.isArray(res.notifications) ? res.notifications : []);
    setUnreadCount(typeof res.unread_count === 'number' ? res.unread_count : 0);
  };

  useEffect(() => {
    fetchNotifications();

    if (isAuthenticated && !isAdmin) {
      const channel = echo.channel('admin-orders');
      channel.listen('.OrderStatusUpdated', () => {
        fetchNotifications();
      });

      return () => {
        channel.stopListening('.OrderStatusUpdated');
        echo.leaveChannel('admin-orders');
      };
    }
  }, [isAuthenticated, isAdmin]);

  const handleMarkAllRead = async () => {
    const ids = safeNotifications.map(n => n.id);
    await userNotificationApi.markAllAsRead(ids);
    setUnreadCount(0);
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read', { icon: '✓', id: 'mark-all-read' });
  };

  const handleSingleMarkRead = async (e: React.MouseEvent, notifId: string) => {
    e.stopPropagation();
    await userNotificationApi.markAsRead(notifId);
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, unread: false } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const handleApplyCoupon = async (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);
      const res = await applyCoupon(code);
      if (res?.success) {
        toast.success(`🎉 Code "${code}" applied to your cart!`);
      } else {
        toast.success(`📋 Copied code "${code}" to clipboard!`);
      }
    } catch {
      toast.success(`📋 Copied code "${code}"!`);
    }
  };

  const handleNotificationClick = async (notif: UserNotification) => {
    if (notif.unread) {
      await userNotificationApi.markAsRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifOpen(false);
    const targetLink = notif.actionLink || notif.link;
    if (targetLink) {
      navigate(targetLink);
    }
  };

  const safeNotifications = Array.isArray(notifications) ? notifications : [];

  const ordersCount = safeNotifications.filter(n => {
    if (n.category === 'order') return true;
    if (n.category) return false;
    const t = `${n.title} ${n.message} ${n.type || ''}`.toLowerCase();
    return t.includes('order #') || t.includes('dispatch') || t.includes('out for delivery') || t.includes('shipped') || t.includes('tracking');
  }).length;

  const offersCount = safeNotifications.filter(n => {
    if (n.category === 'offer') return true;
    if (n.category) return false;
    const t = `${n.title} ${n.message} ${n.type || ''}`.toLowerCase();
    return t.includes('offer') || t.includes('coupon') || t.includes('discount') || t.includes('promo') || t.includes('sale') || t.includes('voucher') || t.includes('free delivery');
  }).length;

  const advisoryCount = safeNotifications.filter(n => {
    if (n.category === 'advisory') return true;
    if (n.category) return false;
    const t = `${n.title} ${n.message} ${n.type || ''}`.toLowerCase();
    return t.includes('crop') || t.includes('doctor') || t.includes('pest') || t.includes('agri') || t.includes('fertilizer') || t.includes('weather') || t.includes('alert') || t.includes('warning');
  }).length;

  const displayedNotifications = safeNotifications.filter(n => {
    if (notifFilter === 'unread') return n.unread;
    if (notifFilter === 'orders') {
      if (n.category === 'order') return true;
      if (n.category) return false;
      const t = `${n.title} ${n.message} ${n.type || ''}`.toLowerCase();
      return t.includes('order #') || t.includes('dispatch') || t.includes('out for delivery') || t.includes('shipped') || t.includes('tracking');
    }
    if (notifFilter === 'offers') {
      if (n.category === 'offer') return true;
      if (n.category) return false;
      const t = `${n.title} ${n.message} ${n.type || ''}`.toLowerCase();
      return t.includes('offer') || t.includes('coupon') || t.includes('discount') || t.includes('promo') || t.includes('sale') || t.includes('voucher') || t.includes('free delivery');
    }
    if (notifFilter === 'advisory') {
      if (n.category === 'advisory') return true;
      if (n.category) return false;
      const t = `${n.title} ${n.message} ${n.type || ''}`.toLowerCase();
      return t.includes('crop') || t.includes('doctor') || t.includes('pest') || t.includes('agri') || t.includes('fertilizer') || t.includes('weather') || t.includes('alert') || t.includes('warning');
    }
    return true;
  });

  const paginatedNotifications = displayedNotifications.slice(0, notifVisibleCount);

  const getNotificationIcon = (n: UserNotification) => {
    const cat = n.category || '';
    const t = `${n.title} ${n.message} ${n.type || ''}`.toLowerCase();

    if (cat === 'offer' || t.includes('coupon') || t.includes('discount') || t.includes('promo') || t.includes('sale') || t.includes('voucher') || t.includes('off ')) {
      return (
        <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 border border-amber-500/20 shadow-xs">
          <Sparkles className="w-4 h-4" />
        </div>
      );
    }
    if (cat === 'advisory' || t.includes('crop') || t.includes('doctor') || t.includes('pest') || t.includes('warning') || t.includes('advisory')) {
      return (
        <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5 border border-emerald-500/20 shadow-xs">
          <Sprout className="w-4 h-4" />
        </div>
      );
    }
    if (cat === 'order' || t.includes('deliver') || t.includes('shipped') || t.includes('dispatch') || t.includes('track') || t.includes('order #')) {
      return (
        <div className="p-2.5 rounded-2xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5 border border-blue-500/20 shadow-xs">
          <Truck className="w-4 h-4" />
        </div>
      );
    }
    return (
      <div className="p-2.5 rounded-2xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 shrink-0 mt-0.5 border border-purple-500/20 shadow-xs">
        <Bell className="w-4 h-4" />
      </div>
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      productApi.trackSearch(q);
      navigate(`/products?search=${encodeURIComponent(q)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLanguageToggle = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    i18n.changeLanguage(nextLang);
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    navigate('/login', { replace: true });
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      <header className="sticky top-0 z-40 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 shadow-xs transition-colors duration-300">
      {/* Top Banner */}
      <div className="bg-emerald-900 dark:bg-slate-950 text-emerald-100 text-xs py-1.5 border-b border-emerald-800/40 dark:border-slate-800">
        <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-10 flex justify-between items-center gap-2">
          <div className="flex items-center gap-1.5 truncate">
            <AnimatedShield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium text-[11px] sm:text-xs truncate">
              <span className="sm:hidden">Govt. Certified Agri Store &amp; Direct Delivery</span>
              <span className="hidden sm:inline">Government Certified Genuine Agricultural Inputs &amp; Direct Farm Delivery</span>
            </span>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="hidden md:inline text-xs text-emerald-200 dark:text-slate-400">Toll Free: 1800-888-FARM</span>
            
            {/* Dark / Light Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              className="flex items-center gap-1.5 font-semibold text-[11px] sm:text-xs cursor-pointer bg-emerald-800/80 dark:bg-slate-800 text-amber-300 dark:text-amber-400 hover:text-white px-2.5 py-1 rounded-lg border border-emerald-700/50 dark:border-slate-700 transition-all"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-amber-300" />}
              <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
            </button>

            <button
              onClick={handleLanguageToggle}
              className="flex items-center gap-1 hover:text-white font-semibold text-[11px] sm:text-xs cursor-pointer bg-emerald-800/80 dark:bg-slate-800 text-emerald-200 dark:text-slate-300 px-2 py-0.5 rounded-md border border-emerald-700/50 dark:border-slate-700"
            >
              <Globe className="w-3 h-3 text-emerald-300" />
              <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-[1440px] 2xl:max-w-[1536px] mx-auto px-3 sm:px-6 lg:px-10">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Logo */}
          <Link to={isAdmin ? '/admin/dashboard' : '/'} className="shrink-0 transition-transform duration-200 hover:scale-[1.02]">
            <Logo variant="navbar" isAdmin={isAdmin} />
          </Link>

          {/* Desktop Search — only for non-admin */}
          {!isAdmin && (
            <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
              <div className="absolute left-3.5 top-2.5">
                <AnimatedSearch className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
            </form>
          )}

          {/* Admin banner in navbar */}
          {isAdmin && (
            <div className="hidden md:flex items-center gap-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 text-xs font-bold px-3 py-1.5 rounded-xl">
              <AnimatedShield className="w-4 h-4 text-amber-600" />
              <span>Administrator Mode</span>
            </div>
          )}

          {/* Desktop Navigation — only for non-admin */}
          {!isAdmin && (
            <nav className="hidden lg:flex items-center gap-5 text-sm font-medium">
              <Link
                to="/"
                className={`transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                  isActive('/') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-700 dark:text-slate-300'
                }`}
              >
                {t('nav_home')}
              </Link>
              <Link
                to="/products"
                className={`transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                  isActive('/products') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-700 dark:text-slate-300'
                }`}
              >
                {t('nav_products')}
              </Link>
              <Link
                to="/diagnose"
                className={`flex items-center gap-1 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                  isActive('/diagnose') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-700 dark:text-slate-300'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span>{t('nav_diagnose')}</span>
              </Link>
              <Link
                to="/planner"
                className={`flex items-center gap-1 transition-colors hover:text-emerald-600 dark:hover:text-emerald-400 ${
                  isActive('/planner') ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-gray-700 dark:text-slate-300'
                }`}
              >
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>{t('nav_planner')}</span>
              </Link>
            </nav>
          )}

          {/* Right Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">

            {/* Cart Button — only for non-admin */}
            {!isAdmin && (
              <motion.button
                onClick={toggleDrawer}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                aria-label="View Cart"
              >
                <AnimatedCart className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700 dark:text-emerald-400" active={itemCount > 0} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-0.5 -right-0.5 bg-emerald-600 text-white text-[10px] sm:text-[11px] font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-xs"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}

            {/* Notification Bell Button — for non-admin (both authenticated & guests) */}
            {!isAdmin && (
              <div className="relative">
                <motion.button
                  onClick={() => {
                    setNotifOpen(!notifOpen);
                    setUserDropdownOpen(false);
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-800 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl transition-colors cursor-pointer flex items-center justify-center"
                  aria-label="View Notifications"
                >
                  <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700 dark:text-emerald-400" />
                  <AnimatePresence>
                    {unreadCount > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[10px] sm:text-[11px] font-black min-w-[18px] h-[18px] sm:min-w-[20px] sm:h-[20px] px-1 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md animate-pulse"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                {notifOpen && typeof document !== 'undefined' && createPortal(
                  <>
                    {/* Dark Dim Backdrop for touch dismiss on mobile */}
                    <div 
                      className="fixed inset-0 bg-slate-950/70 dark:bg-black/85 backdrop-blur-xs z-[115]"
                      onClick={() => setNotifOpen(false)}
                    />

                    {/* Mobile Bottom Sheet & Desktop Popover */}
                    <div className="fixed inset-x-0 bottom-0 z-[120] sm:bottom-auto sm:top-16 sm:right-6 sm:left-auto sm:w-[460px] bg-white dark:bg-slate-900 rounded-t-[28px] sm:rounded-3xl shadow-[0_-15px_50px_rgba(0,0,0,0.4)] sm:shadow-2xl border-t sm:border border-emerald-500/20 dark:border-slate-800 p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-4 max-h-[85dvh] sm:max-h-[620px] flex flex-col text-gray-900 dark:text-white animate-in slide-in-from-bottom-6 sm:slide-in-from-top-2 duration-200">
                      
                      {/* Mobile Drag Indicator Bar */}
                      <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3 sm:hidden shrink-0 cursor-pointer" onClick={() => setNotifOpen(false)} />

                      {/* Header */}
                      <div className="pb-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between shrink-0">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            <Bell className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs sm:text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                                Notifications
                              </h4>
                              {unreadCount > 0 && (
                                <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
                                  {unreadCount} new
                                </span>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">Real-time store, order &amp; farm advisory alerts</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={handleMarkAllRead}
                              className="text-[11px] font-black text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-800 px-2.5 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-emerald-500/20"
                            >
                              <CheckCheck className="w-3.5 h-3.5" />
                              <span>Mark read</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => setNotifOpen(false)}
                            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            aria-label="Close Notifications"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Guest Banner — helpful onboarding */}
                      {!isAuthenticated && (
                        <div className="mx-0.5 my-2 p-3 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/15 border border-emerald-500/25 flex items-center justify-between gap-3 shrink-0">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="p-1.5 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shrink-0">
                              <User className="w-3.5 h-3.5" />
                            </div>
                            <div className="text-left min-w-0">
                              <p className="text-xs font-black text-slate-900 dark:text-white">Track Your Farm Orders</p>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">Log in for live GPS parcel tracking &amp; invoices</p>
                            </div>
                          </div>
                          <Link
                            to="/login"
                            onClick={() => setNotifOpen(false)}
                            className="shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black px-3 py-1.5 rounded-xl transition-all shadow-xs"
                          >
                            Log In
                          </Link>
                        </div>
                      )}

                      {/* Filter Tabs: All / Orders / Offers / Advisory / Unread */}
                      <div className="flex border-b border-gray-100 dark:border-slate-800 py-2 gap-1.5 shrink-0 overflow-x-auto no-scrollbar">
                        {[
                          { id: 'all', label: `All (${safeNotifications.length})` },
                          { id: 'orders', label: `📦 Orders (${ordersCount})` },
                          { id: 'offers', label: `🏷️ Offers (${offersCount})` },
                          { id: 'advisory', label: `🌾 Advisory (${advisoryCount})` },
                          { id: 'unread', label: `Unread (${unreadCount})` }
                        ].map(tab => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => { setNotifFilter(tab.id as any); setNotifVisibleCount(6); }}
                            className={`text-xs font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                              notifFilter === tab.id
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-gray-600 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            {tab.label}
                          </button>
                        ))}
                      </div>

                      {/* Scrollable Items */}
                      <div className="overflow-y-auto divide-y divide-gray-100 dark:divide-slate-800/60 flex-1 my-1 pr-0.5 space-y-1">
                        {paginatedNotifications.length === 0 ? (
                          <div className="p-8 text-center text-xs text-gray-500 dark:text-slate-400 space-y-3">
                            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                              {notifFilter === 'orders' ? (
                                <Package className="w-7 h-7" />
                              ) : notifFilter === 'offers' ? (
                                <Tag className="w-7 h-7" />
                              ) : notifFilter === 'advisory' ? (
                                <Sprout className="w-7 h-7" />
                              ) : (
                                <CheckCheck className="w-7 h-7" />
                              )}
                            </div>
                            <div className="space-y-1">
                              <p className="font-black text-sm text-gray-900 dark:text-slate-100">
                                {notifFilter === 'unread' 
                                  ? 'All caught up!' 
                                  : notifFilter === 'orders' 
                                    ? 'No active orders yet' 
                                    : notifFilter === 'offers'
                                      ? 'No active promo codes right now'
                                      : notifFilter === 'advisory'
                                        ? 'Crops are healthy and secure'
                                        : 'No notifications'}
                              </p>
                              <p className="text-xs text-gray-400 dark:text-slate-500 max-w-xs mx-auto">
                                {notifFilter === 'unread'
                                  ? 'You have reviewed all store and order notifications.'
                                  : notifFilter === 'orders'
                                    ? 'Order dispatch alerts, invoice updates, and tracking will appear here.'
                                    : notifFilter === 'offers'
                                      ? 'Seasonal fertilizer discounts and cashbacks will appear here.'
                                      : notifFilter === 'advisory'
                                        ? 'No severe pest or crop pathogen warnings in your district.'
                                        : 'Store announcements and farm updates will appear here.'}
                              </p>
                            </div>

                            {/* Action CTA depending on tab */}
                            <div className="pt-2">
                              {notifFilter === 'orders' ? (
                                <button
                                  type="button"
                                  onClick={() => { setNotifOpen(false); navigate('/products'); }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                                >
                                  Browse Store Inputs
                                </button>
                              ) : notifFilter === 'advisory' ? (
                                <button
                                  type="button"
                                  onClick={() => { setNotifOpen(false); navigate('/diagnose'); }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                                >
                                  Try AI Crop Clinic
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => { setNotifFilter('all'); }}
                                  className="bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 font-black text-xs px-4 py-2 rounded-xl transition-all"
                                >
                                  View All Updates
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          paginatedNotifications.map((n) => (
                            <div
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`p-3 rounded-2xl my-1 transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/80 flex gap-3 items-start ${
                                n.unread 
                                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-l-[3.5px] border-emerald-500 shadow-2xs' 
                                  : 'border-l-[3.5px] border-transparent'
                              }`}
                            >
                              {getNotificationIcon(n)}
                              <div className="flex-1 space-y-1.5 text-xs min-w-0">
                                <div className="flex items-start justify-between gap-2">
                                  <div className="space-y-0.5 min-w-0">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <p className={`text-xs text-gray-900 dark:text-white leading-tight ${n.unread ? 'font-black' : 'font-extrabold'}`}>
                                        {n.title}
                                      </p>
                                      {n.badgeText && (
                                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                                          {n.badgeText}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-1 shrink-0">
                                    {n.unread ? (
                                      <button
                                        type="button"
                                        title="Mark as read"
                                        onClick={(e) => handleSingleMarkRead(e, n.id)}
                                        className="p-1 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-slate-800 rounded-lg"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                      </button>
                                    ) : null}
                                  </div>
                                </div>
                                <p className="text-gray-600 dark:text-slate-300 text-xs line-clamp-2 leading-relaxed">
                                  {n.message}
                                </p>
                                <div className="flex items-center justify-between pt-1 gap-2 flex-wrap">
                                  <p className="text-[10px] text-gray-400 dark:text-slate-500 flex items-center gap-1 font-medium">
                                    <Clock className="w-3 h-3 text-emerald-500/70" />
                                    <span>{n.time || 'Recent'}</span>
                                  </p>

                                  <div className="flex items-center gap-2">
                                    {n.couponCode && (
                                      <button
                                        type="button"
                                        onClick={(e) => handleApplyCoupon(e, n.couponCode!)}
                                        className="text-[10px] font-mono font-black bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-lg hover:bg-amber-500/25 transition flex items-center gap-1 cursor-pointer"
                                      >
                                        {copiedCode === n.couponCode ? (
                                          <>
                                            <Check className="w-3 h-3 text-emerald-500" />
                                            <span>Applied!</span>
                                          </>
                                        ) : (
                                          <>
                                            <Copy className="w-3 h-3" />
                                            <span>{n.couponCode}</span>
                                          </>
                                        )}
                                      </button>
                                    )}

                                    {(n.actionLabel || n.link) && (
                                      <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5">
                                        <span>{n.actionLabel || 'View Details'}</span>
                                        <ArrowRight className="w-2.5 h-2.5" />
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* 6+ Notifications Pagination ("Load More" footer bar) */}
                      {displayedNotifications.length > 6 && (
                        <div className="pt-2.5 pb-0.5 border-t border-gray-100 dark:border-slate-800 flex items-center justify-between text-xs shrink-0 px-1">
                          <span className="text-[11px] text-gray-500 dark:text-slate-400 font-semibold">
                            Showing {Math.min(notifVisibleCount, displayedNotifications.length)} of {displayedNotifications.length}
                          </span>
                          {notifVisibleCount < displayedNotifications.length ? (
                            <button
                              type="button"
                              onClick={() => setNotifVisibleCount((prev) => prev + 6)}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/70 hover:bg-emerald-100/90 dark:hover:bg-emerald-900/60 border border-emerald-200/80 dark:border-emerald-800/50 transition-all flex items-center gap-1 cursor-pointer active:scale-95 shadow-2xs"
                            >
                              <span>Load More</span>
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setNotifVisibleCount(6)}
                              className="text-[11px] font-bold text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 cursor-pointer"
                            >
                              Show Less ↑
                            </button>
                          )}
                        </div>
                      )}

                    </div>
                  </>,
                  document.body
                )}
              </div>
            )}

            {/* Auth Dropdown / Login — on mobile, hidden in header because it is in bottom nav 'Me' & drawer menu */}
            {isAuthenticated ? (
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                >
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full font-bold flex items-center justify-center text-xs sm:text-sm border ${
                    isAdmin
                      ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                      : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                  }`}>
                    {user?.name?.[0] || 'F'}
                  </div>
                  <span className="hidden md:inline text-sm font-semibold text-gray-800 dark:text-slate-200 max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-slate-400 hidden md:inline" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 py-2 z-50 animate-fade-in text-gray-900 dark:text-white">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-slate-800">
                      <p className="text-xs text-gray-400 dark:text-slate-400 font-medium">Logged in as</p>
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{user?.phone || user?.email}</p>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 mt-1 bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          <AnimatedShield size={12} className="text-amber-500" />
                          Administrator
                        </span>
                      )}
                    </div>

                    {/* Admin sees ONLY admin dashboard link */}
                    {isAdmin ? (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-amber-700 dark:text-amber-300 font-semibold hover:bg-amber-50 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        <span>Admin Dashboard</span>
                      </Link>
                    ) : (
                      /* Customer-only links */
                      <>
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <User className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                          <span>{t('nav_profile')}</span>
                        </Link>

                        <Link
                          to="/orders"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Package className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                          <span>{t('nav_orders')}</span>
                        </Link>

                        <Link
                          to="/diagnose"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Stethoscope className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                          <span>Crop Diagnosis</span>
                        </Link>

                        <Link
                          to="/planner"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 dark:text-slate-200 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Calendar className="w-4 h-4 text-gray-400 dark:text-slate-400" />
                          <span>Farm Planner</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-gray-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors font-medium cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:inline-block bg-emerald-600 text-white hover:bg-emerald-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all shadow-sm shadow-emerald-200 dark:shadow-none shrink-0"
              >
                {t('nav_login')}
              </Link>
            )}

            {/* Mobile Hamburger Toggle — only for non-admin */}
            {!isAdmin && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-1.5 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                aria-label="Toggle Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile Navigation Drawer — only for non-admin */}
        {!isAdmin && mobileMenuOpen && (
          <div className="lg:hidden border-b border-emerald-500/20 py-4 px-4 space-y-3 animate-fade-in bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl text-gray-900 dark:text-white shadow-2xl rounded-b-3xl">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder={t('search_placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-50/80 dark:bg-slate-800/80 border border-gray-200/80 dark:border-slate-700 rounded-2xl pl-9 pr-4 py-2.5 text-xs text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-400 focus:outline-none focus:border-emerald-500 shadow-inner"
              />
              <Search className="w-4 h-4 text-emerald-600 dark:text-emerald-400 absolute left-3 top-3" />
            </form>

            <div className="space-y-1.5">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800/80 hover:text-emerald-700 dark:hover:text-emerald-400 border border-transparent hover:border-emerald-200/50 transition-all"
              >
                <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('nav_home')}</span>
              </Link>
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800/80 hover:text-emerald-700 dark:hover:text-emerald-400 border border-transparent hover:border-emerald-200/50 transition-all"
              >
                <Package className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>{t('nav_products')}</span>
              </Link>
              <Link
                to="/diagnose"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/20 shadow-xs"
              >
                <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span>AI Crop Doctor &amp; Diagnosis</span>
              </Link>
              <Link
                to="/planner"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-amber-800 dark:text-amber-300 bg-amber-500/10 dark:bg-amber-950/60 border border-amber-500/20 shadow-xs"
              >
                <Calendar className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Farm Crop Planner</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setNotifOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-800 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-slate-800/80 hover:text-emerald-700 dark:hover:text-emerald-400 border border-transparent hover:border-emerald-200/50 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Notifications &amp; Alerts</span>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                    {unreadCount} new
                  </span>
                )}
              </button>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-800 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-all"
                  >
                    <User className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-gray-800 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-slate-800/80 transition-all"
                  >
                    <Package className="w-4 h-4 text-gray-500 dark:text-slate-400" />
                    <span>My Orders</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </>
              ) : (
                <div className="pt-2 flex gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-2xl text-xs shadow-md shadow-emerald-600/20 transition-all"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-slate-200 font-bold py-2.5 rounded-2xl text-xs border border-gray-200 dark:border-slate-700 transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
    </>
  );
};
