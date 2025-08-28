import React from "react";
import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";

const SearchFilters = ({ handleChange, handleSubmit, sidebarData }) => {
  return (
    <form action="" onSubmit={handleSubmit}>
      <div className="w-full flex items-center justify-start p-5">
        <input
          type="text"
          id="searchTerm"
          className="rounded-s-lg px-4 py-2 bg-gray-600 text-white w-72 focus:outline-none focus:ring-1 focus:ring-orange"
          placeholder="Search"
          value={sidebarData.searchTerm}
          onChange={handleChange}
        />
        <button className="bg-orange p-3 rounded-r-lg">
          <FaSearch color="white" />
        </button>
      </div>
      <div className="px-4 pl-8">
        <div className=" flex gap-3 flex-wrap bg-darkgray">
          <div className="flex items-center gap-3">
            <FaFilter color="white" />
            <h2 className="text-white text-xl font-bold">Filters:</h2>
          </div>
          <div className="flex gap-x-3 gap-y-0 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="all"
                name="all"
                checked={sidebarData.purpose === "all"}
                onChange={handleChange}
                className="peer relative appearance-none w-5 h-5 border border-orange rounded-md cursor-pointer focus:outline-none checked:bg-orange hover:ring-1 hover:ring-orange after:contemt-[''] after:w-full after:h-full after:top-0 after:left-0"
              />
              <label
                htmlFor="all"
                className="text-white text-lg cursor-pointer"
              >
                Sell & Rent
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="sell"
                name="sell"
                checked={sidebarData.purpose === "sell"}
                onChange={handleChange}
                className="peer relative appearance-none w-5 h-5 border border-orange rounded-md cursor-pointer focus:outline-none checked:bg-orange hover:ring-1 hover:ring-orange after:contemt-[''] after:w-full after:h-full after:top-0 after:left-0"
              />
              <label
                htmlFor="sell"
                className="text-white text-lg cursor-pointer"
              >
                Sell
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rent"
                name="rent"
                checked={sidebarData.purpose === "rent"}
                onChange={handleChange}
                className="peer relative appearance-none w-5 h-5 border border-orange rounded-md cursor-pointer focus:outline-none checked:bg-orange hover:ring-1 hover:ring-orange after:contemt-[''] after:w-full after:h-full after:top-0 after:left-0"
              />
              <label
                htmlFor="rent"
                className="text-white text-lg cursor-pointer"
              >
                Rent
              </label>
            </div>
          </div>
          <div>
            <select
              name="sort"
              id="sort_order"
              defaultValue={`created_at_desc`}
              onChange={handleChange}
              className="bg-gray-600 text-white rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange"
            >
              <option value="createdAt_desc">Latest</option>
              <option value="price_desc">Price low to high</option>
              <option value="price_asc">Price high to low</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className="text-white bg-orange px-4 rounded-md font-bold">
            Apply filters
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchFilters;
