import './UserList.css';

import React, { useEffect, useState } from 'react';
import { deleteUser, fetchUsers } from '../../api/adminApi';

import NotificationModal from './NotificationModal';
import UserEditModal from './UserEditModal';
import UserViewModal from './UserViewModal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // For viewing
  const [editableUser, setEditableUser] = useState(null); // For editing
  const [notifyUser, setNotifyUser] = useState(null); // For sending notification

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchUsers();
        setUsers(response.data.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        alert('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <div className="user-list-container">
      <h2>User Management</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="user-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{`${user.name.firstName} ${user.name.lastName}`}</td>
                <td>{user.email}</td>
                <td>{user.phone || 'N/A'}</td>
                <td>{user.role}</td>
                <td>
                  <button onClick={() => setSelectedUser(user)}>View</button>
                  <button onClick={() => setEditableUser(user)}>Edit</button>
                  <button onClick={() => setNotifyUser(user)}>Send Notification</button>
                  <button onClick={() => handleDelete(user._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* View Modal */}
      {selectedUser && (
        <UserViewModal user={selectedUser} onClose={() => setSelectedUser(null)} />
      )}

      {/* Edit Modal */}
      {editableUser && (
        <UserEditModal
          user={editableUser}
          onClose={() => setEditableUser(null)}
          onSave={() => setEditableUser(null)}
        />
      )}

      {/* Notification Modal */}
      {notifyUser && (
        <NotificationModal
          user={notifyUser}
          onClose={() => setNotifyUser(null)}
        />
      )}
    </div>
  );
};

export default UserList;
