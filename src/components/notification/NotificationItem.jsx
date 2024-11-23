import React from 'react';
import PropTypes from 'prop-types';
import './NotificationItem.css';

const NotificationItem = ({
  notification,
  onMarkAsRead,
  onDeleteNotification,
}) => {
  const { id, title, message, isRead, timestamp } = notification;

  return (
    <div className={`notification-item ${isRead ? 'read' : 'unread'}`}>
      <div className="notification-content">
        <h3>{title}</h3>
        <p>{message}</p>
        <span className="notification-timestamp">
          {new Date(timestamp).toLocaleString()}
        </span>
      </div>
      <div className="notification-actions">
        {!isRead && (
          <button onClick={() => onMarkAsRead(id)} className="mark-read-btn">
            Mark as Read
          </button>
        )}
        <button
          onClick={() => onDeleteNotification(id)}
          className="delete-btn"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

NotificationItem.propTypes = {
  notification: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    isRead: PropTypes.bool.isRequired,
    timestamp: PropTypes.string.isRequired,
  }).isRequired,
  onMarkAsRead: PropTypes.func.isRequired,
  onDeleteNotification: PropTypes.func.isRequired,
};

export default NotificationItem;
