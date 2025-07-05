import { useEffect, useState } from "react";
import { verifyToken } from "../../services/verifyToken";
import { Link, useNavigate } from "react-router-dom";
import { getUserInfo } from "../../services/getUserInfo";
import Vehicles from "./vehicle";
import { Button } from "@material-tailwind/react";
export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

  const logoutHandler = () => {
    localStorage.clear();
  };

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await verifyToken();
      if (!isAuthenticated) {
        navigate("/login", { replace: true });
      }
    };

    getUserInfo().then((data) => setUserData(data));

    checkAuth();
  }, [navigate]);

  if (userData.userType === "OWNER") {
    if (!userData.vehicles || userData.vehicles.length === 0) {
      return (
        <div>
          <Link onClick={()=> localStorage.setItem("ownerID", userData.id)} to={"/dashboard/add-vehicle"}>
            <Button>Add Vehicle</Button>
          </Link>

          <h1>Welcome to dashboard OWNER</h1>
          <p>Username: {userData.username}</p>
          <p>First Name: {userData.fname}</p>
          <p>Last Name: {userData.lname}</p>
          <p>National Code: {userData.codeMeli}</p>
          <p>Usertype: {userData.userType}</p>

          <Link onClick={logoutHandler} to={"/login"}>
            <Button className="bg-red-600">Logout</Button>
          </Link>
        </div>
      );
    }
    return (
      <div>
        <h1>Welcome to dashboard OWNER</h1>
        <p>Username: {userData.username}</p>
        <p>First Name: {userData.fname}</p>
        <p>Last Name: {userData.lname}</p>
        <p>National Code: {userData.codeMeli}</p>
        <p>Usertype: {userData.userType}</p>
        <Vehicles vehicles={userData.vehicles} ownerID={userData.id}/>
        <div className="flex gap-4 justify-center mt-3">
          <Link onClick={logoutHandler} to={"/login"}>
            <Button className="bg-red-600">Logout</Button>
          </Link>
          <Link onClick={()=> localStorage.setItem("ownerID", userData.id)} to={"/dashboard/add-vehicle"}>
            <Button>Add Vehicle</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>OFFICER</h1>
      <p>Username: {userData.username}</p>
      <p>First Name: {userData.fname}</p>
      <p>Last Name: {userData.lname}</p>
      <p>National Code: {userData.codeMeli}</p>
      <p>Usertype: {userData.userType}</p>
      <Link onClick={logoutHandler} to={"/login"}>
        <Button className="bg-red-600">Logout</Button>
      </Link>
    </div>
  );
}
