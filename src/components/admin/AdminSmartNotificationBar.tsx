import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Truck, AlertTriangle, Sparkles, ShieldCheck,
  Check, ChevronLeft, ChevronRight, X, Bell,
  DollarSign, Activity, Eye, ArrowRight
} from 'lucide-react';
import { useAdminNotificationStore } from '../../store/adminNotificationStore';
import { useUIStore } from '../../store/uiStore';
import { AdminNotificationCategory } from '../../types/adminNotification';

export const AdminSmartNotificationBar: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useUIStore();
  const {
    notifications,
    unreadCount,
    currentIndex,
    isPaused,
    dismissed,
    loadNotifications,
    markAsRead,
    dismissBanner,
    nextNotification,
    prevNotification,
    setCurrentIndex,
    setIsPaused,
    setIsDrawerOpen,
    openWithFilter
  } = useAdminNotificationStore();

  const [copiedNotification, setCopiedNotification] = useState<string | null>(null);

  // Load notifications on mount and set up periodic 45s refresh
  useEffect(() => {
    loadNotifications();
    const refreshInterval = setInterval(() => {
      loadNotifications(true);
    }, 45000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Auto-rotate ticker carousel every 7 seconds unless paused on hover/touch
  useEffect(() => {
    if (dismissed || isPaused || notifications.length <= 1) return;
    const interval = setInterval(() => {
      nextNotification();
    }, 7000);
    return () => clearInterval(interval);
  }, [dismissed, isPaused, notifications.length, nextNotification]);

  if (dismissed || notifications.length === 0) return null;

  const current = notifications[currentIndex] || notifications[0];
  if (!current) return null;

  // Category Theme Definitions (Senior Designer Tailored Palettes)
  const getCategoryStyles = (category: AdminNotificationCategory) => {
    switch (category) {
      case 'orders':
        return {
          glow: 'from-blue-500/15 via-sky-500/10 to-indigo-500/15',
          border: theme === 'dark' ? 'border-blue-500/30' : 'border-blue-300',
          badge: theme === 'dark' ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' : 'bg-blue-50 text-blue-700 border-blue-200',
          iconBg: theme === 'dark' ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600',
          icon: <Package className="w-4 h-4 animate-pulse" />,
          accentBtn: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25',
          label: 'Order Telemetry'
        };
      case 'inventory':
        return {
          glow: 'from-amber-500/15 via-orange-500/10 to-red-500/15',
          border: theme === 'dark' ? 'border-amber-500/30' : 'border-amber-300',
          badge: theme === 'dark' ? 'bg-amber-500/20 text-amber-300 border-amber-400/30' : 'bg-amber-50 text-amber-800 border-amber-200',
          iconBg: theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700',
          icon: <AlertTriangle className="w-4 h-4 animate-bounce" />,
          accentBtn: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white shadow-amber-500/25',
          label: 'Inventory Alert'
        };
      case 'diagnoses':
        return {
          glow: 'from-purple-500/15 via-fuchsia-500/10 to-emerald-500/15',
          border: theme === 'dark' ? 'border-purple-500/30' : 'border-purple-300',
          badge: theme === 'dark' ? 'bg-purple-500/20 text-purple-300 border-purple-400/30' : 'bg-purple-50 text-purple-800 border-purple-200',
          iconBg: theme === 'dark' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700',
          icon: <Sparkles className="w-4 h-4 text-purple-400" />,
          accentBtn: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-500 hover:to-fuchsia-500 text-white shadow-purple-500/25',
          label: 'Crop Doctor AI'
        };
      case 'settlement':
        return {
          glow: 'from-emerald-500/15 via-teal-500/10 to-cyan-500/15',
          border: theme === 'dark' ? 'border-emerald-500/30' : 'border-emerald-300',
          badge: theme === 'dark' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' : 'bg-emerald-50 text-emerald-800 border-emerald-200',
          iconBg: theme === 'dark' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700',
          icon: <DollarSign className="w-4 h-4 text-emerald-400" />,
          accentBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-500/25',
          label: 'Finance & COD'
        };
      case 'security':
      case 'system':
      default:
        return {
          glow: 'from-cyan-500/15 via-slate-500/10 to-indigo-500/15',
          border: theme === 'dark' ? 'border-cyan-500/30' : 'border-cyan-300',
          badge: theme === 'dark' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30' : 'bg-cyan-50 text-cyan-800 border-cyan-200',
          iconBg: theme === 'dark' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700',
          icon: <ShieldCheck className="w-4 h-4 text-cyan-400" />,
          accentBtn: 'bg-gradient-to-r from-cyan-600 to-slate-700 hover:from-cyan-500 hover:to-slate-600 text-white shadow-cyan-500/25',
          label: 'System Integrity'
        };
    }
  };

  const style = getCategoryStyles(current.category);

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (current.unread) {
      markAsRead(current.id);
    }
    const target = current.actionLink || current.link;
    if (target) {
      navigate(target);
    }
  };

  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(current.id);
    setCopiedNotification(current.id);
    setTimeout(() => setCopiedNotification(null), 2000);
  };

  return (
    <div
      className="w-full px-3 sm:px-6 lg:px-8 pt-2.5 pb-1 relative z-30 transition-all duration-300"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className={`relative overflow-hidden rounded-2xl sm:rounded-2xl border ${style.border} shadow-lg backdrop-blur-2xl transition-all duration-300 ${
          theme === 'dark'
            ? 'bg-slate-950/90 text-slate-100 shadow-black/40'
            : 'bg-white/95 text-slate-900 shadow-emerald-950/5'
        }`}
      >
        {/* Subtle Ambient Background Gradient Wash */}
        <div className={`absolute inset-0 bg-gradient-to-r ${style.glow} pointer-events-none opacity-80`} />

        {/* Top Shimmer Border Highlight */}
        <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent pointer-events-none" />

        {/* DESKTOP VIEW (sm and above) */}
        <div className="hidden sm:flex items-center justify-between gap-3 px-3.5 py-2.5 relative z-10">
          
          {/* Left: Category Icon + Live Beacon + Category Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Live Telemetry Pulsing Beacon */}
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="hidden xl:inline">Live Store Alert</span>
            </div>

            {/* Category Icon Container */}
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 border border-white/10 ${style.iconBg} shadow-xs`}>
              {style.icon}
            </div>

            {/* Category Badge */}
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-lg border ${style.badge}`}>
              {current.badgeText || style.label}
            </span>
          </div>

          {/* Center: Animated Carousel Content */}
          <div className="min-w-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-2.5 truncate"
              >
                <p className="text-xs sm:text-sm font-black truncate text-slate-900 dark:text-white">
                  {current.title}
                </p>

                {current.metric && (
                  <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md border shrink-0 ${
                    theme === 'dark'
                      ? 'bg-slate-800/90 text-emerald-300 border-slate-700'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}>
                    {current.metric.value}
                  </span>
                )}

                <span className="hidden lg:inline text-xs text-slate-500 dark:text-slate-400 truncate max-w-md">
                  — {current.message}
                </span>

                <span className="text-[10px] text-slate-400 font-medium shrink-0 ml-auto hidden xl:inline">
                  {current.time}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: Direct 1-Click CTA Button + Navigation Arrows + Dismiss */}
          <div className="flex items-center gap-2 shrink-0">
            {/* 1-Click Action CTA Button */}
            <button
              type="button"
              onClick={handleActionClick}
              className={`text-xs font-black px-3 py-1.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all duration-200 active:scale-95 cursor-pointer ${style.accentBtn}`}
            >
              <span>{current.actionLabel || 'View Details'}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            {/* Carousel Navigation (< and >) */}
            {notifications.length > 1 && (
              <div className="flex items-center gap-0.5 bg-black/5 dark:bg-white/5 p-0.5 rounded-xl border border-black/10 dark:border-white/10">
                <button
                  type="button"
                  onClick={prevNotification}
                  title="Previous Alert"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Previous notification"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] font-mono font-bold text-slate-400 px-1 select-none">
                  {currentIndex + 1}/{notifications.length}
                </span>
                <button
                  type="button"
                  onClick={nextNotification}
                  title="Next Alert"
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Next notification"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Mark as Read Button */}
            {current.unread && (
              <button
                type="button"
                onClick={handleMarkAsRead}
                title="Mark this alert as read"
                className="p-1.5 rounded-xl text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-emerald-500/10 transition-colors cursor-pointer"
                aria-label="Mark as read"
              >
                {copiedNotification === current.id ? (
                  <Check className="w-4 h-4 text-emerald-500" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
              </button>
            )}

            {/* View All Drawer Trigger */}
            <button
              type="button"
              onClick={() => openWithFilter(current.category)}
              title="Open Full Notification Center"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer relative"
              aria-label="View all notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-black min-w-[16px] h-[16px] px-1 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-xs">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Dismiss Bar */}
            <button
              type="button"
              onClick={dismissBanner}
              title="Dismiss notification ticker for this session"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Dismiss banner"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

        </div>

        {/* MOBILE VIEW (< sm: Compact Touch-Optimized Layout) */}
        <div className="sm:hidden px-3 py-2 relative z-10 space-y-1.5">
          {/* Top Row: Icon + Badge + Time + Notification Bell + Dismiss */}
          <div className="flex items-center justify-between gap-1.5">
            <div className="flex items-center gap-1.5 min-w-0">
              <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${style.iconBg}`}>
                {style.icon}
              </div>
              <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md border truncate ${style.badge}`}>
                {current.badgeText || style.label}
              </span>
              <span className="text-[9px] text-slate-400 font-medium truncate">
                {current.time}
              </span>
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {/* Mobile Notification Center Trigger */}
              <button
                type="button"
                onClick={() => openWithFilter(current.category)}
                title="Open Notification Center"
                className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer relative"
                aria-label="Open Activity Center"
              >
                <Bell className="w-3.5 h-3.5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-rose-600 text-white text-[8px] font-black min-w-[14px] h-[14px] px-0.5 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-xs">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Quick Dismiss */}
              <button
                type="button"
                onClick={dismissBanner}
                title="Dismiss banner"
                className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                aria-label="Dismiss alert"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Middle Row: Title + Metric */}
          <div className="min-w-0" onClick={() => {
            if (current.actionLink || current.link) {
              handleActionClick();
            } else {
              openWithFilter(current.category);
            }
          }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-0.5 cursor-pointer"
              >
                <p className="text-xs font-black leading-tight text-slate-900 dark:text-white line-clamp-1">
                  {current.title}
                </p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {current.message}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom Row: 1-Tap Action Pill + Indicators */}
          <div className="flex items-center justify-between pt-0.5 gap-2">
            {/* Carousel Dots */}
            {notifications.length > 1 ? (
              <div className="flex items-center gap-1">
                {notifications.slice(0, 5).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentIndex(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === currentIndex
                        ? 'w-4 bg-emerald-500'
                        : 'w-1.5 bg-slate-400/30'
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            ) : <div />}

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleActionClick}
                className={`text-[10px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 ${style.accentBtn}`}
              >
                <span>{current.actionLabel || 'Action'}</span>
                <ArrowRight className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
