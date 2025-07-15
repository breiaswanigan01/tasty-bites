// SignUp.jsx
import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaArrowLeft, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordIsValid = password.length >= 6;

  const handleSignup = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!passwordIsValid) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

    try {
      await signup(email, password);
      toast.success("Account created! 🎉");
      navigate("/");
    } catch (error) {
      toast.error("Signup failed: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 text-purple-600 hover:text-purple-800"
        >
          <FaArrowLeft />
        </button>

        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Create an Account ✨
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-3 text-purple-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-purple-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched(true)}
              className="w-full pl-10 pr-10 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-cyan-400"
              required
            />
            <span
              className="absolute right-3 top-3 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {touched && !passwordIsValid && (
            <p className="text-sm text-red-600">
              Password must be at least 6 characters long.
            </p>
          )}

          <p className="text-sm text-gray-500">
            Password must be at least 6 characters.
          </p>

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition"
          >
            Sign Up
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-cyan-700 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
