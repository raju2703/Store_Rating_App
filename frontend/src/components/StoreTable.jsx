import React from "react";

const StoreTable = ({ stores, setRating }) => {
  const handleRating = (storeId, ratingValue) => {
    setRating(storeId, ratingValue);
  };

  const renderStars = (storeId, rating) => {
    return [...Array(5)].map((_, i) => {
      const value = i + 1;
      return (
        <span
          key={value}
          onClick={() => handleRating(storeId, value)}
          className={`cursor-pointer text-xl ${
            value <= rating ? "text-yellow-500" : "text-gray-300"
          }`}
        >
          ★
        </span>
      );
    });
  };

  return (
    <table className="min-w-full text-sm">
      <thead className="bg-gray-100 text-left">
        <tr>
          <th className="p-2">Store Name</th>
          <th className="p-2">Email</th>
          <th className="p-2">Address</th>
          <th className="p-2">Rating</th>
        </tr>
      </thead>
      <tbody>
        {stores.map((s) => (
          <tr key={s.id} className="border-t">
            <td className="p-2">{s.name}</td>
            <td className="p-2">{s.email}</td>
            <td className="p-2">{s.address}</td>
            <td className="p-2">{renderStars(s.id, s.rating)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default StoreTable;
