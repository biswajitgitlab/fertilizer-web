import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
  Bell, CheckCheck, RefreshCw, X, ArrowRight,
  Package, AlertTriangle, Sparkles, DollarSign,
  UserCheck, Activity, Shield, Inbox
} from 'lucide-react';
import { useAdminNotificationStore } from '../../store/adminNotificationStore';
import { useUIStore } from '../../store/uiStore';
import { useAuthStore } from '../../store/authStore';
import { AdminNotificationCategory } from '../../types/adminNotification';

export const AdminNotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { theme } = useUIStore();
  const {
    notifications,
    unreadCount,
    isLoading,
    isDrawerOpen,
    activeFilter,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    setActiveFilter,
    setIsDrawerOpen
  } = useAdminNotificationStore();

  const containerRef = useRef<HTMLDivElement>(null);

  // Lock body scroll on mobile when bottom sheet is open
  useEffect(() => {
    if (isDrawerOpen && typeof document !== 'undefined') {
      const originalOverflow = document.body.style.overflow;
      // On mobile view, prevent background scrolling
      if (window.innerWidth < 640) {
        document.body.style.overflow = 'hidden';
      }
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isDrawerOpen]);

  // Handle ESC key dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        setIsDrawerOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, setIsDrawerOpen]);

  if (!isDrawerOpen || typeof document === 'undefined') {
    return null;
  }

  // Filter tabs definition
  const filterTabs: { key: 'all' | AdminNotificationCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'orders', label: 'Orders' },
    { key: 'inventory', label: 'Stock' },
    { key: 'diagnoses', label: 'Crop AI' },
    { key: 'settlement', label: 'Finance' },
    { key: 'security', label: 'Security & Team' }
  ];

  // Match items based on active tab
  const isMatch = (item: any, catKey: string) => {
    if (catKey === 'all') return true;
    if (catKey === 'orders') return item.category === 'orders' || item.type === 'order' || item.required_permission === 'orders.view';
    if (catKey === 'inventory') return item.category === 'inventory' || item.type === 'warning' || item.required_permission === 'inventory.view';
    if (catKey === 'diagnoses') return item.category === 'diagnoses' || item.type === 'diagnosis' || item.required_permission === 'diagnoses.view';
    if (catKey === 'settlement') return item.category === 'settlement' || item.required_permission === 'reports.view';
    if (catKey === 'security') return item.category === 'security' || item.type === 'user' || item.required_permission === 'roles.manage';
    return item.category === catKey;
  };

  const filteredNotifications = notifications.filter(item => isMatch(item, activeFilter));

  // Calculate unread count per tab
  const getTabUnreadCount = (tabKey: string) => {
    if (tabKey === 'all') return unreadCount;
    return notifications.filter(n => n.unread && isMatch(n, tabKey)).length;
  };

  const handleItemClick = (item: any) => {
    if (item.unread) {
      markAsRead(String(item.id));
    }
    setIsDrawerOpen(false);
    const target = item.actionLink || item.link;
    if (target) {
      navigate(target);
    }
  };

  const handleItemMarkRead = (id: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(String(id));
  };

  const getItemIcon = (item: any) => {
    if (item.category === 'inventory' || item.type === 'warning') {
      return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    }
    if (item.category === 'orders' || item.type === 'order') {
      return <Package className="w-4 h-4 text-blue-500" />;
    }
    if (item.category === 'diagnoses' || item.type === 'diagnosis') {
      return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
    if (item.category === 'settlement') {
      return <DollarSign className="w-4 h-4 text-emerald-400" />;
    }
    if (item.category === 'security' || item.type === 'user') {
      return <UserCheck className="w-4 h-4 text-cyan-400" />;
    }
    return <Activity className="w-4 h-4 text-indigo-400" />;
  };

  const getItemIconBg = (item: any) => {
    if (item.category === 'inventory' || item.type === 'warning') return 'bg-amber-500/10 border-amber-500/20';
    if (item.category === 'orders' || item.type === 'order') return 'bg-blue-500/10 border-blue-500/20';
    if (item.category === 'diagnoses' || item.type === 'diagnosis') return 'bg-purple-500/10 border-purple-500/20';
    if (item.category === 'settlement') return 'bg-emerald-500/10 border-emerald-500/20';
    if (item.category === 'security' || item.type === 'user') return 'bg-cyan-500/10 border-cyan-500/20';
    return 'bg-indigo-500/10 border-indigo-500/20';
  };

  return createPortal(
    <>
      {/* Dimmed backdrop for touch and outside-click dismiss */}
      <div
        className="fixed inset-0 bg-slate-950/75 dark:bg-black/85 backdrop-blur-xs z-[115] transition-opacity duration-200"
        onClick={() => setIsDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Dual Layout: Native Mobile Bottom Sheet (< sm) & Desktop Floating Popover (>= sm) */}
      <div
        ref={containerRef}
        role="dialog"
        aria-label="Admin Notification Center"
        aria-modal="true"
        className={`fixed inset-x-0 bottom-0 z-[120] sm:bottom-auto sm:top-16 sm:right-6 sm:left-auto sm:w-[480px] rounded-t-[28px] sm:rounded-3xl shadow-[0_-15px_50px_rgba(0,0,0,0.5)] sm:shadow-2xl border-t sm:border p-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:pb-4 max-h-[85dvh] sm:max-h-[640px] flex flex-col animate-in slide-in-from-bottom-6 sm:slide-in-from-top-2 duration-200 transition-all ${
          theme === 'dark'
            ? 'bg-slate-900/98 border-slate-800 text-slate-100 backdrop-blur-2xl shadow-black/90'
            : 'bg-white/98 border-slate-200 text-slate-900 shadow-2xl backdrop-blur-2xl'
        }`}
      >
        {/* Mobile top drag/dismiss handle */}
        <div
          className="w-12 h-1.5 bg-slate-300 dark:bg-slate-700 rounded-full mx-auto mb-3 sm:hidden shrink-0 cursor-pointer active:scale-95 transition-transform"
          onClick={() => setIsDrawerOpen(false)}
          title="Close sheet"
        />

        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 shadow-xs">
              <Bell className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white truncate">
                  Admin Activity Center
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full shadow-xs shrink-0 animate-pulse">
                    {unreadCount} New
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                Role: {user?.role || 'Staff Admin'} &bull; Real-time alerts
              </p>
            </div>
          </div>

          {/* Top Actions: Refresh, Mark all read, Close */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => loadNotifications(true)}
              title="Refresh Notifications"
              aria-label="Refresh Notifications"
              className={`p-1.5 rounded-xl transition-colors cursor-pointer active:scale-90 ${
                isLoading
                  ? 'text-emerald-500 animate-spin'
                  : 'text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-50 dark:hover:bg-slate-800 px-2 py-1 rounded-xl transition-all cursor-pointer flex items-center gap-1 border border-emerald-500/20 active:scale-95"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Mark read</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsDrawerOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer active:scale-90"
              aria-label="Close Notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Scope Tabs */}
        <div className="flex items-center gap-1.5 my-2.5 overflow-x-auto py-1 scrollbar-none border-b border-slate-200/80 dark:border-slate-800/80 shrink-0">
          {filterTabs.map((tab) => {
            const tabUnread = getTabUnreadCount(tab.key);
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveFilter(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 font-black'
                    : theme === 'dark'
                      ? 'bg-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                <span>{tab.label}</span>
                {tabUnread > 0 && (
                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-rose-500 text-white'
                  }`}>
                    {tabUnread}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Scrollable Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 pr-1 space-y-1">
          {isLoading && notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 flex flex-col items-center justify-center gap-2.5">
              <RefreshCw className="w-6 h-6 animate-spin text-emerald-500" />
              <span className="font-semibold">Updating live store telemetry...</span>
            </div>
          ) : filteredNotifications.length > 0 ? (
            filteredNotifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`p-3 rounded-2xl cursor-pointer transition-all flex items-start gap-3 my-1 relative group active:scale-[0.99] border ${
                  item.unread
                    ? theme === 'dark'
                      ? 'bg-slate-800/80 border-emerald-500/30 hover:border-emerald-500/50 shadow-xs'
                      : 'bg-emerald-50/70 border-emerald-200 hover:border-emerald-300 shadow-xs'
                    : theme === 'dark'
                      ? 'border-transparent hover:bg-slate-800/40'
                      : 'border-transparent hover:bg-slate-50'
                }`}
              >
                {/* Category Icon */}
                <div className={`p-2.5 rounded-xl border shrink-0 mt-0.5 shadow-2xs ${getItemIconBg(item)}`}>
                  {getItemIcon(item)}
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs font-bold truncate ${
                      item.unread
                        ? 'text-emerald-700 dark:text-emerald-400 font-black'
                        : 'text-slate-800 dark:text-slate-200'
                    }`}>
                      {item.title}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 font-medium">
                      {item.time}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
                    {item.message}
                  </p>

                  {/* Badges & Metrics Footer */}
                  <div className="flex items-center justify-between mt-2 gap-1.5 flex-wrap">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {item.badgeText && (
                        <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                          {item.badgeText}
                        </span>
                      )}
                      {item.metric && (
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                          {item.metric.value}
                        </span>
                      )}
                      {item.required_permission && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                          <Shield className="w-2.5 h-2.5 text-emerald-500" />
                          <span>{item.required_permission}</span>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {item.unread && (
                        <button
                          type="button"
                          onClick={(e) => handleItemMarkRead(item.id, e)}
                          className="text-[10px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-extrabold cursor-pointer hover:underline"
                          title="Mark as read"
                        >
                          Mark read
                        </button>
                      )}
                      {(item.actionLink || item.link) && (
                        <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-0.5 opacity-80 group-hover:opacity-100">
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 flex flex-col items-center justify-center gap-2">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 mb-1">
                <Inbox className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                No notifications in "{filterTabs.find(t => t.key === activeFilter)?.label}"
              </p>
              <p className="text-[11px] text-slate-400 max-w-xs">
                You're completely up to date. New activity telemetry will appear here automatically.
              </p>
            </div>
          )}
        </div>

        {/* Footer Navigation Link */}
        <div className="pt-2.5 border-t border-slate-200 dark:border-slate-800 text-center shrink-0">
          <button
            type="button"
            onClick={() => {
              setIsDrawerOpen(false);
              navigate('/admin/orders');
            }}
            className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors flex items-center justify-center gap-1.5 w-full py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 cursor-pointer"
          >
            <span>View All Activity Logs &amp; Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </>,
    document.body
  );
};
