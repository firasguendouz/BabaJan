import React, { useState } from 'react';

import { debounce } from '../../utils/helpers';

const OrderFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    deliveryType: '', // New filter for delivery type
    sort: 'asc', // Default sorting by totalAmount (ascending)
  });

  // Update the filter state and notify the parent component
  const handleInputChange = (field, value) => {
    const updatedFilters = { ...filters, [field]: value };
    setFilters(updatedFilters);
    onFiltersChange(updatedFilters); // Notify parent component about filter changes
  };

  // Debounced search input handling
  const debouncedSearch = debounce((value) => {
    handleInputChange('search', value);
  }, 500);

  return (
    <div className="order-filters">
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search orders (ID, email, name, item)..."
        onChange={(e) => debouncedSearch(e.target.value)}
      />

      {/* Status Filter */}
      <select
        onChange={(e) => handleInputChange('status', e.target.value)}
        value={filters.status}
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="prepared">Prepared</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
      </select>

      {/* Delivery Type Filter */}
      <select
        onChange={(e) => handleInputChange('deliveryType', e.target.value)}
        value={filters.deliveryType}
      >
        <option value="">All Delivery Types</option>
        <option value="delivery">Delivery</option>
        <option value="pickup">Pickup</option>
      </select>

      {/* Sort By Total Amount */}
      <select
        onChange={(e) => handleInputChange('sort', e.target.value)}
        value={filters.sort}
      >
        <option value="asc">Total (Low to High)</option>
        <option value="desc">Total (High to Low)</option>
      </select>
    </div>
  );
};

export default OrderFilters;
