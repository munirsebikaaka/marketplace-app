import { createContext, useContext, useEffect, useState } from "react";
import { getProductsHandler } from "../services/products/ProductServices";

const ProductsContext = createContext();
export const useProductsContext = () => useContext(ProductsContext);
export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const excuteProducts = async () => {
      try {
        setLoading(true);
        const productsResponse = await getProductsHandler();
        setProducts(productsResponse);
        setLoading(false);
      } catch (e) {
        console.log("the error to consider", e);
      }
    };

    excuteProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading }}>
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
