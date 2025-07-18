import { useEffect, useState } from "react";
import { getOfficerTickets } from "../../services/getOfficerTickets";
import {
  Card,
  CardBody,
  CardHeader,
  Typography,
  Button,
  Chip,
  List,
  ListItem,
  Avatar,
  IconButton,
} from "@material-tailwind/react";
import {
  UserCircleIcon,
  TicketIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";

const Officer = ({ userData }) => {
  const navigate = useNavigate();

  const [officerData, setOfficerData] = useState({
    tickets: [],
    count: 0,
    officer_id: "",
  });
  const [loading, setLoading] = useState(true); // Changed to initial true

  useEffect(() => {
    if (userData?.id) {
      localStorage.setItem("officerId", userData.id);
    }

    const fetchData = async () => {
      try {
        const data = await getOfficerTickets();

        setOfficerData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]); // Added userData dependency

  const logoutHandler = () => {
    localStorage.clear();
    navigate("/login", { replace: true });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("fa-IR").format(amount) + " ریال";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PAID":
        return "پرداخت شده";
      case "UNPAID":
        return "پرداخت نشده";
      case "CANCELLED":
        return "لغو شده";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "green";
      case "UNPAID":
        return "red";
      case "CANCELLED":
        return "amber";
      default:
        return "blue";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <Typography variant="h4" color="blue-gray">
              داشبورد مامور
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

        {/* User Info Card - Always visible */}
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
                <Typography>مامور راهنمایی و رانندگی</Typography>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Action Buttons - Always visible */}
        <div className="flex justify-center mb-6 gap-4">
          <Button
            color="red"
            className="flex items-center gap-2"
            onClick={logoutHandler}
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            خروج
          </Button>

          <Link to={"/dashboard/add-ticket"}>
            <Button color="blue" className="flex items-center gap-2">
              <PlusIcon className="h-5 w-5" />
              ثبت جریمه جدید
            </Button>
          </Link>
        </div>

        {/* Tickets Section with Loading State */}
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center mb-4">
              <TicketIcon className="h-6 w-6 text-blue-500 mr-2" />
              <Typography variant="h5" color="blue-gray">
                جریمه ثبت شده
              </Typography>
              {!loading && officerData.count > 0 && (
                <Chip
                  value={`${officerData.count} مورد`}
                  color="blue"
                  variant="ghost"
                  size="sm"
                  className="mr-2"
                />
              )}
            </div>

            {loading ? (
              // Loading State UI
              <div className="flex flex-col items-center justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                <Typography color="blue-gray" className="text-center">
                  در حال دریافت اطلاعات قبض‌ها...
                </Typography>
              </div>
            ) : officerData.count === 0 ? (
              // Empty State
              <div className="text-center py-8">
                <TicketIcon className="h-16 w-16 mx-auto text-gray-400" />
                <Typography color="gray" className="mt-4">
                  هنوز هیچ قبضی ثبت نکرده‌اید
                </Typography>
                <Link to={"/dashboard/add-ticket"}>
                  <Button color="blue" className="mt-4">
                    ثبت اولین قبض
                  </Button>
                </Link>
              </div>
            ) : (
              // Tickets List
              <List className="p-0">
                {officerData.tickets.map((ticket) => (
                  <ListItem
                    onClick={() => {
                      navigate(`/dashboard/tickets/${ticket.id}`, {
                        state: { userData }, 
                      });
                    }}
                    key={ticket.id}
                    className="flex flex-col items-start p-4 mb-3 rounded-lg border border-gray-200"
                  >
                    <div className="w-full flex justify-between items-start">
                      <div>
                        <Typography variant="h6" color="blue-gray">
                          {ticket.violation}
                        </Typography>
                        <Typography
                          variant="small"
                          color="gray"
                          className="mt-1"
                        >
                          {ticket.carModel}
                        </Typography>
                      </div>
                      <Chip
                        value={getStatusText(ticket.status)}
                        color={getStatusColor(ticket.status)}
                        size="sm"
                        className="rounded-full"
                      />
                    </div>

                    <div className="w-full grid grid-cols-2 gap-3 mt-4">
                      <div className="flex items-center">
                        <BanknotesIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <Typography variant="small" className="font-bold">
                          {formatCurrency(ticket.amount)}
                        </Typography>
                      </div>

                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-5 w-5 text-blue-500 mr-2" />
                        <Typography variant="small">
                          {formatDate(ticket.issuedAt)}
                        </Typography>
                      </div>
                    </div>
                  </ListItem>
                ))}
              </List>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default Officer;
