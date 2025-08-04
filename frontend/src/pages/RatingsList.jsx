import React from "react";

const RatingsList = ({ ratings }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
        📝 User Ratings
      </h3>

      {ratings.length === 0 ? (
        <p className="text-gray-500 italic">No ratings yet.</p>
      ) : (
        <ul className="space-y-3">
          {ratings.map((item, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-50 hover:bg-gray-100 transition-colors p-4 rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-medium text-gray-700">{item.username}</p>
                <p className="text-sm text-gray-500">{item.comment}</p>
              </div>
              <div className="text-yellow-500 font-bold text-lg">
                ⭐ {item.rating} / 5
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RatingsList;
