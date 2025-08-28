const SkeletonCard = ({ number = 1 }) => {
  const cardsArray = Array(number)
    .fill()
    .map((_, index) => index + 1);

  return (
    <div
      className={`grid py-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] max-sm:flex flex-col w-full gap-2`}
    >
      {cardsArray.map((_, index) => (
        <div
          key={index}
          className={`bg-gray relative rounded-lg overflow-hidden w-full pb-3`}
        >
          <div className="bg-gray z-50">
            <div className="relative">
              <div
                className={`h-[220px] bg-[#3d3d3d] skeleton w-full object-cover transition-scale duration-300 skeleton`}
              />
            </div>
            <div className="p-5 box-border flex flex-col gap-4">
              <div className={`skeleton w-full rounded-md h-5 skeleton`} />
              <div className={`skeleton w-full rounded-md h-5 skeleton`} />
              <div className={`skeleton w-full rounded-md h-5 skeleton`} />
              <div className={`skeleton w-full rounded-md h-5 skeleton`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCard;
