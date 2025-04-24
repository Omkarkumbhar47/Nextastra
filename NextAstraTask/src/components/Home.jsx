import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const goToEditor = () => {
    navigate("/dashboard"); 
  };

  const goToLogin = () => {
    navigate("/login");
  };

  const goToSignup = () => {
    navigate("/register");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <header className="w-full bg-[#a931ffe0] py-6 shadow-md text-center">
        <h1 className="text-4xl font-bold">Image Boundary Editor</h1>
        <p className="text-lg text-blue-100 mt-2">
          Upload images, detect people, edit bounding boxes, and save to the cloud.
        </p>
      </header>

      <main className="flex flex-col items-center justify-center flex-grow px-4">
        <div className="max-w-lg w-full bg-gray-800 shadow-xl rounded-xl p-8 border border-gray-700">
          {isLoggedIn ? (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-green-300">Welcome Back!</h2>
              <p className="mb-6 text-gray-300">
                Ready to edit your images? Click below to get started.
              </p>
              <button
                onClick={goToEditor}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium"
              >
                Open Editor
              </button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-4 text-blue-300">Get Started</h2>
              <p className="mb-6 text-gray-300">
                Create an account or log in to use all features including saving edited boundaries.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={goToSignup}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                >
                  Sign Up
                </button>
                <button
                  onClick={goToLogin}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium"
                >
                  Login
                </button>
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="w-full bg-gray-900 text-center py-4 text-sm text-gray-400 border-t border-gray-700">
        © 2025 Image Boundary Editor. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
