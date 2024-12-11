import React, { useState } from 'react';

const Filters = ({ users, onFilterChange }) => {
  const [search, setSearch] = useState('');

  const handleSearchInputChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);

    // Filter the users list based on the search query
    const filteredUsers = users.filter(
      (user) =>
        user.name.firstName.toLowerCase().includes(value) ||
        user.name.lastName.toLowerCase().includes(value) ||
        user.email.toLowerCase().includes(value) ||
        user.phone?.toLowerCase().includes(value)
    );

    // Notify parent about the filtered users
    onFilterChange(filteredUsers);
  };

  return (
    <div className="filters">
      <input
        type="text"
        placeholder="Search users by name, email, or phone..."
        value={search}
        onChange={handleSearchInputChange}
      />
    </div>
  );
};

export default Filters;
