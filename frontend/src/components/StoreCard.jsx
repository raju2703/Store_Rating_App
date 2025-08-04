import React, { useState } from "react";

const StoreCard = ({ store, userRating, onRate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedRating, setSelectedRating] = useState(userRating || 0);

  const handleSave = () => {
    if (selectedRating >= 1 && selectedRating <= 5) {
      onRate(store.id, selectedRating); // Send rating to parent
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-4 space-y-2 border">
      <h2 className="text-lg font-semibold">{store.name}</h2>
      <p className="text-sm text-gray-600">{store.address}</p>
      <p className="text-sm">
        Overall Rating:{" "}
        <span className="font-medium">⭐ {store.averageRating}</span>
      </p>

      {!isEditing ? (
        <div className="flex items-center justify-between">
          <p className="text-sm">
            Your Rating:{" "}
            {userRating ? (
              `⭐ ${userRating}`
            ) : (
              <span className="italic text-gray-500">Not rated</span>
            )}
          </p>
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:underline"
          >
            {userRating ? "Update Rating" : "Submit Rating"}
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {/* Star selection UI */}
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setSelectedRating(star)}
                className={`text-2xl transition ${
                  star <= selectedRating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
            >
              Save
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setSelectedRating(userRating || 0);
              }}
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StoreCard;
