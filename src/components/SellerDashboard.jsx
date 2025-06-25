import { useEffect, useState } from "react";
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

function SellerDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "seller") {
      navigate("/");
      return;
    }

    const q = query(
      collection(db, "products"),
      where("sellerId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(items);
    });

    return unsubscribe;
  }, [user, navigate]);

  const handleEdit = (product) => setEditingProduct(product);

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  return (
    <div className="seller-dashboard">
      <header className="dashboard-header">
        <h2>Seller Dashboard</h2>
        <p>Welcome, {user?.name}</p>
      </header>

      <SellerForm
        user={user}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />

      <YourProducts
        products={products}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default SellerDashboard;
