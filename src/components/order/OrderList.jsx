import React from 'react';
import PropTypes from 'prop-types';
import './OrderList.css';

const OrderList = ({ orders, onSelectOrder }) => {
  return (
    <div className="order-list">
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id} className="order-item">
              <div>
                <span><strong>Order ID:</strong> {order.id}</span>
                <span><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</span>
                <span><strong>Status:</strong> {order.status}</span>
              </div>
              <button onClick={() => onSelectOrder(order.id)}>View Details</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

OrderList.propTypes = {
  orders: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSelectOrder: PropTypes.func.isRequired,
};

export default OrderList;
