import propertySolution from "../assets/icons/propertySolutionIcon.svg";
import searchFilter from "../assets/icons/searchFilterIcon.svg";
import messageIcon from "../assets/icons/messageIcon.svg";
import roundArrow from "../assets/icons/roundArrow.svg";
import heroImg from "../assets/Images/LandingPageImages/heroSectionImg.png";
import skyscrapers from "../assets/Images/LandingPageImages/skyscrapers.jpg";
import { Link } from "react-router-dom";
import { Heading, MoveRight, Search } from "lucide-react";
import FeatureCards from "../components/Home-page-components/FeatureCards";
import { getToken } from "../Middleware/cookies";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, useAnimation } from "framer-motion";
import useFetch from "../useFetch";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import SkeletonCard from "../components/SkeletonCard";

const Home = () => {
  return (
    <div className="py-10 px-5 lg:px-10">
      <Hero />
      <Features />
      <RecentListings purpose={"sell"} />
      <Hero2 />
      <RecentListings purpose={"rent"} />
    </div>
  );
};

const Hero = () => {
  return (
    <section className="relative pb-8 xl:px-44 md:px-14 sm:px-8 px-2">
      <div className="flex xl:justify-between justify-center items-center flex-col lg:flex-row gap-10 mt-8 xl:mt-0 max-w-7xl">
        <div className="text-white flex flex-col justify-center items-start gap-6 ">
          <div className="relative z-10">
            <motion.div
              variants={{
                hidden: { opacity: 0, x: -75 },
                visible: { opacity: 1, x: 0 },
              }}
              initial="hidden"
              animate="visible"
              transition={{ duration: 0.3, delay: 0.5 }}
              className="bg-orange w-20 h-20 rounded-full absolute right-[28%] top-[-30px] -z-10"
            />
            <motion.h1
              variants={{
                hidden: { opacity: 0, x: -75 },
                visible: { opacity: 1, x: 0 },
              }}
              initial="hidden"
              animate="visible"
              className="font-semibold lg:text-[3.8rem] md:text-[3.2rem] sm:leading-[4rem] leading-[3rem] text-[2.8rem]"
            >
              Find your <br />{" "}
              <span className="text-orange">perfect Home,</span> <br /> hassle
              free
            </motion.h1>
          </div>
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -75 },
              visible: { opacity: 1, x: 0 },
            }}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            className="flex flex-col text-sm text-neutral-600"
          >
            <span>
              Welcome to Urbannest! Your gateway to the perfect property.
            </span>
            <span>
              Whether buying, selling, or renting, we streamline the process,
            </span>
            <span>
              empowering you with the tools to make informed decisions.
            </span>
          </motion.div>
          <ExploreBtn />
        </div>
        <div className="flex items-center justify-center fade-in">
          <div className="sm:w-[30rem] sm:h-[35rem] w-[20rem] h-[25rem] overflow-hidden rounded-t-[15rem] ">
            <img src={heroImg} alt="" className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
};

const ExploreBtn = () => {
  return (
    <Link to={"/explore"}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 60 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        className="w-40 px-5 py-2 bg-white rounded-lg overflow-hidden relative group z-0 cursor-pointer"
      >
        <div class="circle absolute h-[5em] w-[5em] -top-[2.5em] -right-[2.5em] rounded-full bg-orange group-hover:scale-[800%] duration-500 z-[-1] op"></div>
        <div className="flex items-center justify-between">
          <h1 class="z-20 font-bold text-black group-hover:text-white duration-500 text-[1.4em]">
            Explore
          </h1>
          <MoveRight className="group-hover:opacity-100 opacity-0 text-white duration-500" />
        </div>
      </motion.div>
    </Link>
  );
};

