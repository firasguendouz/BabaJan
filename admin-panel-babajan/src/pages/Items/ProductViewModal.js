import './ProductViewModal.css';

import React from 'react';

const ProductViewModal = ({ product, onClose }) => {
  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>{product.name}</h2>
        <div className="product-details">
          <img
            src={product.thumbnail || '/placeholder.png'}
            alt={product.name}
            className="product-image"
          />
          <div className="details">
            <p>
              <strong>SKU:</strong> {product.sku}
            </p>
            <p>
              <strong>Price:</strong> {product.price.amount} {product.price.currency}
            </p>
            <p>
              <strong>Quantity:</strong> {product.quantity}
            </p>
            <p>
              <strong>Category:</strong> {product.categoryName}
            </p>
            <p>
              <strong>Subcategory:</strong> {product.subcategoryName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductViewModal;
