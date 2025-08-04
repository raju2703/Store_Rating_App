import React, { useState } from "react";
import ProfileCard from "../components/ProfileCard";
import Navbar from "../components/Navbar";
import mockRatings from "../data/mockRatings";
import FilterComponent from "../components/FilterComponent";

const OwnerDashboard = () => {
  const [showProfile, setShowProfile] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [minRating, setMinRating] = useState(0);

  const user = {
    userId: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Owner",
    storeId: 1,
  };

  const handleSuccess = () => alert("Password updated successfully!");
  const handleError = (msg) => alert(msg);
  const handleLogout = () => {
    alert("Logged out");
    window.location.href = "/login";
  };

  const storeRatings = mockRatings.filter(
    (r) => r.storeId === user.storeId && r.rating >= minRating
  );

  const sortedRatings = [...storeRatings].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.date) - new Date(a.date);
      case "oldest":
        return new Date(a.date) - new Date(b.date);
      case "highest":
        return b.rating - a.rating;
      case "lowest":
        return a.rating - b.rating;
      default:
        return 0;
    }
  });

  const averageRating =
    storeRatings.reduce((sum, r) => sum + r.rating, 0) /
    (storeRatings.length || 1);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-50 to-blue-50">
      <Navbar
        onToggleProfile={() => setShowProfile((prev) => !prev)}
        onLogout={handleLogout}
      />

      <div className="p-6 max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <h1 className="text-3xl font-bold text-blue-700">Welcome, {user.name}</h1>
            <p className="text-gray-600">Manage your store and view customer feedback.</p>
          </div>
          <div className="bg-white shadow rounded-lg px-6 py-4 mt-4 sm:mt-0">
            <p className="text-gray-600 text-sm">Average Rating</p>
            <div className="text-3xl font-bold text-yellow-500">
              ⭐ {averageRating.toFixed(1)} / 5
            </div>
          </div>
        </div>

        {showProfile && (
          <div className="flex justify-center">
            <ProfileCard
              userId={user.userId}
              name={user.name}
              email={user.email}
              role={user.role}
              onSuccess={handleSuccess}
              onError={handleError}
            />
          </div>
        )}

        {/* Filter Options */}
        <FilterComponent
          sortBy={sortBy}
          setSortBy={setSortBy}
          minRating={minRating}
          setMinRating={setMinRating}
        />

        {/* Ratings Table */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Store Feedback</h2>
          {sortedRatings.length === 0 ? (
            <p className="text-gray-500">No ratings match your filter.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-blue-50 text-blue-700">
                  <tr>
                    <th className="px-4 py-2 font-medium">User</th>
                    <th className="px-4 py-2 font-medium">Rating</th>
                    <th className="px-4 py-2 font-medium">Comment</th>
                    <th className="px-4 py-2 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRatings.map((r) => (
                    <tr
                      key={`${r.userId}-${r.date}`}
                      className="border-t border-gray-200 hover:bg-gray-50 transition-all"
                    >
                      <td className="px-4 py-2">{r.userName}</td>
                      <td className="px-4 py-2 text-yellow-500 font-medium">
                        ⭐ {r.rating}
                      </td>
                      <td className="px-4 py-2">{r.comment}</td>
                      <td className="px-4 py-2 text-gray-500">{r.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 mt-12 pt-6 border-t">
          &copy; {new Date().getFullYear()} Store Rating Platform. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default OwnerDashboard;
