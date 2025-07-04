import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";
import "../styles/viewDetails.css";

import ProductChatManager from "./ProductChatManager";

export default function ViewDetails() {
  const { id } = useParams();
  const { user } = useContext(UserContext);
  const { addToCart } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedProduct = { id: docSnap.id, ...docSnap.data() };
          setProduct(fetchedProduct);
        } else {
          console.error("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  if (loading) return <p className="loading">Loading product details...</p>;
  if (!product) return <p className="not-found">Product not found.</p>;

  return (
    <>
      {!showChat ? (
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
                disabled={!user || user.role === "seller"}
              >
                Add to Cart
              </button>

              {user && (
                <button
                  className="btn-product"
                  onClick={() => {
                    setShowChat(true);
                  }}
                >
                  {user.uid === product.sellerId
                    ? "Buyer Messages"
                    : " Start Chat"}
                </button>
              )}
            </div>
          </div>
        </div>
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
