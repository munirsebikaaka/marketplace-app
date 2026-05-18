import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Features/Navbar";
import Home from "./Pages/Home";
import Signup from "./Features/Signup";
import Login from "./Features/Login";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import SellerDashboard from "./Pages/SellerDashboard";
import YourProducts from "./components/SellerDetails/YourProducts";
import Products from "./Pages/Products";
import ViewDetails from "./components/SellerDetails/viewDetails";
import Cart from "./Pages/Cart";
import VehicleProducts from "./components/Products/VehicleProducts";
import FunitureProducts from "./components/Products/funitureProducts";
import MobilePhonesProducts from "./components/Products/MobilePhonesProducts";
import FashionProducts from "./components/Products/FashionProducts";
import FoodAndAgriculture from "./components/Products/FoodAndAgriculture";
import ElectronicsProducts from "./components/Products/ElectronicsProducts";
import PropertiesProducts from "./components/Products/propertiesProducts";

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
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/seller" element={<SellerDashboard />} />
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ViewDetails />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/yourproduct" element={<YourProducts />} />
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

export default App;
