import React from "react";
import { Users, Store, Star } from "lucide-react";

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow flex items-center space-x-4 border-t-4 ${color}`}
  >
    <div className="p-3 bg-gray-100 rounded-full">
      <Icon className="text-gray-700 w-6 h-6" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  </div>
);

const DashboardStats = ({ users, stores, ratings }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <StatCard
        icon={Users}
        label="Total Users"
        value={users.length}
        color="border-blue-500"
      />
      <StatCard
        icon={Store}
        label="Total Stores"
        value={stores.length}
        color="border-green-500"
      />
      <StatCard
        icon={Star}
        label="Total Ratings"
        value={ratings.length}
        color="border-yellow-500"
      />
    </div>
  );
};

export default DashboardStats;
