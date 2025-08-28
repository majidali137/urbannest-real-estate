const FeatureCards = ({ heading, description, url }) => {
  return (
    <div
      className="grid gap-6 bg-darkgray bg-opacity-40 text-white border border-white border-opacity-10 rounded-2xl sm:px-9 px-3 py-7 w-full hover:drop-shadow-xl hover:scale-[103%] transition-all duration-300"
      style={{ gridTemplateColumns: "subgrid" }}
    >
      <img src={url} alt={url} width={50} height={50} className="py-2" />
      <h1 className="text-2xl font-semibold">{heading}</h1>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>
  );
};

export default FeatureCards;
