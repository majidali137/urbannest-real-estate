import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserContextProvider } from "../context/userContext";
import { ProfileContextProvider } from "../context/profileContext";

ReactDOM.createRoot(document.getElementById("root")! as HTMLElement).render(
  <React.StrictMode>
    <UserContextProvider>
      <ProfileContextProvider>
        <App />
      </ProfileContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);
