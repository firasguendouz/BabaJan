import './OrderList.css';

import React, { useEffect, useState } from 'react';

import OrderDetailsModal from './OrderDetailsModal';
import OrderEditModal from './OrderEditModal';
import OrderFilters from './OrderFilters';
import { fetchOrders } from '../../api/adminApi';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editableOrder, setEditableOrder] = useState(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        const response = await fetchOrders();
        setOrders(response.data.data);
        setFilteredOrders(response.data.data); // Initialize with all orders
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

  const applyFilters = (filters) => {
    let filtered = [...orders];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((order) => {
        const hasMatchingId = order._id.includes(search);
        const hasMatchingItem = order.items.some((item) =>
          item.itemId.includes(search)
        );
        const hasMatchingAddress = order.deliveryInfo.address
          ?.toLowerCase()
          .includes(search);

        const hasMatchingUser =
          order.userId &&
          (order.userId.email?.toLowerCase().includes(search) ||
            order.userId.name?.firstName?.toLowerCase().includes(search) ||
            order.userId.name?.lastName?.toLowerCase().includes(search));

        return hasMatchingId || hasMatchingItem || hasMatchingAddress || hasMatchingUser;
      });
    }

    if (filters.status) {
      filtered = filtered.filter((order) => order.status === filters.status);
    }

    if (filters.deliveryType) {
      filtered = filtered.filter(
        (order) => order.deliveryInfo.type === filters.deliveryType
      );
    }

    if (filters.sort === 'asc') {
      filtered.sort((a, b) => a.finalAmount - b.finalAmount);
    } else if (filters.sort === 'desc') {
      filtered.sort((a, b) => b.finalAmount - a.finalAmount);
    }

    setFilteredOrders(filtered);
  };

  return (
    <div className="order-list-container">
      <h2>Order Management</h2>

      <OrderFilters onFiltersChange={applyFilters} />

      {loading ? (
        <p>Loading orders...</p>
      ) : (
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Delivery Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>
                  {order.userId
                    ? `${order.userId.name?.firstName || 'N/A'} ${
                        order.userId.name?.lastName || ''
                      }`
                    : 'Guest'}
                </td>
                <td>€{order.finalAmount.toFixed(2)}</td>
                <td>{order.status}</td>
                <td>
                  {order.deliveryInfo?.type === 'pickup' ? 'Pickup' : 'Delivery'}
                </td>
                <td>
                  <button onClick={() => setSelectedOrder(order)}>View</button>
                  <button onClick={() => setEditableOrder(order)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {editableOrder && (
        <OrderEditModal
          order={editableOrder}
          onClose={() => setEditableOrder(null)}
        />
      )}
    </div>
  );
};

export default OrderList;
