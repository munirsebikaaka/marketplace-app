import { useContext } from "react";

import { CartContext } from "../../contexts/CartContext";

import { Link } from "react-router-dom";
import { useProducts } from "../../contexts/ProductsContext";
import ImageGallery from "./ImageGallery";
import { useUserContext } from "../../contexts/UserContext";

const ElectronicsProducts = () => {
  const { products, loading, error, refetch } = useProducts();
  const { addToCart } = useContext(CartContext);

  const { user } = useUserContext();

  const electronics = products?.filter(
    (product) => product.category?.toLowerCase() === "electronics",
  );

  return (
    <div className="products">
      <h2>Electronics</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button className="btn btn--secondary" onClick={refetch}>
            Retry
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {electronics.length > 0 ? (
            electronics.map((product) => (
              <div key={product.id} className="product-card">
                <ImageGallery
                  images={
                    product.images?.length > 0
                      ? product.images
                      : product.imageUrl
                        ? [product.imageUrl]
                        : product.image
                          ? [product.image]
                          : ["def.jpg"]
                  }
                  alt={product.name}
                />

                <div className="seller-product-card">
                  <h3 className="product-title">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <p className="product-price">
                    Price: ${product.price.toFixed(2)}
                  </p>

                  {product.reviews && product.reviews.length > 0 && (
                    <div className="reviews-summary">
                      <span>
                        Rating:{" "}
                        {(
                          product.reviews.reduce(
                            (sum, review) => sum + review.rating,
                            0,
                          ) / product.reviews.length
                        ).toFixed(1)}
                        /5
                      </span>
                      <span>({product.reviews.length} reviews)</span>
                    </div>
                  )}

                  <div className="product-further-links">
                    <button
                      className="btn-product btn-primary"
                      onClick={() => addToCart(product)}
                      disabled={!user || user.role === "seller"}>
                      Add to Cart
                    </button>

                    <Link
                      to={`/product/${product.id}`}
                      className="view-details">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>
              No products found.{" "}
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
