import { useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import FormInput from "../components/FormInput";
import Oauth from "../components/Oauth";
import illustration from "../assets/Images/illustration.jpeg";
import logo from "../assets/Images/urbannestIcon.png";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, loading, setLoading } = useContext(UserContext);

  const [userLoginData, setUserLoginData] = useState({
    email: "",
    password: "",
  });
  const inputs = [
    {
      id: 1,
      name: "email",
      type: "email",
      errorMessage: "Enter a valid email",
      placeholder: "Email",
      required: true,
    },
    {
      id: 2,
      name: "password",
      type: "password",
      errorMessage: "Password required",
      placeholder: "Password",
      required: true,
    },
  ];

  const handleChange = (event) => {
    const value = event.target.value;

    setUserLoginData((prev) => ({ ...prev, [event.target.name]: value }));
  };

  const LoginHandler = async (e) => {
    e.preventDefault();
    const { email, password } = userLoginData;

    try {
      setLoading(true);
      const { data } = await axios.post("/login", {
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setUserLoginData({});
        setUser(data);
        navigate("/");
        toast.success("Logged in successfuly");
        setLoading(false);
        // location.reload(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pages flex items-center justify-between mx-auto max-w-5xl mt-10">
      <div className="flex items-center justify-between rounded-xl overflow-hidden border md:py-0 py-5 px-0 md:p-0 border-gray-600">
        <div className="md:flex hidden items-center justify-center w-1/2 overflow-hidden py-0">
          <img src={illustration} alt="" className="w-full object-contain" />
        </div>
        <div className="bg-darkgray rounded-xl flex justify-center items-center w-1/2 flex-1">
          <form
            onSubmit={LoginHandler}
            className="flex flex-col justify-center items-center w-[350px] p-5 gap-4"
          >
            <h1 className="flex gap-5 mb-5 justify-center items-center font-bold text-3xl text-white">
              <span>
                <img src={logo} alt="" className="w-10" />
              </span>
              Login
            </h1>
            <div className="w-full">
              {inputs.map((input) => (
                <FormInput
                  key={input.id}
                  {...input}
                  value={userLoginData[input.name]}
                  handleChange={handleChange}
                />
              ))}
            </div>
            <div className=" flex justify-between items-center w-full mt-8 text-white">
              <Link
                to="/forgot-password"
                className="text-orange text-sm flex items-center"
              >
                Forgot Password
              </Link>
              <button
                type="submit"
                className="reg-signin-btn bg-transparent border border-orange"
              >
                Log In
              </button>
            </div>
            <div className="flex w-full justify-center items-center">
              <Oauth />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
