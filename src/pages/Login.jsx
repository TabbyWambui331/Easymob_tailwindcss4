import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!name.trim()) return alert("Please enter your business name or email");

    // Temporarily store user
    localStorage.setItem("businessName", name);
    localStorage.setItem("token", "demo-token"); // Fake token for now

    navigate("/Dashboard"); // Redirect after "login"
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-50">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded shadow w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center">
          Welcome to Easymob
        </h2>

        <input
          type="text"
          placeholder="Enter business name or email"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-gray-300 rounded p-2 mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-blue py-2 rounded hover:bg-blue-700"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default Login;
