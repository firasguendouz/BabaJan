import React from 'react';
import PropTypes from 'prop-types';
import './OrderDetails.css';

const OrderDetails = ({ order, onClose }) => {
  if (!order) return <p>Loading...</p>;

  return (
    <div className="order-details">
      <h2>Order Details</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
      
      <h3>Items</h3>
      <ul>
        {order.items.map((item) => (
          <li key={item.id} className="order-item-detail">
            <span><strong>{item.name}</strong></span>
            <span>Qty: {item.quantity}</span>
            <span>${item.price.toFixed(2)}</span>
          </li>
        ))}
      </ul>
      
      <button onClick={onClose}>Close</button>
    </div>
  );
};

OrderDetails.propTypes = {
  order: PropTypes.shape({
    id: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    total: PropTypes.number.isRequired,
    items: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
  }),
  onClose: PropTypes.func.isRequired,
};

export default OrderDetails;
