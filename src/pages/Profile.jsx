import React from 'react';
import useAuth from '../hooks/useAuth';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Profile;
