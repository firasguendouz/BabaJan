import "./ProductsList.css";

import React from "react";

const ProductsList = ({ products, onProductClick, onEditProduct }) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Thumbnail</th>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr
            key={product._id}
            onClick={() => onProductClick(product)} // Opens the view modal
            role="button"
            tabIndex="0" // Keyboard navigation
            onKeyPress={(e) => e.key === "Enter" && onProductClick(product)} // Accessibility
          >
            <td>
              <img
                src={product.thumbnail || "/placeholder.png"}
                alt={product.name}
                className="product-thumbnail"
              />
            </td>
            <td>{product.name}</td>
            <td>
              {product.price.amount} {product.price.currency}
            </td>
            <td>{product.quantity}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductsList;
