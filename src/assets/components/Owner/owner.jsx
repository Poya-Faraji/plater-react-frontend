// In Owner.jsx
import { useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Chip,
  Avatar,
  IconButton,
} from "@material-tailwind/react";
import {
  TruckIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import Vehicles from "../dashboard/vehicle";

const Owner = ({ userData }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (userData?.id) {
      localStorage.setItem("ownerID", userData.id);
    }
  }, [userData]);

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Typography variant="h4" color="blue-gray">
              داشبورد مالک
            </Typography>
            <Typography variant="small" color="gray">
              {userData.fname} {userData.lname}
            </Typography>
          </div>

          <IconButton
            variant="text"
            color="red"
            className="rounded-full"
            onClick={logoutHandler}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
          </IconButton>
        </div>

        {/* User Info Card */}
        <Card className="mb-6">
          <CardBody className="p-4">
            <div className="flex items-center">
              <Avatar
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${userData.fname} ${userData.lname}`}
                alt="user-avatar"
                size="lg"
                className="border border-blue-gray-200"
              />
              <div className="mr-3">
                <Typography variant="h6">
                  {userData.fname} {userData.lname}
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  کد ملی: {userData.codeMeli}
                </Typography>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold"
                >
                  نام کاربری
                </Typography>
                <Typography>{userData.username}</Typography>
              </div>

              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-bold"
                >
                  نقش
                </Typography>
                <Typography>مالک وسیله نقلیه</Typography>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center mb-6 gap-4">
          <Button
            color="red"
            className="flex items-center gap-2"
            onClick={logoutHandler}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            خروج
          </Button>

          <Link to="/dashboard/add-vehicle">
            <Button color="blue" className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              افزودن وسیله نقلیه
            </Button>
          </Link>
        </div>

        {/* Vehicles Section */}
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center mb-4">
              <TruckIcon className="h-6 w-6 text-blue-500 mr-2" />
              <Typography variant="h5" color="blue-gray">
                وسایل نقلیه
              </Typography>
              {userData.vehicles?.length > 0 && (
                <Chip
                  value={`${userData.vehicles.length} مورد`}
                  color="blue"
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                />
              )}
            </div>

            {!userData.vehicles || userData.vehicles.length === 0 ? (
              // Empty Vehicles State
              <div className="text-center py-8">
                <TruckIcon className="h-16 w-16 mx-auto text-gray-400" />
                <Typography color="gray" className="mt-4">
                  هنوز وسیله نقلیه‌ای ثبت نکرده‌اید
                </Typography>
                <Link to="/dashboard/add-vehicle">
                  <Button color="blue" className="mt-4">
                    افزودن اولین وسیله نقلیه
                  </Button>
                </Link>
              </div>
            ) : (
              // Use your Vehicles component here
              <Vehicles vehicles={userData.vehicles} />
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Owner;