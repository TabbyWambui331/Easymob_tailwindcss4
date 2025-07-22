import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [registerMessage, setRegisterMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterMessage("");

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      localStorage.setItem("user", JSON.stringify(user));
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration Error:", error.code);
      if (error.code === "auth/email-already-in-use") {
        setRegisterMessage("Email already in use.");
      } else if (error.code === "auth/invalid-email") {
        setRegisterMessage("Invalid email format.");
      } else if (error.code === "auth/weak-password") {
        setRegisterMessage("Password should be at least 6 characters.");
      } else {
        setRegisterMessage("Registration failed. Please try again.");
      }
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
            Join <span className="text-blue-600">EasyMob POS</span>
          </motion.h1>
          <p className="text-gray-700 text-sm">
            Create your business account and get started today.
          </p>
        </div>

        {/* Registration Form */}
        <div className="bg-white shadow-xl p-6 rounded-lg w-full max-w-sm border border-blue-200">
          <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">Register Your Business</h2>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-blue-900">Business Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded outline-blue-400"
                autoComplete="email"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-blue-900">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded outline-blue-400"
                autoComplete="new-password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 transition"
            >
              Register
            </button>
            {registerMessage && <p className="text-red-500 text-sm mt-2">{registerMessage}</p>}
          </form>

          <p className="text-sm text-center mt-4 text-gray-600">
            Already have a business account?{" "}
            <a href="/login" className="underline hover:text-blue-800">
              Login here
            </a>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-800 text-white text-center py-4 mt-10">
        © {new Date().getFullYear()} EasyMob POS. All rights reserved.
      </footer>
    </div>
  );
};

export default Register;
