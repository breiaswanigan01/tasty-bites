import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import RecipeModal from "./RecipeModal";
import { useAuth } from "../Auth/AuthContext";
import RecipeCard from "./RecipeCard";
import toast, { Toaster } from "react-hot-toast"; // ✅ Toast import

const RecipeSearch = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [mealType, setMealType] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [error, setError] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { currentUser, favorites, setFavorites, logout } = useAuth();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    balanced: false,
    "high-protein": false,
    "low-fat": false,
    "low-carb": false,
  });

  const dietaryOptions = [
    { id: "balanced", label: "Balanced" },
    { id: "high-protein", label: "High Protein" },
    { id: "low-fat", label: "Low Fat" },
    { id: "low-carb", label: "Low Carb" },
  ];

  const commonSearchTerms = [
    "chicken",
    "beef",
    "pasta",
    "salad",
    "soup",
    "fish",
    "vegetarian",
    "dessert",
  ];

  const updateSearchHistory = (term) => {
    const updatedHistory = [term, ...searchHistory.filter((item) => item !== term)].slice(0, 5);
    setSearchHistory(updatedHistory);
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const fetchRecipes = useCallback(async (query, filters, mealType) => {
    try {
      setIsLoading(true);
      const dietLabels = Object.keys(filters)
        .filter((key) => filters[key])
        .join(",");
      const randomQuery = commonSearchTerms[Math.floor(Math.random() * commonSearchTerms.length)];
      const searchQuery = query || randomQuery;

      const response = await axios.get("http://localhost:5050/api/recipes", {
        params: {
          q: searchQuery,
          diet: dietLabels,
          mealType: mealType,
        },
      });

      if (response.data.hits.length === 0) {
        setError("No recipes found for the selected dietary options.");
        setRecipes([]);
      } else {
        setError("");
        let result = response.data.hits;

        if (sortOption === "calories-asc") {
          result.sort((a, b) => a.recipe.calories - b.recipe.calories);
        } else if (sortOption === "calories-desc") {
          result.sort((a, b) => b.recipe.calories - a.recipe.calories);
        } else if (sortOption === "name-asc") {
          result.sort((a, b) => a.recipe.label.localeCompare(b.recipe.label));
        }

        setRecipes(result);
        if (query) updateSearchHistory(query);
      }
    } catch (error) {
      console.error("❌ Error fetching recipes:", error);
      setError("Error fetching the recipes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [sortOption, searchHistory]);

  useEffect(() => {
    fetchRecipes(query || "chicken", filters);
    const storedHistory = JSON.parse(localStorage.getItem("searchHistory")) || [];
    setSearchHistory(storedHistory);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchRecipes(query, filters, mealType);
  };

  const handleFilterChange = (e) => {
    const updatedFilters = {
      ...filters,
      [e.target.id]: e.target.checked,
    };
    setFilters(updatedFilters);
    fetchRecipes(query, updatedFilters);
  };

  const handleRecipeClick = (recipe) => {
    setIsSpinning(true);
    setSelectedRecipe(recipe);
  };

  const toggleFavorite = (recipe) => {
    if (!currentUser) {
      toast.error("Please log in to save this meal", {
        style: {
          border: "1px solid #f87171",
          padding: "12px",
          color: "#b91c1c",
        },
        iconTheme: {
          primary: "#b91c1c",
          secondary: "#fef2f2",
        },
      });
      return;
    }

    setFavorites((prevFavorites) => {
      const updatedFavorites = prevFavorites.find((fav) => fav.uri === recipe.uri)
        ? prevFavorites.filter((fav) => fav.uri !== recipe.uri)
        : [...prevFavorites, recipe];

      localStorage.setItem(
        `${currentUser.uid}-favorites`,
        JSON.stringify(updatedFavorites)
      );
      return updatedFavorites;
    });
  };

  const isFavorite = (recipe) =>
    favorites.some((fav) => fav.uri === recipe.uri);

  useEffect(() => {
    if (currentUser) {
      const saved =
        JSON.parse(localStorage.getItem(`${currentUser.uid}-favorites`)) || [];
      setFavorites(saved);
    }
  }, [currentUser, setFavorites]);

  const handleDeleteFavorite = (recipeToDelete) => {
    const updatedFavorites = favorites.filter(
      (fav) => fav.uri !== recipeToDelete.uri
    );
    setFavorites(updatedFavorites);
    localStorage.setItem(
      `${currentUser.uid}-favorites`,
      JSON.stringify(updatedFavorites)
    );
  };

  return (
    <div className="bg-gradient-to-br from-cyan-100 to-purple-100 min-h-screen text-gray-800">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto p-4">
        <nav className="flex flex-col md:flex-row justify-between items-center gap-4 text-purple-800 md:text-lg mb-8 font-medium">
          <div>
            {currentUser && (
              <button
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
                className="hover:underline transition duration-200"
              >
                Logout
              </button>
            )}
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4">
            {!currentUser && (
              <>
                <Link to="/signup" className="hover:text-purple-600 transition">Sign Up</Link>
                <Link to="/login" className="hover:text-purple-600 transition">Login</Link>
              </>
            )}
            <Link to="/saved-meals" className="hover:text-purple-600 transition">Saved Meals</Link>
          </div>
        </nav>

        <h1 className="text-center text-4xl md:text-5xl font-extrabold text-purple-800 mb-10 tracking-tight">
          Tasty Bites <span role="img" aria-label="plate">🍽️</span>
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-4"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for a recipe..."
            className={`w-full sm:w-[70%] md:w-[50%] xl:w-[40%] border ${
              error ? "border-red-500 animate-shake" : "border-purple-300"
            } p-3 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-200`}
          />
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-200 font-medium"
          >
            Search
          </button>
        </form>

        {searchHistory.length > 0 && (
          <div className="text-center mb-6">
            <p className="text-sm text-gray-600 mb-2 font-semibold">Recent Searches:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setQuery(term);
                    fetchRecipes(term, filters, mealType);
                  }}
                  className="bg-white border border-purple-200 text-purple-600 text-xs px-3 py-1 rounded-full hover:bg-purple-100 transition-all"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <label className="mr-2 font-semibold text-gray-700">Sort By:</label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="border border-purple-300 p-2 rounded-lg shadow"
          >
            <option value="">Default</option>
            <option value="calories-asc">Calories (Low to High)</option>
            <option value="calories-desc">Calories (High to Low)</option>
            <option value="name-asc">Name (A - Z)</option>
          </select>
        </div>

        <div className="text-center mb-4">
          <label className="mr-2 font-semibold text-gray-700">Meal Type:</label>
          <select
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="border border-purple-300 p-2 rounded-lg shadow"
          >
            <option value="">All</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>

        <h2 className="text-center text-2xl md:text-3xl font-semibold mb-4 text-purple-700">
          Dietary Filters
        </h2>
        <div className="bg-white border rounded-2xl shadow-lg p-5 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {dietaryOptions.map((option) => (
              <label
                key={option.id}
                className="flex items-center space-x-2 text-gray-700 font-medium hover:text-purple-700 transition-all"
              >
                <input
                  type="checkbox"
                  id={option.id}
                  checked={filters[option.id]}
                  onChange={handleFilterChange}
                  className="h-5 w-5 accent-purple-600 transition duration-200 ease-in-out cursor-pointer rounded"
                />
                <span className="text-sm md:text-base">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {error && (
          <p className="text-red-500 font-medium text-center mb-6 animate-shake text-sm md:text-base">
            {error}
          </p>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-12 h-12 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {recipes.map((recipeObj, index) => (
              <RecipeCard
                key={index}
                recipe={recipeObj.recipe}
                onClick={handleRecipeClick}
                isFavorite={isFavorite}
                toggleFavorite={toggleFavorite}
              />
            ))}
          </div>
        )}

        {selectedRecipe && (
          <RecipeModal
            recipe={selectedRecipe}
            onClose={() => setSelectedRecipe(null)}
          />
        )}
      </div>
    </div>
  );
};

export default RecipeSearch;
