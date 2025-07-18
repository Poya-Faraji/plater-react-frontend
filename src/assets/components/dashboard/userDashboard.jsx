import { useEffect, useState } from "react";
import { verifyToken } from "../../services/verifyToken";
import { Link, useNavigate } from "react-router-dom";
import { getUserInfo } from "../../services/getUserInfo";
import Officer from "../officer/officer";
import Owner from "../Owner/owner";

export default function Dashboard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await verifyToken();
      if (!isAuthenticated) {
        navigate("/login", { replace: true });
      }
    };

    const fetchUserData = async () => {
      try {
        const data = await getUserInfo();
        setUserData(data);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
    fetchUserData();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  
  if (userData.userType === "OWNER") {
    return <Owner userData={userData} />;
  } 
 
  return <Officer userData={userData} />;
}