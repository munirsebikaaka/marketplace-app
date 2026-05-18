const userName = (user) => {
  const fullName = user?.name || "User";
  const firstName =
    fullName.split(" ")[0].charAt(0).toUpperCase() +
    fullName.split(" ")[0].slice(1);

  return firstName;
};

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

export default userName;
