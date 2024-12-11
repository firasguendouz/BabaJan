import './NotificationList.css';

import React, { useEffect, useState } from 'react';
import {
  createNotification,
  fetchNotifications,
  fetchUsers,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from '../../api/adminApi';

import { formatDate } from '../../utils/dateFormatter';

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalNotifications, setTotalNotifications] = useState(0);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [userList, setUserList] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    deliveryMethod: ['push'],
  });

  // Fetch notifications
  useEffect(() => {
    const fetchNotificationData = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = { page, limit };
        const response = await fetchNotifications(params);
        setNotifications(response.data.data);
        setTotalNotifications(response.data.pagination.total);
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('Failed to load notifications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationData();
  }, [page, limit]);

  // Fetch user list
  const fetchUserList = async () => {
    if (userList.length === 0) {
      try {
        const response = await fetchUsers({ limit: 100 });
        setUserList(response.data.data);
      } catch (err) {
        console.error('Error fetching user list:', err);
      }
    }
  };

  // Mark a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notification) =>
          notification._id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

 

  // Send a new notification
  const handleSendNotification = async () => {
    if (!newNotification.title || !newNotification.message) {
      alert('Please fill in both the title and message.');
      return;
    }

    try {
      const payload = {
        title: newNotification.title,
        message: newNotification.message,
        type: newNotification.type,
        deliveryMethod: newNotification.deliveryMethod,
        recipient: selectedUser === 'all' ? undefined : selectedUser,
      };

      await createNotification(payload);
      alert('Notification sent successfully.');
      setIsSendModalOpen(false);
      setNewNotification({ title: '', message: '', type: 'info', deliveryMethod: ['push'] });
    } catch (err) {
      console.error('Error sending notification:', err);
    }
  };

  const totalPages = Math.ceil(totalNotifications / limit);

  return (
    <div className="notification-list-container">
      <h2>Notifications</h2>

      {/* Actions */}
      <div className="notification-actions">
        <button onClick={() => setIsSendModalOpen(true)}>Send Notification</button>
        <button onClick={handleMarkAllAsRead} disabled={notifications.every((n) => n.read)}>
          Mark All as Read
        </button>
      </div>

      {/* Error or Loader */}
      {loading ? (
        <p>Loading notifications...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : notifications.length > 0 ? (
        <>
          {/* Notification Table */}
          <table className="notification-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Message</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notification) => (
                <tr key={notification._id}>
                  <td>{notification._id}</td>
                  <td>{notification.title}</td>
                  <td>{notification.message}</td>
                  <td
                    className={`status ${notification.read ? 'read' : 'unread'}`}
                  >
                    {notification.read ? 'Read' : 'Unread'}
                  </td>
                  <td>{formatDate(notification.createdAt)}</td>
                  <td>
                    {!notification.read && (
                      <button onClick={() => handleMarkAsRead(notification._id)}>
                        Mark as Read
                      </button>
                    )}
                    
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No notifications found.</p>
      )}

      {/* Send Notification Modal */}
      {isSendModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={() => setIsSendModalOpen(false)}>
              &times;
            </span>
            <h3>Send Notification</h3>
            <form onSubmit={(e) => e.preventDefault()}>
              <label>
                Title:
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, title: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Message:
                <textarea
                  value={newNotification.message}
                  onChange={(e) =>
                    setNewNotification({ ...newNotification, message: e.target.value })
                  }
                  required
                />
              </label>
              <label>
                Recipient:
                <select
                  value={selectedUser}
                  onChange={(e) => setSelectedUser(e.target.value)}
                  onFocus={fetchUserList}
                >
                  <option value="all">All Users</option>
                  {userList.map((user) => (
                    <option key={user._id} value={user._id}>
                      {user.name.firstName} {user.name.lastName}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Type:
                <select
                  value={newNotification.type}
                  onChange={(e) => setNewNotification({ ...newNotification, type: e.target.value })}
                >
                  <option value="system">System</option>
                  <option value="promo">Promo</option>
                  <option value="reminder">Reminder</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              <label>
                Delivery Method:
                <select
                  multiple
                  value={newNotification.deliveryMethod}
                  onChange={(e) =>
                    setNewNotification({
                      ...newNotification,
                      deliveryMethod: Array.from(e.target.selectedOptions, (o) => o.value),
                    })
                  }
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="push">Push</option>
                  <option value="telegram">Telegram</option>
                </select>
              </label>
              <button type="button" onClick={handleSendNotification}>
                Send Notification
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
