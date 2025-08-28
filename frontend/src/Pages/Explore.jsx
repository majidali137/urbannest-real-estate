import { FaSearch } from "react-icons/fa";
import { FaFilter } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import { checkboxData } from "../data/checkboxInputData";
import { motion } from "framer-motion";
import SkeletonCard from "../components/SkeletonCard";
import CheckboxInput from "../components/CheckboxInput";
import CheckboxTypeFilters from "../components/CheckboxTypeFilters";

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const Explore = () => {
  const navigate = useNavigate();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    purpose: "all",
    type: "%5B%5D",
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [typeArray, setTypeArray] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const purposeFromUrl = urlParams.get("purpose");
    const typeFromUrl = urlParams.get("type");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      purposeFromUrl ||
      sortFromUrl ||
      orderFromUrl ||
      typeFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        purpose: purposeFromUrl || "all",
        type: typeFromUrl || "%5B%5D",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    console.log(typeFromUrl);
    if (typeFromUrl) {
      let decodedListingType = JSON.parse(decodeURIComponent(typeFromUrl));
      console.log(decodedListingType);
      setTypeArray(decodedListingType);
    }
    const fetchListings = async () => {
      try {
        setLoading(true);
        setShowMore(false);
        const searchQuery = urlParams.toString();
        const { data } = await axios.get(`/explore?${searchQuery}`);
        if (data.length > 8) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
        setListings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "sell" ||
      e.target.id === "rent"
    ) {
      setSidebarData((prev) => ({ ...prev, purpose: e.target.id }));
    } else if (e.target.id === "searchTerm") {
      setSidebarData((prev) => ({ ...prev, searchTerm: e.target.value }));
    } else if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";
      const order = e.target.value.split("_")[1] || "desc";

      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const listingTypeHandleChange = (e, parent) => {
    let key = `type.${parent}`;
    let value = e.target.name;
    if (!e.target.checked) {
      setTypeArray((prevArray) => {
        const newArray = prevArray.filter((item) => item[key] !== value);
        updateSidebarData(newArray);
        return newArray;
      });
      return;
    }

    setTypeArray((prevArray) => {
      const newArray = [...prevArray, { [key.toString()]: value }];
      updateSidebarData(newArray);
      return newArray;
    });
  };
  console.log(typeArray);
  console.log(sidebarData.type);

  const updateSidebarData = (updatedArray) => {
    let encodedUriArray = encodeURIComponent(JSON.stringify(updatedArray));
    setSidebarData((prevData) => ({ ...prevData, type: encodedUriArray }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("purpose", sidebarData.purpose);
    urlParams.set("type", sidebarData.type);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();

    navigate(`/explore?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);

    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();

    const { data } = await axios.get(`/explore?${searchQuery}`);

    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="flex-col flex md:flex-row mb-16">
      <form action="" onSubmit={handleSubmit} className="lg:w-[25%] md:w-[30%]">
        <div className="w-full flex items-center justify-center p-5">
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
        <div className="px-4 pl-8 w-full">
          <div className="md:min-h-screen flex md:flex-col gap-1 flex-wrap bg-darkgray w-full">
            <div className="flex items-center gap-3 pb-4">
              <FaFilter color="white" />
              <h2 className="text-white text-xl font-bold">Filters:</h2>
            </div>
            <div className="flex gap-x-3 flex-wrap">
              <CheckboxInput
                id={"all"}
                name={"all"}
                sidebarData={sidebarData}
                handleChange={handleChange}
                value={"Sell & Rent"}
                purpose={"all"}
                htmlFor={"all"}
              />
              <CheckboxInput
                id={"sell"}
                name={"sell"}
                sidebarData={sidebarData}
                handleChange={handleChange}
                value={"Sell"}
                purpose={"sell"}
                htmlFor={"sell"}
              />
              <CheckboxInput
                id={"rent"}
                name={"rent"}
                sidebarData={sidebarData}
                handleChange={handleChange}
                value={"Rent"}
                purpose={"rent"}
                htmlFor={"rent"}
              />
            </div>
            <div className="flex flex-col gap-3">
              {checkboxData.map((item) => {
                return (
                  <CheckboxTypeFilters
                    item={item}
                    parent={item.name}
                    onChange={listingTypeHandleChange}
                    typeArray={typeArray}
                  />
                );
              })}
            </div>
            <div className="flex gap-2 mt-3 md:flex-col">
              <div className="">
                <select
                  name="sort"
                  id="sort_order"
                  defaultValue={`created_at_desc`}
                  onChange={handleChange}
                  className="bg-gray-600 text-white rounded-md px-3 py-2 cursor-pointer focus:outline-none focus:ring-1 focus:ring-orange"
                >
                  <option value="createdAt_desc">Latest</option>
                  <option value="price_desc">Price high to low</option>
                  <option value="price_asc">Price low to high</option>
                  <option value="createdAt_asc">Oldest</option>
                </select>
              </div>
              <div>
                <motion.button
                  whileTap={{ backgroundColor: "#d44e00", scale: 0.9 }}
                  className="text-white bg-orange px-6 py-2 rounded-md font-bold"
                >
                  Apply filters
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </form>
      <div className="w-full">
        {loading && (
          <div className="px-10">
            <SkeletonCard number={9} />
          </div>
        )}
        <div
          className={`${
            loading ? "flex items-center justify-center" : "grid"
          } px-10 py-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] max-sm:flex flex-col w-full gap-2`}
        >
          {!loading && listings?.length === 0 && (
            <p className="text-white text-xl">No listings found</p>
          )}
          {!loading &&
            listings?.length > 0 &&
            listings.map((listing) => (
              <ListingCard key={listing._id} listing={listing} />
            ))}
        </div>
        {!loading && showMore && (
          <button
            onClick={onShowMoreClick}
            className="text-orange text-center w-full hover:underline"
          >
            Show more
          </button>
        )}
      </div>
    </div>
  );
};

export default Explore;
