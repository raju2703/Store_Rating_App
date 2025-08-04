import React, { useState } from "react";

const AddStoreForm = ({ addStore }) => {
  const [newStore, setNewStore] = useState({
    name: "",
    email: "",
    address: "",
    rating: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStore((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { name, email, address, rating } = newStore;

    if (!name || !email || !address) {
      alert("Please fill out all fields.");
      return;
    }

    addStore({
      ...newStore,
      rating: parseFloat(rating) || 0,
    });

    setNewStore({
      name: "",
      email: "",
      address: "",
      rating: "",
    });
  };

  return (
    <div className="bg-white rounded shadow p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Add New Store</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="name"
          placeholder="Store Name"
          value={newStore.name}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Store Email"
          value={newStore.email}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          name="address"
          placeholder="Address"
          value={newStore.address}
          onChange={handleChange}
          className="border px-3 py-2 rounded"
          required
        />
        <input
          name="rating"
          type="number"
          placeholder="Initial Rating (0-5)"
          value={newStore.rating}
          onChange={handleChange}
          min="0"
          max="5"
          step="0.1"
          className="border px-3 py-2 rounded"
        />
        <button
          type="submit"
          className="col-span-2 bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Add Store
        </button>
      </form>
    </div>
  );
};

export default AddStoreForm;
