import axios from "axios";

const PRODUCTS_URL = "https://market-place-fd898-default-rtdb.firebaseio.com/";

export const pushProductsHandler = async (product) => {
  try {
    await axios.post(`${PRODUCTS_URL}products.json`, product);
  } catch (e) {
    console.error("Product upload failed:", e);
    throw new Error(e.message || "Unable to submit product.");
  }
};
export const getProductsHandler = async () => {
  const products = [];
  try {
    const response = await axios.get(`${PRODUCTS_URL}products.json`);
    const data = response.data || {};
    for (const key in data) {
      const productData = {
        name: data[key].name,
        description: data[key].description,
        price: data[key].price,
        category: data[key].category,
        condition: data[key].condition,
        location: data[key].location,
        id: data[key].id,
        images: data[key].images || [],
        imageUrl: data[key].imageUrl || data[key].image || null,
        sellerId: data[key].sellerId || null,
        reviews: data[key].reviews || [],
      };
      products.push(productData);
    }
    return products;
  } catch (e) {
    console.error("Products fetch failed:", e);
    throw new Error("Unable to load products. Please try again later.");
  }
};
