import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/productCard.css";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

// Import contexts to get global user and cart actions
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";

function Products() {
  // Access the logged-in user from global UserContext
  const { user } = useContext(UserContext);

  // Access addToCart function from CartContext to add products to cart
  const { addToCart } = useContext(CartContext);

  // Local state for products list, loading state, and search term
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Listen to real-time updates on 'products' collection from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      // Map Firestore docs into product objects
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setProducts(productList);
      setLoading(false);
    });

    // Cleanup listener on component unmount
    return unsubscribe;
  }, []);

  // Filter products based on search term in name or description
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products">
      <h2>Products</h2>

      {/* Search input to filter products */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="products-grid">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                {/* Placeholder image */}
                {/* <img
                  src={product.imageUrl || "def.jpg"}
                  alt={product.name}
                  className="product-image"
                /> */}

                <img
                  src={"def.jpg"}
                  alt={"default data"}
                  className="product-image"
                />

                <div className="seller-product-card">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">
                    Price: ${product.price.toFixed(2)}
                  </p>

                  {/* Show rating summary if reviews exist */}
                  {product.reviews && product.reviews.length > 0 && (
                    <div className="reviews-summary">
                      <span>
                        Rating:{" "}
                        {(
                          product.reviews.reduce(
                            (sum, review) => sum + review.rating,
                            0
                          ) / product.reviews.length
                        ).toFixed(1)}
                        /5
                      </span>
                      <span>({product.reviews.length} reviews)</span>
                    </div>
                  )}

                  {/* Buttons for adding to cart and viewing details */}
                  <div className="product-further-links">
                    <button
                      className="btn-product btn-primary"
                      onClick={() => addToCart(product)}
                      // Disable button if user is not logged in or user is a seller
                      disabled={!user || user.role === "seller"}
                    >
                      Add to Cart
                    </button>

                    <Link
                      to={`/product/${product.id}`}
                      className="view-details"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>
              No products found.{" "}
              {/* If user is a seller, suggest adding products */}
              {user?.role === "seller" && (
                <Link to="/seller">Add some products</Link>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Products;
