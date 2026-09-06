import { apiClient } from './axiosInstances';

export interface UserNotification {
  id: string;
  numeric_id?: number;
  title: string;
  message: string;
  time: string;
  timestamp?: string;
  type: string;
  unread: boolean;
  link?: string;
  category?: 'order' | 'offer' | 'advisory' | 'system';
  actionLabel?: string;
  actionLink?: string;
  couponCode?: string;
  badgeText?: string;
}

export interface UserNotificationsResponse {
  notifications: UserNotification[];
  unread_count: number;
}

const READ_STORAGE_KEY = 'sarkar_read_notifications';

const getReadIds = (): Set<string> => {
  try {
    if (typeof localStorage === 'undefined') return new Set();
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw);
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
};

const saveReadIds = (ids: Set<string>) => {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(Array.from(ids)));
    }
  } catch {
    // Ignore storage errors
  }
};

// High-converting, realistic public e-commerce broadcast notifications for farmers & shoppers
export const GUEST_BROADCAST_SEEDS: UserNotification[] = [
  {
    id: 'notif-offer-newfarmer',
    title: 'Special Farmer Discount: ₹150 OFF 🏷️',
    message: 'Use code NEWFARMER on orders above ₹499. Valid on water-soluble fertilizers and pest sprays today.',
    category: 'offer',
    type: 'coupon',
    time: 'Today',
    unread: true,
    couponCode: 'NEWFARMER',
    link: '/products',
    actionLabel: 'Copy & Shop',
    actionLink: '/products',
    badgeText: '₹150 OFF'
  },
  {
    id: 'notif-advisory-pest',
    title: 'Pest Advisory: Fall Armyworm Warning ⚠️',
    message: 'Regional Agri-Bureau reported early leaf damage in maize and paddy. Upload leaf photos for instant diagnosis.',
    category: 'advisory',
    type: 'crop_advisory',
    time: '3h ago',
    unread: true,
    link: '/diagnose',
    actionLabel: 'Diagnose Crops',
    actionLink: '/diagnose',
    badgeText: 'Urgent Alert'
  },
  {
    id: 'notif-offer-freedelivery',
    title: 'Free Direct Farm Delivery Unlocked 🚜',
    message: 'All government-certified fertilizer orders over ₹499 now qualify for Free Direct Farm Delivery.',
    category: 'offer',
    type: 'delivery_offer',
    time: 'Yesterday',
    unread: false,
    link: '/products',
    actionLabel: 'Browse Store',
    actionLink: '/products',
    badgeText: 'Free Shipping'
  }
];

export const userNotificationApi = {
  getNotifications: async (isAuthenticated = true): Promise<UserNotificationsResponse> => {
    const readIds = getReadIds();

    // Guest users should immediately receive broadcast notifications without failing API calls
    if (!isAuthenticated) {
      const guestNotifications = GUEST_BROADCAST_SEEDS.map((n) => ({
        ...n,
        unread: readIds.has(n.id) ? false : Boolean(n.unread)
      }));
      return {
        notifications: guestNotifications,
        unread_count: guestNotifications.filter((n) => n.unread).length
      };
    }

    let backendNotifications: UserNotification[] = [];

    try {
      const res = await apiClient.get('/user/notifications');
      if (res.data && Array.isArray(res.data.notifications) && res.data.notifications.length > 0) {
        backendNotifications = res.data.notifications;
      }
    } catch {
      // Backend offline or unauthenticated -> fallback gracefully to broadcast announcements
    }

    // Use backend notifications if available; otherwise use safe broadcast seeds (never fake personal orders)
    const sourceList = backendNotifications.length > 0 ? backendNotifications : GUEST_BROADCAST_SEEDS;

    const mergedNotifications = sourceList.map((n) => {
      const isMarkedRead = readIds.has(n.id);
      return {
        ...n,
        unread: isMarkedRead ? false : Boolean(n.unread)
      };
    });

    const unreadCount = mergedNotifications.filter((n) => n.unread).length;

    return {
      notifications: mergedNotifications,
      unread_count: unreadCount
    };
  },

  markAsRead: async (id: string): Promise<void> => {
    const readIds = getReadIds();
    readIds.add(id);
    saveReadIds(readIds);

    try {
      await apiClient.post(`/user/notifications/${id}/read`);
    } catch {
      // Offline fallback already updated in localStorage
    }
  },

  markAllAsRead: async (notificationIds?: string[]): Promise<void> => {
    const readIds = getReadIds();
    if (notificationIds && notificationIds.length > 0) {
      notificationIds.forEach((id) => readIds.add(id));
    } else {
      GUEST_BROADCAST_SEEDS.forEach((n) => readIds.add(n.id));
    }
    saveReadIds(readIds);

    try {
      await apiClient.post('/user/notifications/read-all');
    } catch {
      // Offline fallback already updated in localStorage
    }
  }
};
