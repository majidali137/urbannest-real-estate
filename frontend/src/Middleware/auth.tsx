import { Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { UserContext } from "../../context/userContext";
import { getToken } from "./cookies";
import axios from "axios";

interface Role {
  name: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  roles?: Role[];
  [key: string]: unknown;
}

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectRoute = ({ children }: ProtectedRouteProps) => {
  const { user } = useContext(UserContext)!;
  const token = getToken();

  if (user || token) {
    return <Navigate to={"/"} replace />;
  }
  return <>{children}</>;
};

export const ProfileProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = getToken();
  const { user } = useContext(UserContext)!;

  if (!user && !token) {
    return <Navigate to={"/login"} replace />;
  }
  return <>{children}</>;
};

export const AdminProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const token = getToken();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get<User>("/profile");
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
    return <Navigate to={"/login"} replace />;
  }

  return <>{children}</>;
};
