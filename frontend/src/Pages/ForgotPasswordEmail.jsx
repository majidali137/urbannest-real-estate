import { useState } from "react";
import FormInput from "../components/FormInput";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import forgetPassword from "../assets/Images/forgotPassword.jpg";
import logo from "../assets/Images/urbannestIcon.png";

const ForgotPasswordEmail = () => {
  const [otpData, setOtpData] = useState({
    email: "",
    otp: "",
    password: "",
  });
  const navigate = useNavigate();

  const [toOtp, setToOtp] = useState(false);
  const [toReset, setToReset] = useState(false);

  const emailInput = {
    name: "email",
    type: "email",
    errorMessage: "Enter a valid email",
    placeholder: "Email",
    required: true,
  };

  const otpInput = {
    name: "otp",
    type: "otp",
    errorMessage: "Enter a 6 digit otp",
    placeholder: "OTP",
    pattern: "^[0-9]{6}$",
    required: true,
  };
  const passwordInput = {
    name: "password",
    type: "password",
    errorMessage:
      "Password should be 8 to 26 characters and should include atlease a number, a letter and a special character",
    placeholder: "Reset Password",
    pattern:
      "^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,26}$",
    required: true,
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setOtpData(() => ({ ...otpData, [e.target.name]: value }));
  };

  const emailSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.get("/forgot-password", {
        params: { email: otpData.email },
      });

      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setToOtp(true);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const otpSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.get(`/forgot-password/otp`, {
        params: { email: otpData.email, otp: otpData.otp },
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success("OTP matched");
        setToReset(true);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const resetPass = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post("/resetPassword", {
        email: otpData.email,
        password: otpData.password,
      });
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(data.message);
        setToOtp(false);
        setToReset(false);
        navigate("/login");
      }
    } catch (error) {
      console.log("Error while resetting ", error);
    }
  };

  return (
    <div className="pages flex items-center justify-between mx-auto max-w-5xl mt-10">
      <div className="flex items-center justify-between rounded-xl overflow-hidden border md:py-0 py-5 px-0 md:p-0 border-gray-600">
        <div className="md:flex hidden items-center justify-center w-1/2 overflow-hidden py-0">
          <img src={forgetPassword} alt="" className="w-full object-contain" />
        </div>
        <div className="bg-darkgray rounded-xl flex justify-center items-center w-1/2 flex-1">
          <form
            onSubmit={(e) =>
              `${
                toOtp && !toReset
                  ? otpSubmit(e)
                  : toReset
                  ? resetPass(e)
                  : emailSubmit(e)
              }`
            }
            className="flex flex-col justify-center items-center w-[350px] p-5 gap-4"
          >
            <h1 className="flex gap-5 mb-5 justify-center items-center font-bold text-3xl text-white">
              <span>
                <img src={logo} alt="" className="w-10" />
              </span>
              {toReset ? "Enter a new Password" : "Reset Password"}
            </h1>
            <div className="w-full">
              {toOtp && !toReset ? (
                <FormInput
                  {...otpInput}
                  value={otpData[otpInput.name]}
                  handleChange={handleChange}
                />
              ) : toReset ? (
                <FormInput
                  {...passwordInput}
                  value={otpData[passwordInput.name]}
                  handleChange={handleChange}
                />
              ) : (
                <FormInput
                  {...emailInput}
                  value={otpData[emailInput.name]}
                  handleChange={handleChange}
                />
              )}
            </div>
            <div className=" flex justify-center items-center w-full mt-3 text-white">
              <button
                type="submit"
                className="reg-signin-btn justify-center bg-transparent border border-orange"
              >
                {toReset ? "Reset" : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordEmail;
// <div className="pages w-full flex justify-center items-center mt-24">
//     <div className="login-signup-shadow bg-darkgray px-16 max-sm:px-5 rounded-md py-16 flex justify-center items-center">
//         <form onSubmit={(e) => `${toOtp && !toReset ? otpSubmit(e) : toReset ? resetPass(e) : emailSubmit(e)}`}  className="flex flex-col justify-center items-center">
//             <h1 className=" flex mb-5 justify-center items-center font-bold text-3xl text-white">
//             {toReset ? 'Enter a new Password' :'Forgot Password'}
//             </h1>

//             <button type="submit" className="reg-signin-btn">{toOtp && !toReset ? 'Enter Otp' : toReset ? 'Reset Password' : 'Enter email'}</button>
//         </form>
//     </div>
// </div>
