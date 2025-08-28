import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { GoDot } from "react-icons/go";
import { GoDotFill } from "react-icons/go";

const ImageSlider = ({ imageUrls }) => {
  const [imageIndex, setImageIndex] = useState(0);

  const showPrevImage = () => {
    setImageIndex((index) => {
      if (index === 0) {
        return imageUrls.length - 1;
      }
      return index - 1;
    });
  };
  const showNextImage = () => {
    setImageIndex((index) => {
      if (index === imageUrls.length - 1) {
        return 0;
      }
      return index + 1;
    });
  };

  return (
    <div className="w-full h-full relative">
      <div className="flex w-full h-full overflow-hidden">
        {imageUrls?.length > 0
          ? imageUrls.map((image) => (
              <img
                src={image}
                key={image}
                alt="Property Image"
                style={{ translate: `${-100 * imageIndex}%` }}
                className="object-cover w-full h-full block aspect-[10/6] flex-shrink-0 flex-grow-0 transition-all duration-300"
              />
            ))
          : "Loading..."}
      </div>

      <button
        onClick={showPrevImage}
        className="absolute block top-0 bottom-0 p-4 z-40 text-white text-3xl hover:bg-black hover:bg-opacity-20 transition-all duration-300 left-0"
      >
        <IoIosArrowBack />
      </button>
      <button
        onClick={showNextImage}
        className="absolute block top-0 bottom-0 p-4 z-40 text-white text-3xl hover:bg-black hover:bg-opacity-20 transition-all duration-300 bg-opacity-10 right-0"
      >
        <IoIosArrowForward />
      </button>
      <div className="absolute flex bottom-2 left-1/2 -translate-x-1/2">
        {imageUrls?.length > 0 &&
          imageUrls.map((_, index) => (
            <button
              onClick={() => setImageIndex(index)}
              key={index}
              className="hover:scale-125 transition-all duration-200"
            >
              {index === imageIndex ? (
                <GoDotFill size={20} />
              ) : (
                <GoDot size={20} />
              )}
            </button>
          ))}
      </div>
    </div>
  );
};

export default ImageSlider;
