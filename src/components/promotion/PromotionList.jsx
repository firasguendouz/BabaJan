import React from 'react';
import PropTypes from 'prop-types';
import PromotionCard from './PromotionCard';
import './PromotionList.css';

const PromotionList = ({ promotions, onPromotionClick }) => {
  if (promotions.length === 0) {
    return <p>No promotions available.</p>;
  }

  return (
    <div className="promotion-list">
      {promotions.map((promotion) => (
        <PromotionCard
          key={promotion.id}
          promotion={promotion}
          onClick={() => onPromotionClick(promotion.id)}
        />
      ))}
    </div>
  );
};

PromotionList.propTypes = {
  promotions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imageUrl: PropTypes.string.isRequired,
      discount: PropTypes.number.isRequired,
    })
  ).isRequired,
  onPromotionClick: PropTypes.func.isRequired,
};

export default PromotionList;
