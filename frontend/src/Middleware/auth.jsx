import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/userContext";
import { getToken } from "./cookies";
import axios from "axios";

export const ProtectRoute = ({ children }) => {
  const { user } = useContext(UserContext);
  const token = getToken();

  if (user || token) {
    return <Navigate to={"/"} replace={true}></Navigate>;
  }
  return children;
};

export const ProfileProtectedRoute = ({ children }) => {
  const token = getToken();
  const { user } = useContext(UserContext);
  if (!user && !token) {
    return <Navigate to={"/login"} replace={true}></Navigate>;
  }
  return children;
};

export const AdminProtectedRoute = ({ children }) => {
  const token = getToken();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get("/profile");
        if (data) {
          setUser(data);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [token]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user?.roles?.[0]?.name !== "admin") {
    return <Navigate to={"/login"} replace={true} />;
  }

  return children;
};
