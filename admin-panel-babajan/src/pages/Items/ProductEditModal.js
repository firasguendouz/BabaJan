import './ProductEditModal.css';

import React, { useEffect, useState } from 'react';

const ProductEditModal = ({ product = {}, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: product.name || '',
    sku: product.sku || '',
    price: product.price?.amount || 0,
    currency: product.price?.currency || 'EUR',
    quantity: product.quantity || 0,
    thumbnail: product.thumbnail || '',
    category: product.category || '',
    subcategory: product.subcategory || '',
  });

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [error, setError] = useState('');

  // Fetch categories when modal opens
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/categories', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        const result = await response.json();
        if (response.ok && result.success) {
          setCategories(result.data || []);
        } else {
          throw new Error(result.message || 'Failed to fetch categories.');
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories.');
      }
    };

    fetchCategories();
  }, []);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (!formData.category) {
      setSubcategories([]);
      return;
    }

    const fetchSubcategories = async () => {
      try {
        const selectedCategory = categories.find(
          (cat) => cat._id === formData.category
        );
        setSubcategories(selectedCategory?.subcategories || []);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setError('Failed to load subcategories.');
      }
    };

    fetchSubcategories();
  }, [formData.category, categories]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!formData.name || !formData.sku || !formData.price || !formData.category) {
      setError('Name, SKU, Price, and Category are required.');
      return;
    }

    const method = product.id ? 'PATCH' : 'POST';
    const url = product.id
      ? `/api/items/${formData.category}/${formData.subcategory}/${product.id}`
      : `/api/items/${formData.category}/${formData.subcategory}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to save product.');

      onSave(result); // Call parent onSave callback with saved data
      onClose();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Failed to save product.');
    }
  };

  return (
    <div className="modal">
      <h2>{product.id ? 'Edit Product' : 'Add New Product'}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            required
          />
        </label>
        <label>
          SKU:
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => handleInputChange('sku', e.target.value)}
            required
          />
        </label>
        <label>
          Price:
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
            required
          />
        </label>
        <label>
          Currency:
          <input
            type="text"
            value={formData.currency}
            onChange={(e) => handleInputChange('currency', e.target.value)}
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            min="0"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value))}
          />
        </label>
        <label>
          Thumbnail URL:
          <input
            type="text"
            value={formData.thumbnail}
            onChange={(e) => handleInputChange('thumbnail', e.target.value)}
          />
        </label>
        <label>
          Category:
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            required
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </label>
        <label>
          Subcategory:
          <select
            value={formData.subcategory}
            onChange={(e) => handleInputChange('subcategory', e.target.value)}
          >
            <option value="">Select a subcategory</option>
            {subcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
        </label>
        <div className="modal-actions">
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductEditModal;
