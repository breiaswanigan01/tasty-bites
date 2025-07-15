import React from "react";
import { Route, Routes } from "react-router-dom";
import RecipeSearch from "./Components/RecipeSearch";
import SignUp from "./Auth/SignUp";
import Login from "./Auth/Login";
import { Toaster } from "react-hot-toast";
import SavedMeals from "./Auth/SavedMeals";
import { AuthProvider, useAuth } from "./Auth/AuthContext";
import PrivateRoute from "./Auth/PrivateRoute";
import ForgotPassword from "./Auth/ForgotPassword";

const AppRoutes = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-purple-700 font-semibold text-lg">
        Checking authentication...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<RecipeSearch />} />

      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <RecipeSearch />
          </PrivateRoute>
        }
      />
      <Route
        path="/saved-meals"
        element={
          <PrivateRoute>
            <SavedMeals />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
