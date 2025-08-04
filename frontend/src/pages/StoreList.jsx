import React, { useEffect, useState } from "react";
import axios from "axios";
import StoreCard from "../components/StoreCard.jsx";

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");

  const fetchStores = async () => {
    const { data } = await axios.get("/api/stores", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    setStores(data);
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const filtered = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <input
          placeholder="Search by name or address..."
          className="p-3 border w-2/3 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white p-2 rounded-xl"
        >
          Logout
        </button>
      </div>
      <div className="grid gap-4">
        {filtered.map((store) => (
          <StoreCard key={store.id} store={store} fetchStores={fetchStores} />
        ))}
      </div>
    </div>
  );
};

export default StoreList;
