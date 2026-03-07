import axios from "axios";

const PRODUCTS_URL = "https://market-place-fd898-default-rtdb.firebaseio.com/";

export const pushProductsHandler = async (products) => {
  try {
    await axios.post(`${PRODUCTS_URL}products.json`, products);
  } catch (e) {
    console.log(e);
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
      };
      products.push(productData);
    }
  } catch (e) {
    console.log(e);
  }

  return products;
};
