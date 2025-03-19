import React, { useEffect, useState } from "react";
import ProductList from "./ProductList";
const BASE_URL = "http://fastapi-backend.us-east-1.elasticbeanstalk.com";

const ProductContainer = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  let componentMounted = true;

  useEffect(() => {
    const getProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${BASE_URL}/products/`);
        if (componentMounted) {
          setData(await response.json());
          setLoading(false);
        }
      } catch (error) {
        console.log(error)
      }

      return () => {
        componentMounted = false;
      };
    };

    getProducts();
  }, []);

  const handleAddToCart = (product) => {};

  return <ProductList products={data} onAddToCart={handleAddToCart} />;
};

export default ProductContainer;
