import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { auth } from "./firebase"; // make sure this is correct
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email.");
      return;
    }

    try {
      await resetPassword(email);
      toast.success("Check your inbox for the reset link 💌", { duration: 5000 });
      setEmail(""); // Clear input after success
    } catch (error) {
      toast.error("Failed to send reset email. " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-cyan-100 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-purple-700 mb-4 text-center">
          Reset Your Password
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 mb-3 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded transition"
          >
            Send Reset Link
          </button>
        </form>
        <p className="mt-4 text-sm text-center">
          <Link to="/login" className="text-cyan-700 hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
