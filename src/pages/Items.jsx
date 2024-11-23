import './Items.css';

import ItemList from '../components/item/ItemList';
import React from 'react';
import useFetch from '../hooks/useFetch';

const Items = () => {
  const { data: items, loading, error } = useFetch('/api/items');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  console.log('Fetched items:', items); // Debug to ensure `items` is an array

  return (
    <div className="items-page">
      <h1>Shop Items</h1>
      <ItemList items={items} onItemClick={(id) => console.log('Item selected:', id)} />
    </div>
  );
};

export default Items;
