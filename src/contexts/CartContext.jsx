import React, { createContext, useState, useEffect, useContext } from "react";
import { doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";

import { UserContext } from "./UserContext";
import { db } from "../firebase";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useContext(UserContext);
  const [cart, setCart] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);

  useEffect(() => {
    if (!user) {
      setCart([]);
      setLoadingCart(false);
      return;
    }

    const cartRef = doc(db, "carts", user.uid);

    const loadCart = async () => {
      try {
        const snapshot = await getDoc(cartRef);
        if (snapshot.exists()) {
          setCart(snapshot.data().items || []);
        } else {
          setCart([]);
        }

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

  useEffect(() => {
    const saveCart = async () => {
      if (user) {
        const cartRef = doc(db, "carts", user.uid);
        await setDoc(cartRef, { items: cart }, { merge: true });
      }
    };

    if (user) saveCart();
  }, [cart, user]);

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

  return (
    <CartContext.Provider
      value={{
        cart,
        loadingCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
