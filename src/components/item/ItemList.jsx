import './ItemList.css';

import ItemCard from './ItemCard';
import PropTypes from 'prop-types';
import React from 'react';

const ItemList = ({ items = [], onItemClick }) => {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="no-items">No items found. Try adjusting your filters.</p>;
  }

  return (
    <div className="product-card-grid">
      {items.map((item) => (
        <div className="product-card-grid-item" key={item.id || item._id}>
          <ItemCard
            item={{
              id: item.id || item._id, // Ensure compatibility with different formats
              name: item.name,
              price: item.price.amount || item.price, // Adjust for nested price object
              stock: item.quantity || item.stock, // Adjust for alternative naming
              imageUrl: item.thumbnail || item.imageUrl || '/placeholder.jpg',
              category: item.categoryName || item.category,
              subcategory: item.subcategoryName || item.subcategory,
              discount: item.discount || 0, // Default to 0 if discount not provided
              originalPrice: item.originalPrice || item.price.amount || item.price,
              unit: item.unit || 'pcs', // Default unit
            }}
            onClick={() => onItemClick(item.id || item._id)}
          />
        </div>
      ))}
    </div>
  );
};

ItemList.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      _id: PropTypes.string,
      name: PropTypes.string.isRequired,
      price: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          amount: PropTypes.number.isRequired,
          currency: PropTypes.string,
        }),
      ]).isRequired,
      quantity: PropTypes.number,
      stock: PropTypes.number,
      thumbnail: PropTypes.string,
      imageUrl: PropTypes.string,
      categoryName: PropTypes.string,
      category: PropTypes.string.isRequired,
      subcategoryName: PropTypes.string,
      subcategory: PropTypes.string,
      discount: PropTypes.number,
      originalPrice: PropTypes.number,
      unit: PropTypes.string,
    })
  ),
  onItemClick: PropTypes.func.isRequired,
};

export default ItemList;
