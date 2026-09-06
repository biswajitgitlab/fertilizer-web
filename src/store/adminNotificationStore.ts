import { create } from 'zustand';
import { AdminNotification, AdminNotificationCategory } from '../types/adminNotification';
import { adminNotificationService } from '../services/adminNotificationService';

const DISMISSED_STORAGE_KEY = 'sarkar_admin_banner_dismissed';

interface AdminNotificationState {
  notifications: AdminNotification[];
  unreadCount: number;
  isLoading: boolean;
  currentIndex: number;
  isPaused: boolean;
  dismissed: boolean;
  lastFetched: number;
  activeFilter: 'all' | AdminNotificationCategory;
  isDrawerOpen: boolean;

  // Actions
  loadNotifications: (force?: boolean) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  dismissBanner: () => void;
  undismissBanner: () => void;
  nextNotification: () => void;
  prevNotification: () => void;
  setCurrentIndex: (index: number) => void;
  setIsPaused: (paused: boolean) => void;
  setActiveFilter: (filter: 'all' | AdminNotificationCategory) => void;
  setIsDrawerOpen: (open: boolean) => void;
  openWithFilter: (filter: 'all' | AdminNotificationCategory) => void;
}

const getInitialDismissed = (): boolean => {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(DISMISSED_STORAGE_KEY) === 'true';
  }
  return false;
};

export const useAdminNotificationStore = create<AdminNotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  currentIndex: 0,
  isPaused: false,
  dismissed: getInitialDismissed(),
  lastFetched: 0,
  activeFilter: 'all',
  isDrawerOpen: false,

  loadNotifications: async (force: boolean = false) => {
    const { lastFetched, isLoading } = get();
    const now = Date.now();

    // Throttle fetches within 25 seconds unless forced
    if (!force && lastFetched > 0 && now - lastFetched < 25000) {
      return;
    }

    if (isLoading) return;

    set({ isLoading: true });
    try {
      const data = await adminNotificationService.getNotifications();
      const currentList = data.notifications || [];
      const currentCount = data.unread_count ?? currentList.filter(n => n.unread).length;

      set((state) => ({
        notifications: currentList,
        unreadCount: currentCount,
        isLoading: false,
        lastFetched: Date.now(),
        // Clamp currentIndex if out of bounds
        currentIndex: state.currentIndex >= currentList.length ? 0 : state.currentIndex
      }));
    } catch {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    const { notifications } = get();
    await adminNotificationService.markAsRead(id);

    const updated = notifications.map(n => n.id === id ? { ...n, unread: false } : n);
    const newUnreadCount = updated.filter(n => n.unread).length;

    set({
      notifications: updated,
      unreadCount: newUnreadCount
    });
  },

  markAllAsRead: async () => {
    const { notifications } = get();
    await adminNotificationService.markAllAsRead(notifications);

    const updated = notifications.map(n => ({ ...n, unread: false }));

    set({
      notifications: updated,
      unreadCount: 0
    });
  },

  dismissBanner: () => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(DISMISSED_STORAGE_KEY, 'true');
    }
    set({ dismissed: true });
  },

  undismissBanner: () => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(DISMISSED_STORAGE_KEY);
    }
    set({ dismissed: false });
  },

  nextNotification: () => {
    const { notifications, currentIndex } = get();
    if (notifications.length <= 1) return;
    set({ currentIndex: (currentIndex + 1) % notifications.length });
  },

  prevNotification: () => {
    const { notifications, currentIndex } = get();
    if (notifications.length <= 1) return;
    set({ currentIndex: (currentIndex - 1 + notifications.length) % notifications.length });
  },

  setCurrentIndex: (index: number) => {
    set({ currentIndex: index });
  },

  setIsPaused: (paused: boolean) => {
    set({ isPaused: paused });
  },

  setActiveFilter: (filter: 'all' | AdminNotificationCategory) => {
    set({ activeFilter: filter });
  },

  setIsDrawerOpen: (open: boolean) => {
    set({ isDrawerOpen: open });
  },

  openWithFilter: (filter: 'all' | AdminNotificationCategory) => {
    set({ activeFilter: filter, isDrawerOpen: true });
  }
}));
