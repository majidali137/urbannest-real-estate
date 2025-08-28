import googleIcon from "../assets/googleIcon.svg";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../../context/userContext";
import { useContext } from "react";

const Oauth = () => {
  const navigate = useNavigate();

  const { loading, setLoading } = useContext(UserContext);

  const handleGoogleClick = async () => {
    try {
      setLoading(true);
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);

      console.log(result.user);

      const { data } = await axios.post("/auth/google", {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        toast.success("Successfully signed up with google");
        navigate("/");
        setLoading(false);
        location.reload(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleGoogleClick}
      className="flex items-center justify-center gap-2 text-white rounded-lg text-lg font-bold"
    >
      <img
        src={googleIcon}
        alt="Google icon"
        className="bg-white rounded-full w-7"
      />
    </button>
  );
};

export default Oauth;
