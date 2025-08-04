import React, { useState } from "react";
import Navbar from "../components/Navbar"; // Make sure this path is correct
import StoreCard from "../components/StoreCard"; // You'll create this component
const mockStores = [
  {
    id: 1,
    name: "Coffee Paradise",
    address: "123 Brew Street",
    averageRating: 4.2,
  },
  {
    id: 2,
    name: "Gadget World",
    address: "456 Tech Ave",
    averageRating: 3.9,
  },
  {
    id: 3,
    name: "Book Haven",
    address: "789 Read Blvd",
    averageRating: 4.7,
  },
  {
    id: 4,
    name: "Fashion Fiesta",
    address: "101 Trendy Lane",
    averageRating: 4.0,
  },
  {
    id: 5,
    name: "Healthy Bites",
    address: "202 Organic Way",
    averageRating: 4.5,
  },
  {
    id: 6,
    name: "Techie Toys",
    address: "303 Gadget Grove",
    averageRating: 3.8,
  },
  {
    id: 7,
    name: "Shoe Stop",
    address: "404 Style Avenue",
    averageRating: 4.1,
  },
  {
    id: 8,
    name: "Grocery Galaxy",
    address: "505 Daily Street",
    averageRating: 4.3,
  },
  {
    id: 9,
    name: "Pet Planet",
    address: "606 Paw Boulevard",
    averageRating: 4.6,
  },
  {
    id: 10,
    name: "Fitness Fuel",
    address: "707 Gym Court",
    averageRating: 3.7,
  },
];

const UserDashboard = () => {
  const [search, setSearch] = useState("");
  const [userRatings, setUserRatings] = useState({});

  const filteredStores = mockStores.filter((store) =>
    `${store.name} ${store.address}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleRating = (storeId) => {
    const rating = prompt("Enter your rating (1 to 5):");
    const num = parseInt(rating);
    if (num >= 1 && num <= 5) {
      setUserRatings((prev) => ({ ...prev, [storeId]: num }));
    } else {
      alert("Rating must be between 1 and 5.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onLogout={() => alert("Logging out...")} />

      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Welcome User!</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by store name or address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded shadow-sm"
        />

        {/* Store List */}
        <div className="space-y-4">
          {filteredStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              userRating={userRatings[store.id]}
              onRate={handleRating}
            />
          ))}
          {filteredStores.length === 0 && (
            <p className="text-gray-600">No stores match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
