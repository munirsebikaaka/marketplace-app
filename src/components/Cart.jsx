import React, { useContext } from "react";
import { Link } from "react-router-dom";
import "../styles/cart.css";
import { CartContext } from "../contexts/CartContext"; // Adjust the path if needed

function Cart() {
  // Access cart data and functions directly from CartContext
  const { cart, updateQuantity, removeFromCart } = useContext(CartContext);

  // Helper function to calculate the total price of the cart items
  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div className="cart-container">
      <h2 className="cart-header">Your Shopping Cart</h2>

      {/* Show a message if the cart is empty */}
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/products" className="btn">
            Browse Products
          </Link>
        </div>
      ) : (
        <>
          {/* List all cart items */}
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h3 className="item-title">{item.name}</h3>
                  <p className="item-price">Price: ${item.price.toFixed(2)}</p>
                </div>
                <div className="item-quantity">
                  {/* Decrease quantity button */}
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </button>

                  {/* Current quantity */}
                  <span>{item.quantity}</span>

                  {/* Increase quantity button */}
                  <button
                    className="quantity-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="item-total">
                  {/* Total price for this item */}$
                  {(item.price * item.quantity).toFixed(2)}
                </div>
                {/* Remove item button */}
                <button
                  onClick={() => removeFromCart(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Order summary section */}
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping:</span>
              <span>$0.00</span>
            </div>
            <div className="summary-row summary-total">
              <span>Total:</span>
              <span>${calculateTotal().toFixed(2)}</span>
            </div>

            {/* Link to checkout page */}
            <Link to="/checkout" className="btn checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
