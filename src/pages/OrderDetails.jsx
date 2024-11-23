import React from 'react';
import { useParams } from 'react-router-dom';
import useFetch from '../hooks/useFetch';
import OrderDetails from '../components/order/OrderDetails';
import './OrderDetails.css';

const OrderDetailsPage = () => {
  const { orderId } = useParams();
  const { data: order, loading, error } = useFetch(`/api/orders/${orderId}`);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="order-details-page">
      <h1>Order Details</h1>
      <OrderDetails order={order} onClose={() => console.log('Order details closed')} />
    </div>
  );
};

export default OrderDetailsPage;
