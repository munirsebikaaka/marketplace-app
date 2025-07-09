import { useContext } from "react";

import { UserContext } from "../../contexts/UserContext";
import { Link } from "react-router-dom";
import { useProducts } from "../../contexts/ProductsContext";

const ElectronicsProducts = () => {
  const { products, loading } = useProducts();

  const { user } = useContext(UserContext);

  const electronics = products?.filter(
    (product) => product.category?.toLowerCase() === "electronics"
  );

  return (
    <div className="products">
      <h2>Electronics</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : (
        <div className="products-grid">
          {electronics.length > 0 ? (
            electronics.map((product) => (
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
};
export default ElectronicsProducts;
