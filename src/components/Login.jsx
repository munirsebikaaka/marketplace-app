import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "../firebase"; // Make sure this path is correct
import "../styles/auth.css";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Spinner from "./Spiner";

function Login({ onLogin }) {
  // Form input values
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  // Error and loading states
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Update form values
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Step 1: Check if email exists in the Firestore "users" collection
      const usersRef = collection(db, "users");
      const emailQuery = query(usersRef, where("email", "==", formData.email));
      const emailSnapshot = await getDocs(emailQuery);

      if (emailSnapshot.empty) {
        setError("This email is not registered. Please check or sign up.");
        setLoading(false);
        return; // Stop here if email is not found
      }

      // Step 2: Sign in with Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      // Step 3: Fetch user's extra data from Firestore using UID
      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        setError("User profile not found. Please contact support.");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      // Step 4: Pass user data to parent
      if (onLogin) {
        onLogin({
          uid: user.uid,
          name: userData.name,
          email: userData.email,
          role: userData.role,
        });
      }

      // Step 5: Redirect to home
      navigate("/");
    } catch (err) {
      console.error("Login error code:", err.code); // Check exact Firebase error

      if (err.code === "auth/invalid-credential") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("This email is not registered.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/user-disabled") {
        setError("This account has been disabled.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false); // Always turn off loading at the end
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="auth-container">
          <h2 className="auth-title">Login</h2>
          {error && <p className="error-message">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group password-group">
              <label className="form-label">Password</label>
              <input
                type={!showPassword ? "password" : "text"}
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />

              {!showPassword ? (
                <IoEyeOff
                  className="showpassword-login"
                  onClick={() => setShowPassword(true)}
                />
              ) : (
                <IoEye
                  className="showpassword-login"
                  onClick={() => setShowPassword(false)}
                />
              )}
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              Login
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Login;
