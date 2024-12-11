import './PromotionEditModal.css';

import React, { useEffect, useState } from 'react';

const PromotionEditModal = ({ promotion, isEditing, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    title: promotion?.title || '',
    promoCode: promotion?.promoCode || '',
    type: promotion?.type || 'percentage',
    discountValue: promotion?.discountValue || 0,
    startDate: promotion?.startDate ? promotion.startDate.split('T')[0] : '',
    endDate: promotion?.endDate ? promotion.endDate.split('T')[0] : '',
    isActive: promotion?.isActive || false,
    applicableTo: {
      categories: promotion?.applicableTo?.categories || [],
      items: promotion?.applicableTo?.items || [],
      users: promotion?.applicableTo?.users || [],
    },
    usageLimit: promotion?.usageLimit || 0,
    priority: promotion?.priority || 1,
    autoDeactivate: promotion?.autoDeactivate || false,
  });

  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        // Fetch categories, items, and users
        const [categoriesResponse, itemsResponse, usersResponse] = await Promise.all([
          fetch('/api/categories'), // Replace with actual endpoint
          fetch('/api/items?available=true'), // Fetch only available items
          fetch('/api/users'), // Fetch all users or filter as needed
        ]);

        setCategories(await categoriesResponse.json());
        setItems(await itemsResponse.json());
        setUsers(await usersResponse.json());
      } catch (error) {
        console.error('Error fetching filters:', error);
      }
    };

    fetchFilters();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.title || !formData.promoCode || !formData.startDate || !formData.endDate) {
      alert('Please fill in all required fields.');
      return;
    }
    onSave(formData);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h3>{isEditing ? 'Edit Promotion' : 'Create New Promotion'}</h3>

        <form>
          {/* Title */}
          <label>
            Title:
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              required
            />
          </label>

          {/* Promo Code */}
          <label>
            Promo Code:
            <input
              type="text"
              value={formData.promoCode}
              onChange={(e) => handleInputChange('promoCode', e.target.value)}
              required
            />
          </label>

          {/* Type */}
          <label>
            Type:
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
            >
              <option value="percentage">Percentage</option>
              <option value="flat">Flat</option>
            </select>
          </label>

          {/* Discount Value */}
          <label>
            Discount Value:
            <input
              type="number"
              value={formData.discountValue}
              onChange={(e) => handleInputChange('discountValue', e.target.value)}
              min="0"
              required
            />
          </label>

          {/* Start Date */}
          <label>
            Start Date:
            <input
              type="date"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              required
            />
          </label>

          {/* End Date */}
          <label>
            End Date:
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              required
            />
          </label>

          {/* Applicable To */}
          <fieldset>
            <legend>Applicable To</legend>
            <label>
              Categories:
              <select
                multiple
                value={formData.applicableTo.categories}
                onChange={(e) =>
                  handleInputChange('applicableTo', {
                    ...formData.applicableTo,
                    categories: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
              >
                {categories.map((category) => (
                  <option key={category._id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Items:
              <select
                multiple
                value={formData.applicableTo.items}
                onChange={(e) =>
                  handleInputChange('applicableTo', {
                    ...formData.applicableTo,
                    items: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
              >
                {items.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.name.en}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Users:
              <select
                multiple
                value={formData.applicableTo.users}
                onChange={(e) =>
                  handleInputChange('applicableTo', {
                    ...formData.applicableTo,
                    users: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
              >
                {users.map((user) => (
                  <option key={user._id} value={user.email}>
                    {user.email}
                  </option>
                ))}
              </select>
            </label>
          </fieldset>

          {/* Other Details */}
          <label>
            Usage Limit:
            <input
              type="number"
              value={formData.usageLimit}
              onChange={(e) => handleInputChange('usageLimit', e.target.value)}
              min="0"
            />
          </label>

          <label>
            Priority:
            <input
              type="number"
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              min="1"
            />
          </label>

          <label>
            Auto Deactivate:
            <input
              type="checkbox"
              checked={formData.autoDeactivate}
              onChange={(e) => handleInputChange('autoDeactivate', e.target.checked)}
            />
          </label>

          <label>
            Active:
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
            />
          </label>

          {/* Save Button */}
          <button type="button" onClick={handleSave}>
            {isEditing ? 'Save Changes' : 'Create Promotion'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromotionEditModal;
