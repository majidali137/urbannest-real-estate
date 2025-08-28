import {
  Route,
  RouterProvider,
  Routes,
  createBrowserRouter,
} from "react-router-dom";
import "./App.css";
import Layout from "./Layout";
import Home from "./Pages/Home";
import About from "./Pages/About";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import ContactUs from "./Pages/ContactUs";
import axios from "axios";
import Profile from "./Pages/Profile";
import ForgotPasswordEmail from "./Pages/ForgotPasswordEmail";
import {
  AdminProtectedRoute,
  ProfileProtectedRoute,
  ProtectRoute,
} from "./Middleware/auth";
import PageNotFound from "./Pages/PageNotFound";
import UserInfo from "./components/profile-components/UserInfo";
import Favourites from "./components/profile-components/Favourites";
import Notifications from "./components/profile-components/Notifications";
import Dashboard from "./components/profile-components/Dashboard";
import AddListing from "./components/profile-components/AddListing";
import { Toaster } from "react-hot-toast";
import ManageListings from "./components/profile-components/ManageListings";
import UpdateListing from "./components/profile-components/UpdateListing";
import Explore from "./Pages/Explore";
import Listing from "./Pages/Listing";
import Admin from "./Pages/Admin";
import AdminDashboard from "./components/admin-components/AdminDashboard";
import ManageUsers from "./components/admin-components/ManageUsers";
import AdminListings from "./components/admin-components/AdminListings";

axios.defaults.baseURL = "http://localhost:8000/";
axios.defaults.withCredentials = true;

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/about",
          element: <About />,
        },
        {
          path: "/contact",
          element: <ContactUs />,
        },
        {
          path: "/register",
          element: (
            <ProtectRoute>
              <Register />
            </ProtectRoute>
          ),
        },
        {
          path: "/login",
          element: (
            <ProtectRoute>
              <Login />
            </ProtectRoute>
          ),
        },
        {
          path: "/explore",
          element: <Explore />,
        },
        {
          path: "/forgot-password",
          element: (
            <ProtectRoute>
              <ForgotPasswordEmail />
            </ProtectRoute>
          ),
        },
        {
          path: "*",
          element: <PageNotFound />,
        },
        {
          path: "/listing/:id",
          element: <Listing />,
        },
      ],
    },
    {
      path: "/admin-dashboard",
      element: (
        <AdminProtectedRoute>
          <Admin />
        </AdminProtectedRoute>
      ),
      children: [
        {
          path: "/admin-dashboard",
          element: <AdminDashboard />,
        },
        {
          path: "/admin-dashboard/listing",
          element: <AdminListings />,
        },
        {
          path: "/admin-dashboard/users",
          element: <ManageUsers />,
        },
      ],
    },
    {
      path: "/profile",
      element: (
        <ProfileProtectedRoute>
          <Profile />
        </ProfileProtectedRoute>
      ),
      children: [
        {
          path: "/profile",
          element: (
            <ProfileProtectedRoute>
              <UserInfo />
            </ProfileProtectedRoute>
          ),
        },
        {
          path: "/profile/dashboard",
          element: (
            <ProfileProtectedRoute>
              <Dashboard />
            </ProfileProtectedRoute>
          ),
        },
        {
          path: "/profile/add-listing",
          element: (
            <ProfileProtectedRoute>
              <AddListing />
            </ProfileProtectedRoute>
          ),
        },
        {
          path: "/profile/manage-listings",
          element: (
            <ProfileProtectedRoute>
              <ManageListings />
            </ProfileProtectedRoute>
          ),
        },
        {
          path: "/profile/favourites",
          element: (
            <ProfileProtectedRoute>
              <Favourites />
            </ProfileProtectedRoute>
          ),
        },
        {
          path: "/profile/notifications",
          element: (
            <ProfileProtectedRoute>
              <Notifications />
            </ProfileProtectedRoute>
          ),
        },
        {
          path: "/profile/update-listing/:listingId",
          element: (
            <ProfileProtectedRoute>
              <UpdateListing />
            </ProfileProtectedRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <main className="h-full">
      <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
      <RouterProvider router={router} />
    </main>
  );
}

export default App;
