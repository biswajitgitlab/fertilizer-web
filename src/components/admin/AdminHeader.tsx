import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Bell, Search, Menu, Sparkles, Shield,
  Sun, Moon, Plus, ChevronDown, ChevronRight, ShoppingBag,
  Package, User, Key, ExternalLink, LogOut, Command, X, Activity,
  Database, Sliders, ArrowRight, UserCheck, ShieldCheck,
  RefreshCw, CheckCheck, AlertTriangle, DollarSign
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';
import { Logo } from '../common/Logo';
import { adminApi, adminAuthApi } from '../../api/adminApi';
import { useAdminNotificationStore } from '../../store/adminNotificationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { AdminNotificationCenter } from './AdminNotificationCenter';

interface AdminHeaderProps {
  title?: string;
  onOpenMobileSidebar: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  title = "Admin Portal",
  onOpenMobileSidebar
}) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();

  // Dropdown states
  const [profileOpen, setProfileOpen] = useState(false);
  const [quickActionOpen, setQuickActionOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Shared Admin Notifications Store
  const {
    unreadCount,
    loadNotifications,
    isDrawerOpen,
    setIsDrawerOpen
  } = useAdminNotificationStore();

  // Refs for click outside
  const profileRef = useRef<HTMLDivElement>(null);
  const quickActionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Initial load and periodic 45s auto-polling
  useEffect(() => {
    loadNotifications();
    const interval = setInterval(() => loadNotifications(true), 45000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

  // Handle global keyboard shortcuts (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setSearchModalOpen(false);
        setProfileOpen(false);
        setIsDrawerOpen(false);
        setQuickActionOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsDrawerOpen]);

  // Auto focus search input on modal open
  useEffect(() => {
    if (searchModalOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchModalOpen]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
      if (quickActionRef.current && !quickActionRef.current.contains(event.target as Node)) {
        setQuickActionOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await adminAuthApi.logout();
    } catch (e) {
      // ignore
    }
    logout();
    setProfileOpen(false);
    navigate('/admin/login', { replace: true });
  };

  // Quick navigation items for search command palette
  const commandQuickLinks = [
    { title: 'Dashboard Overview', category: 'Pages', icon: Activity, link: '/admin/dashboard' },
    { title: 'Staff & Internal Management', category: 'Users', icon: UserCheck, link: '/admin/users' },
    { title: 'Customer & Farmer CRM', category: 'Users', icon: User, link: '/admin/customers' },
    { title: 'Product Inventory Catalog', category: 'Catalog', icon: Package, link: '/admin/products' },
    { title: 'Order Fulfillment', category: 'Sales', icon: ShoppingBag, link: '/admin/orders' },
    { title: 'Crop Diagnosis Reviews', category: 'Agri AI', icon: Sliders, link: '/admin/diagnoses' },
    { title: 'Warehouse Stock Audit', category: 'Catalog', icon: Database, link: '/admin/inventory' },
    { title: 'Role & Permission Controls', category: 'Security', icon: Key, link: '/admin/roles' },
  ];

  const filteredCommands = commandQuickLinks.filter(cmd =>
    cmd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cmd.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header className={`sticky top-0 z-30 transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-slate-950/90 border-b border-slate-800/80 text-white shadow-xl shadow-black/30 backdrop-blur-2xl'
          : 'bg-white/95 border-b border-slate-200 text-slate-900 shadow-xs backdrop-blur-2xl'
      }`}>
        {/* Top Accent Gradient Bar */}
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500 via-teal-400 via-cyan-500 to-emerald-600 animate-gradient" />

        <div className="px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* LEFT SECTION: Mobile Drawer Hamburger, Logo, Page Title & Live Status Badge */}
          <div className="flex items-center gap-2 sm:gap-3.5 min-w-0">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={onOpenMobileSidebar}
              className={`lg:hidden p-2 rounded-xl transition-all duration-200 border cursor-pointer active:scale-95 ${
                theme === 'dark'
                  ? 'text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border-slate-800'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
              aria-label="Open Mobile Navigation Menu"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Mobile Brand Icon */}
            <div className="lg:hidden shrink-0">
              <Logo variant="icon" size="xs" />
            </div>

            {/* Title / System Live Status Pill */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="inline-flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border border-emerald-500/25 uppercase tracking-wider shrink-0 shadow-xs">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="hidden xs:inline">Live System</span>
                <span className="xs:hidden">LIVE</span>
              </span>

              {/* Mobile View Title snippet if title exists */}
              {title && (
                <span className={`text-xs sm:text-sm font-black truncate hidden sm:inline-block max-w-[150px] md:max-w-none ${
                  theme === 'dark' ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  {title}
                </span>
              )}
            </div>
          </div>

          {/* CENTER SECTION: Quick Search Trigger Command Button (Desktop/Tablet) */}
          <div className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-sm mx-2 lg:mx-4">
            <button
              onClick={() => setSearchModalOpen(true)}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs border transition-all duration-200 cursor-pointer group shadow-inner ${
                theme === 'dark'
                  ? 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-emerald-500/50 hover:bg-slate-900 hover:text-slate-200'
                  : 'bg-slate-50 border-slate-200 text-slate-500 hover:border-emerald-500/50 hover:bg-white hover:text-slate-900 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                <span className="truncate">Search orders, SKUs, staff...</span>
              </div>
              <div className={`hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-semibold border ${
                theme === 'dark'
                  ? 'bg-slate-950 border-slate-800 text-slate-400'
                  : 'bg-white border-slate-200 text-slate-500'
              }`}>
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
            </button>
          </div>

          {/* RIGHT SECTION: Quick Actions, Mobile Search Icon, Notifications, Theme, Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            
            {/* Mobile Search Icon Trigger */}
            <button
              onClick={() => setSearchModalOpen(true)}
              className={`md:hidden p-2 rounded-xl border transition-all cursor-pointer active:scale-95 ${
                theme === 'dark'
                  ? 'text-slate-300 hover:text-white bg-slate-900/80 border-slate-800'
                  : 'text-slate-600 hover:text-slate-900 bg-slate-100 border-slate-200'
              }`}
              title="Search System"
              aria-label="Search System"
            >
              <Search className="w-4.5 h-4.5" />
            </button>

            {/* Quick Action Dropdown Trigger (+ New) */}
            <div className="relative" ref={quickActionRef}>
              {/* Desktop/Tablet Expanded Action Trigger */}
              <button
                onClick={() => setQuickActionOpen(!quickActionOpen)}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer shadow-md border active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-emerald-500/30 shadow-emerald-950/40'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-500/40 shadow-emerald-600/20'
                }`}
                title="Quick Admin Actions"
              >
                <Plus className="w-4 h-4" />
                <span>Action</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${quickActionOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Mobile Compact + Action Icon Trigger */}
              <button
                onClick={() => setQuickActionOpen(!quickActionOpen)}
                className={`sm:hidden p-2 rounded-xl text-white font-bold transition-all duration-200 cursor-pointer shadow-md border active:scale-95 ${
                  theme === 'dark'
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500/40 shadow-emerald-950/40'
                    : 'bg-emerald-600 border-emerald-500/40 shadow-emerald-600/20'
                }`}
                title="Quick Create"
                aria-label="Quick Create"
              >
                <Plus className="w-4.5 h-4.5" />
              </button>

              {/* Quick Action Dropdown Popover */}
              {quickActionOpen && (
                <div className={`absolute right-0 mt-2.5 w-64 rounded-2xl shadow-2xl border p-2 z-50 animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-150 ${
                  theme === 'dark'
                    ? 'bg-slate-900/95 border-slate-800 text-slate-100 backdrop-blur-xl shadow-black/80'
                    : 'bg-white/95 border-slate-200/90 text-slate-900 backdrop-blur-xl shadow-2xl'
                }`}>
                  <div className="px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span>Quick Creation Hub</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">Shortcuts</span>
                  </div>
                  <div className="py-1 space-y-1">
                    <Link
                      to="/admin/products/new"
                      onClick={() => setQuickActionOpen(false)}
                      className="group flex items-center justify-between p-2 rounded-xl text-xs transition-all hover:bg-emerald-50/70 dark:hover:bg-slate-800/80 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                          <Package className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            New Product SKU
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            Fertilizer, seed or pesticide
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all opacity-40 group-hover:opacity-100" />
                    </Link>

                    <Link
                      to="/admin/coupons"
                      onClick={() => setQuickActionOpen(false)}
                      className="group flex items-center justify-between p-2 rounded-xl text-xs transition-all hover:bg-teal-50/70 dark:hover:bg-slate-800/80 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            Discount Coupon
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            Seasonal discount campaign
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all opacity-40 group-hover:opacity-100" />
                    </Link>

                    <Link
                      to="/admin/users"
                      onClick={() => setQuickActionOpen(false)}
                      className="group flex items-center justify-between p-2 rounded-xl text-xs transition-all hover:bg-cyan-50/70 dark:hover:bg-slate-800/80 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            Invite Staff Member
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            Grant role & warehouse zone
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all opacity-40 group-hover:opacity-100" />
                    </Link>

                    <Link
                      to="/admin/analytics"
                      onClick={() => setQuickActionOpen(false)}
                      className="group flex items-center justify-between p-2 rounded-xl text-xs transition-all hover:bg-indigo-50/70 dark:hover:bg-slate-800/80 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                          <Activity className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            Run Revenue Audit
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            Margins, tax & cashflows
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all opacity-40 group-hover:opacity-100" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Theme"
              className={`p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center border active:scale-95 ${
                theme === 'dark'
                  ? 'text-amber-400 hover:text-amber-300 bg-slate-900/80 hover:bg-slate-800 border-slate-800'
                  : 'text-amber-600 hover:text-amber-700 bg-slate-100 hover:bg-amber-50 border-slate-200'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className="w-4.5 h-4.5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-amber-600 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Notification Bell with High-Visibility Badge & Responsive Center */}
            <div className="relative">
              <motion.button
                onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative p-2 rounded-xl border transition-all duration-200 cursor-pointer flex items-center justify-center active:scale-95 ${
                  theme === 'dark'
                    ? 'text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border-slate-800'
                    : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
                }`}
                title="Admin Activity Notifications"
                aria-label="Admin Activity Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <AnimatePresence>
                  {unreadCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white dark:border-slate-950 shadow-md animate-pulse"
                    >
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Portal-rendered Native Mobile Bottom Sheet & Desktop Popover */}
              <AdminNotificationCenter />
            </div>

            {/* Admin Profile Dropdown Trigger */}
            <div className="relative pl-1.5 sm:pl-2 border-l border-slate-800/80 dark:border-slate-800" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className={`flex items-center gap-2 p-1 rounded-2xl transition-all duration-200 cursor-pointer border active:scale-95 ${
                  theme === 'dark'
                    ? 'hover:bg-slate-900 border-slate-800/90 text-slate-200'
                    : 'hover:bg-slate-100 border-slate-200 text-slate-800'
                }`}
                title="Admin Account & Settings"
                aria-label="Admin Profile"
              >
                {/* Initial Avatar Badge */}
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 text-white font-black flex items-center justify-center text-xs shadow-md border border-emerald-400/40 shrink-0">
                  {user?.name?.[0] || 'A'}
                </div>

                <div className="hidden lg:block text-left pr-1">
                  <div className="flex items-center gap-1">
                    <p className={`text-xs font-extrabold leading-tight ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                      {user?.name || 'Store Admin'}
                    </p>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <p className="text-[10px] text-emerald-500 font-extrabold tracking-wider uppercase leading-tight">
                    {user?.role || 'Staff Admin'}
                  </p>
                </div>

                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 hidden lg:block transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Admin Profile Executive Menu Dropdown */}
              {profileOpen && (
                <div className={`absolute right-0 mt-2.5 w-72 rounded-2xl shadow-2xl border p-2.5 z-50 animate-in fade-in slide-in-from-top-2 zoom-in-95 duration-150 ${
                  theme === 'dark'
                    ? 'bg-slate-900/95 border-slate-800 text-slate-100 backdrop-blur-xl shadow-black/90'
                    : 'bg-white/95 border-slate-200/90 text-slate-900 backdrop-blur-xl shadow-2xl'
                }`}>
                  {/* User Details Header Card */}
                  <div className="p-3 bg-gradient-to-br from-emerald-500/10 via-teal-500/10 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-transparent rounded-xl border border-emerald-500/20 mb-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
                          {user?.name?.[0] || 'A'}
                        </div>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black truncate">{user?.name || 'Store Administrator'}</p>
                        <p className="text-[10px] text-slate-400 truncate">{user?.email || 'admin@fertilizershop.com'}</p>
                        <span className="inline-block mt-1 text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 uppercase tracking-widest">
                          {user?.role || 'Staff Member'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="space-y-1">
                    <div className="px-2 py-1 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                      Administrative Control
                    </div>

                    <Link
                      to="/admin/users"
                      onClick={() => setProfileOpen(false)}
                      className="group flex items-center justify-between p-2 rounded-xl text-xs transition-all hover:bg-emerald-50/70 dark:hover:bg-slate-800/80 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                          <UserCheck className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            Staff Directory
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            Manage team permissions
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all opacity-40 group-hover:opacity-100" />
                    </Link>

                    <Link
                      to="/admin/roles"
                      onClick={() => setProfileOpen(false)}
                      className="group flex items-center justify-between p-2 rounded-xl text-xs transition-all hover:bg-teal-50/70 dark:hover:bg-slate-800/80 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0 group-hover:bg-teal-600 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                          <Shield className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                            Roles & Security
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            RBAC & audit access logs
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 group-hover:translate-x-0.5 transition-all opacity-40 group-hover:opacity-100" />
                    </Link>

                    <Link
                      to="/"
                      onClick={() => setProfileOpen(false)}
                      className="group flex items-center justify-between p-2 rounded-xl text-xs transition-all hover:bg-cyan-50/70 dark:hover:bg-slate-800/80 cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-cyan-600 group-hover:text-white group-hover:scale-105 transition-all shadow-2xs">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                            Exit to Storefront
                          </p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">
                            View public customer store
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all opacity-40 group-hover:opacity-100" />
                    </Link>
                  </div>

                  {/* Logout Action */}
                  <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-between p-2 rounded-xl text-xs font-bold text-rose-500 hover:text-rose-600 bg-rose-500/10 hover:bg-rose-500/20 transition-all cursor-pointer border border-rose-500/20 active:scale-95 group"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-rose-500/15 text-rose-500 flex items-center justify-center shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-2xs">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold">Log Out Session</p>
                          <p className="text-[10px] text-slate-400 dark:text-slate-500 font-normal">End admin console access</p>
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-rose-400 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </header>

      {/* GLOBAL SEARCH COMMAND PALETTE MODAL (Touch Friendly + Ctrl+K) */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-6 sm:pt-24 px-2 sm:px-4">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-200"
            onClick={() => setSearchModalOpen(false)}
          />

          {/* Modal Container */}
          <div className={`relative w-full max-w-2xl rounded-3xl shadow-2xl border overflow-hidden z-10 animate-in zoom-in-95 duration-150 ${
            theme === 'dark'
              ? 'bg-slate-900/95 border-slate-800 text-white backdrop-blur-2xl shadow-emerald-950/20'
              : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
          }`}>
            {/* Search Bar Input Header */}
            <div className="p-3.5 sm:p-4 border-b border-slate-800/80 dark:border-slate-800 flex items-center gap-3">
              <Search className="w-5 h-5 text-emerald-500 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders, staff, SKUs, inventory, or pages..."
                className={`w-full bg-transparent text-sm sm:text-base font-medium focus:outline-none placeholder-slate-500 ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}
              />
              {searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="p-1.5 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={() => setSearchModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Command Results */}
            <div className="p-2 sm:p-3 max-h-[60vh] sm:max-h-96 overflow-y-auto space-y-1">
              <div className="px-3 py-1 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                Quick Portal Navigation
              </div>

              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => {
                  const Icon = cmd.icon;
                  return (
                    <div
                      key={idx}
                      onClick={() => {
                        setSearchModalOpen(false);
                        navigate(cmd.link);
                      }}
                      className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all active:scale-[0.99] ${
                        theme === 'dark'
                          ? 'hover:bg-slate-800/80 hover:text-emerald-400'
                          : 'hover:bg-emerald-50 hover:text-emerald-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-bold">{cmd.title}</p>
                          <p className="text-[10px] text-slate-400">{cmd.category}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center text-slate-500 text-xs font-medium">
                  No system modules match "{searchQuery}".
                </div>
              )}
            </div>

            {/* Footer Hint */}
            <div className={`p-3 border-t text-[11px] text-slate-400 flex items-center justify-between px-4 sm:px-5 ${
              theme === 'dark' ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <span className="flex items-center gap-1.5">
                <Command className="w-3.5 h-3.5 text-emerald-500" />
                <span className="truncate">Fertilizer Admin Intelligent Search</span>
              </span>
              <span className="hidden sm:inline">Press <b>ESC</b> to close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
