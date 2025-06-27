import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/cart.css";

import { UserContext } from "../contexts/UserContext";
import { CartContext } from "../contexts/CartContext";

function Checkout() {
  const { user } = useContext(UserContext);

  const { cart, clearCart } = useContext(CartContext);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    address: "",
    payment: "credit",
  });

  const [orderComplete, setOrderComplete] = useState(false);

  const navigate = useNavigate();

  const calculateTotal = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Handle form input changes, updating local formData state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission (placing the order)
  const handleSubmit = (e) => {
    e.preventDefault();

    // Create an order object with relevant info
    const order = {
      id: Date.now(), // simple unique id based on timestamp
      userId: user?.uid || "guest", // use user ID or 'guest' if no user
      items: cart,
      total: calculateTotal(),
      shippingAddress: formData.address,
      paymentMethod: formData.payment,
      date: new Date().toISOString(),
    };

    // Save the order to localStorage (simple persistence example)
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    localStorage.setItem("orders", JSON.stringify([...orders, order]));

    // Clear the global cart using the context action
    clearCart();

    // Show order complete message
    setOrderComplete(true);
  };

  // If order is complete, show confirmation UI
  if (orderComplete) {
    return (
      <div className="checkout-complete">
        <h2>Order Complete!</h2>
        <p>Thank you for your purchase.</p>
        <button onClick={() => navigate("/")} className="btn">
          Back to Home
        </button>
      </div>
    );
  }

  // Main checkout form and order summary UI
  return (
    <div className="checkout">
      <h2>Checkout</h2>

      <div className="checkout-container">
        {/* Order Summary */}
        <div className="order-summary">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.id} className="order-item">
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="order-total">
            <span>Total:</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="checkout-form">
          <h3>Shipping Information</h3>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Shipping Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <h3>Payment Method</h3>
          <div className="form-group">
            <label>
              <input
                type="radio"
                name="payment"
                value="credit"
                checked={formData.payment === "credit"}
                onChange={handleChange}
              />
              Credit Card
            </label>

            <label>
              <input
                type="radio"
                name="payment"
                value="paypal"
                checked={formData.payment === "paypal"}
                onChange={handleChange}
              />
              PayPal
            </label>
          </div>

          <button type="submit" className="btn place-order-btn">
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;
