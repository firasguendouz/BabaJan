import React from 'react';
import PropTypes from 'prop-types';
import './Profile.css';

const Profile = ({ user, onUpdate }) => {
  const { name, email } = user;

  return (
    <div className="profile">
      <h2>Profile</h2>
      <div className="profile-field">
        <strong>Name:</strong>
        <span>{name}</span>
      </div>
      <div className="profile-field">
        <strong>Email:</strong>
        <span>{email}</span>
      </div>
      <button onClick={onUpdate}>Edit Profile</button>
    </div>
  );
};

Profile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default Profile;
