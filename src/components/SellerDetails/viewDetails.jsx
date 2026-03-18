import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";
import { CartContext } from "../../contexts/CartContext";
import "../../styles/viewDetails.css";
import ProductChatManager from "../Products/ProductChats/ProductChatManager";
import RelatedDetailedProducts from "../Products/RelatedDetailedProducts";
import { useProductsContext } from "../../contexts/ProductsContext";

export default function ViewDetails() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);
  const { products } = useProductsContext();
  const [product, setProduct] = useState(null);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const selectedProduct = products.find((p) => p.id === id);
    setProduct(selectedProduct);
  }, [id]);

  const productCategory = product?.category.toLowerCase();

  if (!product) return <p className="not-found">Product not found.</p>;

  return (
    <>
      {!showChat ? (
        <>
          <div className="product-details">
            <div className="product-image-section">
              <img
                src={product.imageUrl || "/def.jpg"}
                alt={product.name}
                className="product-detail-image"
              />
            </div>

            <div className="product-info-section">
              <h2 className="product-title">{product.name}</h2>
              <p className="product-description">
                <strong>Description:</strong> {product.description}
              </p>
              <p className="product-price">
                <strong>Price:</strong> ${product.price?.toFixed(2)}
              </p>

              {product.reviews?.length > 0 && (
                <div className="reviews-summary">
                  <p>
                    <strong>Rating:</strong>{" "}
                    {(
                      product.reviews.reduce((sum, r) => sum + r.rating, 0) /
                      product.reviews.length
                    ).toFixed(1)}
                    /5
                  </p>
                  <p>({product.reviews.length} reviews)</p>
                </div>
              )}

              <div className="control-btns">
                <button
                  className="btn-product"
                  onClick={() => addToCart(product)}
                  disabled={!user || user.role === "seller"}>
                  Add to Cart
                </button>

                {user && (
                  <button
                    className="btn-product"
                    onClick={() => {
                      setShowChat(true);
                    }}>
                    {user.uid === product.sellerId
                      ? "Check Buyers"
                      : " Start Chat"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <RelatedDetailedProducts productCategory={productCategory} />
        </>
      ) : (
        <>
          {showChat && user?.uid && (
            <ProductChatManager
              sellerId={product.sellerId}
              productId={product.id}
              onSetShowChat={setShowChat}
            />
          )}
        </>
      )}
    </>
  );
}
