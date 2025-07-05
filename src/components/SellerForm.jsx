import { useState, useEffect, useContext } from "react";
import { addDoc, updateDoc, collection, doc } from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "../contexts/UserContext";
import { toast } from "react-toastify";
import "../styles/sellerForm.css";

const categories = [
  "Phones",
  "Cars",
  "Electronics",
  "Home & Garden",
  "Fashion",
  "Sports",
  "Funiture",
  "Properties",
  "Food & Agriculture",
];

const conditions = ["New", "Used"];

function SellerForm({ editingProduct, setEditingProduct }) {
  const { user } = useContext(UserContext);

  // Form state includes multiple images now
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    images: [], // Array of image URLs for preview
    imageFiles: [], // Actual File objects for upload (if you add upload later)
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // When editing an existing product, populate form with its data
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        title: editingProduct.name || "",
        description: editingProduct.description || "",
        price: editingProduct.price ? editingProduct.price.toString() : "",
        category: editingProduct.category || "",
        condition: editingProduct.condition || "",
        location: editingProduct.location || "",
        images: editingProduct.images || [], // Assuming array of URLs
        imageFiles: [],
      });
    } else {
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        condition: "",
        location: "",
        images: [],
        imageFiles: [],
      });
    }
    setErrors({});
  }, [editingProduct]);

  // Handle text/select inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multiple image file selection and preview generation
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));

    // Append new images and files to existing arrays
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newPreviews],
      imageFiles: [...prev.imageFiles, ...files],
    }));
  };

  // Remove a selected image from preview and files arrays
  const removeImage = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      const newFiles = [...prev.imageFiles];
      newImages.splice(index, 1);
      newFiles.splice(index, 1);
      return { ...prev, images: newImages, imageFiles: newFiles };
    });
  };

  // Basic validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0)
      newErrors.price = "Price must be a positive number";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.condition) newErrors.condition = "Please select condition";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    // if (formData.images.length === 0)
    //   newErrors.images = "At least one image is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // Submit handler (no image upload implemented here, just URLs for now)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      // Prepare data object for Firestore
      const data = {
        name: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        location: formData.location.trim(),
        images: formData.images, // Save image URLs (for upload, integrate Firebase Storage)
        sellerId: user.uid,
        sellerName: user.name,
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), data);
        toast.success("Product updated successfully!");
      } else {
        await addDoc(collection(db, "products"), data);
        toast.success("Product added successfully!");
      }

      // Reset form and editing state
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        condition: "",
        location: "",
        images: [],
        imageFiles: [],
      });
      setEditingProduct(null);
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="seller-form-section">
      <h2 className="form-title">
        {editingProduct ? "Edit Your Product" : "Add New Product"}
      </h2>

      <form className="seller-form" onSubmit={handleSubmit} noValidate>
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Product Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="e.g. iPhone 12 Pro Max"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? "input-error" : ""}
          />
          {errors.title && <p className="error-text">{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            placeholder="Describe your product"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? "input-error" : ""}
          />
          {errors.description && (
            <p className="error-text">{errors.description}</p>
          )}
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">Price (USD)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            placeholder="e.g. 500"
            value={formData.price}
            onChange={handleChange}
            className={errors.price ? "input-error" : ""}
          />
          {errors.price && <p className="error-text">{errors.price}</p>}
        </div>

        {/* Category */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? "input-error" : ""}
          >
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="error-text">{errors.category}</p>}
        </div>

        {/* Condition */}
        <div className="form-group">
          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className={errors.condition ? "input-error" : ""}
          >
            <option value="">-- Select Condition --</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
          {errors.condition && <p className="error-text">{errors.condition}</p>}
        </div>

        {/* Location */}
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            id="location"
            name="location"
            type="text"
            placeholder="e.g. Kampala, Uganda"
            value={formData.location}
            onChange={handleChange}
            className={errors.location ? "input-error" : ""}
          />
          {errors.location && <p className="error-text">{errors.location}</p>}
        </div>

        {/* Images */}
        <div className="form-group">
          <label htmlFor="images">Product Images</label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className={errors.images ? "input-error" : ""}
          />
          {errors.images && <p className="error-text">{errors.images}</p>}

          {/* Preview selected images */}
          <div className="image-preview-container">
            {formData.images.map((src, index) => (
              <div key={index} className="image-preview">
                <img src={src} alt={`Preview ${index + 1}`} />
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={() => removeImage(index)}
                  title="Remove image"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit & Cancel buttons */}
        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting
              ? editingProduct
                ? "Updating..."
                : "Submitting..."
              : editingProduct
              ? "Update Product"
              : "Add Product"}
          </button>

          {editingProduct && (
            <button
              type="button"
              className="btn-cancel"
              onClick={() => setEditingProduct(null)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default SellerForm;
