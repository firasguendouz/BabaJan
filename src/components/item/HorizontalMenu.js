import './HorizontalMenu.css';

import React, { useRef, useState } from 'react';

const HorizontalMenu = ({ categories, onCategoryClick }) => {
  const scrollContainerRef = useRef(null);
  const [isLeftScrollable, setIsLeftScrollable] = useState(false);
  const [isRightScrollable, setIsRightScrollable] = useState(true);

  const scrollHandler = (direction) => {
    const scrollAmount = 150; // Amount to scroll in pixels
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      if (direction === 'left') {
        container.scrollLeft -= scrollAmount;
      } else {
        container.scrollLeft += scrollAmount;
      }

      // Check scrollability after scrolling
      setTimeout(() => {
        setIsLeftScrollable(container.scrollLeft > 0);
        setIsRightScrollable(
          container.scrollLeft < container.scrollWidth - container.clientWidth
        );
      }, 200);
    }
  };

  return (
    <div className="horizontal-menu">
      <button
        className={`scroll-arrow left-arrow ${isLeftScrollable ? '' : 'hidden'}`}
        aria-label="Scroll left"
        onClick={() => scrollHandler('left')}
      >
        <span className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M14.997 18L9 11.982 15 6"
            ></path>
          </svg>
        </span>
      </button>

      <div
        className="scroll-container"
        ref={scrollContainerRef}
        onScroll={() => {
          if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            setIsLeftScrollable(container.scrollLeft > 0);
            setIsRightScrollable(
              container.scrollLeft < container.scrollWidth - container.clientWidth
            );
          }
        }}
      >
        <div className="tabs">
          {categories.map((category) => (
            <button
              key={category._id} // Assuming category._id is unique
              className="tab"
              role="tab"
              onClick={() => onCategoryClick(category._id)}
            >
              {category.title} {/* Displaying the title */}
            </button>
          ))}
        </div>
      </div>

      <button
        className={`scroll-arrow right-arrow ${isRightScrollable ? '' : 'hidden'}`}
        aria-label="Scroll right"
        onClick={() => scrollHandler('right')}
      >
        <span className="icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              d="M9.003 6L15 12.018 9 18"
            ></path>
          </svg>
        </span>
      </button>
    </div>
  );
};

export default HorizontalMenu;
