import './Payment.css';

import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { createOrder } from '../state/orderSlice';
import { useNavigate } from 'react-router-dom';

const Payment = () => {
  const cart = useSelector((state) => state.cart || []);
  const user = useSelector((state) => state.user.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Shipping details state
  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    streetAddress1: '',
    streetAddress2: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
    shippingMethod: 'standard',
  });

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + item.quantity * item.price, 0);
  const shippingPrice = shippingDetails.shippingMethod === 'express' ? 10 : 5;
  const total = subtotal + shippingPrice;

  // Validate required fields
  const validateFields = () => {
    if (!shippingDetails.firstName || !shippingDetails.lastName || !shippingDetails.streetAddress1 || !shippingDetails.city || !shippingDetails.postalCode || !shippingDetails.country) {
      alert('Please fill in all required fields.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    const orderData = {
      lines: cart.map((item) => ({
        variant_id: item.id,
        quantity: item.quantity,
        unit_price: {
          currency: 'EUR',
          amount: item.price,
          amount_decimal: item.price,
        },
        total_price: {
          currency: 'EUR',
          amount: item.quantity * item.price,
          amount_decimal: item.quantity * item.price,
        },
        product_name: item.name,
        product_category: item.category || 'default-category',
        thumbnail: item.thumbnail || '',
        product_sku: item.sku || 'default-sku',
      })),
      subtotal: {
        currency: 'EUR',
        amount: subtotal,
        amount_decimal: subtotal,
      },
      shipping_price: {
        currency: 'EUR',
        amount: shippingPrice,
        amount_decimal: shippingPrice,
      },
      total: {
        currency: 'EUR',
        amount: total,
        amount_decimal: total,
      },
      shipping_address: {
        first_name: shippingDetails.firstName,
        last_name: shippingDetails.lastName,
        street_address_1: shippingDetails.streetAddress1,
        street_address_2: shippingDetails.streetAddress2 || '',
        city: shippingDetails.city,
        postal_code: shippingDetails.postalCode,
        country: shippingDetails.country,
        phone: shippingDetails.phone || '',
      },
      shipping_info: {
        shipping_method_name: shippingDetails.shippingMethod,
      },
      userId: user.id,
    };

    try {
      await dispatch(createOrder(orderData)).unwrap();
      navigate('/confirmation'); // Redirect to confirmation page on success
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('Order submission failed. Please try again.');
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    setShippingDetails({ ...shippingDetails, [e.target.name]: e.target.value });
  };

  return (
    <div className="payment-page">
      <h1>Confirm Your Order</h1>
      <div className="order-summary">
        <h2>Order Summary</h2>
        <ul>
          {cart.map((item) => (
            <li key={item.id}>
              {item.name} - {item.quantity} pcs x €{item.price.toFixed(2)}
            </li>
          ))}
        </ul>
        <p>
          <strong>Subtotal:</strong> €{subtotal.toFixed(2)}
        </p>
        <p>
          <strong>Shipping:</strong> €{shippingPrice.toFixed(2)}
        </p>
        <p>
          <strong>Total:</strong> €{total.toFixed(2)}
        </p>
      </div>
      <form onSubmit={handleSubmit} className="shipping-form">
        <h2>Shipping Details</h2>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={shippingDetails.firstName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={shippingDetails.lastName}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="streetAddress1"
          placeholder="Street Address 1"
          value={shippingDetails.streetAddress1}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="streetAddress2"
          placeholder="Street Address 2"
          value={shippingDetails.streetAddress2}
          onChange={handleChange}
        />
        <input
          type="text"
          name="city"
          placeholder="City"
          value={shippingDetails.city}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="postalCode"
          placeholder="Postal Code"
          value={shippingDetails.postalCode}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="country"
          placeholder="Country"
          value={shippingDetails.country}
          onChange={handleChange}
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone"
          value={shippingDetails.phone}
          onChange={handleChange}
        />
        <label>Shipping Method:</label>
        <select
          name="shippingMethod"
          value={shippingDetails.shippingMethod}
          onChange={handleChange}
        >
          <option value="PICKUP">PICKUP (€5.00)</option>
          <option value="DELIVERY">DELIVERY (€10.00)</option>
        </select>
        <button type="submit" className="confirm-order-button">
          Confirm Order
        </button>
      </form>
    </div>
  );
};

export default Payment;
