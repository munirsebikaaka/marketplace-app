import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase";

import "../styles/sellerDashboard.css";
import SellerForm from "./SellerForm";
import YourProducts from "./YourProducts";

// Import UserContext to get the logged-in user globally
import { UserContext } from "../contexts/UserContext";

function SellerDashboard() {
  // Get the current user from UserContext instead of props
  const { user } = useContext(UserContext);

  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if user is not a seller
    if (user?.role !== "seller") {
      navigate("/");
      return;
    }

    // Query Firestore products where sellerId matches current user's uid
    const q = query(
      collection(db, "products"),
      where("sellerId", "==", user.uid)
    );

    // Subscribe to real-time updates of seller's products
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    });

    // Cleanup subscription on unmount
    return unsubscribe;
  }, [user, navigate]);

  // Handler to start editing a product
  const handleEdit = (product) => setEditingProduct(product);

  // Handler to delete a product document from Firestore
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  return (
    <div className="seller-dashboard">
      <header className="dashboard-header">
        <h2>Seller Dashboard</h2>
        {/* Show the seller's name if user is loaded */}
        <p>Welcome, {user?.name}</p>
      </header>

      {/* Pass user and editing state to SellerForm */}
      <SellerForm
        user={user}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />

      {/* Pass products and handlers to YourProducts component */}
      <YourProducts
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default SellerDashboard;
