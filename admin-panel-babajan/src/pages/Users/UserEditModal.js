import './UserEditModal.css';

import React from 'react';
import UserForm from './UserForm';

const UserEditModal = ({ user, onClose, onSave }) => {
  const handleSave = (updatedUser) => {
    // Call the onSave function passed from the parent component
    onSave(updatedUser);
    alert('User updated successfully!');
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h3>Edit User</h3>
        {/* Pass the user data and handleSave callback to UserForm */}
        <UserForm user={user} onSave={handleSave} />
      </div>
    </div>
  );
};

export default UserEditModal;
