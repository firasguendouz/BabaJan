import React from 'react';
import PropTypes from 'prop-types';
import NotificationItem from './NotificationItem';
import './NotificationList.css';

const NotificationList = ({
  notifications,
  onMarkAsRead,
  onDeleteNotification,
}) => {
  if (notifications.length === 0) {
    return <p>No notifications available.</p>;
  }

  return (
    <div className="notification-list">
      <h2>Notifications</h2>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onMarkAsRead={onMarkAsRead}
          onDeleteNotification={onDeleteNotification}
        />
      ))}
    </div>
  );
};

NotificationList.propTypes = {
  notifications: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      message: PropTypes.string.isRequired,
      isRead: PropTypes.bool.isRequired,
      timestamp: PropTypes.string.isRequired,
    })
  ).isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDeleteNotification: PropTypes.func.isRequired,
};

export default NotificationList;
