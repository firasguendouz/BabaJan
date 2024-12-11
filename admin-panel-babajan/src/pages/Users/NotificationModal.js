import './NotificationModal.css'; // Add appropriate styles

import React, { useState } from 'react';

import { createNotification } from '../../api/adminApi';

const NotificationModal = ({ user, onClose }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('info');
  const [deliveryMethod, setDeliveryMethod] = useState(['push']); // Default to push
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const notificationData = {
      recipient: user._id,
      type,
      title,
      message,
      deliveryMethod,
    };

    try {
      await createNotification(notificationData);
      alert('Notification sent successfully!');
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error sending notification:', error);
      alert('Failed to send notification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h3>Send Notification</h3>
        <form onSubmit={handleSubmit}>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </label>
          <label>
            Message:
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </label>
          <label>
            Type:
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="system">system</option>
              <option value="promo">promo</option>
              <option value="reminder">reminder</option>
              <option value="feedback">feedback</option>
              <option value="custom">custom</option>
              <option value="order">order</option>

            </select>
          </label>
          <label>
            Delivery Method:
            <select
              multiple
              value={deliveryMethod}
              onChange={(e) =>
                setDeliveryMethod(Array.from(e.target.selectedOptions, (o) => o.value))
              }
            >
              <option value="email">Email</option>
              <option value="sms">SMS</option>
              <option value="push">Push</option>
              <option value="telegram">Telegram</option>
            </select>
          </label>
          <button type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send Notification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NotificationModal;
