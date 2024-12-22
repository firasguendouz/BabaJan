import './Items.css';

import React, { useEffect, useState } from 'react';

import HorizontalMenu from '../components/item/HorizontalMenu';
import ItemList from '../components/item/ItemList';
import axios from 'axios';

const ItemsPage = () => {
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch categories and items on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/items'),
        ]);

        setCategories(categoriesResponse.data.data || []);
        setItems(itemsResponse.data.data || []);
        setFilteredItems(itemsResponse.data.data || []);
      } catch (err) {
        setError('Failed to load data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter items based on category or subcategory
  useEffect(() => {
    let filtered = items;

    if (selectedSubcategory) {
      filtered = items.filter((item) => item.subcategory === selectedSubcategory);
    } else if (selectedCategory) {
      filtered = items.filter((item) => item.category === selectedCategory);
    }

    setFilteredItems(filtered);
  }, [selectedCategory, selectedSubcategory, items]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null); // Reset subcategory when selecting a new category
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };

  if (loading) return <div className="items-loading">Loading items...</div>;
  if (error) return <div className="items-error">{error}</div>;

  const pageTitle = selectedSubcategory
    ? `Products in ${
        categories
          .flatMap((cat) => cat.subcategories)
          .find((sub) => sub._id === selectedSubcategory)?.name || 'Subcategory'
      }`
    : selectedCategory
    ? `Products in ${
        categories.find((cat) => cat._id === selectedCategory)?.title || 'Category'
      }`
    : 'Our Products';

  return (
    <main className="items-page">
      <h1 className="items-title">{pageTitle}</h1>

      {/* Filters Section */}
      <div className="items-filters">
        <HorizontalMenu
          categories={categories.map((cat) => ({
            ...cat,
            subcategories: cat.subcategories.map((sub) => ({
              _id: sub._id,
              name: sub.name,
            })),
          }))}
          onCategoryClick={handleCategoryClick}
          onSubcategoryClick={handleSubcategoryClick}
        />
      </div>

      {/* Item List */}
      <div className="items-list">
        {filteredItems.length > 0 ? (
          <ItemList
            items={filteredItems}
            onItemClick={(id) => console.log(`Clicked item: ${id}`)}
          />
        ) : (
          <div className="items-empty">No items found in this category or subcategory.</div>
        )}
      </div>
    </main>
  );
};

export default ItemsPage;
