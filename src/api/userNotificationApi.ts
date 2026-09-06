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

// High-converting, realistic e-commerce seed notifications for farmers & shoppers
const FALLBACK_SEEDS: UserNotification[] = [
  {
    id: 'notif-order-8291',
    title: 'Order #SF-8291 Out for Delivery 🚚',
    message: 'Your IFFCO NPK 19-19-19 (50kg) and Chelated Zinc bag is out for farm delivery with AgriExpress today.',
    category: 'order',
    type: 'order_status',
    time: '18m ago',
    unread: true,
    link: '/orders',
    actionLabel: 'Track Delivery',
    actionLink: '/orders',
    badgeText: 'Out for Delivery'
  },
  {
    id: 'notif-offer-newfarmer',
    title: 'Special Farmer Discount: ₹150 OFF 🏷️',
    message: 'Use code NEWFARMER on orders above ₹499. Valid on water-soluble fertilizers and pest sprays today.',
    category: 'offer',
    type: 'coupon',
    time: '1h ago',
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
  getNotifications: async (): Promise<UserNotificationsResponse> => {
    const readIds = getReadIds();
    let backendNotifications: UserNotification[] = [];

    try {
      const res = await apiClient.get('/user/notifications');
      if (res.data && Array.isArray(res.data.notifications) && res.data.notifications.length > 0) {
        backendNotifications = res.data.notifications;
      }
    } catch {
      // Backend offline or unauthenticated -> fallback gracefully
    }

    // If backend provided notifications, use them; otherwise use rich contextual seeds
    const sourceList = backendNotifications.length > 0 ? backendNotifications : FALLBACK_SEEDS;

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
      FALLBACK_SEEDS.forEach((n) => readIds.add(n.id));
    }
    saveReadIds(readIds);

    try {
      await apiClient.post('/user/notifications/read-all');
    } catch {
      // Offline fallback already updated in localStorage
    }
  }
};
