import './OrderEditModal.css';

import React, { useEffect, useState } from 'react';

import { fetchItems } from '../../api/adminApi';

const OrderEditModal = ({ order, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    _id: order?._id || order?.id || '',
    items:
      order?.items?.map((item) => ({
        ...item,
        price: Number(item.price) || 0,
        total: Number(item.total) || 0,
      })) || [],
    discountAmount: Number(order?.discountAmount) || 0,
    status: order?.status || 'pending',
    paymentDetails: { ...order?.paymentDetails } || {},
    deliveryInfo: { ...order?.deliveryInfo } || {},
  });

  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(false);

  //
  // ==================== FETCH AVAILABLE ITEMS ====================
  //
  useEffect(() => {
    const fetchAvailableItems = async () => {
      try {
        setLoading(true);
        const response = await fetchItems({});
        const sanitizedItems = response.data.data.map((item) => ({
          ...item,
          price: Number(item.price) || 0,
        }));
        setAllItems(sanitizedItems);
      } catch (error) {
        console.error('Error fetching items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAvailableItems();
  }, []);

  //
  // ==================== HANDLE FIELD CHANGES ====================
  //
  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedItems = [...prev.items];
      updatedItems[index] = {
        ...updatedItems[index],
        [field]: value,
      };

      if (field === 'quantity') {
        updatedItems[index].total =
          Number(updatedItems[index].price) * (parseInt(value, 10) || 0);
      }

      return { ...prev, items: updatedItems };
    });
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
            name: selectedItem.name?.en || 'Unnamed Item',
            unit: selectedItem.unit || 'unit',
            price: Number(selectedItem.price) || 0,
            quantity: 1,
            total: Number(selectedItem.price) || 0,
          },
        ],
      }));
    }
  };

  const handleRemoveItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  //
  // ==================== HANDLE SAVE ====================
  //
  const handleSave = () => {
    const orderId = formData._id || formData.id;

    if (!orderId) {
      console.error('Order ID is missing!');
      alert('Order ID is missing. Please refresh and try again.');
      return;
    }

    // Ensure required fields are populated
    if (!formData.status) {
      alert('Order status is required.');
      return;
    }

    if (onSave && typeof onSave === 'function') {
      onSave({
        ...formData,
        _id: orderId,
      });
    } else {
      console.warn('onSave is not a valid function.');
    }
  };

  //
  // ==================== RENDER COMPONENT ====================
  //
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
                value={formData.paymentDetails?.method || ''}
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
              {formData.paymentDetails?.transactionId || 'N/A'}
            </p>
            <p>
              <strong>Paid At:</strong>{' '}
              {formData.paymentDetails?.paidAt || 'Not Paid'}
            </p>
          </fieldset>

          {/* Delivery Info */}
          <fieldset>
            <legend>Delivery Info</legend>
            <label>
              Delivery Type:
              <select
                value={formData.deliveryInfo?.type || ''}
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
                value={formData.deliveryInfo?.address || ''}
                onChange={(e) =>
                  handleFieldChange('deliveryInfo', {
                    ...formData.deliveryInfo,
                    address: e.target.value,
                  })
                }
                disabled={formData.deliveryInfo?.type === 'pickup'}
              />
            </label>
          </fieldset>

          {/* Items */}
          <fieldset>
            <legend>Items</legend>
            {formData.items.map((item, index) => (
              <div key={index} className="item-edit-block">
                <p><strong>Item ID:</strong> {item.itemId}</p>
                <p><strong>Name:</strong> {item.name}</p>
                <p><strong>Unit:</strong> {item.unit}</p>
                <p><strong>Price:</strong> €{Number(item.price).toFixed(2)}</p>
                <label>
                  Quantity:
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                  />
                </label>
                <p>Total: €{Number(item.total).toFixed(2)}</p>
                <button type="button" onClick={() => handleRemoveItem(index)}>
                  Remove Item
                </button>
              </div>
            ))}
            <div>
              <label>Add Item:</label>
              <select onChange={(e) => handleAddItem(e.target.value)} defaultValue="">
                <option value="" disabled>Select an item</option>
                {allItems.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name?.en} - €{Number(item.price).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
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
