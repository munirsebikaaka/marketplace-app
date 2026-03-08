const userName = (user) => {
  const fullName = user?.name || "User";
  const firstName =
    fullName.split(" ")[0].charAt(0).toUpperCase() +
    fullName.split(" ")[0].slice(1);

  return firstName;
};

{
  /*
                  <Route path="/products" element={<Products />} />
                  <Route path="/product/:id" element={<ViewDetails />} />
                  <Route path="/seller" element={<SellerDashboard />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/yourproduct" element={<YourProducts />} />
                  <Route path="/checkout" element={<Checkout />} />

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
                   */
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

// UPDATING PRODUCT CODE
// useEffect(() => {
//   if (editingProduct) {
//     setFormData({
//       title: editingProduct.name || "",
//       description: editingProduct.description || "",
//       price: editingProduct.price ? editingProduct.price.toString() : "",
//       category: editingProduct.category || "",
//       condition: editingProduct.condition || "",
//       location: editingProduct.location || "",
//       images: editingProduct.images || [],
//       imageFiles: [],
//     });
//   } else {
//     setFormData({
//       title: "",
//       description: "",
//       price: "",
//       category: "",
//       condition: "",
//       location: "",
//       images: [],
//       imageFiles: [],
//     });
//   }
//   setErrors({});
// }, [editingProduct]);

// VALIDATIGING FORM

export default userName;
