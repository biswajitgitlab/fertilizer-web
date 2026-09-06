export type AdminNotificationCategory = 
  | 'orders' 
  | 'inventory' 
  | 'diagnoses' 
  | 'settlement' 
  | 'security' 
  | 'system';

export type AdminNotificationSeverity = 'critical' | 'warning' | 'info' | 'success';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  category: AdminNotificationCategory;
  severity: AdminNotificationSeverity;
  time: string;
  timestamp?: string;
  unread: boolean;
  link: string;
  actionLabel?: string;
  actionLink?: string;
  badgeText?: string;
  metric?: {
    label: string;
    value: string;
  };
  required_permission?: string;
}

export interface AdminNotificationsResponse {
  notifications: AdminNotification[];
  unread_count: number;
}
