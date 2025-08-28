import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/userContext";
import useFetch from "../../useFetch";
import { Edit, Edit2Icon, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ListingCard from "../ListingCard";
import { AiFillDelete } from "react-icons/ai";
import Loader from "../Loader";
import edit from "../../assets/edit.svg";
import DialogBox from "../DialogBox";

const ManageListings = ({ className }) => {
  const { user } = useContext(UserContext);
  const { data, loading, error, forceFetch } = useFetch(
    `/listings/${user?._id}`
  );

  const [dialog, setDialog] = useState(false);
  const [listingId, setListingId] = useState();

  const listings = data;

  const handleDeleteListing = async (id) => {
    try {
      const { data } = await axios.delete(`/delete-listing/${id}`);
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.success);
        forceFetch();
      }
    } catch (error) {
      console.error(error);
      toast.error("Error while deleting the listing");
    }
  };

  return (
    <div
      className={`${className} px-7 py-5 w-full flex flex-col gap-5 max-h-screen overflow-y-scroll`}
    >
      <h1 className="text-2xl font-bold text-white">My Listings</h1>
      <div className="flex w-full justify-center text-xl text-light-gray">
        {loading ? (
          <div className="flex items-center justify-center w-full gap-2 mt-4">
            <Loader width={"w-[30px]"} />
            <p className="text-white">Fetching Properties</p>
          </div>
        ) : listings.length === 0 ? (
          "You have no listings"
        ) : (
          ""
        )}
      </div>
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] max-sm:flex flex-col w-full gap-4">
        {listings.length > 0 &&
          listings.map((listing, index) => (
            <li
              key={listing._id}
              className="relative grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] max-sm:flex flex-col w-full gap-2"
            >
              <AiFillDelete
                className="text-2xl absolute bottom-3 right-3 shadow-gray-600 drop-shadow z-50 text-lorange cursor-pointer"
                onClick={() => {
                  setListingId(listing._id);
                  setDialog(true);
                }}
              />
              <Link to={`/profile/update-listing/${listing._id}`}>
                <img
                  src={edit}
                  width={20}
                  height={20}
                  className="absolute right-3 top-1/2 z-50 drop-shadow-lg cursor-pointer"
                  alt=""
                />
              </Link>
              <ListingCard listing={listing} className={"drop-shadow-xl"} />
            </li>
          ))}
        <DialogBox
          dialog={dialog}
          setDialog={setDialog}
          deleteListing={handleDeleteListing}
          listingId={listingId}
        />
      </ul>
    </div>
  );
};

export default ManageListings;