const Features = () => {
  const features = [
    {
      id: 1,
      heading: "Property Solutions",
      description:
        "Whether you're selling or renting, reach a wide audience with our user-friendly listing process.",
      url: propertySolution,
    },
    {
      id: 2,
      heading: "Advanced Search Filters",
      description:
        "Find your dream property faster with our advanced search filters. Narrow down your options to discover the perfect match for your needs.",
      url: searchFilter,
    },
    {
      id: 3,
      heading: "Secure Messaging System",
      description:
        "Communicate securely and directly with property owners and potential buyers through our integrated messaging system",
      url: messageIcon,
    },
  ];

  const token = getToken();
  const visibleRef = useRef(null);

  const isInView = useInView(visibleRef, { once: true });
  const animateControls = useAnimation();

  useEffect(() => {
    if (isInView) {
      animateControls.start("visible");
    }
  }, [isInView]);

  if (document)
    return (
      <div className="lg:px-20 px-0">
        <motion.div
          ref={visibleRef}
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
          initial="hidden"
          animate={animateControls}
          transition={{ delay: 0.2 }}
          className="relative md:px-20 px-10 max-sm:px-2 py-10 my-20  rounded-2xl border border-white border-opacity-10 bg-gray bg-opacity-75"
        >
          <motion.div
            ref={visibleRef}
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.5 } }}
            initial="hidden"
            animate={animateControls}
            transition={{ delay: 0.5 }}
            className="w-56 h-56 rounded-full bg-orange opacity-50 absolute blur-3xl -z-10"
          />
          <div className="flex flex-col gap-10">
            <div className="flex justify-between items-center px-6">
              <h1 className="text-white font-semibold sm:text-5xl text-3xl">
                Why Chose Us?
              </h1>
              <Link to={token ? "/profile/dashboard" : "register"}>
                <motion.img
                  ref={visibleRef}
                  variants={{
                    hidden: { rotate: 90, opacity: 0 },
                    visible: { rotate: 0, opacity: 1 },
                  }}
                  initial="hidden"
                  animate={animateControls}
                  transition={{ delay: 0.5 }}
                  src={roundArrow}
                  alt=""
                  width={70}
                  height={70}
                  className="cursor-pointer hover:rotate-[55deg] transition-all duration-300 hover:drop-shadow-md shadow-black"
                />
              </Link>
            </div>
            <motion.div
              ref={visibleRef}
              variants={{
                hidden: { opacity: 0, y: 70 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: 0.4, duration: 0.4 }}
              initial="hidden"
              animate={animateControls}
              className="border-white border-opacity-25 w-full grid gap-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] max-[400px]:grid-cols-[repeat(auto-fill,minmax(200px,1fr))]"
            >
              {features.map((feature) => (
                <FeatureCards
                  key={feature.id}
                  heading={feature.heading}
                  description={feature.description}
                  url={feature.url}
                />
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    );
};

const RecentListings = ({ purpose }) => {
  const searchQuerry = `searchTerm=&purpose=${purpose}&sort=created_at&order=desc&limit=4`;
  const { data, loading, error } = useFetch(`/explore?${searchQuerry}`);

  return (
    <div
      className={`${
        data ? "flex" : "hidden"
      } text-white  flex-col py-10 sm:px-20`}
    >
      <h2 className="font-semibold text-xl">
        Recent {purpose === "sell" ? "Selling" : "Rental"} Properties
      </h2>
      {loading && <SkeletonCard number={4} />}
      <div
        className={`${
          loading ? "flex items-center justify-center" : "grid"
        } py-5 grid-cols-[repeat(auto-fill,minmax(300px,1fr))] max-sm:flex flex-col w-full gap-2`}
      >
        {!loading && data?.length === 0 && (
          <p className="text-white text-xl">No listings found</p>
        )}
        {!loading &&
          data?.length > 0 &&
          data.map((listing, i) => (
            <motion.div
              key={listing._id}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0, transition: { delay: i * 0.2 } }}
              viewport={{ once: true }}
            >
              <ListingCard listing={listing} />
            </motion.div>
          ))}
      </div>
      {!loading && data?.length > 0 && (
        <Link
          className="w-full flex justify-center text-orange"
          to={`/explore?searchTerm=&purpose=${purpose}&sort=created_at&order=desc&limit=9`}
        >
          {" "}
          Explore More
        </Link>
      )}
    </div>
  );
};

const Hero2 = () => {
  const title = "Discover the benefits of our".split(" ");

  return (
    <section className="xl:px-44 md:px-14 sm:px-8 px-2 py-10">
      <motion.div className="flex xl:justify-between justify-center items-center flex-col lg:flex-row gap-10 mt-8 xl:mt-0 max-w-7xl">
        <div className="flex items-center justify-center fade-in">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: { duration: 1, delay: 0.5 },
            }}
            viewport={{ once: true }}
            className="sm:w-[30rem] sm:h-[35rem] w-[20rem] h-[25rem] overflow-hidden rounded-t-[15rem] "
          >
            <img
              src={skyscrapers}
              alt=""
              className="w-full h-full rounded-t-full"
            />
          </motion.div>
        </div>
        <div className="text-white flex flex-col justify-center items-start gap-6 ">
          <div>
            <motion.h1 className="font-semibold lg:text-[3.2rem] md:text-[2.8rem] sm:leading-[3rem] leading-[2rem] text-[2.5rem]">
              {title.map((el, i) => (
                <motion.span
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.2,
                      delay: i / 6,
                    },
                  }}
                  viewport={{ once: true }}
                  key={i}
                >
                  {el}{" "}
                </motion.span>
              ))}
              <br />{" "}
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.2,
                    delay: 1,
                  },
                }}
                viewport={{ once: true }}
                className="text-orange"
              >
                Real-estate
              </motion.span>{" "}
              <br />{" "}
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {
                    duration: 0.2,
                    delay: 1.2,
                  },
                }}
                viewport={{ once: true }}
              >
                Services
              </motion.span>
            </motion.h1>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{
              opacity: 1,
              x: 0,
              transition: { duration: 1, delay: 0.3 },
            }}
            viewport={{ once: true }}
          >
            <span>
              Welcome to Urbannest! Your gateway to the perfect property.
            </span>
            <span>
              Whether buying, selling, or renting, we streamline the process,
            </span>
            <span>
              empowering you with the tools to make informed decisions.
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default Home;
