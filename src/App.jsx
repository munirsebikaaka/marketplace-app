import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./Features/Navbar";
import Home from "./Pages/Home";
import Signup from "./Features/Signup";
import Login from "./Features/Login";
import { UserProvider } from "./contexts/UserContext";
import { CartProvider } from "./contexts/CartContext";
import { ProductsProvider } from "./contexts/ProductsContext";

function App() {
  return (
    <UserProvider>
      <CartProvider>
        <Router>
          <div className="App">
            <Navbar />
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/login" element={<Login />} />
              </Routes>
            </div>
          </div>
        </Router>
      </CartProvider>
    </UserProvider>
  );
}

export default App;
