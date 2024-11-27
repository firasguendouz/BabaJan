import './Profile.css';

import React, { useEffect, useState } from 'react';
import { fetchOrderHistory, fetchUserProfile } from '../state/userSlice';
import { useDispatch, useSelector } from 'react-redux';

import HorizontalMenu from '../components/item/HorizontalMenu';

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const orderHistory = useSelector((state) => state.user.orderHistory || []);
  const [selectedSection, setSelectedSection] = useState('info');

  useEffect(() => {
    dispatch(fetchUserProfile());
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  const menuItems = [
    { id: 'info', title: 'Personal Information' },
    { id: 'orders', title: 'Order History' },
    { id: 'wishlist', title: 'Wishlist' },
  ];

  const renderSection = () => {
    switch (selectedSection) {
      case 'info':
        return (
          <div className="profile-section">
            <h2>Personal Information</h2>
            <p><strong>Name:</strong> {`${user?.name?.firstName} ${user?.name?.lastName}`}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Phone:</strong> {user?.phone}</p>
            <p><strong>Address:</strong></p>
            <ul>
              {user?.address?.length > 0 ? (
                user.address.map((addr, index) => (
                  <li key={index}>{`${addr.street}, ${addr.city}, ${addr.postalCode}, ${addr.country}`}</li>
                ))
              ) : (
                <li>No address added.</li>
              )}
            </ul>
          </div>
        );
      case 'orders':
        return (
          <div className="profile-section">
            <h2>Order History</h2>
            {orderHistory.length > 0 ? (
              <ul>
                {orderHistory.map((order) => (
                  <li key={order._id}>
                    <p><strong>Order ID:</strong> {order._id}</p>
                    <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p><strong>Total:</strong> €{order.total.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No orders found.</p>
            )}
          </div>
        );
      case 'wishlist':
        return (
          <div className="profile-section">
            <h2>Wishlist</h2>
            <p>Feature under development.</p>
          </div>
        );
      default:
        return <p>Select a section from the menu.</p>;
    }
  };

  return (
    <div className="profile-page">
      <h1>Profile</h1>
      <HorizontalMenu
        categories={menuItems}
        onCategoryClick={(id) => setSelectedSection(id)}
      />
      <div className="profile-content">{renderSection()}</div>
    </div>
  );
};

export default Profile;
