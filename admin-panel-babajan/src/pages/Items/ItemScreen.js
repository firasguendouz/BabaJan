import "./ItemScreen.css";

import React, { useEffect, useState } from "react";

import Filters from "./Filters";
import MenuActions from "./MenuActions";
import ProductEditModal from "./ProductEditModal";
import ProductViewModal from "./ProductViewModal";
import ProductsList from "./ProductsList";

const ItemScreen = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [editProduct, setEditProduct] = useState(null);

  const API_BASE_URL = "http://localhost:5000/api";

  // Fetch categories and items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, itemsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }).then((res) => res.json()),
          fetch(`${API_BASE_URL}/items`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }).then((res) => res.json()),
        ]);

        if (categoriesResponse.success && itemsResponse.success) {
          setCategories(categoriesResponse.data || []);
          setProducts(itemsResponse.data || []);
          setFilteredProducts(itemsResponse.data || []);
        } else {
          console.error("Failed to fetch categories or items");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter products
  useEffect(() => {
    const filterByCategory = () => {
      let filtered = products;

      if (selectedSubcategory) {
        filtered = filtered.filter((product) => product.subcategory === selectedSubcategory);
      } else if (selectedCategory) {
        filtered = filtered.filter((product) => product.category === selectedCategory);
      }

      if (searchQuery) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (lowStockOnly) {
        filtered = filtered.filter((product) => product.quantity < 10);
      }

      return filtered;
    };

    setFilteredProducts(filterByCategory());
  }, [selectedCategory, selectedSubcategory, products, searchQuery, lowStockOnly]);

  return (
    <div className="item-screen">
      <Filters
        categories={categories}
        setSelectedCategory={setSelectedCategory}
        setSelectedSubcategory={setSelectedSubcategory}
        setSearchQuery={setSearchQuery}
        setLowStockOnly={setLowStockOnly}
      />
      <MenuActions setEditProduct={setEditProduct} />
      <ProductsList
        products={filteredProducts}
        onProductClick={setViewProduct} // Pass the click handler
      />
      {viewProduct && (
        <ProductViewModal
          product={viewProduct}
          onClose={() => setViewProduct(null)}
        />
      )}
      {editProduct && (
        <ProductEditModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
        />
      )}
    </div>
  );
};

export default ItemScreen;
