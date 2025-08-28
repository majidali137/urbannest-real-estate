const Loader = ({ width }) => {
  return <div className={`loader ${width ? width : "w-[50px]"}`}></div>;
};

export default Loader;
