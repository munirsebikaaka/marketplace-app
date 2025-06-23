import { useEffect, useState } from "react";
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
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";

function App() {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  // ✅ Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userRef = doc(db, "users", firebaseUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUser({ uid: firebaseUser.uid, ...userSnap.data() });
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
        setCart([]);
        setLoadingCart(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ Fetch & Listen to Cart from Firestore
  useEffect(() => {
    if (!user) return;

    const cartRef = doc(db, "carts", user.uid);

    const loadCart = async () => {
      try {
        // Initial cart fetch
        const snapshot = await getDoc(cartRef);
        if (snapshot.exists()) {
          setCart(snapshot.data().items || []);
        } else {
          setCart([]);
        }

        // Real-time updates
        const unsubscribe = onSnapshot(cartRef, (docSnap) => {
          if (docSnap.exists()) {
            setCart(docSnap.data().items || []);
          } else {
            setCart([]);
          }
        });

        setLoadingCart(false);
        return unsubscribe;
      } catch (error) {
        console.error("Failed to load cart:", error);
        setLoadingCart(false);
      }
    };

    let unsubscribeFn;
    loadCart().then((unsubscribe) => {
      unsubscribeFn = unsubscribe;
    });

    return () => {
      if (unsubscribeFn) unsubscribeFn();
    };
  }, [user]);

  // ✅ Save cart to Firestore on update
  useEffect(() => {
    const saveCart = async () => {
      if (user) {
        const cartRef = doc(db, "carts", user.uid);
        await setDoc(cartRef, { items: cart }, { merge: true });
      }
    };

    if (user) saveCart();
  }, [cart, user]);

  // ✅ Cart Logic
  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeFromCart(productId);
      return;
    }

    setCart(
      cart.map((item) => (item.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleLogin = (userData) => {
    setUser(userData); // Optional override
  };

  const handleLogout = () => {
    setUser(null);
    setCart([]);
    signOut(auth);
  };

  return (
    <Router>
      <div className="App">
        <Navbar
          user={user}
          cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
          onLogout={handleLogout}
        />

        <div className="container">
          {loadingCart ? (
            <p>Loading cart...</p>
          ) : (
            <Routes>
              <Route path="/" element={<Home user={user} />} />
              <Route
                path="/signup"
                element={
                  !user ? <Signup onLogin={handleLogin} /> : <Navigate to="/" />
                }
              />
              <Route
                path="/login"
                element={
                  !user ? <Login onLogin={handleLogin} /> : <Navigate to="/" />
                }
              />
              <Route
                path="/products"
                element={<Products user={user} onAddToCart={addToCart} />}
              />
              <Route
                path="/seller"
                element={
                  user?.role === "seller" ? (
                    <SellerDashboard user={user} />
                  ) : (
                    <Navigate to="/" />
                  )
                }
              />
              <Route
                path="/cart"
                element={
                  <Cart
                    cart={cart}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                }
              />
              <Route
                path="/checkout"
                element={
                  user ? (
                    <Checkout cart={cart} user={user} onClearCart={clearCart} />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
            </Routes>
          )}
        </div>
      </div>
    </Router>
  );
}

export default App;
