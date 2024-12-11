import './PromotionList.css';

import React, { useEffect, useState } from 'react';
import {
  createPromotion,
  deletePromotion,
  fetchPromotions,
  togglePromotionStatus,
  updatePromotion,
} from '../../api/adminApi';

import PromotionEditModal from './PromotionEditModal'; // Modal for editing/creating promotions
import { debounce } from '../../utils/helpers';
import { formatDate } from '../../utils/dateFormatter';

const PromotionList = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', status: '' });
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPromotions, setTotalPromotions] = useState(0);
  const [selectedPromotion, setSelectedPromotion] = useState(null); // For viewing/editing promotions
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPromotionData = async () => {
      setLoading(true);
      try {
        const response = await fetchPromotions({ ...filters, page, limit });
        setPromotions(response.data.data);
        setTotalPromotions(response.data.meta.total);
      } catch (error) {
        console.error('Error fetching promotions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotionData();
  }, [filters, page, limit]);

  const handleSearchChange = debounce((value) => setFilters((prev) => ({ ...prev, search: value })), 500);

  const handleDelete = async (promoId) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await deletePromotion(promoId);
        setPromotions((prev) => prev.filter((promo) => promo._id !== promoId));
        alert('Promotion deleted successfully.');
      } catch (error) {
        console.error('Error deleting promotion:', error);
      }
    }
  };

  const handleToggleStatus = async (promoId) => {
    try {
      await togglePromotionStatus(promoId);
      setPromotions((prev) =>
        prev.map((promo) =>
          promo._id === promoId ? { ...promo, isActive: !promo.isActive } : promo
        )
      );
      alert('Promotion status updated successfully.');
    } catch (error) {
      console.error('Error toggling promotion status:', error);
    }
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedPromotion(null); // Clear selection for new promotion
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleSavePromotion = async (promoData) => {
    try {
      if (isEditing) {
        const response = await updatePromotion(selectedPromotion._id, promoData);
        setPromotions((prev) =>
          prev.map((promo) => (promo._id === selectedPromotion._id ? response.data.data : promo))
        );
        alert('Promotion updated successfully.');
      } else {
        const response = await createPromotion(promoData);
        setPromotions((prev) => [response.data.data, ...prev]);
        alert('Promotion created successfully.');
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving promotion:', error);
      alert('Failed to save promotion.');
    }
  };

  const totalPages = Math.ceil(totalPromotions / limit);

  return (
    <div className="promotion-list-container">
      <h2>Promotion Management</h2>

      {/* Filters */}
      <div className="promotion-filters">
        <input
          type="text"
          placeholder="Search by name or promo code..."
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <select
          onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
          value={filters.status}
        >
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <button onClick={handleCreate}>+ Add New Promotion</button>
      </div>

      {/* Promotion Table */}
      {loading ? (
        <p>Loading promotions...</p>
      ) : (
        <table className="promotion-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Promo Code</th>
              <th>Type</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.length > 0 ? (
              promotions.map((promo) => (
                <tr key={promo._id}>
                  <td>{promo._id}</td>
                  <td>{promo.title}</td>
                  <td>{promo.promoCode}</td>
                  <td>{promo.type}</td>
                  <td>{promo.discountValue}%</td>
                  <td>{promo.isActive ? 'Active' : 'Inactive'}</td>
                  <td>{formatDate(promo.startDate)}</td>
                  <td>{formatDate(promo.endDate)}</td>
                  <td>
                    <button onClick={() => handleEdit(promo)}>Edit</button>
                    <button onClick={() => handleToggleStatus(promo._id)}>
                      {promo.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onClick={() => handleDelete(promo._id)}>Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9">No promotions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button disabled={page === totalPages} onClick={() => setPage((prev) => prev + 1)}>
          Next
        </button>
      </div>

      {/* Promotion Modal */}
      {isModalOpen && (
        <PromotionEditModal
          promotion={selectedPromotion}
          isEditing={isEditing}
          onSave={handleSavePromotion}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default PromotionList;
