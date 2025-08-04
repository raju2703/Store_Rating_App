import React from "react";

const Navbar = ({ onToggleProfile, onLogout }) => (
  <nav className="bg-white shadow sticky top-0 z-50">
    <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between">
      {/* Left Buttons */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onToggleProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          aria-label="Toggle Profile"
        >
          Profile
        </button>
        <button
          onClick={onLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-200"
          aria-label="Logout"
        >
          Logout
        </button>
      </div>

      {/* Center Title / Logo */}
      <div className="flex-grow text-center mt-2 sm:mt-0">
        <h1 className="text-xl font-semibold text-gray-700"> Portal</h1>
      </div>
    </div>
  </nav>
);

export default Navbar;
