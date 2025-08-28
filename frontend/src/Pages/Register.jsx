import { useState, useContext } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import FormInput from "../components/FormInput";
import Oauth from "../components/Oauth";
import illustration from "../assets/Images/illustration.jpeg";
import logo from "../assets/Images/urbannestIcon.png";

const Signup = () => {
  const navigate = useNavigate();
  const { loading, setLoading } = useContext(UserContext);

  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const inputs = [
    {
      id: 1,
      name: "username",
      type: "text",
      errorMessage:
        "Username should be 3-16 characters and shouldn't include any special characters",
      placeholder: "Username",
      pattern: "^[A-Za-z0-9]{3,16}$",
      required: true,
    },
    {
      id: 2,
      name: "email",
      type: "email",
      errorMessage: "Enter a valid Email",
      placeholder: "Email",
      required: true,
    },
    {
      id: 3,
      name: "password",
      type: "password",
      errorMessage:
        "Password should be 8 to 26 characters and should include a number, a letter and a special character",
      placeholder: "Password",
      pattern:
        "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,26}$",
      required: true,
    },
  ];

  const handleChange = (event) => {
    const value = event.target.value;

    setUser((prev) => ({ ...prev, [event.target.name]: value }));
  };

  const registerUser = async (e) => {
    e.preventDefault();
    const { username, email, password } = user;
    try {
      setLoading(true);
      const { data } = await axios.post("/register", {
        username,
        email,
        password,
      });
      if (data.error) {
        toast.error(data.error);
        setLoading(false);
      } else {
        setUser({});
        toast.success("Registeration successfull");
        setLoading(false);
        navigate("/login");
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
            onSubmit={registerUser}
            className="flex flex-col justify-center items-center w-[350px] p-5 gap-4"
          >
            <h1 className="flex gap-5 mb-5 justify-center items-center font-bold text-3xl text-white">
              <span>
                <img src={logo} alt="" className="w-10" />
              </span>
              Signup
            </h1>
            <div className="w-full">
              {inputs.map((input) => (
                <FormInput
                  key={input.id}
                  {...input}
                  value={user[input.name]}
                  handleChange={handleChange}
                />
              ))}
            </div>
            <div className=" flex justify-between items-center w-full mt-8 text-white">
              <Link
                to="/login"
                className="text-orange text-sm flex items-center"
              >
                Login
              </Link>
              <button type="submit" className="reg-signin-btn">
                Signup
              </button>
            </div>
            <div className="mb-0">
              <Oauth />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
