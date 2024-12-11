import './UserViewModal.css';

import React from 'react';
import { formatDate } from '../../utils/dateFormatter';

const UserViewModal = ({ user, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h3>User Details</h3>
        <div className="user-details">
          <p><strong>ID:</strong> {user._id}</p>
          <p><strong>Name:</strong> {`${user.name.firstName} ${user.name.lastName}`}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Active:</strong> {user.isActive ? 'Yes' : 'No'}</p>
          <p><strong>Deleted:</strong> {user.isDeleted ? 'Yes' : 'No'}</p>
          <p><strong>Deleted Reason:</strong> {user.deletedReason || 'N/A'}</p>
          <p><strong>Last Login:</strong> {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</p>
          <p><strong>Created At:</strong> {formatDate(user.createdAt)}</p>
          <p><strong>Updated At:</strong> {formatDate(user.updatedAt)}</p>
          <p><strong>Deleted At:</strong> {user.deletedAt !== "1999-12-31T23:00:00.000Z" ? formatDate(user.deletedAt) : 'N/A'}</p>

          <h4>Address:</h4>
          {user.address.length > 0 ? (
            <ul>
              {user.address.map((addr, index) => (
                <li key={index}>
                  <p><strong>Street:</strong> {addr.street}</p>
                  <p><strong>City:</strong> {addr.city}</p>
                  <p><strong>Postal Code:</strong> {addr.postalCode}</p>
                  <p><strong>Country:</strong> {addr.country}</p>
                  <p><strong>Default:</strong> {addr.isDefault ? 'Yes' : 'No'}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No addresses found.</p>
          )}

          <h4>Wishlist:</h4>
          {user.wishlist.length > 0 ? (
            <ul>
              {user.wishlist.map((wish, index) => (
                <li key={index}>
                  <p><strong>Item ID:</strong> {wish.itemId}</p>
                  <p><strong>Added At:</strong> {formatDate(wish.addedAt)}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No wishlist items found.</p>
          )}

          <h4>Order History:</h4>
          {user.orderHistory.length > 0 ? (
            <ul>
              {user.orderHistory.map((order, index) => (
                <li key={index}>
                  <p><strong>Order ID:</strong> {order}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No orders found.</p>
          )}

          <h4>Additional Info:</h4>
          <p><strong>Login Attempts:</strong> {user.loginAttempts}</p>
          <p><strong>Permissions:</strong> {user.permissions.join(', ') || 'None'}</p>
          <p><strong>Preferences:</strong> {Object.keys(user.preferences).length > 0 ? JSON.stringify(user.preferences) : 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default UserViewModal;
