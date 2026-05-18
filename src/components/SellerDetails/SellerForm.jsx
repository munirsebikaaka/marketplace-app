import { useState } from "react";
import "../../styles/sellerDashboard.css";
import { pushProductsHandler } from "../../services/products/ProductServices";

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

function SellerForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const readFileAsDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    const selectedFiles = files.slice(0, 6);
    const previews = await Promise.all(
      selectedFiles.map(async (file) => ({
        name: file.name,
        src: await readFileAsDataUrl(file),
      })),
    );
    setImagePreviews((prev) => [...prev, ...previews].slice(0, 6));
  };

  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

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
    if (imagePreviews.length < 2)
      newErrors.images = "Please upload at least 2 product images.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmittingProduct(true);
      setSubmitError("");
      const data = {
        name: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        location: formData.location.trim(),
        images: imagePreviews.map((preview) => preview.src),
        imageUrl: imagePreviews[0]?.src || null,
        id: `${formData.title}${Math.random() * 1000 + 99 / 0.5}${Date.now().toString()}${formData.category}`,
      };
      await pushProductsHandler(data);
      setFormData({
        title: "",
        description: "",
        price: "",
        category: "",
        condition: "",
        location: "",
      });
      setImagePreviews([]);
      setErrors({});
    } catch (e) {
      setSubmitError(e.message || "Submission failed. Please try again.");
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  return (
    <section
      className={`seller-form-section ${submitError && "fetch-error-colors"}`}>
      <h2 className="form-title">Add New Product</h2>
      <form className="seller-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="title">Product Title</label>
          {submitError && (
            <p className="error-text">Submitting form failed: {submitError}</p>
          )}
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

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? "input-error" : ""}>
            <option value="">-- Select Category --</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="error-text">{errors.category}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="condition">Condition</label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className={errors.condition ? "input-error" : ""}>
            <option value="">-- Select Condition --</option>
            {conditions.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
          {errors.condition && <p className="error-text">{errors.condition}</p>}
        </div>

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

        <div className="form-group">
          <label htmlFor="images">Product Images</label>
          <input
            id="images"
            name="images"
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className={errors.images ? "input-error" : ""}
          />
          <small className="helper-text">
            Upload at least 2 images (recommended 3). Thumbnails appear below.
          </small>
          {errors.images && <p className="error-text">{errors.images}</p>}
          {imagePreviews.length > 0 && (
            <div className="image-preview-container">
              {imagePreviews.map((image, index) => (
                <div className="image-preview" key={`${image.name}-${index}`}>
                  <img src={image.src} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="btn-remove-image"
                    onClick={() => removeImage(index)}>
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmittingProduct}>
            {isSubmittingProduct ? "Submitting..." : "Add Product"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default SellerForm;
