import { useContext } from 'react';
import { NotificationContext } from '../context/NotificationContext';

const useNotifications = () => {
  const {
    notifications,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
  } = useContext(NotificationContext);

  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
  };
};

export default useNotifications;
