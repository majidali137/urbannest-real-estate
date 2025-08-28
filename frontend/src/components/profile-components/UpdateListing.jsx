import { useContext, useEffect, useRef, useState } from "react";
import adInfo from "../../assets/icons/infoIcon.svg";
import adImages from "../../assets/icons/imageUploadIcon.svg";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/userContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import Toggle from "../Toggle";

const UpdateListing = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { requestSelling } = useParams();

  const { user, loading } = useContext(UserContext);

  const fileRef = useRef(null);

  const [listingData, setListingData] = useState({
    purpose: "sell",
    type: {
      home: "house",
    },
    city: "",
    address: "",
    areaSize: 0,
    areaUnit: "marla",
    price: 0,
    bedrooms: 0,
    bathrooms: 0,
    title: "",
    description: "",
    images: [],
  });

  const [imageUploadError, setImageUploadError] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);

  const [files, setFiles] = useState([]);

  useEffect(() => {
    const fetchListing = async () => {
      const listingId = params.listingId;
      const { data } = await axios.get(`/get-listing-by-id/${listingId}`);
      if (data.error) {
        console.log(data.error);
        toast.error(data.error);
        return;
      }
      setListingData(data);
    };

    fetchListing();
  }, []);

  const handleSelectChange = (key, value) => {
    setListingData((prev) => ({ ...prev, [key]: value }));
  };
  const handleTabButtonSelectChange = (combineKey, value) => {
    const [category, subCategory] = combineKey.split(".");

    setListingData((prev) => ({
      ...prev,
      [category]: {
        [subCategory]: value,
      },
    }));
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    console.log(value);
    setListingData((prev) => ({ ...prev, [e.target.name]: value }));
  };

  const handleImageUpload = (e) => {
    if (files.length > 0 && files.length + listingData.images.length < 11) {
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i], i));
      }
      Promise.all(promises)
        .then((urls) => {
          setListingData((prev) => ({
            ...prev,
            images: listingData.images.concat(urls),
          }));
          setImageUploadError(false);
          setFiles([]);
        })
        .catch((err) => {
          setImageUploadError("Image upload failed! (3mb max per image)");
          setImageUploadError(false);
        });
    } else {
      setImageUploadError("You can only upload upto 10 images per listing");
      setImageUploadError(false);
    }
  };
  const storeImage = async (file, i) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progess = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setImageLoading(`Image ${i + 1} is uploading: ${progess}%`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageLoading(false);
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const updateListing = async (e) => {
    e.preventDefault();
    if (listingData.images.length < 1) {
      setImageUploadError("Please choose atleast one image");
      toast.error("Please choose atleast one image");
      return;
    }
    try {
      const { data } = await axios.post(`/update-listing/${params.listingId}`, {
        ...listingData,
        userRef: user._id,
      });

      if (data.error) {
        toast.error(data.error);
        navigate("/profile/dashboard");
      } else {
        toast.success("Listing updated successfully");
        navigate("/profile/manage-listings");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error while updating the property");
    }
  };

  if (user?.roles?.name === "buyer" && user?.seller) {
    return (
      <div className="flex items-center justify-center w-full text-white gap-5">
        <h1 className="font-medium text-xl">
          Switch to selling mode to update properties!
        </h1>
        <Toggle />
      </div>
    );
  }
  if (user?.roles?.name === "buyer" && !user?.seller) {
    return (
      <div className="flex items-center justify-center w-full text-white">
        <h1 className="font-medium text-xl">
          Become a seller to update your properties
        </h1>
      </div>
    );
  }

  return (
    <form
      onSubmit={updateListing}
      className="flex flex-col gap-7 items-center w-full py-10 overflow-scroll"
    >
      <h1 className="text-white font-bold text-3xl">Update Listing</h1>

      {/*Title and description*/}
      <PurposeAndType
        selectChange={handleSelectChange}
        listingData={listingData}
        handleTabButtonSelectChange={handleTabButtonSelectChange}
        handleInputChange={handleInputChange}
      />

      <PriceAndArea
        handleInputChange={handleInputChange}
        listingData={listingData}
      />
      <BedroomsAndBathrooms
        handleInputChange={handleInputChange}
        listingData={listingData}
      />

      {/*Title and description*/}
      <TitleAndDescription
        handleInputChange={handleInputChange}
        listingData={listingData}
      />

      {/*Property Images*/}
      <UploadImages
        fileRef={fileRef}
        files={files}
        setFiles={setFiles}
        handleImageUpload={handleImageUpload}
        listingData={listingData}
        setListingData={setListingData}
        imageUploadError={imageUploadError}
        imageLoading={imageLoading}
      />

      <button
        type="submit"
        className="bg-orange px-7 py-2 rounded-md text-white font-bold"
      >
        {loading ? "Updating..." : "Update Listing"}
      </button>
    </form>
  );
};

function PurposeAndType({
  selectChange,
  listingData,
  handleTabButtonSelectChange,
  handleInputChange,
}) {
  return (
    <div className="grid grid-cols-4 gap-5 bg-gray px-16 max-sm:px-7 w-[90%] py-10 xl:w-[75%] rounded-xl text-white">
      <div className=" lg:col-span-1 col-span-4">
        <img src={adInfo} alt="ad info" className=" w-16 opacity-50" />
        <h2 className="text-white font-semibold text-xl">
          Location and purpose
        </h2>
      </div>
      <div className="lg:col-span-3 col-span-4 flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg font-medium">
            Select Purpose
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => selectChange("purpose", "sell")}
              className={`${
                listingData.purpose === "sell"
                  ? "bg-orange border-[1px] border-orange"
                  : "border-[1px]"
              } rounded-full px-6 py-1`}
            >
              Sell
            </button>
            <button
              type="button"
              onClick={() => selectChange("purpose", "rent")}
              className={`${
                listingData.purpose === "rent"
                  ? "bg-orange border-[1px] border-orange"
                  : "border-[1px]"
              } rounded-full px-6 py-1`}
            >
              Rent
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg font-medium">
            Select Property Type
          </label>
          <div>
            <div className="flex flex-wrap">
              <p
                onClick={() => selectChange("type", { home: "house" })}
                className={`${
                  listingData?.type?.home
                    ? "text-orange border-orange border-b-[1px]"
                    : ""
                } px-5 py-2 cursor-pointer`}
              >
                Home
              </p>
              <p
                onClick={() =>
                  selectChange("type", { plots: "residential-plot" })
                }
                className={`${
                  listingData?.type?.plots
                    ? "text-orange border-orange border-b-[1px]"
                    : ""
                } px-5 py-2 cursor-pointer`}
              >
                Plots
              </p>
              <p
                onClick={() => selectChange("type", { commercial: "office" })}
                className={`${
                  listingData?.type?.commercial
                    ? "text-orange border-orange border-b-[1px]"
                    : ""
                } px-5 py-2 cursor-pointer`}
              >
                Commercial
              </p>
            </div>

            <div
              className={`${
                listingData.type.home ? "flex" : "hidden"
              } flex-wrap w-full gap-3 pt-5`}
            >
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.home", "house")
                }
                className={`${
                  listingData.type.home === "house"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                House
              </button>
              <button
                type="button"
                onClick={() => handleTabButtonSelectChange("type.home", "flat")}
                className={`${
                  listingData.type.home === "flat"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Flat
              </button>
              <button
                type="button"
                onClick={() => handleTabButtonSelectChange("type.home", "room")}
                className={`${
                  listingData.type.home === "room"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Room
              </button>
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.home", "farm-house")
                }
                className={`${
                  listingData.type.home === "farm-house"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Farm House
              </button>
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.home", "pent-house")
                }
                className={`${
                  listingData.type.home === "pent-house"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Pent House
              </button>
            </div>

            <div
              className={`${
                listingData.type.plots ? "flex" : "hidden"
              } flex-wrap w-full gap-3 pt-5`}
            >
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.plots", "residential-plot")
                }
                className={`${
                  listingData.type.plots === "residential-plot"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Residential Plot
              </button>
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.plots", "commercial-plot")
                }
                className={`${
                  listingData.type.plots === "commercial-plot"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Commercial Plot
              </button>
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.plots", "agricultural-plot")
                }
                className={`${
                  listingData.type.plots === "agricultural-plot"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Agricultural Plot
              </button>
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.plots", "industrial-land")
                }
                className={`${
                  listingData.type.plots === "industrial-land"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Industrial Land
              </button>
            </div>

            <div
              className={`${
                listingData.type.commercial ? "flex" : "hidden"
              } flex-wrap w-full gap-3 pt-5`}
            >
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.commercial", "office")
                }
                className={`${
                  listingData.type.commercial === "office"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Office
              </button>
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.commercial", "shop")
                }
                className={`${
                  listingData.type.commercial === "shop"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Shop
              </button>
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.commercial", "warehouse")
                }
                className={`${
                  listingData.type.commercial === "warehouse"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Warehouse
              </button>
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.commercial", "factory")
                }
                className={`${
                  listingData.type.commercial === "factory"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Factory
              </button>
              <button
                type="button"
                onClick={() =>
                  handleTabButtonSelectChange("type.commercial", "building")
                }
                className={`${
                  listingData.type.commercial === "building"
                    ? "bg-orange border-orange"
                    : "border"
                } rounded-full px-6 py-1`}
              >
                Building
              </button>
            </div>
          </div>
        </div>
        <div className=" flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-lg">City</h2>
            <input
              onChange={handleInputChange}
              type="text"
              name="city"
              value={listingData.city}
              className=" rounded-md py-2 px-4 bg-gray-600"
              minLength={3}
              maxLength={50}
              required
              placeholder="City"
            />
          </div>
          <div className="flex flex-col gap-2">
            <h2 className="font-medium text-lg">Address</h2>
            <input
              onChange={handleInputChange}
              type="text"
              name="address"
              value={listingData.address}
              className=" rounded-md py-2 px-4 bg-gray-600"
              minLength={5}
              required
              placeholder="Address"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function PriceAndArea({ handleInputChange, listingData }) {
  return (
    <div className="grid grid-cols-4 gap-5 bg-gray px-16 max-sm:px-7 w-[90%] py-10 xl:w-[75%] rounded-xl text-white">
      <div className=" lg:col-span-1 col-span-4">
        <img src={adInfo} alt="ad info" className=" w-16 opacity-50" />
        <h2 className="text-white font-semibold text-xl">Area and Price</h2>
      </div>
      <div className="lg:col-span-3 col-span-4 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg">
            Area Size
          </label>
          <div className="flex gap-3">
            <input
              onChange={handleInputChange}
              name="areaSize"
              value={listingData.areaSize}
              type="number"
              pattern="^[+]?\d+([.]\d+)?$"
              step={"0.01"}
              className="w-full rounded-md py-2 px-4 bg-gray-600"
              required
              placeholder="Enter property Area Size"
            />
            <select
              name="areaUnit"
              id="areaunit"
              value={listingData.areaUnit}
              onChange={handleInputChange}
              className="text-white h-full rounded-md px-4 bg-gray-600"
            >
              <option value="marla">Marla</option>
              <option value="kanal">Kanal</option>
              <option value="squareFeet">Sq. Ft.</option>
              <option value="SquareMeter">Sq. M.</option>
              <option value="SquareYard">Sq. Yd.</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg">
            Price
          </label>
          <input
            onChange={handleInputChange}
            name="price"
            value={listingData.price}
            type="number"
            pattern="^[+]?\d+([.]\d+)?$"
            className=" rounded-md py-2 px-4 bg-gray-600 lg:w-[50%]"
            required
            placeholder="PKR. Property Price"
          />
        </div>
      </div>
    </div>
  );
}

function BedroomsAndBathrooms({ handleInputChange, listingData }) {
  return (
    <div className="grid grid-cols-4 gap-5 bg-gray px-16 max-sm:px-7 w-[90%] py-10 xl:w-[75%] rounded-xl text-white">
      <div className=" lg:col-span-1 col-span-4">
        <img src={adInfo} alt="ad info" className=" w-16 opacity-50" />
        <h2 className="text-white font-semibold text-xl">
          Bedrooms and bathrooms
        </h2>
      </div>
      <div className="lg:col-span-3 col-span-4 flex gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg">
            Bedrooms
          </label>
          <input
            onChange={handleInputChange}
            name="bedrooms"
            value={listingData.bedrooms}
            type="number"
            pattern="^[+]?\d+([.]\d+)?$"
            className=" rounded-md py-2 px-4 bg-gray-600"
            minLength={5}
            maxLength={70}
            required
            placeholder="Number of Bedrooms"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg">
            Bathrooms
          </label>
          <input
            onChange={handleInputChange}
            name="bathrooms"
            value={listingData.bathrooms}
            type="number"
            pattern="^[+]?\d+([.]\d+)?$"
            className=" rounded-md py-2 px-4 bg-gray-600"
            required
            placeholder="Number of Bathrooms"
          />
        </div>
      </div>
    </div>
  );
}

function TitleAndDescription({ handleInputChange, listingData }) {
  return (
    <div className="grid grid-cols-4 gap-5 bg-gray px-16 max-sm:px-7 w-[90%] py-10 xl:w-[75%] rounded-xl text-white">
      <div className=" lg:col-span-1 col-span-4">
        <img src={adInfo} alt="ad info" className=" w-16 opacity-50" />
        <h2 className="text-white font-semibold text-xl">Ad Information</h2>
      </div>
      <div className="lg:col-span-3 col-span-4 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg">
            Title
          </label>
          <input
            onChange={handleInputChange}
            type="text"
            name="title"
            value={listingData.title}
            className=" rounded-md py-2 px-4 bg-gray-600"
            minLength={5}
            maxLength={70}
            required
            placeholder="Enter property title. eg. Beautiful house in chenab orchids."
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg">
            Description
          </label>
          <textarea
            onChange={handleInputChange}
            type="text"
            name="description"
            value={listingData.description}
            className=" rounded-md py-2 px-4 bg-gray-600"
            required
            placeholder="Descripe your property in detail"
          />
        </div>
      </div>
    </div>
  );
}

function UploadImages({
  fileRef,
  setFiles,
  handleImageUpload,
  listingData,
  setListingData,
  imageUploadError,
  imageLoading,
}) {
  const handleDeleteImage = (index) => {
    setListingData((prev) => ({
      ...prev,
      images: prev.images.filter((_, id) => id !== index),
    }));
  };

  return (
    <div className="grid grid-cols-4 gap-5 bg-gray px-16 max-sm:px-7 w-[90%] py-10 xl:w-[75%] rounded-xl text-white">
      <div className=" lg:col-span-1 col-span-4">
        <img src={adImages} alt="ad info" className=" w-14 opacity-50" />
        <h2 className="text-white font-semibold text-xl">Property Images</h2>
      </div>
      <div className="lg:col-span-3 col-span-4 flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="" className="text-lg">
            Add images of your property
          </label>
          <div className="flex justify-between max-lg:flex-col gap-4 border border-orange border-dashed rounded-lg p-7">
            <div className="flex flex-col gap-2">
              <input
                onChange={(e) => setFiles(e.target.files)}
                type="file"
                ref={fileRef}
                accept="image/*"
                multiple
              />
              <p className="text-light-red">
                {imageUploadError && imageUploadError}
              </p>
              <p className="text-light-red">{imageLoading && imageLoading}</p>
              <div className="flex flex-col gap-2">
                <div>
                  <button
                    onClick={handleImageUpload}
                    type="button"
                    disabled={imageLoading}
                    className="bg-orange px-4 py-2 rounded-md font-semibold"
                  >
                    {imageLoading ? "Uploading..." : "Upload Images"}
                  </button>
                </div>
                <p className="text-sm">Max size 3MB, .jpg .png only</p>
              </div>
              <div
                className={`${
                  listingData.images[0] ? "flex gap-4 w-full" : "hidden"
                }`}
              >
                {listingData.images.map((image, index) => (
                  <div
                    key={image}
                    className="relative flex flex-wrap justify-between items-center"
                  >
                    <img
                      src={image}
                      alt="property image"
                      className=" w-24 h-16 object-cover"
                    />
                    <X
                      onClick={() => handleDeleteImage(index)}
                      className="absolute bottom-1 right-1 w-4 h-4 bg-white rounded-full text-light-red cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateListing;
