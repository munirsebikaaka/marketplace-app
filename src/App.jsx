import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Products from "./components/Products";
import SellerDashboard from "./components/SellerDashboard";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

import YourProducts from "./components/YourProducts";
import { UserContext, UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { useContext, useEffect, useState } from "react";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";
import ViewDetails from "./components/viewDetails";

function App() {
  const [products, setProducts] = useState(null);
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const product = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(product);
    });
    return unsubscribe;
  }, []);

  const productID = products?.map((product) => product.id);

  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />

            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />

                <Route
                  path="/signup"
                  element={
                    <RequireNoUser>
                      <Signup />
                    </RequireNoUser>
                  }
                />

                <Route
                  path="/login"
                  element={
                    <RequireNoUser>
                      <Login />
                    </RequireNoUser>
                  }
                />

                {/* Products page - accessible by everyone */}
                <Route path="/products" element={<Products />} />

                <Route path="/product/:id" element={<ViewDetails />} />

                {/* Seller dashboard - only for logged-in users with role 'seller' */}
                <Route
                  path="/seller"
                  element={
                    <RequireSeller>
                      <SellerDashboard />
                    </RequireSeller>
                  }
                />

                {/* Cart page - accessible by everyone */}
                <Route path="/cart" element={<Cart />} />

                {/* YourProducts page - accessible by everyone */}
                <Route path="/yourproduct" element={<YourProducts />} />

                {/* Checkout page - only accessible if logged in */}
                <Route
                  path="/checkout"
                  element={
                    <RequireUser>
                      <Checkout />
                    </RequireUser>
                  }
                />
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

// --------------------------------------------
// Helper components to protect routes based on user auth status or role
// --------------------------------------------

// Access user context here
function RequireNoUser({ children }) {
  const { user } = useContext(UserContext);

  // If user is logged in, redirect to home, otherwise show the children component (login/signup)
  if (user) {
    return <Navigate to="/" />;
  }
  return children;
}

function RequireUser({ children }) {
  const { user } = useContext(UserContext);

  // If user is NOT logged in, redirect to login, otherwise show the children component
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function RequireSeller({ children }) {
  const { user } = useContext(UserContext);

  // If user is NOT logged in or user role is NOT 'seller', redirect to home
  if (!user || user.role !== "seller") {
    return <Navigate to="/" />;
  }
  return children;
}

export default App;
