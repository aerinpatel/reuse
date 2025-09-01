// src/components/LoginPage.jsx

import React, { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi'; // Importing icons

const LoginPage = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle successful login
        console.log('Login successful:', data.message);
        // Call the parent component's success handler
        onLoginSuccess();
      } else {
        // Handle login failure
        console.error('Login failed:', data.message);
        alert(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Logo and App Name */}
        <div className="text-center mb-10">
          <div className="inline-block bg-gray-800 text-white text-xl font-bold p-3 rounded-lg shadow-md">
            A
          </div>
          <h1 className="text-3xl font-extrabold text-gray-800 mt-3">APKSure</h1>
          <p className="text-gray-500 mt-1">Detect Fake Android Apps</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 ease-in-out hover:scale-[1.01]">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 mb-8">
            Sign in to continue to your account.
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <FiMail className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transform transition-all duration-300 ease-in-out focus:scale-[1.02]"
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <FiLock className="absolute top-1/2 -translate-y-1/2 left-4 text-gray-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transform transition-all duration-300 ease-in-out focus:scale-[1.02]"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg shadow-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transform transition-all duration-300 ease-in-out hover:scale-[1.02] hover:shadow-lg"
            >
              Sign In
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-500 mt-8">
            {/* You can add a link here if you have a sign-up page */}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;