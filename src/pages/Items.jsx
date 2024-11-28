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

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          axios.get('https://babajan.onrender.com/api/categories'),
          axios.get('https://babajan.onrender.com/api/items'),
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

  // Filter items based on selected category or subcategory
  useEffect(() => {
    if (selectedSubcategory) {
      setFilteredItems(
        items.filter((item) => item.subcategory === selectedSubcategory)
      );
    } else if (selectedCategory) {
      setFilteredItems(
        items.filter((item) => item.category === selectedCategory)
      );
    } else {
      setFilteredItems(items);
    }
  }, [selectedCategory, selectedSubcategory, items]);

  const handleCategoryClick = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null); // Reset subcategory when category is selected
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setSelectedSubcategory(subcategoryId);
  };

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>
        {selectedSubcategory
          ? `Products in ${categories
              .flatMap((cat) => cat.subcategories)
              .find((sub) => sub._id === selectedSubcategory)?.name || 'Subcategory'}`
          : selectedCategory
          ? `Products in ${categories.find((cat) => cat._id === selectedCategory)?.title || 'Category'}`
          : 'Our Products'}
      </h1>

      {/* Horizontal menu for categories and subcategories */}
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

      {/* Item list */}
      {filteredItems.length > 0 ? (
        <ItemList
          items={filteredItems}
          onItemClick={(id) => console.log(`Clicked item: ${id}`)}
        />
      ) : (
        <div>No items found in this category or subcategory.</div>
      )}
    </div>
  );
};

export default ItemsPage;
