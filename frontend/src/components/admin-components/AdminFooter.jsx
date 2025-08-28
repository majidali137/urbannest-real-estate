import { FaFacebook, FaInstagram, FaLinkedin, FaTwitter } from "react-icons/fa";

const AdminFooter = () => {
  return (
    <div className="bg-black mb-0 mt-20 w-full px-20 py-10 max-sm:px-8 max-sm:py-6">
      <div className="text-white text-sm pt-8 flex justify-between items-center max-sm:flex-col-reverse gap-4">
        <p className=" text-light-gray">
          © 2022 Urbannest. All rights reserved
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

export default AdminFooter;
