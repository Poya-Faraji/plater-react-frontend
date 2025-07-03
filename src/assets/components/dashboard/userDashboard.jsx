import { useEffect, useState } from "react";
import { verifyToken } from "../../services/verifyToken";
import { useNavigate } from "react-router-dom";
import { getUserInfo } from "../../services/getUserInfo";
export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});

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
    return (
      <div>
        <h1>Welcome to dashboard OWNER</h1>
        <p>Username: {userData.username}</p>
        <p>First Name: {userData.fname}</p>
        <p>Last Name: {userData.lname}</p>
        <p>National Code: {userData.codeMeli}</p>
        <p>Usertype: {userData.userType}</p>
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
    </div>
  );
}
