import { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import "../styles/home.css";

const categories = [
  { id: "electronics", name: "Electronics", icon: "💻" },
  { id: "vehicles", name: "Vehicles", icon: "🚗" },
  { id: "fashion", name: "Fashion", icon: "👗" },
  { id: "furniture", name: "Furniture", icon: "🪑" },
  { id: "properties", name: "Properties", icon: "🏠" },
  { id: "phones", name: "Mobile phones", icon: "📱" },
  { id: "foodAndAgriculture", name: "Food & Agriculture", icon: "🌾" },
];

const locations = ["Kampala", "Entebbe", "Jinja", "Mbarara"];

function Home() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      const products = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFeaturedProducts(products.slice(0, 4));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleSearch = () => {
    let query = "?";
    if (searchTerm) query += `search=${encodeURIComponent(searchTerm)}&`;
    if (selectedCategory)
      query += `category=${encodeURIComponent(selectedCategory)}&`;
    if (selectedLocation)
      query += `location=${encodeURIComponent(selectedLocation)}&`;
    navigate(`/products${query}`);
  };

  return (
    <div className="home">
      <div className="home__header">
        <h1 className="home__title">Welcome to the Marketplace</h1>
        {!user ? (
          <div className="home__auth">
            <Link to="/login" className="btn btn--primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn--secondary">
              Sign Up
            </Link>
          </div>
        ) : (
          <p className="home__welcome">
            Welcome back, <strong>{user.displayName || user.email}</strong>!
          </p>
        )}
      </div>

      {/* 🔍 Search Filters */}
      <div className="home__search">
        <input
          type="text"
          className="input input--text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />

        <select
          className="input input--select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <select
          className="input input--select"
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          <option value="">All Locations</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <button className="btn btn--primary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* 📂 Categories */}
      <h2 className="section__title">Categories</h2>
      <div className="home__categories">
        {categories.map((cat) => (
          <Link to={`/${cat.id}`} key={cat.id} className="category">
            <span className="category__icon">{cat.icon}</span>
            <span className="category__name">{cat.name}</span>
          </Link>
        ))}
      </div>

      {/* 🌟 Featured Products */}
      <h2 className="section__title">Featured Products</h2>
      {loading ? (
        <p className="loading">Loading products...</p>
      ) : (
        <div className="home__products">
          {featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <Link
                to={`/product/${product.id}`}
                key={product.id}
                className="product-card"
              >
                <img
                  src={product.image || "def.jpg"}
                  alt={product.name}
                  className="product-card__image"
                />
                <div className="product-card__info">
                  <h3 className="product-card__title">{product.name}</h3>
                  <p className="product-card__price">
                    $ {product.price?.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="no-products">No products found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
