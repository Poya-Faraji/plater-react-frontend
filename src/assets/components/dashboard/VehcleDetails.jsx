import { useEffect, useState } from "react";
import { 
  Card, 
  CardHeader, 
  CardBody, 
  CardFooter, 
  Typography, 
  Button, 
  Chip,
  Badge,
  List,
  ListItem,
  ListItemPrefix,
  Avatar,
  IconButton,
  Accordion,
  AccordionHeader,
  AccordionBody
} from "@material-tailwind/react";
import { 
  ArrowLeftIcon, 
  TrashIcon, 
  DocumentTextIcon,
  UserIcon,
  TicketIcon,
  CalendarDaysIcon,
  BanknotesIcon,
  ExclamationCircleIcon,
  InformationCircleIcon
} from "@heroicons/react/24/outline";
import { verifyToken } from "../../services/verifyToken";
import { useNavigate, useParams } from "react-router-dom";
import { getVehicleDetails } from "../../services/getVehicleDetails";
import { deleteVehicle } from "../../services/deleteVehicle";


export default function VehicleDetail() {
  const navigate = useNavigate();
  const { vehicleId } = useParams();

  
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openTicket, setOpenTicket] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const isAuthenticated = await verifyToken();
        if (!isAuthenticated) {
          navigate("/login", { replace: true });
          return;
        }
        
        const data = await getVehicleDetails(vehicleId);
        setVehicle(data);
        setLoading(false)

      } catch (err) {
        console.error(err)
        setError("خطا در دریافت اطلاعات خودرو");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [navigate, vehicleId]);
  
  const handleDelete = async () => {
    if (vehicle?.hasUnpaidTickets) {
      alert("امکان حذف خودرو با قبض‌های پرداخت نشده وجود ندارد");
      return;
    }

    if (!window.confirm("آیا از حذف این خودرو اطمینان دارید؟")) {
      return;
    }

    try {
      await deleteVehicle(vehicleId);
      navigate("/dashboard");
    } catch (err) {
      console.error(error)
      setError(err)
    }
  };
  
  const handleToggleTicket = (ticketId) => {
    setOpenTicket(openTicket === ticketId ? null : ticketId);
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fa-IR').format(amount) + " ریال";
  };
  
  const getStatusColor = (status) => {
    switch(status) {
      case "PAID": return "green";
      case "UNPAID": return "red";
      case "CANCELLED": return "amber";
      default: return "blue";
    }
  };
  
  const getStatusText = (status) => {
    switch(status) {
      case "PAID": return "پرداخت شده";
      case "UNPAID": return "پرداخت نشده";
      case "CANCELLED": return "لغو شده";
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mr-3 text-gray-600">در حال بارگذاری...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-4 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          <ExclamationCircleIcon className="h-12 w-12 mx-auto mb-2" />
          <Typography variant="h5" color="red">
            خطا در دریافت اطلاعات
          </Typography>
          <Typography className="mt-2">{error}</Typography>
          <Button color="red" className="mt-4" onClick={() => navigate(-1)}>
            بازگشت
          </Button>
        </div>
      </div>
    );
  }
  
  if (!vehicle) {
    return (
      <div className="p-4 text-center">
        <div className="bg-blue-50 text-blue-700 p-4 rounded-lg">
          <InformationCircleIcon className="h-12 w-12 mx-auto mb-2" />
          <Typography variant="h5" color="blue">
            خودرو یافت نشد
          </Typography>
          <Typography className="mt-2">خودرو با شناسه {vehicleId} وجود ندارد</Typography>
          <Button color="blue" className="mt-4" onClick={() => navigate(-1)}>
            بازگشت
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center mb-6">
          <IconButton 
            variant="text" 
            color="blue" 
            className="rounded-full mr-2"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </IconButton>
          <Typography variant="h4" color="blue-gray">
            اطلاعات خودرو
          </Typography>
        </div>
        
        {/* Vehicle Information Card */}
        <Card className="mb-6 overflow-hidden">
          <CardHeader 
            color="blue" 
            floated={false} 
            shadow={false} 
            className="m-0 p-4 rounded-t-xl"
          >
            <div className="flex justify-between items-center">
              <div>
                <Typography variant="h5" color="white">
                  پلاک خودرو
                </Typography>
                <Typography variant="h3" color="white" className="font-bold mt-1">
                  {vehicle.first2digits}
                  <span className="mx-1">{vehicle.letter}</span>
                  {vehicle.last3digits}
                  <span className="mx-1">-</span>
                  {vehicle.citycode}
                </Typography>
              </div>
              <Badge
                content={vehicle.hasUnpaidTickets ? "!" : ""}
                color={vehicle.hasUnpaidTickets ? "red" : "green"}
                overlap="circular"
                placement="top-end"
              >
                <Avatar
                  src={`https://api.dicebear.com/7.x/icons/svg?seed=${vehicle.id}`}
                  alt="vehicle-icon"
                  size="lg"
                  className="border-2 border-white"
                />
              </Badge>
            </div>
          </CardHeader>
          
          <CardBody className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Typography variant="small" color="blue-gray" className="font-bold">
                  مدل
                </Typography>
                <Typography className="mt-1">
                  {vehicle.model || "ثبت نشده"}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="font-bold">
                  رنگ
                </Typography>
                <Typography className="mt-1">
                  {vehicle.color || "ثبت نشده"}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="font-bold">
                  سال ساخت
                </Typography>
                <Typography className="mt-1">
                  {vehicle.year ? vehicle.year : "ثبت نشده"}
                </Typography>
              </div>
              
              <div>
                <Typography variant="small" color="blue-gray" className="font-bold">
                  تاریخ ثبت
                </Typography>
                <Typography className="mt-1">
                  {formatDate(vehicle.createdAt)}
                </Typography>
              </div>
            </div>
          </CardBody>
          
          <CardFooter className="pt-0 p-4">
            <Button 
              color="red" 
              variant="gradient" 
              fullWidth
              onClick={handleDelete}
              disabled={vehicle.hasUnpaidTickets}
              className="flex items-center justify-center"
            >
              <TrashIcon className="h-5 w-5 ml-2" />
              حذف خودرو
            </Button>
            
            {vehicle.hasUnpaidTickets && (
              <Typography variant="small" color="red" className="mt-2 text-center">
                به دلیل وجود قبض‌های پرداخت نشده، امکان حذف خودرو وجود ندارد
              </Typography>
            )}
          </CardFooter>
        </Card>
        
        {/* Owner Information */}
        <Card className="mb-6">
          <CardBody className="p-4">
            <div className="flex items-center mb-4">
              <UserIcon className="h-6 w-6 text-blue-500 mr-2" />
              <Typography variant="h5" color="blue-gray">
                مالک خودرو
              </Typography>
            </div>
            
            <div className="flex items-center">
              <Avatar
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${vehicle.owner.fname} ${vehicle.owner.lname}`}
                alt="owner-avatar"
                size="lg"
                className="border border-blue-gray-200"
              />
              <div className="mr-3">
                <Typography variant="h6">
                  {vehicle.owner.fname} {vehicle.owner.lname}
                </Typography>
                <Typography variant="small" color="gray" className="mt-1">
                  کد ملی: {vehicle.owner.codeMeli}
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
        
        {/* Tickets Section */}
        <Card>
          <CardBody className="p-4">
            <div className="flex items-center mb-4">
              <TicketIcon className="h-6 w-6 text-blue-500 mr-2" />
              <Typography variant="h5" color="blue-gray">
                قبض‌های ثبت شده
              </Typography>
              <Chip
                value={`${vehicle.tickets.length} مورد`}
                color="blue"
                variant="ghost"
                size="sm"
                className="mr-2"
              />
            </div>
            
            {vehicle.tickets.length === 0 ? (
              <div className="text-center py-8">
                <DocumentTextIcon className="h-16 w-16 mx-auto text-gray-400" />
                <Typography color="gray" className="mt-4">
                  هیچ قبضی برای این خودرو ثبت نشده است
                </Typography>
              </div>
            ) : (
              <List className="p-0">
                {vehicle.tickets.map((ticket) => (
                  <Accordion
                    key={ticket.id}
                    open={openTicket === ticket.id}
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className={`h-5 w-5 transform ${openTicket === ticket.id ? "rotate-180" : ""}`}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    }
                  >
                    <ListItem className="p-0" selected={openTicket === ticket.id}>
                      <AccordionHeader
                        onClick={() => handleToggleTicket(ticket.id)}
                        className="border-b-0 p-3"
                      >
                        <ListItemPrefix>
                          <div className="relative">
                            <BanknotesIcon className="h-6 w-6 text-blue-500" />
                            {ticket.payments.length > 0 && (
                              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border border-white"></div>
                            )}
                          </div>
                        </ListItemPrefix>
                        <div className="mr-3">
                          <Typography color="blue-gray" className="font-bold">
                            {ticket.violation}
                          </Typography>
                          <Typography variant="small" color="gray" className="font-normal">
                            {formatDate(ticket.issuedAt)}
                          </Typography>
                        </div>
                        <div className="ml-auto">
                          <Chip
                            value={getStatusText(ticket.status)}
                            color={getStatusColor(ticket.status)}
                            size="sm"
                            className="rounded-full"
                          />
                        </div>
                      </AccordionHeader>
                    </ListItem>
                    
                    <AccordionBody className="py-1">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <Typography variant="small" className="font-bold">
                            مبلغ:
                          </Typography>
                          <Typography variant="small" className="font-bold">
                            {formatCurrency(ticket.amount)}
                          </Typography>
                        </div>
                        
                        <div className="flex justify-between mb-2">
                          <Typography variant="small" className="font-bold">
                            مامور ثبت‌کننده:
                          </Typography>
                          <Typography variant="small">
                            {ticket.officer.fname} {ticket.officer.lname}
                          </Typography>
                        </div>
                        
                        {ticket.payments.length > 0 && (
                          <div className="mt-4">
                            <Typography variant="small" className="font-bold mb-2">
                              پرداخت‌ها:
                            </Typography>
                            <List>
                              {ticket.payments.map((payment) => (
                                <ListItem key={payment.id} className="py-1 px-0">
                                  <div className="flex justify-between w-full">
                                    <div>
                                      <Typography variant="small" className="font-bold">
                                        {formatDate(payment.paidAt)}
                                      </Typography>
                                      <Typography variant="small">
                                        {payment.method || "نامشخص"}
                                      </Typography>
                                    </div>
                                    <Typography variant="small" className="font-bold">
                                      {formatCurrency(payment.amount)}
                                    </Typography>
                                  </div>
                                </ListItem>
                              ))}
                            </List>
                          </div>
                        )}
                      </div>
                    </AccordionBody>
                  </Accordion>
                ))}
              </List>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}