import React from 'react';
import PromotionList from '../components/promotion/PromotionList';
import useFetch from '../hooks/useFetch';
import './Promotions.css';

const Promotions = () => {
  const { data: promotions, loading, error } = useFetch('/api/promotions');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="promotions-page">
      <h1>Promotions</h1>
      <PromotionList promotions={promotions} onPromotionClick={(id) => console.log('Promotion clicked:', id)} />
    </div>
  );
};

export default Promotions;
