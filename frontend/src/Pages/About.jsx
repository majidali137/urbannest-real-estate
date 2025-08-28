import lavaBuilding from "../assets/Images/aboutUsImages/orangeLavaBuilding.jpg";
import skyscrapersTopView from "../assets/Images/aboutUsImages/skyscrapersTopView.jpg";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="mb-0">
      <div className="text-white md:px-16 px-10 py-40 md:pt-40 pt-10 pb-64">
        <h1 className="text-7xl font-semibold">About Us</h1>
        <h3 className="text-3xl font-semibold max-w-5xl mt-8">
          We are passionate about connecting you with your dream property,{" "}
          <span className="text-neutral-600">
            making every step of your real estate journey seamless and impactful
          </span>
        </h3>
      </div>
      <div className="bg-white text-black sm:px-10 px-5 pb-20 flex flex-col justify-center items-center mb-0">
        <div className="flex justify-center w-full">
          <motion.img
            whileInView={{ opacity: 1, y: -40 }}
            initial={{ opacity: 0, x: 0 }}
            viewport={{ once: true }}
            src={lavaBuilding}
            alt={lavaBuilding}
            className="md:w-3/4 w-5/6 h-[30rem] object-cover relative -top-20 rounded-[3rem]"
          />
        </div>
        <div className="md:px-32 px-0">
          <motion.h1
            whileInView={{
              opacity: 1,
              y: -40,
              transition: { delay: 0.3, duration: 0.4 },
            }}
            initial={{ opacity: 0, x: 0 }}
            viewport={{ once: true }}
            className="text-6xl font-semibold"
          >
            Our Vision
          </motion.h1>
          <motion.h4
            whileInView={{
              opacity: 1,
              y: -40,
              transition: { delay: 0.3, duration: 0.4 },
            }}
            initial={{ opacity: 0, x: 0 }}
            viewport={{ once: true }}
            className="text-xl mt-5 md:leading-8"
          >
            At Urbannest, our vision is to transform the real estate experience
            by creating a platform where finding, buying, and selling properties
            is effortless, transparent, and enjoyable for everyone. We strive to
            become the most trusted and innovative real estate marketplace,
            setting new standards for excellence in the industry.
          </motion.h4>
        </div>
        <div className="lg:w-[84%] bg-gray text-white lg:px-20 sm:px-10 px-6 py-20  mt-10 rounded-[2.5rem] flex xl:flex-row xl:items-start items-center flex-col gap-10">
          <div className="flex flex-col lg:gap-10 gap-5 w-full">
            <motion.h1
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.3, duration: 0.4 },
              }}
              initial={{ opacity: 0, y: 50 }}
              viewport={{ once: true }}
              className="text-6xl font-semibold"
            >
              Our Mission
            </motion.h1>
            <motion.h4
              whileInView={{
                opacity: 1,
                y: 0,
                transition: { delay: 0.3, duration: 0.4 },
              }}
              initial={{ opacity: 0, y: 50 }}
              viewport={{ once: true }}
              className="text-xl lg:mt-5  md:leading-8"
            >
              At Urbannest, our vision is to transform the real estate
              experience by creating a platform where finding, buying, and
              selling properties is effortless, transparent, and enjoyable for
              everyone. We strive to become the most trusted and innovative real
              estate marketplace, setting new standards for excellence in the
              industry.
            </motion.h4>
            <Link to={"/explore"}>
              <motion.button
                whileInView={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 },
                }}
                initial={{ opacity: 0, y: 50 }}
                viewport={{ once: true }}
                className="px-6 py-3 rounded-xl border border-orange text-orange hover:bg-orange hover:text-white hover:border-orange transition-all duration-300 text-xl"
              >
                Explore Properties
              </motion.button>
            </Link>
          </div>
          <img
            src={skyscrapersTopView}
            alt={skyscrapersTopView}
            className="w-[26rem] h-[26rem] object-fill rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default About;
