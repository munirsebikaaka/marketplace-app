import { useState, useEffect } from "react";
import { addDoc, updateDoc, collection, doc } from "firebase/firestore";
import { db } from "../firebase";

// import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// const storage = getStorage(); // Initialize storage if using image upload

function SellerForm({ user, editingProduct, setEditingProduct }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    imageUrl: "",
    imageFile: null, // Will hold the selected image file
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Populate form for editing
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        description: editingProduct.description,
        price: editingProduct.price.toString(),
        imageUrl: editingProduct.image || "",
        imageFile: null,
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        imageUrl: "",
        imageFile: null,
      });
    }
    setErrors({});
  }, [editingProduct]);

  // Handle field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file input and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        imageFile: file,
        imageUrl: URL.createObjectURL(file), // Preview only
      }));
    }
  };

  // Validate fields
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (
      !formData.price ||
      isNaN(formData.price) ||
      Number(formData.price) <= 0
    ) {
      newErrors.price = "Price must be a positive number";
    }

    // Optional: Require image for new products
    // if (!formData.imageUrl && !formData.imageFile && !editingProduct) {
    //   newErrors.image = "Product image is required";
    // }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSubmitting(true);
      let imageUrl = formData.imageUrl;

      // 🔒 IMAGE UPLOAD LOGIC (currently commented out)
      /*
      if (formData.imageFile) {
        const imageRef = ref(storage, `product-images/${Date.now()}_${formData.imageFile.name}`);
        await uploadBytes(imageRef, formData.imageFile);
        imageUrl = await getDownloadURL(imageRef);
      }
      */

      const data = {
        name: formData.name.trim(),
        description: formData.description.trim(),
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="product-form">
      <h3>{editingProduct ? "Edit Product" : "Add New Product"}</h3>

      <form onSubmit={handleSubmit} noValidate>
        {/* Name Field */}
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
          {errors.name && <p className="error-text">{errors.name}</p>}
        </div>

        {/* Description Field */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          {errors.description && (
            <p className="error-text">{errors.description}</p>
          )}
        </div>

        {/* Price Field */}
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
          {errors.price && <p className="error-text">{errors.price}</p>}
        </div>

        {/* Image Input */}
        <div className="form-group">
          <label htmlFor="image">Product Image:</label>
          <input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
          {/* Uncomment to show image error:
          {errors.image && <p className="error-text">{errors.image}</p>} */}
        </div>

        {/* Preview Image */}
        {formData.imageUrl && (
          <img
            src={formData.imageUrl}
            alt="Preview"
            className="product-image-preview"
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-form btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? editingProduct
              ? "Updating..."
              : "Submitting..."
            : editingProduct
            ? "Update Product"
            : "Add Product"}
        </button>

        {/* Cancel Button (Edit Mode Only) */}
        {editingProduct && (
          <button
            type="button"
            className="btn-form btn-cancel"
            onClick={() => setEditingProduct(null)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
      </form>
    </section>
  );
}

export default SellerForm;
