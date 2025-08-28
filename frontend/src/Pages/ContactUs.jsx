import errorPage from "../assets/Images/errorPageIllustration.png";
import cone from "../assets/cone.svg";
import contactUsBg from "../assets/Images/contactUsBg.jpg";
import logoIcon from "../assets/Images/urbannestIcon.png";
import FormInput from "../components/FormInput";
import { useState, useRef } from "react";
import emailjs from "@emailjs/browser";

const Contact = () => {
  const inputs = [
    {
      id: 1,
      name: "name",
      type: "text",
      errorMessage: "Name is required",
      placeholder: "Full Name",
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
      name: "message",
      type: "text",
      errorMessage: "Please enter the message you wanna send us",
      placeholder: "Message",
      required: true,
    },
  ];

  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_ijftl4i", "template_8zxkvuw", form.current, {
        publicKey: "iOw2CFJoRnKHS0tiE",
      })
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error.text);
        }
      );
  };
  const [contactUser, setContactUser] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const value = event.target.value;

    setContactUser((prev) => ({ ...prev, [event.target.name]: value }));
  };

  return (
    <div className="h-screen">
      <img src={contactUsBg} alt="" className="-z-10 w-full absolute top-0 " />
      <div className="h-[90vh] flex items-center justify-center xl:gap-72 lg:gap-28 md:gap-10 gap-8 md:pt-0 pt-28 md:px-10 md:flex-row flex-col">
        <h1 className="text-white font-bold md:text-6xl text-4xl">
          Contact Us
        </h1>
        <form
          ref={form}
          onSubmit={sendEmail}
          className="bg-white sm:px-10 px-4 py-16 flex flex-col gap-12 items-center"
        >
          <img src={logoIcon} alt={logoIcon} className="w-16 h-16" />
          <div>
            {inputs.map((input) => (
              <FormInput
                key={input.id}
                className={
                  "text-gray focus:placeholder-gray border-b-[1px] border-b-gray focus:border-b-gray placeholder-gray md:w-80"
                }
                {...input}
                value={contactUser[input.name]}
                handleChange={handleChange}
              />
            ))}
          </div>
          <div className="w-full flex justify-end">
            <button
              type="submit"
              className="border-gray font-medium border rounded-md px-5 py-2 hover:bg-gray hover:text-white transition-all duration-300"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
