import './OrderEditModal.css';

import React, { useEffect, useState } from 'react';

import { fetchItems } from '../../api/adminApi';

const OrderEditModal = ({ order, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    items: [...order.items],
    discountAmount: order.discountAmount,
    status: order.status,
    paymentDetails: { ...order.paymentDetails },
    deliveryInfo: { ...order.deliveryInfo },
  });

  const [allItems, setAllItems] = useState([]); // List of all available items
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch available items
    const fetchAvailableItems = async () => {
      try {
        setLoading(true);
        const response = await fetchItems({}); // Fetch all items
        setAllItems(response.data.data); // Store fetched items
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableItems();
  }, []);

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };

    if (field === 'quantity') {
      updatedItems[index].total =
        updatedItems[index].price * (parseInt(value, 10) || 0);
    }

    setFormData((prev) => ({
      ...prev,
      items: updatedItems,
    }));
  };

  const handleAddItem = (itemId) => {
    const selectedItem = allItems.find((item) => item._id === itemId);
    if (selectedItem) {
      setFormData((prev) => ({
        ...prev,
        items: [
          ...prev.items,
          {
            itemId: selectedItem._id,
            name: selectedItem.name.en, // Assuming 'en' for English
            unit: selectedItem.unit,
            price: selectedItem.price,
            quantity: 1,
            total: selectedItem.price,
          },
        ],
      }));
    }
  };

  const handleRemoveItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, items: updatedItems }));
  };

  const handleSave = () => {
    // Validate items
    const invalidItems = formData.items.some(
      (item) => !item.itemId || !item.name || !item.unit
    );

    if (invalidItems) {
      alert('Each item must have an item ID, name, and unit.');
      return;
    }

    // Call the onSave handler with valid form data
    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h3>Edit Order</h3>
        <form>
          {/* Payment Details */}
          <fieldset>
            <legend>Payment Details</legend>
            <label>
              Payment Method:
              <select
                value={formData.paymentDetails.method}
                onChange={(e) =>
                  handleFieldChange('paymentDetails', {
                    ...formData.paymentDetails,
                    method: e.target.value,
                  })
                }
              >
                <option value="cash-on-delivery">Cash on Delivery</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="other">Other</option>
              </select>
            </label>
            <p>
              <strong>Transaction ID:</strong>{' '}
              {formData.paymentDetails.transactionId || 'N/A'}
            </p>
            <p>
              <strong>Paid At:</strong>{' '}
              {formData.paymentDetails.paidAt || 'Not Paid'}
            </p>
          </fieldset>

          {/* Delivery Info */}
          <fieldset>
            <legend>Delivery Info</legend>
            <label>
              Delivery Type:
              <select
                value={formData.deliveryInfo.type}
                onChange={(e) =>
                  handleFieldChange('deliveryInfo', {
                    ...formData.deliveryInfo,
                    type: e.target.value,
                  })
                }
              >
                <option value="delivery">Delivery</option>
                <option value="pickup">Pickup</option>
              </select>
            </label>
            <label>
              Address:
              <input
                type="text"
                value={formData.deliveryInfo.address}
                onChange={(e) =>
                  handleFieldChange('deliveryInfo', {
                    ...formData.deliveryInfo,
                    address: e.target.value,
                  })
                }
                disabled={formData.deliveryInfo.type === 'pickup'}
              />
            </label>
            <label>
              Scheduled At:
              <input
                type="datetime-local"
                value={formData.deliveryInfo.scheduledAt}
                onChange={(e) =>
                  handleFieldChange('deliveryInfo', {
                    ...formData.deliveryInfo,
                    scheduledAt: e.target.value,
                  })
                }
              />
            </label>
            <label>
              Delivered At:
              <input
                type="datetime-local"
                value={formData.deliveryInfo.deliveredAt || ''}
                onChange={(e) =>
                  handleFieldChange('deliveryInfo', {
                    ...formData.deliveryInfo,
                    deliveredAt: e.target.value,
                  })
                }
              />
            </label>
          </fieldset>

          {/* Items */}
          <fieldset>
            <legend>Items</legend>
            {formData.items.map((item, index) => (
              <div key={index} className="item-edit-block">
                <p>
                  <strong>Item ID:</strong> {item.itemId}
                </p>
                <p>
                  <strong>Name:</strong> {item.name}
                </p>
                <p>
                  <strong>Unit:</strong> {item.unit}
                </p>
                <p>
                  <strong>Price:</strong> ${item.price.toFixed(2)}
                </p>
                <label>
                  Quantity:
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, 'quantity', e.target.value)
                    }
                  />
                </label>
                <p>Total: ${item.total.toFixed(2)}</p>
                <button type="button" onClick={() => handleRemoveItem(index)}>
                  Remove Item
                </button>
              </div>
            ))}
            <div>
              <label>Add Item:</label>
              <select
                onChange={(e) => handleAddItem(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>
                  Select an item
                </option>
                {allItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name.en} - ${item.price.toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
          </fieldset>

          {/* Order Status */}
          <fieldset>
            <legend>Status</legend>
            <select
              value={formData.status}
              onChange={(e) => handleFieldChange('status', e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="prepared">Prepared</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </fieldset>

          <button type="button" onClick={handleSave} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OrderEditModal;
