import "./Filters.css";

import React, { useRef, useState } from "react";

const Filters = ({
  categories,
  setSelectedCategory,
  setSelectedSubcategory,
  setSearchQuery,
  setLowStockOnly,
}) => {
  const categoryScrollRef = useRef(null);
  const subcategoryScrollRef = useRef(null);

  const [selectedCategory, setLocalSelectedCategory] = useState(null);
  const [selectedSubcategory, setLocalSelectedSubcategory] = useState(null);
  const [isCategoryScrollable, setIsCategoryScrollable] = useState({
    left: false,
    right: true,
  });
  const [isSubcategoryScrollable, setIsSubcategoryScrollable] = useState({
    left: false,
    right: true,
  });

  const scrollHandler = (direction, containerRef, setScrollableState) => {
    const scrollAmount = 150; // Amount to scroll in pixels
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollLeft += direction === "left" ? -scrollAmount : scrollAmount;

      // Update scrollability states
      setTimeout(() => {
        setScrollableState({
          left: container.scrollLeft > 0,
          right: container.scrollLeft < container.scrollWidth - container.clientWidth,
        });
      }, 200);
    }
  };

  const handleCategoryClick = (categoryId) => {
    setLocalSelectedCategory(categoryId);
    setSelectedCategory(categoryId);
    setLocalSelectedSubcategory(null); // Reset subcategory selection
    setSelectedSubcategory(null);
  };

  const handleSubcategoryClick = (subcategoryId) => {
    setLocalSelectedSubcategory(subcategoryId);
    setSelectedSubcategory(subcategoryId);
  };

  return (
    <div className="filters">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        className="filters__search"
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Low Stock Toggle */}
      <label className="filters__checkbox">
        <input
          type="checkbox"
          onChange={(e) => setLowStockOnly(e.target.checked)}
        />
        Low Stock Only
      </label>

      {/* Categories Menu */}
      <div className="category-menu">
        <button
          className={`scroll-arrow left-arrow ${isCategoryScrollable.left ? "" : "hidden"}`}
          aria-label="Scroll categories left"
          onClick={() => scrollHandler("left", categoryScrollRef, setIsCategoryScrollable)}
        >
          &lt;
        </button>
        <div
          className="scroll-container"
          ref={categoryScrollRef}
          onScroll={() => {
            if (categoryScrollRef.current) {
              const container = categoryScrollRef.current;
              setIsCategoryScrollable({
                left: container.scrollLeft > 0,
                right: container.scrollLeft < container.scrollWidth - container.clientWidth,
              });
            }
          }}
        >
          {categories.map((category) => (
            <button
              key={category._id}
              className={`category-tab ${selectedCategory === category._id ? "active" : ""}`}
              onClick={() => handleCategoryClick(category._id)}
            >
              {category.title}
            </button>
          ))}
        </div>
        <button
          className={`scroll-arrow right-arrow ${isCategoryScrollable.right ? "" : "hidden"}`}
          aria-label="Scroll categories right"
          onClick={() => scrollHandler("right", categoryScrollRef, setIsCategoryScrollable)}
        >
          &gt;
        </button>
      </div>

      {/* Subcategories Menu */}
      {selectedCategory && (
        <div className="subcategory-menu">
          <button
            className={`scroll-arrow left-arrow ${isSubcategoryScrollable.left ? "" : "hidden"}`}
            aria-label="Scroll subcategories left"
            onClick={() =>
              scrollHandler("left", subcategoryScrollRef, setIsSubcategoryScrollable)
            }
          >
            &lt;
          </button>
          <div
            className="scroll-container"
            ref={subcategoryScrollRef}
            onScroll={() => {
              if (subcategoryScrollRef.current) {
                const container = subcategoryScrollRef.current;
                setIsSubcategoryScrollable({
                  left: container.scrollLeft > 0,
                  right: container.scrollLeft < container.scrollWidth - container.clientWidth,
                });
              }
            }}
          >
            {categories
              .find((cat) => cat._id === selectedCategory)
              ?.subcategories.map((subcategory) => (
                <button
                  key={subcategory._id}
                  className={`subcategory-tab ${selectedSubcategory === subcategory._id ? "active" : ""}`}
                  onClick={() => handleSubcategoryClick(subcategory._id)}
                >
                  {subcategory.name}
                </button>
              ))}
          </div>
          <button
            className={`scroll-arrow right-arrow ${isSubcategoryScrollable.right ? "" : "hidden"}`}
            aria-label="Scroll subcategories right"
            onClick={() =>
              scrollHandler("right", subcategoryScrollRef, setIsSubcategoryScrollable)
            }
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

export default Filters;
