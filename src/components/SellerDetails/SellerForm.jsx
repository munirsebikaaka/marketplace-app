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
  const [isSubmitingProduct, setIsSubmittingProduct] = useState(false);
  const [fetchErrror, setFetchErrror] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const data = {
        name: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category,
        condition: formData.condition,
        location: formData.location.trim(),
        id: `${formData.title}${Math.random() * 1000 + 99 / 0.5}${Date.now().toString()}${formData.category}`,
      };
      await pushProductsHandler(data, setFetchErrror);
      setIsSubmittingProduct(false);
    } catch (e) {
      console.log("error from seller form", e);
    }

    setFormData({
      title: "",
      description: "",
      price: "",
      category: "",
      condition: "",
      location: "",
    });
  };

  return (
    <section className="seller-form-section">
      <h2 className="form-title">Add New Product</h2>
      <form className="seller-form" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="title">Product Title</label>
          {fetchErrror && (
            <p className="error-text">Submiting form failed: {fetchErrror}</p>
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

        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitingProduct}>
            {isSubmitingProduct ? "" : "Add Product"}
          </button>
        </div>
      </form>
    </section>
  );
}

export default SellerForm;
