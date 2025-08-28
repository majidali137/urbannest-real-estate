import ListingCard from "../ListingCard";
import useFetch from "../../useFetch";
import { AiFillDelete } from "react-icons/ai";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../Loader";
import SearchFilters from "./SearchFilters";
import { useNavigate } from "react-router-dom";
import DialogBox from "../DialogBox";

const AdminListings = () => {
  // const { data, loading, error } = useFetch("explore");
  const [allListings, setAllListings] = useState();
  const [dialog, setDialog] = useState(false);
  const [listingId, setListingId] = useState();
  const [deleteListingFlag, setDeleteListingFlag] = useState(false);

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    purpose: "all",
    sort: "created_at",
    order: "desc",
  });
  // const [loading, setLoading] = useState(false);
  // const [listings, setListings] = useState([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const purposeFromUrl = urlParams.get("purpose");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (searchTermFromUrl || purposeFromUrl || sortFromUrl || orderFromUrl) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        purpose: purposeFromUrl || "all",
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListings = async () => {
      try {
        setLoading(true);
        const searchQuery = urlParams.toString();
        const { data } = await axios.get(`/explore?${searchQuery}`);
        setAllListings(data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };
    fetchListings();
  }, [location.search, deleteListingFlag]);

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

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("purpose", sidebarData.purpose);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();

    navigate(`/admin-dashboard/listing?${searchQuery}`);
  };

  async function deleteListing(id) {
    console.log(id);
    try {
      const { data } = await axios.delete(`/delete-listing/${id}`);
      if (data.error) {
        toast.error(data.error);
      }
      setDeleteListingFlag(!deleteListingFlag);
      toast.success(data.success);
    } catch (error) {
      toast.error("Error deleting Listing");
    }
  }
  return (
    <div className="flex flex-col gap-3 p-5 justify-start w-full max-h-screen overflow-y-auto">
      <SearchFilters
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        sidebarData={sidebarData}
      />
      {loading && (
        <div className="flex items-center justify-center w-full gap-2 mt-4">
          <Loader width={"w-[30px]"} />
          <p className="text-white">Fetching Properties</p>
        </div>
      )}
      <div className="grid gap-3 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] w-full">
        {allListings &&
          allListings.length > 0 &&
          allListings.map((listing) => (
            <div className="relative" key={listing._id}>
              <AiFillDelete
                className="text-2xl absolute bottom-3 right-3 z-50 shadow-gray-600 drop-shadow text-lorange"
                onClick={() => {
                  setDialog(true);
                  setListingId(listing._id);
                }}
              />
              <ListingCard key={listing?._id} listing={listing} />
            </div>
          ))}
      </div>

      <DialogBox
        dialog={dialog}
        setDialog={setDialog}
        deleteListing={deleteListing}
        listingId={listingId}
      />
    </div>
  );
};

export default AdminListings;
