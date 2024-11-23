import './Orders.css';

import OrderList from '../components/order/OrderList';
import React from 'react';
import useFetch from '../hooks/useFetch';

const Orders = () => {
  const { data: orders, loading, error } = useFetch('/api/orders');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="orders-page">
      <h1>Your Orders</h1>
      <OrderList orders={orders} onSelectOrder={(id) => console.log('Order selected:', id)} />
    </div>
  );
};

export default Orders;
