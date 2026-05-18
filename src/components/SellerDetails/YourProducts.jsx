import { useContext } from "react";

import { Link } from "react-router-dom";
import { useProducts } from "../../contexts/ProductsContext";
import ImageGallery from "../Products/ImageGallery";
import Spinner from "../../Features/Spiner";
import { useUserContext } from "../../contexts/UserContext";

function YourProducts() {
  const { user } = useUserContext();
  const { products, loading, error, refetch } = useProducts();

  const filteredProducts = products?.filter(
    (product) => product.sellerId === user?.uid,
  );

  return (
    <section className="products">
      <h2>Your Products</h2>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button className="btn btn--secondary" onClick={refetch}>
            Retry
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <div key={p.id} className="product-card">
                <ImageGallery
                  images={
                    p.images?.length > 0
                      ? p.images
                      : p.imageUrl
                        ? [p.imageUrl]
                        : p.image
                          ? [p.image]
                          : ["def.jpg"]
                  }
                  alt={p.name || "Product Image"}
                />
                <div className="seller-product-card">
                  <h4 className="product-title">{p.name}</h4>
                  <p className="product-description">{p.description}</p>
                  <p className="product-price">
                    Price ${parseFloat(p.price).toFixed(2)}
                  </p>

                  <div className="product-further-links">
                    <button className="btn-action btn-delete">Delete</button>
                    <Link to={`/product/${p.id}`} className="view-details">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      )}
    </section>
  );
}

export default YourProducts;
