import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products, onAddToCart = () => {} }) => {
  return (
    <div className="container">
      <div className="row product-list">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
