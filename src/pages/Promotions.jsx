import './Promotions.css';

import PromotionList from '../components/promotion/PromotionList';
import React from 'react';
import useFetch from '../hooks/useFetch';

const Promotions = () => {
  const { data: promotions = [], loading, error } = useFetch('/api/promotions');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const activePromotions = promotions.filter((promotion) => promotion.isActive);
  const inactivePromotions = promotions.filter((promotion) => !promotion.isActive);

  return (
    <div className="promotions-page">
      <h1>Promotions</h1>
      <section>
        <h2>Active Promotions</h2>
        <PromotionList
          promotions={activePromotions}
          onPromotionClick={(id) => console.log('Promotion clicked:', id)}
        />
      </section>
      <section>
        <h2>Inactive Promotions</h2>
        <PromotionList
          promotions={inactivePromotions}
          onPromotionClick={(id) => console.log('Promotion clicked:', id)}
        />
      </section>
    </div>
  );
};

export default Promotions;
