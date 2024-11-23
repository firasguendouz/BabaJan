import React from 'react';
import PropTypes from 'prop-types';
import './OrderSummary.css';

const OrderSummary = ({ total, itemCount, lastOrderDate }) => {
  return (
    <div className="order-summary">
      <h3>Order Summary</h3>
      <div className="summary-item">
        <span><strong>Total Orders:</strong></span>
        <span>{itemCount}</span>
      </div>
      <div className="summary-item">
        <span><strong>Total Spent:</strong></span>
        <span>${total.toFixed(2)}</span>
      </div>
      {lastOrderDate && (
        <div className="summary-item">
          <span><strong>Last Order:</strong></span>
          <span>{new Date(lastOrderDate).toLocaleDateString()}</span>
        </div>
      )}
    </div>
  );
};

OrderSummary.propTypes = {
  total: PropTypes.number.isRequired,
  itemCount: PropTypes.number.isRequired,
  lastOrderDate: PropTypes.string,
};

OrderSummary.defaultProps = {
  lastOrderDate: null,
};

export default OrderSummary;
