import { Link } from "react-router-dom";
import "../styles/navbar.css";
import { IoClose, IoMenu } from "react-icons/io5";
import { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext"; // ✅ import context
import { CartContext } from "../contexts/CartContext"; // ✅ optional if you track cart count

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, handleLogout } = useContext(UserContext); // ✅ using logout from context
  const { cart } = useContext(CartContext); // optional, if using CartContext
  const cartCount =
    cart?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleMenuOpen = () => setIsMenuOpen(true);
  const handleMenuClose = () => setIsMenuOpen(false);

  const onLogoutClick = () => {
    try {
      handleLogout(); // ✅ correct usage
      handleMenuClose();
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

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

              <button className="logout-btn" onClick={onLogoutClick}>
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
