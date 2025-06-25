import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { IoClose, IoMenu } from "react-icons/io5";
import { useState } from "react";

const Navbar = ({ user, cartCount, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => setIsMenuOpen(true);
  const handleMenuClose = () => setIsMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link className="link" to="/" onClick={handleMenuClose}>
            Marketplace
          </Link>
        </div>

        <div className={`navbar-links ${isMenuOpen ? "show" : ""}`}>
          <Link className="link" to="/products" onClick={handleMenuClose}>
            Products
          </Link>

          {user ? (
            <>
              {user.role === "seller" && (
                <Link className="link" to="/seller" onClick={handleMenuClose}>
                  Seller Dashboard
                </Link>
              )}
              <Link
                className="link"
                to="/yourproduct"
                onClick={handleMenuClose}
              >
                Your Products
              </Link>

              <Link className="link" to="/cart" onClick={handleMenuClose}>
                Cart ({cartCount})
              </Link>
              <button
                onClick={() => {
                  onLogout();
                  handleMenuClose();
                }}
                className="logout-btn"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="link" to="/login" onClick={handleMenuClose}>
                Login
              </Link>
              <Link className="link" to="/signup" onClick={handleMenuClose}>
                Signup
              </Link>
            </>
          )}
        </div>

        {!isMenuOpen ? (
          <IoMenu className="menu-icon" onClick={handleMenuOpen} />
        ) : (
          <IoClose className="close-icon" onClick={handleMenuClose} />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
