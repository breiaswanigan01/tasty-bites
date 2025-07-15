import React, { useState } from "react";
import { useAuth } from "./AuthContext";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success("Logged in successfully 🎉");
      navigate("/");
    } catch (error) {
      const msg =
        error.code === "auth/user-not-found"
          ? "No account with that email."
          : error.code === "auth/wrong-password"
          ? "Incorrect password."
          : "Login failed. Please try again.";
      toast.error(msg);
    }
  };

  const handleResetPassword = async () => {
    if (!email) return toast.error("Please enter your email first.");
    try {
      await resetPassword(email);
      toast.success("Password reset email sent!");
    } catch (err) {
      toast.error("Could not send reset email. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-cyan-100 flex items-center justify-center px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Welcome Back 💫
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className="relative mb-4">
          <input
            type={showPass ? "text" : "password"}
            placeholder="Password"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className="absolute top-3 right-3 text-gray-500 cursor-pointer"
            onClick={() => setShowPass(!showPass)}
          >
            {showPass ? <FiEyeOff /> : <FiEye />}
          </span>
        </div>

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 text-white w-full py-2 rounded-lg transition"
        >
          Login
        </button>

        <div className="text-right">
          <button
            type="button"
            onClick={handleResetPassword}
            className="text-sm text-cyan-600 hover:underline"
          ></button>

          <p className=" text-sm text-right">
            <Link
              to="/forgot-password"
              className="text-cyan-700 hover:underline"
            >
              Forgot Password?
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-sm">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-cyan-600 font-semibold">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
