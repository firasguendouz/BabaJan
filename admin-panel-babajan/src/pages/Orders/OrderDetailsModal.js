import './OrderDetailsModal.css';

import React, { useEffect, useState } from 'react';

import { fetchItems } from '../../api/adminApi';
import { formatDate } from '../../utils/dateFormatter';

const OrderDetailsModal = ({ order, onClose }) => {
  const [itemDetails, setItemDetails] = useState({}); // Store fetched item details

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const fetchedDetails = {};
        const itemIds = order.items.map((item) => item.itemId);

        const response = await fetchItems({ ids: itemIds }); // Assuming API supports batch fetching
        response.data.data.forEach((itemDetail) => {
          fetchedDetails[itemDetail._id] = itemDetail;
        });

        setItemDetails((prev) => ({ ...prev, ...fetchedDetails }));
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    if (order.items.length > 0) {
      fetchItemDetails();
    }
  }, [order.items]);

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h3>Order Details</h3>
        <p>
          <strong>Order ID:</strong> {order._id}
        </p>
        <p>
          <strong>Customer Name:</strong>{' '}
          {order.userId
            ? `${order.userId?.name?.firstName || 'N/A'} ${
                order.userId?.name?.lastName || ''
              }`
            : 'Guest'}
        </p>
        <p>
          <strong>Email:</strong> {order.userId?.email || 'N/A'}
        </p>
        <p>
          <strong>Delivery Address:</strong> {order.deliveryInfo?.address || 'N/A'}
        </p>
        <p>
          <strong>Total Amount:</strong> €{order.finalAmount?.toFixed(2) || 'N/A'}
        </p>
        <p>
          <strong>Status:</strong> {order.status || 'N/A'}
        </p>
        <p>
          <strong>Payment Method:</strong> {order.paymentDetails?.method || 'N/A'}
        </p>
        <p>
          <strong>Paid At:</strong>{' '}
          {order.paymentDetails?.paidAt
            ? formatDate(order.paymentDetails.paidAt)
            : 'Not Paid'}
        </p>

        <h4>Items</h4>
        <ul>
          {order.items.length > 0 ? (
            order.items.map((item) => {
              const details = itemDetails[item.itemId];
              return (
                <li key={item._id}>
                  <p>
                    <strong>Item Name:</strong>{' '}
                    {details?.name?.en || 'Fetching...'}
                  </p>
                  <p>
                    <strong>Unit:</strong> {details?.unit || 'Fetching...'}
                  </p>
                  <p>
                    <strong>Price:</strong> €
                    {details?.price?.toFixed(2) || 'Fetching...'}
                  </p>
                  <p>
                    <strong>Quantity:</strong> {item.quantity}
                  </p>
                  <p>
                    <strong>Total:</strong> €
                    {item.total?.toFixed(2) || 'N/A'}
                  </p>
                </li>
              );
            })
          ) : (
            <p>No items available for this order.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
