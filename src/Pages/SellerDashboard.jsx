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
import "../styles/sellerDashboard.css";
import { UserContext } from "../contexts/UserContext";
import SellerForm from "../components/SellerDetails/SellerForm";
import { db } from "../firebase";
import userName from "../Features/UserName";

function SellerDashboard() {
  const { user } = useContext(UserContext);

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

        <p>Welcome, {userName(user)}</p>
      </header>

      <SellerForm
        user={user}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />
    </div>
  );
}

export default SellerDashboard;
