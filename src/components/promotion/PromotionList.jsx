import './PromotionList.css';

import PromotionCard from './PromotionCard';
import PropTypes from 'prop-types';
import React from 'react';

const PromotionList = ({ promotions = [], onPromotionClick }) => {
  if (!Array.isArray(promotions) || promotions.length === 0) {
    return <p>No promotions available.</p>;
  }

  const sortedPromotions = [...promotions].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

  return (
    <div className="promotion-list">
      {sortedPromotions.map((promotion) => (
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
      type: PropTypes.string.isRequired,
      discountValue: PropTypes.number.isRequired,
      startDate: PropTypes.string.isRequired,
      endDate: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      applicableTo: PropTypes.shape({
        categories: PropTypes.arrayOf(PropTypes.string),
        items: PropTypes.array,
        users: PropTypes.array,
        regions: PropTypes.array,
      }).isRequired,
    })
  ).isRequired,
  onPromotionClick: PropTypes.func.isRequired,
};

export default PromotionList;
