import './OrderList.css';

import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrder } from '../../api/adminApi';

import OrderDetailsModal from './OrderDetailsModal';
import OrderEditModal from './OrderEditModal';
import OrderFilters from './OrderFilters';

const OrderList = () => {
  const [orders, setOrders] = useState([]); // All orders
  const [filteredOrders, setFilteredOrders] = useState([]); // Filtered orders for display
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editableOrder, setEditableOrder] = useState(null);

  //
  // ==================== FETCH ORDERS ====================
  //
  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        const response = await fetchOrders();
        setOrders(response.data.data);
        setFilteredOrders(response.data.data); // Initialize filtered orders
      } catch (error) {
        console.error('Error fetching orders:', error);
        alert('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderData();
  }, []);

//
// ==================== HANDLE ORDER SAVE ====================
//
const handleSaveOrder = async (updatedOrder) => {
  try {
    const orderId = updatedOrder._id || updatedOrder.id;

    if (!orderId) {
      console.error('Invalid Order ID:', updatedOrder);
      alert('Invalid order data. Please refresh and try again.');
      return;
    }

    setLoading(true);

    // Make an API call to update the order
    const response = await updateOrder(orderId, updatedOrder);
    const savedOrder = response.data.data;

    // Update the order in the local state
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        (order._id || order.id) === savedOrder._id ? savedOrder : order
      )
    );

    setFilteredOrders((prevOrders) =>
      prevOrders.map((order) =>
        (order._id || order.id) === savedOrder._id ? savedOrder : order
      )
    );

    setEditableOrder(null); // Close modal
    alert('Order updated successfully.');
  } catch (error) {
    console.error('Error saving order:', error);
    alert(
      error.response?.data?.message || 'Failed to save order. Please try again.'
    );
  } finally {
    setLoading(false);
  }
};



  //
  // ==================== APPLY FILTERS ====================
  //
  const applyFilters = (filters) => {
    let filtered = [...orders];

    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter((order) => {
        const hasMatchingId = order._id?.includes(search);
        const hasMatchingItem = order.items?.some((item) =>
          item.itemId?.includes(search)
        );
        const hasMatchingAddress = order.deliveryInfo?.address
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
        (order) => order.deliveryInfo?.type === filters.deliveryType
      );
    }

    if (filters.sort === 'asc') {
      filtered.sort((a, b) => a.finalAmount - b.finalAmount);
    } else if (filters.sort === 'desc') {
      filtered.sort((a, b) => b.finalAmount - a.finalAmount);
    }

    setFilteredOrders(filtered);
  };

  //
  // ==================== COMPONENT RETURN ====================
  //
  return (
    <div className="order-list-container">
      <h2>Order Management</h2>

      {/* Filter Component */}
      <OrderFilters onFiltersChange={applyFilters} />

      {/* Loading State */}
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
                <td>€{Number(order.finalAmount || 0).toFixed(2)}</td>
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

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}

      {/* Order Edit Modal */}
      {editableOrder && editableOrder._id && (
        <OrderEditModal
          order={editableOrder}
          onClose={() => setEditableOrder(null)}
          onSave={handleSaveOrder}
        />
      )}
    </div>
  );
};

export default OrderList;
