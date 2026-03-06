import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "../../styles/sellerDashboard.css";
import { pushProductsHandler } from "../../services/ProductServices";

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

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const data = {
      name: formData.title.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      category: formData.category,
      condition: formData.condition,
      location: formData.location.trim(),
    };

    pushProductsHandler(data);

    // setFormData({
    //   title: "",
    //   description: "",
    //   price: "",
    // });
  };

  return (
    <section className="seller-form-section">
      <h2 className="form-title">Add New Product</h2>
      <form className="seller-form" onSubmit={handleSubmit} noValidate>
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
          <button type="submit" className="btn-submit">
            Add Product
          </button>
        </div>
      </form>
    </section>
  );
}

export default SellerForm;
