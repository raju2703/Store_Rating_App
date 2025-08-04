import React from "react";

const FilterComponent = ({ sortBy, setSortBy, minRating, setMinRating }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 mb-4">
      {/* Sort By */}
      <div className="w-full sm:w-auto">
        <label
          htmlFor="sort"
          className="text-xs font-medium text-gray-600 block mb-1"
        >
          Sort:
        </label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full sm:w-40 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring focus:ring-blue-400 bg-white"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
      </div>

      {/* Filter by Minimum Rating */}
      <div className="w-full sm:w-auto">
        <label
          htmlFor="minRating"
          className="text-xs font-medium text-gray-600 block mb-1"
        >
          Min Rating:
        </label>
        <select
          id="minRating"
          value={minRating}
          onChange={(e) => setMinRating(Number(e.target.value))}
          className="w-full sm:w-40 border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring focus:ring-blue-400 bg-white"
        >
          <option value={0}>All</option>
          <option value={1}>1★+</option>
          <option value={2}>2★+</option>
          <option value={3}>3★+</option>
          <option value={4}>4★+</option>
          <option value={5}>5★</option>
        </select>
      </div>
    </div>
  );
};

export default FilterComponent;
