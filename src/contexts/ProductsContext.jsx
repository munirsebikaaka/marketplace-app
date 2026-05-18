import { createContext, useContext, useEffect, useRef, useState } from "react";
import { getProductsHandler } from "../services/products/ProductServices";

const ProductsContext = createContext();
export const useProductsContext = () => useContext(ProductsContext);
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMounted = useRef(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const productsResponse = await getProductsHandler();
      if (isMounted.current) {
        setProducts(productsResponse);
      }
    } catch (err) {
      if (isMounted.current) {
        console.error("ProductsContext fetch error:", err);
        setError("Failed to load products. Please try again.");
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMounted.current = true;
    fetchProducts();

    return () => {
      isMounted.current = false;
    };
  }, []);

  return (
    <ProductsContext.Provider
      value={{ products, loading, error, refetch: fetchProducts }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
