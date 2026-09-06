import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Truck, Sparkles, Sprout, ChevronRight, X, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUIStore } from '../../store/uiStore';
import { userNotificationApi, UserNotification } from '../../api/userNotificationApi';
import { useCart } from '../../hooks/useCart';

export const MobileHomeNotificationBar: React.FC = () => {
  const { openNotifWithFilter } = useUIStore();
  const { applyCoupon } = useCart();
  const [notifications, setNotifications] = useState<UserNotification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    // Check if dismissed in this session
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('mobile_notif_banner_dismissed') === 'true') {
      setDismissed(true);
    }

    const load = async () => {
      try {
        const res = await userNotificationApi.getNotifications();
        if (res && Array.isArray(res.notifications) && res.notifications.length > 0) {
          // Prioritize unread notifications, or show all
          const unreadOrAll = res.notifications.filter(n => n.unread);
          setNotifications(unreadOrAll.length > 0 ? unreadOrAll : res.notifications);
        }
      } catch {
        // Fallback handled inside userNotificationApi
      }
    };
    load();
  }, []);

  // Auto-rotate if multiple notifications exist
  useEffect(() => {
    if (notifications.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [notifications.length]);

  if (dismissed || notifications.length === 0) return null;

  const current = notifications[currentIndex];

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissed(true);
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('mobile_notif_banner_dismissed', 'true');
    }
  };

  const handleApplyCoupon = async (e: React.MouseEvent, code: string) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => setCopiedCode(null), 3000);
      const res = await applyCoupon(code);
      if (res?.success) {
        toast.success(`🎉 Code "${code}" applied to cart!`);
      } else {
        toast.success(`📋 Copied "${code}" to clipboard!`);
      }
    } catch {
      toast.success(`📋 Copied "${code}"!`);
    }
  };

  const getCategoryTheme = () => {
    const cat = current?.category || '';
    const t = `${current?.title || ''} ${current?.message || ''}`.toLowerCase();
    if (cat === 'order' || t.includes('order') || t.includes('deliver') || t.includes('shipped')) {
      return {
        bg: 'from-blue-950/90 via-slate-900/90 to-blue-900/80',
        border: 'border-blue-500/30',
        badge: 'bg-blue-500/20 text-blue-300 border-blue-400/30',
        icon: <Truck className="w-3.5 h-3.5 text-blue-400 shrink-0 animate-bounce" />,
        defaultLabel: 'Live Order Update',
        filter: 'orders' as const
      };
    }
    if (cat === 'offer' || t.includes('offer') || t.includes('coupon') || t.includes('discount')) {
      return {
        bg: 'from-amber-950/90 via-slate-900/90 to-amber-900/80',
        border: 'border-amber-500/30',
        badge: 'bg-amber-500/20 text-amber-300 border-amber-400/30',
        icon: <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-spin-slow" />,
        defaultLabel: 'Limited Offer',
        filter: 'offers' as const
      };
    }
    if (cat === 'advisory' || t.includes('crop') || t.includes('pest') || t.includes('doctor')) {
      return {
        bg: 'from-emerald-950/90 via-slate-900/90 to-teal-900/80',
        border: 'border-emerald-500/30',
        badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
        icon: <Sprout className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
        defaultLabel: 'Crop Advisory',
        filter: 'advisory' as const
      };
    }
    return {
      bg: 'from-emerald-950/90 via-slate-900/90 to-teal-900/80',
      border: 'border-emerald-500/30',
      badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30',
      icon: <Bell className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
      defaultLabel: 'Store Alert',
      filter: 'all' as const
    };
  };

  const theme = getCategoryTheme();

  return (
    <div className="md:hidden w-full px-3 pt-2 pb-1 relative z-30">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={() => openNotifWithFilter(theme.filter)}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-r ${theme.bg} border ${theme.border} p-2.5 shadow-lg shadow-black/25 backdrop-blur-xl cursor-pointer active:scale-[0.99] transition-transform`}
      >
        {/* Subtle decorative shimmer */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between gap-2">
          
          {/* Left Icon with Pulse Glow */}
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-xl bg-white/10 dark:bg-black/30 backdrop-blur-md flex items-center justify-center shrink-0 border border-white/15">
              {theme.icon}
            </div>

            {/* Notification Content Carousel */}
            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -12 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-0.5"
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded-md border ${theme.badge}`}>
                      {current.badgeText || theme.defaultLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {current.time || 'Recent'}
                    </span>
                  </div>
                  <p className="text-xs font-black text-white truncate leading-tight">
                    {current.title}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Right Action Trigger & Dismiss */}
          <div className="flex items-center gap-1 shrink-0">
            {current.couponCode ? (
              <button
                type="button"
                onClick={(e) => handleApplyCoupon(e, current.couponCode!)}
                className="text-[10px] font-mono font-black bg-amber-400 text-slate-950 px-2 py-1 rounded-xl shadow-xs flex items-center gap-1 active:scale-95 transition-transform cursor-pointer"
              >
                {copiedCode === current.couponCode ? (
                  <>
                    <Check className="w-3 h-3" />
                    <span>Applied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{current.couponCode}</span>
                  </>
                )}
              </button>
            ) : (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-black text-emerald-400 dark:text-emerald-300 bg-white/10 hover:bg-white/20 px-2 py-1 rounded-xl border border-white/10 transition-colors">
                <span>View</span>
                <ChevronRight className="w-3 h-3" />
              </span>
            )}

            {/* Quick Dismiss Button */}
            <button
              type="button"
              onClick={handleDismiss}
              title="Dismiss banner"
              className="p-1 text-slate-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer ml-0.5"
              aria-label="Dismiss alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        {/* Carousel indicator dots if multiple notifications */}
        {notifications.length > 1 && (
          <div className="flex items-center justify-center gap-1 pt-1.5">
            {notifications.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === currentIndex
                    ? 'w-4 bg-emerald-400'
                    : 'w-1 bg-white/20'
                }`}
              />
            ))}
          </div>
        )}

      </motion.div>
    </div>
  );
};
