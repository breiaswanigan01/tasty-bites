import React from "react";
import { useAuth } from "./AuthContext";
import RecipeCard from "../Components/RecipeCard";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const SavedMeals = () => {
  const { favorites, toggleFavorite } = useAuth();

  const isFavorite = (recipe) =>
    favorites.some((fav) => fav.uri === recipe.uri);

  return (
    <div className="bg-gradient-to-tr from-cyan-50 to-purple-100 min-h-screen p-6">
      {/* Navigation back home */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-purple-700 hover:text-purple-900 font-semibold text-base transition-all"
        >
          <FaArrowLeft className="mr-2" /> Back to Home
        </Link>
      </div>

      {/* Heading */}
      <h2 className="text-4xl md:text-5xl font-extrabold text-center text-purple-700 mb-10">
        Your Saved Meals
      </h2>

      {/* If no favorites */}
      {favorites.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          You haven't saved any meals yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {favorites.map((recipe, index) => (
            <RecipeCard
              key={index}
              recipe={recipe}
              onClick={() => {}}
              isFavorite={isFavorite}
              toggleFavorite={() => {}} // Disable heart button
              hideFavoriteButton={true} // ✅ Hides "♥ Saved"
              onDelete={toggleFavorite} // ✅ Enables X button
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedMeals;