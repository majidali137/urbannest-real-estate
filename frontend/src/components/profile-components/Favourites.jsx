import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import useFetch from "../../useFetch";
import axios from "axios";
import { Link } from "react-router-dom";
import ListingCard from "../ListingCard";
import Loader from "../Loader";
import toast from "react-hot-toast";

const Favorites = ({ className }) => {
  const { user, loading, setLoading } = useContext(UserContext);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/get-favorites");
        if (data.error) {
          toast.error(data.error);
          setLoading(false);
          return;
        }
        setLoading(false);
        setFavorites(data);
      } catch (error) {
        toast.error("Error fetching the favorite properties");
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  return (
    <div
      className={`${className} px-7 py-5 w-full flex flex-col gap-5 max-h-screen overflow-y-scroll`}
    >
      <h1 className="text-2xl font-bold text-white">Favorites</h1>
      <div className="flex w-full justify-center text-xl text-light-gray">
        {loading ? (
          <div className="flex items-center justify-center w-full gap-2 mt-4">
            <Loader width={"w-[30px]"} />
            <p className="text-white">Fetching your Favorite Properties</p>
          </div>
        ) : user?.favorites.length === 0 || favorites.length === 0 ? (
          <p className="italic text-white opacity-50 font-light">
            You have no favorite Properties
          </p>
        ) : (
          ""
        )}
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] max-sm:flex flex-col w-full gap-4">
        {favorites.length > 0 &&
          favorites.map((listing, index) => (
            <li
              key={listing._id}
              className="relative grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] max-sm:flex flex-col w-full gap-2"
            >
              <ListingCard listing={listing} className={"drop-shadow-xl"} />
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Favorites;
