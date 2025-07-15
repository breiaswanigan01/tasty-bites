import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const RecipeModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black bg-opacity-40 backdrop-blur-sm flex justify-center items-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full relative overflow-y-auto max-h-[90vh] border border-purple-100"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-white bg-purple-600 hover:bg-purple-700 transition-all duration-200 rounded-full p-2 shadow-lg"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Modal Content */}
          <img
            src={recipe.image}
            alt={recipe.label}
            className="w-full h-64 object-cover rounded-t-3xl"
          />
          <div className="p-6 md:p-8">
            <h2 className="text-3xl md:text-4xl font-extrabold text-purple-700 mb-3 leading-snug">
              {recipe.label}
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              <span className="font-medium text-gray-700">{recipe.source}</span> &middot;{" "}
              <span className="text-purple-600 font-semibold">
                {Math.round(recipe.calories)} Calories
              </span>
            </p>

            <h3 className="text-lg font-semibold text-cyan-700 mb-2 uppercase tracking-wide">
              Ingredients
            </h3>
            <ul className="list-disc list-inside text-gray-700 space-y-2 text-sm md:text-base">
              {recipe.ingredientLines.map((line, index) => (
                <li key={index}>{line}</li>
              ))}
            </ul>

            <div className="mt-6 text-right">
              <a
                href={recipe.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-md"
              >
                View Full Recipe
              </a>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default RecipeModal;
