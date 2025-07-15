import React from "react";

const RecipeCard = ({
  recipe,
  onClick,
  isFavorite,
  toggleFavorite,
  hideFavoriteButton = false,
  onDelete,
}) => {
  const handleClick = () => onClick(recipe);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl overflow-hidden transform transition-transform duration-300 hover:scale-[1.03] border border-cyan-100 relative group">
      
      {/* ❌ X Delete Button (Saved Meals only) */}
      {onDelete && (
        <button
          onClick={() => onDelete(recipe)}
          className="absolute top-2 right-2 z-10 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-md opacity-90 group-hover:opacity-100 transition-opacity"
          aria-label="Remove Saved Meal"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}

      {/* Thumbnail Image */}
      <img
        src={recipe.image}
        alt={recipe.label}
        className="w-full h-48 object-cover cursor-pointer"
        onClick={handleClick}
      />

      <div className="p-4">
        <h3
          onClick={handleClick}
          className="text-lg font-semibold text-purple-700 hover:text-cyan-600 cursor-pointer mb-2 transition-colors"
        >
          {recipe.label}
        </h3>

        <p className="text-sm text-gray-500">Calories: {Math.round(recipe.calories)}</p>

        <div className="flex justify-between items-center mt-4">
          <a
            href={recipe.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-cyan-700 text-sm font-medium hover:underline"
          >
            Full Recipe
          </a>

          {!hideFavoriteButton && (
            <button
              onClick={() => toggleFavorite(recipe)}
              className={`text-sm px-3 py-1 rounded-full font-medium transition-all duration-200 shadow-sm ${
                isFavorite(recipe)
                  ? "bg-purple-100 text-purple-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {isFavorite(recipe) ? "♥ Saved" : "♡ Save"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
