import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Features/Navbar";
import Home from "./Pages/Home";
import Signup from "./Features/Signup";
import Login from "./Features/Login";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { ProductsProvider } from "./contexts/ProductsContext";
import SellerDashboard from "./Pages/SellerDashboard";
import ElectronicsProducts from "./components/Products/ElectronicsProducts";

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
                  <Route path="/seller" element={<SellerDashboard />} />
                  <Route
                    path="/electronics"
                    element={<ElectronicsProducts />}
                  />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/login" element={<Login />} />
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
