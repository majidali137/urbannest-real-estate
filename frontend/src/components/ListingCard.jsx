import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import outlineHeart from "../assets/icons/outlineHeart.svg";
import heartIcon from "../assets/icons/heartIcon.svg";
import bath from "../assets/bath.svg";
import bed from "../assets/bed.svg";
import { UserContext } from "../../context/userContext";
import toast from "react-hot-toast";
import axios from "axios";

const ListingCard = ({ listing, className }) => {
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const addToFavorites = async () => {
    try {
      const { data } = await axios.post("/add-to-favorites", {
        listingId: listing._id,
      });

      if (data === null) {
        toast.error("Please Login first");
        navigate("/login");
        return;
      }

      if (data.error) {
        toast.error("Server failed to add the listing to favorites");
        return;
      }

      setUser({ ...user, favorites: data });
      toast.success("Property added to favorites");
    } catch (error) {
      toast.error("Error adding to favorites");
    }
  };

  const removeFromFavorites = async () => {
    try {
      const { data } = await axios.post("/remove-favorite", {
        listingId: listing._id,
      });
      console.log(data);
      if (data.error) {
        toast.error("Server failed to remove favorite Property");
        return;
      }

      setUser({ ...user, favorites: data });
      toast.success("Property Removed from favorites");
    } catch (error) {
      toast.error("Error removing from favorites");
    }
  };
  return (
    <div
      className={`${
        className || ""
      } bg-gray relative rounded-lg overflow-hidden w-full pb-3 `}
    >
      {!user?.favorites.includes(listing._id) || !user ? (
        <img
          src={outlineHeart}
          alt="outlineHeart"
          className={`absolute text-gray-600 top-2 left-2 z-20 text-xl w-5 cursor-pointer`}
          style={{ filter: "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.9))" }}
          onClick={addToFavorites}
        />
      ) : (
        <img
          src={heartIcon}
          alt="heartIcon"
          className={`absolute text-gray-600 top-2 left-2 z-20 text-xl w-5 cursor-pointer`}
          style={{ filter: "drop-shadow(2px 2px 2px rgba(0, 0, 0, 0.6))" }}
          onClick={removeFromFavorites}
        />
      )}

      <Link
        className="bg-gray z-50 text-light-gray"
        to={`/listing/${listing._id}`}
      >
        <div className="relative">
          <span
            className={`${
              listing.purpose === "rent" ? "bg-orange" : "bg-gray"
            } text-white text-sm font-semibold rounded-full absolute z-20 drop-shadow-lg bottom-3 left-3 px-3 flex items-center justify-center`}
          >
            {listing.purpose[0].toUpperCase() + listing.purpose.slice(1)}
          </span>
          <img
            src={listing.images[0]}
            alt="listing cover"
            className="h-[220px] w-full object-cover hover:scale-105 transition-scale duration-300"
          />
        </div>
        <div className="p-5 box-border flex flex-col gap-2">
          <div className="text-neutral-600 flex justify-between">
            <div className=" flex items-center gap-2">
              {listing.bedrooms}
              <img src={bed} alt="bed" width={20} height={20} />{" "}
              {listing.bathrooms}
              <img src={bath} alt="bath" width={20} height={20} />
            </div>
            <h6>{listing?.type?.home}</h6>
          </div>
          <h2 className="font-semibold text-xl truncate text-white">
            {listing.title}
          </h2>
          <div>
            <span className="text-neutral-600">PKR</span> {listing.price}
          </div>
          <div className="flex gap-2 items-center">
            <FaLocationDot color="green" />{" "}
            <span className="truncate">{listing.address}</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
