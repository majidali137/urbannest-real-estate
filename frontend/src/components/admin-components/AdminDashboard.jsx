import React, { useContext, useEffect, useState } from "react";
import { FaBuildingColumns, FaUserLarge } from "react-icons/fa6";
import { MdBedroomParent } from "react-icons/md";
import { MdSell } from "react-icons/md";
import {
  BsFillArchiveFill,
  BsFillGrid3X3GapFill,
  BsPeopleFill,
  BsFillBellFill,
} from "react-icons/bs";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import useFetch from "../../useFetch";
import axios from "axios";

const chart = [
  {
    name: "Page A",
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Page B",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Page C",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Page D",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Page E",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: "Page F",
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: "Page G",
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];

const filterPropertiesByPurpose = (properties, purpose) => {
  return properties.filter((property) => property.purpose === purpose);
};

const AdminDashboard = () => {
  const { data, loading, error } = useFetch(`/get-all-users`);
  const [listings, setListings] = useState([]);
  const [rental, setRental] = useState([]);
  const [selling, setSelling] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      const { data } = await axios.get(`/explore`);
      if (data.error) {
        toast.error(data.error);
      }
      setListings(data);
      const rentProperties = filterPropertiesByPurpose(data, "rent");
      const sellProperties = filterPropertiesByPurpose(data, "sell");
      setRental(rentProperties);
      setSelling(sellProperties);
    };
    fetchListings();
  }, []);

  return (
    <div className="sm:p-5 p-1 w-full max-h-screen overflow-y-auto">
      <h1 className="text-white font-bold text-2xl">Dashboard</h1>
      <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-5 py-15 text-white px-6 py-3">
        <div className="flex flex-col justify-around py-3 px-6 rounded-md bg-gray-600">
          <div className="flex items-center justify-between gap-10">
            <h3 className="font-bold text-lg text-center">PROPERTIES</h3>
            <FaBuildingColumns className="text-5xl opacity-30" />
          </div>
          <h1>{listings?.length ?? "--"}</h1>
        </div>
        <div className="flex flex-col justify-around py-3 px-6 rounded-md bg-gray-600">
          <div className="flex items-center justify-between gap-10">
            <h3 className="font-bold text-lg text-center">Users</h3>
            <FaUserLarge className="text-5xl opacity-30" />
          </div>
          <h1>{data?.length ?? "--"}</h1>
        </div>

        <div className="flex flex-col justify-around py-3 px-6 rounded-md bg-gray-600">
          <div className="flex items-center justify-between gap-10">
            <h3 className="font-bold text-lg text-center">Rent</h3>
            <MdBedroomParent className="text-5xl opacity-30" />
          </div>
          <h1>{rental?.length ?? "--"}</h1>
        </div>

        <div className="flex flex-col justify-around py-3 px-6 rounded-md bg-gray-600">
          <div className="flex items-center justify-between gap-10">
            <h3 className="font-bold text-lg text-center">Sell</h3>
            <MdSell className="text-5xl opacity-30" />
          </div>
          <h1>{selling?.length ?? "--"}</h1>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-20 mt-10 h-300">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={chart}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pv" fill="#8884d8" />
              <Bar dataKey="uv" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              width={500}
              height={300}
              data={chart}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pv"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
