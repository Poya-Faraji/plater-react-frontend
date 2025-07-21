import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import 'react-toastify/dist/ReactToastify.css';

import App from "./App.jsx";
import { ThemeProvider } from "@material-tailwind/react";
import NotFoundPage from "./assets/components/NotFoundPage/notFound.jsx";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignUp from "./assets/components/SignUp/signup.jsx";
import Login from "./assets/components/Login/login.jsx";
import Dashboard from "./assets/components/dashboard/userDashboard.jsx";
import AddVehicle from "./assets/components/AddVehicle/addVehicle.jsx";
import VehcleDetail from "./assets/components/dashboard/VehcleDetails.jsx";
import AddTicket from "./assets/components/AddTicket/addTickets.jsx";
import TicketDetail from "./assets/components/TicketDetail/ticketDetail.jsx";


const router = createBrowserRouter([
  { path: "/", element: <App /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <SignUp /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/dashboard/add-vehicle", element: <AddVehicle /> },
  { path: "/dashboard/add-ticket", element: <AddTicket /> },
  { path: "/dashboard/vehicle/:vehicleId", element: <VehcleDetail /> },
  { path: "/dashboard/tickets/:ticketId", element: <TicketDetail /> },
  { path: "*", element: <NotFoundPage /> },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </RouterProvider>
);
