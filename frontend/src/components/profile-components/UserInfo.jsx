import { useContext, useState, useEffect, useRef } from "react";
import { UserContext } from "../../../context/userContext";
import { Pencil } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { ProfileContext } from "../../../context/profileContext";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

const UserInfo = ({ className }) => {
  const { user, setUser } = useContext(UserContext);

  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileError, setFileError] = useState(false);

  const { requestSellerSession, setRequestSellerSession } =
    useContext(ProfileContext);

  const navigate = useNavigate();

  const [focused, setFocused] = useState(false);

  const handleFocus = (e) => {
    setFocused(true);
  };

  const [disable, setDisable] = useState(true);

  const [profileData, setProfileData] = useState({
    avatar:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
    username: "",
    fullName: "",
    email: "",
    phone: "",
    city: "",
  });

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },
      (error) => {
        console.error("File upload error: ", error); // Add error logging here
        setFileError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadUrl) => {
          setProfileData((prev) => ({ ...prev, avatar: downloadUrl }));

          try {
            console.log("Download URL:", downloadUrl); // Logging download URL
            const { data } = await axios.patch("/upload-profile-image", {
              avatar: downloadUrl,
            });
            setUser((prev) => ({ ...prev, avatar: downloadUrl }));
            console.log("Backend response:", data); // Logging backend response
            if (data.error) {
              toast.error(data.error);
            } else {
              toast.success(data.success);
              navigate("/profile");
            }
          } catch (error) {
            console.error("Error updating profile image: ", error); // More detailed error logging
          }
        });
      }
    );
  };

  useEffect(() => {
    // Update profileData once user context is available
    if (user && disable) {
      setProfileData((prev) => ({
        ...prev,
        username: user.username || "",
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        city: user.city || "",
      }));
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      const { data } = await axios.patch("/complete-profile", {
        avatar: profileData.avatar,
        username: profileData.username,
        email: profileData.email,
        fullName: profileData.fullName,
        phone: profileData.phone,
        city: profileData.city,
        requestSellerSession: requestSellerSession,
      });
      if (data.error) {
        toast.error(data.error);
        setRequestSellerSession(false);
      } else {
        toast.success(data.success);
        location.reload(true);
        setRequestSellerSession(false);
        navigate("/profile");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const inputs = [
    {
      name: "username",
      type: "text",
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special characters",
      placeholder: "Username",
      pattern: "^[A-Za-z0-9]{3,16}$",
      required: true,
    },
    {
      name: "fullName",
      type: "text",
      errorMessage: "Please enter your full name",
      placeholder: "Full Name",
      required: true,
    },
    {
      name: "email",
      type: "email",
      errorMessage: "Enter a valid email",
      placeholder: "Email",
      required: true,
    },
    {
      name: "phone",
      type: "text",
      errorMessage: "Please enter correct Phone number",
      placeholder: "Phone Number",
      pattern: "^[0-9]{11}$",
      required: true,
    },
    {
      name: "city",
      type: "text",
      errorMessage: "Enter your city please",
      placeholder: "City",
      required: true,
    },
  ];

  const handleChange = (event) => {
    const value = event.target.value;
    console.log(`Updating ${event.target.name} to: ${value}`);
    setProfileData({ ...profileData, [event.target.name]: value });
  };

  console.log(filePercentage);

  return (
    <div
      className={`${className} w-full flex flex-col justify-between gap-14 items-center py-10 max-h-screen overflow-y-auto`}
    >
      <div className=" max-sm:flex-col max-md:flex-col flex items-center gap-5 lg:px-40 xl:px-56 w-full md:px-16">
        <div className="relative">
          <input
            onChange={(e) => setFile(e.target.files[0])}
            type="file"
            ref={fileRef}
            hidden
            accept="image/*"
          />
          <img
            onClick={() => fileRef.current.click()}
            src={user?.avatar}
            alt="profile"
            className="rounded-full w-28 h-28 object-cover"
          />
          <div
            className={`${
              filePercentage === 100 || filePercentage === 0
                ? "hidden"
                : "absolute"
            } top-0 left-0 flex items-center justify-center bg-black opacity-50 rounded-full w-full h-full`}
          >
            <span className="text-white font-bold text-2xl">
              {filePercentage}%
            </span>
          </div>
          <span
            className="absolute right-1 bottom-1 p-1 cursor-pointer bg-orange rounded-full"
            onClick={() => fileRef.current.click()}
          >
            <Pencil className="text-white text-lg w-4 h-4" />
          </span>
        </div>
        <div className="flex flex-col">
          <p className="text-white font-medium text-xl">{user?.username}</p>
          <p
            className={`${
              disable ? "text-blue" : "text-light-red"
            } cursor-pointer flex gap-2 text-sm items-center`}
            onClick={() => setDisable(!disable)}
          >
            <Pencil width={17} />
            {disable ? "Edit profile" : "Cancel"}
          </p>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 md:grid-cols-2 gap-10 lg:px-40 xl:px-56 w-full px-10 max-[350px]:px-4">
        {inputs.map((input, index) => (
          <div key={index} className="flex flex-col text-light-gray">
            <label className="font-bold text-lg">{input.placeholder}</label>
            <input
              type={input.type}
              className={`profile-input ${
                disable || input.name === "email"
                  ? " text-center bg-gray "
                  : "bg-orange bg-opacity-10"
              } rounded-lg text-xl text-[#dddddd] p-2 focus:outline-none focus:ring-1 focus:ring-orange`}
              name={input.name}
              value={profileData[input.name]}
              placeholder={input.placeholder}
              pattern={input.pattern}
              required
              onBlur={handleFocus}
              focused={focused.toString()}
              disabled={input.name === "email" ? true : disable}
              onChange={handleChange}
            />
            <span className="inp-error hidden text-base p-1 text-[#ff0000]">
              {input.errorMessage}
            </span>
          </div>
        ))}
      </div>
      <div className="flex gap-10">
        <button
          onClick={handleUpdate}
          disabled={disable}
          className="text-white bg-orange text-xl font-bold px-6 py-2 rounded-lg"
        >
          Save
        </button>
        <button
          onClick={() => setDisable(true)}
          className={`${
            disable ? "hidden" : ""
          } text-xl font-semibold text-orange`}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserInfo;
