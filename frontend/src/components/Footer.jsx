import { useLocation } from "react-router-dom";
import logo from "../assets/Images/urbannestNavbar.png";
import logo2 from "../assets/Images/urbannestIcon.png";
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const Footer = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear();

  // Check if the current path is '/profile'
  if (location.pathname === "/profile") {
    return null; // Don't render the Footer
  }
  if (location.pathname === "/login") {
    return null; // Don't render the Footer
  }
  if (location.pathname === "/register") {
    return null; // Don't render the Footer
  }
  if (location.pathname === "/forgot-password") {
    return null; // Don't render the Footer
  }
  return (
    <div className="bg-black mb-0 w-full px-20 py-10 max-sm:px-8 max-sm:py-6">
      <div className="flex justify-between items-center border-b border-gray pb-5">
        <img src={logo} className=" w-48 max-sm:hidden" alt="urbannest-logo" />
        <img
          src={logo2}
          className="w-10 max-sm:block hidden"
          alt="urbannest-logo"
        />
        <div className="text-white flex max-sm:flex-col">
          <Link className="border-r-orange  px-5" to={"/"}>
            Home
          </Link>
          <Link className="border-r-orange  px-5" to={"/about"}>
            About us
          </Link>
          <Link className="border-r-orange  px-5" to={"/contact"}>
            Contact
          </Link>
        </div>
      </div>
      <div className="text-white text-sm pt-8 flex justify-between items-center max-sm:flex-col-reverse gap-4">
        <p className=" text-light-gray">
          © {currentYear} Urbannest. All rights reserved
        </p>
        <div className="text-white flex gap-5 text-lg">
          <FaFacebook className="hover:text-orange cursor-pointer" />
          <FaInstagram className="hover:text-orange cursor-pointer" />
          <FaTwitter className="hover:text-orange cursor-pointer" />
          <FaLinkedin className="hover:text-orange cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Footer;
