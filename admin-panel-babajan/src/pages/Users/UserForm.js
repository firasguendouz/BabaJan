import React, { useState } from 'react';

import { updateUser } from '../../api/adminApi'; // Import the API call

const UserForm = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    ...user,
    password: '', // Password should start as empty
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
  
    // Check for nested field names (e.g., "name.firstName")
    if (name.includes('.')) {
      const keys = name.split('.'); // Split "name.firstName" into ["name", "firstName"]
      setFormData((prev) => ({
        ...prev,
        [keys[0]]: {
          ...prev[keys[0]], // Preserve other fields in "name"
          [keys[1]]: value, // Update the specific field (e.g., "firstName")
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  

  const handleAddressChange = (index, field, value) => {
    const updatedAddresses = [...formData.address];
    updatedAddresses[index] = {
      ...updatedAddresses[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      address: updatedAddresses,
    }));
  };

  const handleAddAddress = () => {
    setFormData((prev) => ({
      ...prev,
      address: [
        ...prev.address,
        { street: '', city: '', postalCode: '', country: '', isDefault: false },
      ],
    }));
  };

  const handleRemoveAddress = (index) => {
    const updatedAddresses = formData.address.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, address: updatedAddresses }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      const updatedData = { ...formData };
      if (!updatedData.password) {
        delete updatedData.password; // Remove password if it's empty
      }
  
      const updatedUser = await updateUser(user._id, updatedData); // API call
      alert('User updated successfully.');
      onSave(updatedUser.data); // Pass the updated user back to the parent
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name:
        <input
          type="text"
          name="name.firstName"
          value={formData.name.firstName}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Last Name:
        <input
          type="text"
          name="name.lastName"
          value={formData.name.lastName}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Phone:
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formData.password}
          placeholder="Enter new password"
          onChange={handleInputChange}
        />
      </label>
      <fieldset>
        <legend>Addresses</legend>
        {formData.address.map((addr, index) => (
          <div key={index} className="address-block">
            <label>
              Street:
              <input
                type="text"
                value={addr.street}
                onChange={(e) => handleAddressChange(index, 'street', e.target.value)}
                required
              />
            </label>
            <label>
              City:
              <input
                type="text"
                value={addr.city}
                onChange={(e) => handleAddressChange(index, 'city', e.target.value)}
                required
              />
            </label>
            <label>
              Postal Code:
              <input
                type="text"
                value={addr.postalCode}
                onChange={(e) => handleAddressChange(index, 'postalCode', e.target.value)}
                required
              />
            </label>
            <label>
              Country:
              <input
                type="text"
                value={addr.country}
                onChange={(e) => handleAddressChange(index, 'country', e.target.value)}
                required
              />
            </label>
            <label>
              Default:
              <input
                type="checkbox"
                checked={addr.isDefault}
                onChange={(e) => handleAddressChange(index, 'isDefault', e.target.checked)}
              />
            </label>
            <button type="button" onClick={() => handleRemoveAddress(index)}>
              Remove Address
            </button>
          </div>
        ))}
        <button type="button" onClick={handleAddAddress}>
          Add Address
        </button>
      </fieldset>
      <label>
        Active:
        <select
          name="isActive"
          value={formData.isActive ? 'true' : 'false'}
          onChange={handleInputChange}
        >
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>
      </label>
      <label>
        Deleted Reason:
        <textarea
          name="deletedReason"
          value={formData.deletedReason || ''}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
};

export default UserForm;
