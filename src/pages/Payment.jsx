import React, { useState } from 'react';

import { createOrder } from '../state/orderSlice'; // Order creation action
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Payment = () => {
  const [address, setAddress] = useState('');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const cart = useSelector((state) => state.cart || []);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    const orderData = {
      lines: cart.map((item) => ({
        variant_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        product_name: item.name,
      })),
      shipping_address: { address },
      shipping_info: { shipping_method_name: shippingMethod },
      userId: user.id,
    };

    dispatch(createOrder(orderData));
    navigate('/confirmation'); // Redirect to confirmation page
  };

  return (
    <div className="payment-page">
      <h1>Payment</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Shipping Address:</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Shipping Method:</label>
          <select
            value={shippingMethod}
            onChange={(e) => setShippingMethod(e.target.value)}
          >
            <option value="standard">Standard</option>
            <option value="express">Express</option>
          </select>
        </div>
        <button type="submit">Confirm Order</button>
      </form>
    </div>
  );
};

export default Payment;
