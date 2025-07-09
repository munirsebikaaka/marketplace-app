import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Navbar from "./Features/Navbar";
import Home from "./Pages/Home";
import Signup from "./Features/Signup";
import Login from "./Features/Login";
import Products from "./Pages/Products";
import SellerDashboard from "./Pages/SellerDashboard";
import Cart from "./Pages/Cart";
import Checkout from "./Features/Checkout";
import YourProducts from "./components/SellerDetails/YourProducts";
import { UserContext, UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { useContext } from "react";
import ViewDetails from "./components/SellerDetails/viewDetails";
import { ToastContainer } from "react-toastify";
import ElectronicsProducts from "./components/Products/ElectronicsProducts";
import FunitureProducts from "./components/Products/funitureProducts";
import MobilePhonesProducts from "./components/Products/MobilePhonesProducts";
import FashionProducts from "./components/Products/FashionProducts";
import FoodAndAgriculture from "./components/Products/FoodAndAgriculture";
import PropertiesProducts from "./components/Products/propertiesProducts";
import VehicleProducts from "./components/Products/VehicleProducts";
import { ProductsProvider } from "./contexts/ProductsContext";

function App() {
  return (
    <UserProvider>
      <ProductsProvider>
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

                  <Route path="/products" element={<Products />} />

                  <Route path="/product/:id" element={<ViewDetails />} />

                  <Route
                    path="/seller"
                    element={
                      <RequireSeller>
                        <SellerDashboard />
                      </RequireSeller>
                    }
                  />

                  <Route path="/cart" element={<Cart />} />

                  <Route path="/yourproduct" element={<YourProducts />} />

                  <Route
                    path="/checkout"
                    element={
                      <RequireUser>
                        <Checkout />
                      </RequireUser>
                    }
                  />

                  <Route
                    path="/electronics"
                    element={<ElectronicsProducts />}
                  />
                  <Route path="/vehicles" element={<VehicleProducts />} />
                  <Route path="/furniture" element={<FunitureProducts />} />
                  <Route path="/properties" element={<PropertiesProducts />} />
                  <Route path="/phones" element={<MobilePhonesProducts />} />
                  <Route path="/fashion" element={<FashionProducts />} />
                  <Route
                    path="/foodAndAgriculture"
                    element={<FoodAndAgriculture />}
                  />
                </Routes>
              </div>
            </div>
          </Router>
        </CartProvider>
      </ProductsProvider>
    </UserProvider>
  );
}

function RequireNoUser({ children }) {
  const { user } = useContext(UserContext);
  if (user) {
    return <Navigate to="/" />;
  }
  return children;
}

function RequireUser({ children }) {
  const { user } = useContext(UserContext);
  if (!user) {
    return <Navigate to="/login" />;
  }
  return children;
}

function RequireSeller({ children }) {
  const { user } = useContext(UserContext);
  if (!user || user.role !== "seller") {
    return <Navigate to="/" />;
  }
  return children;
}

export default App;
