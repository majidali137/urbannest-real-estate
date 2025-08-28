import { CheckCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import postListingPic from "../../assets/Images/postListingPic.jpg";
import useFetch from "../../useFetch";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import ListingCard from "../ListingCard";
import Loader from "../Loader";

const Dashboard = ({ className }) => {
  const { user } = useContext(UserContext);
  const { data, loading, error } = useFetch(`/listings/${user?._id}`);

  var listings = data.slice(0, 4);

  return (
    <div
      className={`${className} grid grid-cols-3 gap-5 w-full text-white p-5 max-h-screen overflow-y-auto`}
    >
      <div className="col-span-1 max-md:col-span-3 flex flex-col justify-center items-center gap-10 bg-gray py-7 px-0 rounded-xl">
        <h1 className="text-2xl font-semibold">Properties</h1>
        <div className="flex items-center">
          <div className="flex items-center justify-center flex-col gap-3">
            <h1 className="text-2xl">{listings.length}</h1>
            <span className=" text-gray-600">- out of -</span>
            <h1 className="text-2xl">{listings.length}</h1>
            <span className=" text-gray-600">available</span>
          </div>
        </div>
      </div>
      <div className="px-10 py-7 relative col-span-2 max-md:col-span-3 max-md:h-72 max-sm:h-[22rem] overflow-hidden flex flex-col gap-5 bg-gray rounded-xl">
        <h1 className="text-2xl font-semibold">
          Looking to sell or <br /> Rent your property?
        </h1>
        <p className=" text-gray-600 text-lg">
          Post your property now on urbannest.pk
        </p>
        <div>
          <div className="flex gap-2 items-center">
            <CheckCircle className="text-orange" width={15} />
            <p>Connect with real buyers</p>
          </div>
          <div className="flex gap-2 items-center">
            <CheckCircle className="text-orange" width={15} />
            <p>Get best prices</p>
          </div>
        </div>
        <div>
          <button className="bg-orange px-5 py-2 rounded-lg">
            <NavLink to={"/profile/add-listing"}>Add Property</NavLink>
          </button>
        </div>
        <img
          src={postListingPic}
          alt="postListingPic"
          className="h-full lg:absolute max-xl:hidden right-0 top-0"
        />
      </div>
      <div className="col-span-3 flex flex-col gap-5 rounded-xl w-full bg-gray h-full px-7 py-4">
        <h1 className="text-2xl font-semibold">My recent Properties</h1>
        <div className="flex items-center justify-center w-full">
          {error ? (
            "Error while fetching listings"
          ) : loading ? (
            <div className="flex items-center justify-center w-full gap-2 mt-4">
              <Loader width={"w-[30px]"} />
              <p className="text-white">Fetching Properties</p>
            </div>
          ) : listings.length === 0 ? (
            "No recent Listings"
          ) : (
            ""
          )}
        </div>
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] max-sm:flex flex-col w-full gap-2">
          {listings.map((listing) => (
            <li className="relative" key={listing._id}>
              <ListingCard listing={listing} className={"drop-shadow-xl"} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
