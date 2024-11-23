import './PromotionCard.css';

import PropTypes from 'prop-types';
import React from 'react';

const PromotionCard = ({ promotion, onClick }) => {
  const isActive = promotion.isActive ? 'Active' : 'Inactive';
  const startDate = new Date(promotion.startDate).toLocaleDateString();
  const endDate = new Date(promotion.endDate).toLocaleDateString();

  return (
    <div className={`promotion-card ${promotion.isActive ? 'active' : 'inactive'}`} onClick={onClick}>
      <div className="promotion-card-header">
        <h3>{promotion.title}</h3>
        <span className={`promotion-status ${promotion.isActive ? 'active' : 'inactive'}`}>
          {isActive}
        </span>
      </div>
      <div className="promotion-card-content">
        <p>{promotion.type === 'percentage' ? `${promotion.discountValue}% Off` : `${promotion.discountValue} Off`}</p>
        <p>Applicable to: {promotion.applicableTo.categories.join(', ')}</p>
        <p>
          Valid from {startDate} to {endDate}
        </p>
      </div>
    </div>
  );
};

PromotionCard.propTypes = {
  promotion: PropTypes.shape({
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
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PromotionCard;
