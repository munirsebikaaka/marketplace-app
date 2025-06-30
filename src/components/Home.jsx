import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext"; // adjust path as needed
// import bgImage from "../test1/bg.jpg"; // adjust path to your image
import "../styles/home.css"; // make sure this path matches your CSS file

function Home() {
  const { user } = useContext(UserContext);

  return (
    <div className="home-wrapper" style={{ backgroundImage: `url(test1.jpg)` }}>
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
    </div>
  );
}

export default Home;

//npm run build
// firebase deploy
