import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";
import "../styles/viewDetails.css";
import ChatBox from "./ChartBox";

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

  const isBuyer = user && user.uid !== product.sellerId;

  return (
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

        <button
          className="btn-product"
          onClick={() => addToCart(product)}
          disabled={!user || user.role === "seller"}
        >
          Add to Cart
        </button>

        {/* If user is buyer, show start chat button */}
        {user && user.uid !== product.sellerId && (
          <button
            className="btn-product"
            onClick={() => {
              setShowChat(true);
            }}
          >
            Start Chat
          </button>
        )}

        {/* Show ChatBox if:
            - buyer clicked "Start Chat"
            - OR seller is logged in (they don't need to click)
        */}
        {(showChat || user?.uid === product.sellerId) && user?.uid && (
          <ChatBox
            buyerId={user.uid === product.sellerId ? null : user.uid}
            sellerId={product.sellerId}
            productId={product.id}
            currentUserId={user.uid} // PASS current logged-in user ID
          />
        )}
      </div>
    </div>
  );
}

/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chats/{chatId} {
      allow read, write: if request.auth != null &&
        (request.auth.uid == resource.data.buyerId || request.auth.uid == resource.data.sellerId);

      match /messages/{messageId} {
        allow read, write: if request.auth != null &&
          (request.auth.uid == resource.parent.data.buyerId || request.auth.uid == resource.parent.data.sellerId);
      }
    }
  }
}
*/
