import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location]);

  const linkClasses = (path) =>
    `hover:text-purple-300 transition duration-200 ${
      location.pathname === path ? "text-purple-400 font-semibold" : ""
    }`;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-purple-400 hover:text-purple-300 transition">
          MyApp
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6 text-sm sm:text-base">
          {!user ? (
            <>
              <Link to="/register" className={linkClasses("/register")}>
                Register
              </Link>
              <Link to="/login" className={linkClasses("/login")}>
                Login
              </Link>
            </>
          ) : (
            <>
              <Link to="/dashboard" className={linkClasses("/dashboard")}>
                Dashboard
              </Link>
              <div className="text-xs sm:text-sm text-gray-300">
                <div>{user.name || "User"}</div>
                <div className="text-gray-400">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-purple-600 px-3 py-1 rounded text-white hover:bg-purple-700 transition"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
