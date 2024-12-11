import './OrderDetailsModal.css';

import React, { useEffect, useState } from 'react';

import { fetchItems } from '../../api/adminApi';
import { formatDate } from '../../utils/dateFormatter';

const OrderDetailsModal = ({ order, onClose }) => {
  const [itemDetails, setItemDetails] = useState({}); // Store fetched item details

  useEffect(() => {
    // Fetch item details for all items in the order
    const fetchItemDetails = async () => {
      try {
        const fetchedDetails = {};
        await Promise.all(
          order.items.map(async (item) => {
            if (!itemDetails[item.itemId]) {
              const response = await fetchItems({ id: item.itemId });
              const itemDetail = response.data.data[0];
              fetchedDetails[item.itemId] = itemDetail;
            }
          })
        );
        setItemDetails((prev) => ({ ...prev, ...fetchedDetails }));
      } catch (error) {
        console.error('Error fetching item details:', error);
      }
    };

    fetchItemDetails();
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
          <strong>Customer Name:</strong> {order.userId.name.firstName}{' '}
          {order.userId.name.lastName}
        </p>
        <p>
          <strong>Email:</strong> {order.userId.email}
        </p>
        <p>
          <strong>Delivery Address:</strong> {order.deliveryInfo.address}
        </p>
        <p>
          <strong>Total Amount:</strong> ${order.finalAmount.toFixed(2)}
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
        <p>
          <strong>Payment Method:</strong> {order.paymentDetails.method}
        </p>
        <p>
          <strong>Paid At:</strong>{' '}
          {order.paymentDetails.paidAt
            ? formatDate(order.paymentDetails.paidAt)
            : 'Not Paid'}
        </p>
        <h4>Items</h4>
        <ul>
          {order.items.map((item) => {
            const details = itemDetails[item.itemId];
            return (
              <li key={item._id}>
                <p>
                  <strong>Item Name:</strong> {details ? details.name.en : 'Loading...'}
                </p>
                <p>
                  <strong>Unit:</strong> {details ? details.unit : 'Loading...'}
                </p>
                <p>
                  <strong>Price:</strong> $
                  {details ? details.price.toFixed(2) : 'Loading...'}
                </p>
                <p>
                  <strong>Quantity:</strong> {item.quantity}
                </p>
                <p>
                  <strong>Total:</strong> ${item.total.toFixed(2)}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
