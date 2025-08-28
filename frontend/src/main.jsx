import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { UserContextProvider } from "../context/userContext.jsx";
import { ProfileContextProvider } from "../context/profileContext.jsx";
import App from "./App.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <ProfileContextProvider>
        <App />
      </ProfileContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
