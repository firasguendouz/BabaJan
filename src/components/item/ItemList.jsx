import './ItemList.css';

import ItemCard from './ItemCard';
import PropTypes from 'prop-types';
import React from 'react';

const ItemList = ({ items = [], onItemClick }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return <p>No items found.</p>;
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <ItemCard
          key={item._id}
          item={{
            id: item._id,
            name: item.name.en,
            price: item.price,
            stock: item.stock,
            imageUrl: item.photos[0] || '/placeholder.jpg',
            category: item.category,
            ratings: item.ratings,
            unit: item.unit,  // Pass the unit prop
            available: item.stock > 0,  // Checking availability based on stock
          }}
          onClick={() => onItemClick(item._id)}
        />
      ))}
    </div>
  );
};

ItemList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.shape({
        en: PropTypes.string.isRequired,
      }).isRequired,
      price: PropTypes.number.isRequired,
      stock: PropTypes.number.isRequired,
      photos: PropTypes.array,
      category: PropTypes.string.isRequired,
      ratings: PropTypes.number,
      unit: PropTypes.string.isRequired,  // Added unit to prop validation
      available: PropTypes.bool.isRequired,
    })
  ),
  onItemClick: PropTypes.func.isRequired,
};

export default ItemList;
