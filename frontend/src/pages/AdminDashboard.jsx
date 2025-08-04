import React, { useState } from "react";
import Navbar from "../components/Navbar";
import ProfileCard from "../components/ProfileCard";
import DashboardStats from "../components/DashboardStats";
import AddUserForm from "../components/AddUserForm";
import AddStoreForm from "../components/AddStoreForm";
import UserTable from "../components/UserTable";
import StoreTable from "../components/StoreTable";
import { initialUsers, initialStores, initialRatings } from "../data/data";

const AdminDashboard = () => {
  const [users, setUsers] = useState(initialUsers);
  const [stores, setStores] = useState(initialStores);
  const [ratings, setRatings] = useState(initialRatings);

  const addUser = (user) => {
    setUsers([...users, { id: users.length + 1, ...user }]);
  };

  const addStore = (store) => {
    setStores([
      ...stores,
      {
        id: stores.length + 1,
        ...store,
        rating: parseFloat(store.rating) || 0,
      },
    ]);
  };

  const setRating = (storeId, newRating) => {
    setStores((prevStores) =>
      prevStores.map((store) =>
        store.id === storeId ? { ...store, rating: newRating } : store
      )
    );
    setRatings([...ratings, { storeId, rating: newRating }]);
  };

  const handleToggleProfile = () => {
    console.log("Profile toggled");
  };

  const handleLogout = () => {
    console.log("Logout clicked");
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 via-white to-gray-50">
      {/* Navbar */}
      <Navbar onToggleProfile={handleToggleProfile} onLogout={handleLogout} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 space-y-16">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-5xl font-extrabold text-blue-700">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2 text-sm">System Administrator Panel</p>
        </header>

        {/* Dashboard Stats */}
        <DashboardStats users={users} stores={stores} ratings={ratings} />

        {/* Forms Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
            <h2 className="text-2xl font-semibold text-blue-600 mb-4 border-b pb-2">
              Add New User
            </h2>
            <AddUserForm addUser={addUser} />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 transition hover:shadow-xl">
            <h2 className="text-2xl font-semibold text-green-600 mb-4 border-b pb-2">
              Add New Store
            </h2>
            <AddStoreForm addStore={addStore} />
          </div>
        </section>

        {/* Tables Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 overflow-auto transition hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">User List</h2>
            <UserTable users={users} />
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 overflow-auto transition hover:shadow-xl">
            <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Store List</h2>
            <StoreTable stores={stores} setRating={setRating} />
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-400 pt-10 border-t">
          &copy; {new Date().getFullYear()} Store Rating Admin Panel. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default AdminDashboard;
