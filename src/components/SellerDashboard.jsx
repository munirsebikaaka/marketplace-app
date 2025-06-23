import { useEffect, useState } from "react";
import "../styles/sellerDashboard.css"; // Adjust the path as needed
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
// import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
// import { storage } from "../firebase";

function SellerDashboard({ user }) {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    imageFile: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const navigate = useNavigate();

  // Redirect if not a seller
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // const handleImageSelect = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData((prev) => ({
  //       ...prev,
  //       imageFile: file,
  //       imageUrl: URL.createObjectURL(file),
  //     }));
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = formData.imageUrl;

      // COMMENTED OUT IMAGE UPLOAD
      // if (formData.imageFile) {
      //   const storageRef = ref(
      //     storage,
      //     `products/${user.uid}/${Date.now()}_${formData.imageFile.name}`
      //   );
      //   const snapshot = await uploadBytes(storageRef, formData.imageFile);
      //   imageUrl = await getDownloadURL(snapshot.ref);
      // }

      const data = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        image: imageUrl,
        sellerId: user.uid,
        sellerName: user.name,
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), data);
      } else {
        await addDoc(collection(db, "products"), data);
      }

      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        imageFile: null,
      });
      setEditingProduct(null);
    } catch (err) {
      alert("Error submitting product: " + err.message);
      console.error(err);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      imageUrl: product.image || "",
      imageFile: null,
    });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "products", id));
  };

  return (
    <div className="seller-dashboard">
      <header className="dashboard-header">
        <h2>Seller Dashboard</h2>
        <p>Welcome, {user?.name}</p>
      </header>

      <section className="product-form">
        <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description:</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="price">Price:</label>
            <input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          {/* Image Upload Preview */}
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="product-image-preview"
            />
          )}

          {/* 
          <div className="form-group">
            <label htmlFor="image">Product Image:</label>
            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="upload-btn"
            />
          </div>
          */}

          <button type="submit" className="btn-form btn-submit">
            {editingProduct ? "Update Product" : "Add Product"}
          </button>
          {editingProduct && (
            <button
              type="button"
              className="btn-form btn-cancel"
              onClick={() => {
                setEditingProduct(null);
                setFormData({
                  name: "",
                  description: "",
                  price: "",
                  imageUrl: "",
                  imageFile: null,
                });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      </section>

      <section className="seller-products">
        <h3>Your Products</h3>
        <div className="products-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card">
              {/* Optional image */}
              {/* {p.image && (
                <img
                  src={p.image}
                  alt={p.name}
                  className="product-image"
                />
              )} */}
              <div className="seller-product-card">
                <h4>{p.name}</h4>
                <p>{p.description}</p>
                <p>${p.price.toFixed(2)}</p>

                <div className="product-actions">
                  <button
                    className="btn-action btn-edit"
                    onClick={() => handleEdit(p)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => handleDelete(p.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SellerDashboard;
