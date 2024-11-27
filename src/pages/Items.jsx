import React, { useEffect, useState } from 'react';

import HorizontalMenu from '../components/item/HorizontalMenu';
import ItemList from '../components/item/ItemList';
import axios from 'axios';

const ItemsPage = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemsResponse = await axios.get('http://localhost:5000/api/items');
        const categoriesResponse = await axios.get('http://localhost:5000/api/categories');

        setItems(itemsResponse.data.data);
        setCategories(categoriesResponse.data.data);
        setFilteredItems(itemsResponse.data.data);
      } catch (err) {
        setError('Error fetching data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter items when category changes
  useEffect(() => {
    if (selectedCategory) {
      setFilteredItems(items.filter((item) => item.category === selectedCategory));
    } else {
      setFilteredItems(items);
    }
  }, [selectedCategory, items]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category._id);
  };

  if (loading) return <div>Loading items...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Our Products</h1>

      {/* Horizontal menu for categories */}
      <HorizontalMenu
        categories={categories.map((cat) => ({ _id: cat._id, title: cat.title }))}
        onCategoryClick={(category) => handleCategoryClick(category)}
      />

      {/* Item list */}
      <ItemList items={filteredItems} onItemClick={(id) => console.log(`Clicked item: ${id}`)} />
    </div>
  );
};

export default ItemsPage;
