import logoIcon from "../../../assets/Images/urbannestIcon.png";

const EmptyChat = () => {
  return (
    <div className="flex flex-col items-center gap-5 px-4">
      <img src={logoIcon} alt="" className="w-20 opacity-25" />
      <div className="text-sm flex items-center flex-col text-center">
        <p>
          Effortlessly connect with potential buyers or sellers and unlock the
          door to your
        </p>
        <p>
          dream property with seamless messaging on our real estate chat app
        </p>
      </div>
    </div>
  );
};

export default EmptyChat;
