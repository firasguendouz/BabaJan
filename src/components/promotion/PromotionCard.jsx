import React from 'react';
import PropTypes from 'prop-types';
import './PromotionCard.css';

const PromotionCard = ({ promotion, onClick }) => {
  return (
    <div className="promotion-card" onClick={onClick}>
      <img
        src={promotion.imageUrl}
        alt={promotion.title}
        className="promotion-card-image"
      />
      <div className="promotion-card-content">
        <h3>{promotion.title}</h3>
        <p>{promotion.description}</p>
        <span className="promotion-discount">Save {promotion.discount}%</span>
      </div>
    </div>
  );
};

PromotionCard.propTypes = {
  promotion: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imageUrl: PropTypes.string.isRequired,
    discount: PropTypes.number.isRequired,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PromotionCard;
