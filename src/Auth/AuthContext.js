import React, { createContext, useContext, useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ Added loading
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user) {
        const userFavorites =
          JSON.parse(localStorage.getItem(user.uid + "-favorites")) || [];
        setFavorites(userFavorites);
      } else {
        setFavorites([]);
      }
      setLoading(false); // ✅ Done loading after auth check
    });
    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Failed to log in", error);
      throw error;
    }
  };

  const signup = async (email, password) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      console.error("Failed to sign up", error.message);
      throw error;
    }
  };

  const logout = () => {
    signOut(auth);
    navigate("/login");
  };

  const resetPassword = async (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const isFavorite = (recipe) =>
    favorites.some((fav) => fav.uri === recipe.uri);

  const toggleFavorite = (recipe) => {
    if (!currentUser) {
      alert("Please log in to manage favorites.");
      return;
    }

    setFavorites((prevFavorites) => {
      const exists = prevFavorites.find((fav) => fav.uri === recipe.uri);
      const updatedFavorites = exists
        ? prevFavorites.filter((fav) => fav.uri !== recipe.uri)
        : [...prevFavorites, recipe];

      localStorage.setItem(
        `${currentUser.uid}-favorites`,
        JSON.stringify(updatedFavorites)
      );

      return updatedFavorites;
    });
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        currentUser.uid + "-favorites",
        JSON.stringify(favorites)
      );
    }
  }, [favorites, currentUser]);

  const value = {
    currentUser,
    favorites,
    setFavorites,
    login,
    signup,
    logout,
    isFavorite,
    toggleFavorite,
    resetPassword,
    isAuthenticated: !!currentUser,
    loading, // ✅ Expose to App
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
