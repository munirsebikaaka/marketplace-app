import { Link } from "react-router-dom";
import { useContext } from "react";

import "../styles/home.css";
import { UserContext } from "../contexts/UserContext";

function Home() {
  const { user } = useContext(UserContext);

  return (
    <div className="home">
      <h1>Welcome to the Marketplace</h1>
      <p>Buy and sell products with ease</p>

      {!user && (
        <div className="auth-actions">
          <Link to="/login" className="btn">
            Login
          </Link>
          <Link to="/signup" className="btn">
            Sign Up
          </Link>
        </div>
      )}

      <div className="actions">
        <Link to="/products" className="btn">
          Browse Products
        </Link>
        {user?.role === "seller" && (
          <Link to="/seller" className="btn">
            Seller Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}

export default Home;

//npm run build
// firebase deploy
