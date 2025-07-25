// src/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (error) {
      setLoginMessage("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-blue-50 text-gray-800 font-sans">
      <main className="flex flex-col lg:flex-row flex-1 items-center justify-center p-8 gap-10">
        <div className="max-w-lg text-center">
          <motion.h1
            className="text-4xl font-bold mb-4 text-blue-800"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            Welcome to <span className="text-blue-600">EasyMob POS</span>
          </motion.h1>
          <p className="text-gray-700 text-sm">
            A powerful POS system built for small businesses register, sell, track, grow.
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white shadow-xl p-6 rounded-lg w-full max-w-sm border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">Business Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-blue-900">Business Email</label>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded outline-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-blue-900">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded outline-blue-400"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
            >
              Login
            </button>
            {loginMessage && <p className="text-red-500 text-sm mt-2">{loginMessage}</p>}
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Don’t have a business account?{" "}
            <a href="/register" className="underline hover:text-blue-800">
              Register here
            </a>
          </p>
        </div>
      </main>

      <footer className="bg-blue-800 text-white text-center py-4 mt-10">
        © {new Date().getFullYear()} EasyMob POS. All rights reserved.
      </footer>
    </div>
  );
};

export default Login;
