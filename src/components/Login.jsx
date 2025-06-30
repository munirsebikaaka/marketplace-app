import { useState, useContext } from "react";
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
import { auth, db } from "../firebase";
import "../styles/auth.css";
import { IoEye, IoEyeOff } from "react-icons/io5";
import Spinner from "./Spiner";
import { UserContext } from "../contexts/UserContext";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { setUser } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const usersRef = collection(db, "users");
      const emailQuery = query(usersRef, where("email", "==", formData.email));
      const emailSnapshot = await getDocs(emailQuery);

      if (emailSnapshot.empty) {
        setError("This email is not registered. Please check or sign up.");
        setLoading(false);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));

      if (!userDoc.exists()) {
        setError("User profile not found. Please contact support.");
        setLoading(false);
        return;
      }

      const userData = userDoc.data();

      setUser({
        uid: user.uid,
        ...userData,
      });

      navigate("/");
    } catch (err) {
      if (err.code === "auth/invalid-credential") {
        setError("Incorrect password. Please try again.");
      } else if (err.code === "auth/user-not-found") {
        setError("Unregistered email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format.");
      } else if (err.code === "auth/user-disabled") {
        setError("This account has been disabled.");
      } else {
        setError("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="auth-container">
          <h2 className="auth-title">Login</h2>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              {error && <p className="error-message">{error}</p>}

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

            <button type="submit" className="auth-btn">
              Login
            </button>
          </form>
        </div>
      )}
    </>
  );
}

export default Login;
