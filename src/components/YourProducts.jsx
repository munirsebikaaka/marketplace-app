import { collection, onSnapshot } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { db } from "../firebase";
import { UserContext } from "../contexts/UserContext";
import { Link } from "react-router-dom";

function YourProducts() {
  const [products, setProducts] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productList);
    });
    return unsubscribe;
  }, []);

  const filteredProducts = products?.filter(
    (product) => product.sellerId === user?.uid
  );

  return (
    <section className="seller-products">
      <h3>Your Products</h3>
      <div className="products-grid">
        {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
          filteredProducts.map((p) => (
            <div key={p.id} className="product-card">
              <img
                src={p.image || "def.jpg"}
                alt={p.name || "Product Image"}
                className="product-image"
              />
              <div className="seller-product-card">
                <h4 className="product-title">{p.name}</h4>
                <p className="product-description">{p.description}</p>
                <p className="product-price">
                  Price ${parseFloat(p.price).toFixed(2)}
                </p>

                <div className="product-actions">
                  <Link to={`/product/${p.id}`} className="view-details">
                    View Details
                  </Link>
                  <button className="btn-action btn-delete">Delete</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </section>
  );
}

export default YourProducts;
