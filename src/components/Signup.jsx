import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import "../styles/auth.css";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Spinner from "./Spiner";
import { UserContext } from "../contexts/UserContext";

function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "buyer",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const { setUser } = useContext(UserContext); // Get setUser from context

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getFriendlyError = (code) => {
    if (code === "auth/email-already-in-use") {
      return "This email is already registered.";
    }
    if (code === "auth/invalid-email") {
      return "Please enter a valid email.";
    }
    if (code === "auth/weak-password") {
      return "Password should be at least 6 characters.";
    }
    return "Something went wrong. Please try again.";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.name === "" ||
      formData.email === "" ||
      formData.password === ""
    ) {
      setError("All fields are required.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        createdAt: new Date().toISOString(),
      });

      // Update global user state in context
      setUser({
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        role: formData.role,
      });

      navigate("/"); // Redirect after signup
    } catch (err) {
      console.error("Signup Error:", err.message);
      setError(getFriendlyError(err.code));
    }

    setLoading(false);
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="auth-container">
          <h2 className="auth-title">Sign Up</h2>
          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group password-group">
              <label className="form-label">Password</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
                {showPassword ? (
                  <IoEye
                    className="showpassword-login"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <IoEyeOff
                    className="showpassword-login"
                    onClick={() => setShowPassword(true)}
                  />
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="form-input"
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              Sign Up
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Signup;
