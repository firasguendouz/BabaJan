import './ProductsList.css';

import React from 'react';
import { deleteItem } from '../../api/adminApi'; // API Integration

const ProductsList = ({ products, onProductClick, onEditProduct, refreshProducts }) => {
  const handleDelete = async (product) => {
    if (!window.confirm(`Are you sure you want to delete ${product.name}?`)) return;

    try {
      await deleteItem(product.category, product.subcategory, product._id);
      refreshProducts(); // Reload products after deletion
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Failed to delete product. Please try again.');
    }
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Thumbnail</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Actions</th> {/* New Actions Column */}
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product._id}>
            <td>
              <img
                src={product.thumbnail || '/placeholder.png'}
                alt={product.name}
                className="product-thumbnail"
              />
            </td>
            <td>{product.name}</td>
            <td>
              {product.price.amount} {product.price.currency}
            </td>
            <td>{product.quantity}</td>
            <td>
              {/* Action Buttons */}
              <button
                className="action-button view-button"
                onClick={() => onProductClick(product)}
              >
                View
              </button>
              <button
                className="action-button edit-button"
                onClick={() => onEditProduct(product)}
              >
                Edit
              </button>
              <button
                className="action-button delete-button"
                onClick={() => handleDelete(product)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductsList;
