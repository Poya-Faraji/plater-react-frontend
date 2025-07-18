import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Card, 
  CardBody, 
  CardHeader, 
  Typography, 
  Button, 
  Chip, 
  Spinner
} from '@material-tailwind/react';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import TicketIcon from '@heroicons/react/24/outline/TicketIcon';
import UserCircleIcon from '@heroicons/react/24/outline/UserCircleIcon';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import IdentificationIcon from '@heroicons/react/24/outline/IdentificationIcon';
import TruckIcon from '@heroicons/react/24/outline/TruckIcon';
import ExclamationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';
import { 
  getTicketById, 
  cancelTicket, 
  formatCurrency, 
  formatDate, 
  getStatusText, 
  getStatusColor 
} from '../../services/ticketDetailServices';
import { ToastContainer, toast } from 'react-toastify';

const TicketDetail = () => {
  const location = useLocation();
  const userData = location.state?.userData; 

  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketById(ticketId);
        setTicket(data);
      } catch (error) {
        toast.error(error.message, {
          position: "top-right",
          autoClose: 5000,
          closeOnClick: true,
          pauseOnHover: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId]);

  const handleCancelTicket = async () => {
    if (!ticket || ticket.status !== 'UNPAID') return;
    
    setIsCancelling(true);
    try {
      await cancelTicket(ticket.id);
      setTicket({ ...ticket, status: 'CANCELLED' });
      toast.success('قبض با موفقیت لغو شد', {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner className="h-12 w-12" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <ExclamationCircleIcon className="h-16 w-16 mx-auto text-red-500 mb-4" />
        <Typography variant="h4" color="red">
          قبض مورد نظر یافت نشد
        </Typography>
        <Button color="blue" className="mt-4" onClick={() => navigate('/dashboard')}>
          بازگشت به داشبورد
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="container mx-auto px-4">
        <div className="mb-6 ml-auto">
          <Button
            variant="text"
            color="blue-gray"
            className="flex items-center gap-2 mr-auto"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeftIcon className="h-5 w-5" />
            بازگشت به داشبورد
          </Button>
        </div>

        <Card className="shadow-lg">
          <CardHeader 
            className="bg-blue-500 text-white rounded-t-2xl"
          >
            <div className="flex justify-between items-center p-4">
              <Typography variant="h5">
                جزئیات قبض
              </Typography>
              <Chip
                value={getStatusText(ticket.status)}
                color={getStatusColor(ticket.status)}
                className="text-white font-bold"
              />
            </div>
          </CardHeader>

          <CardBody className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ticket Information */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center">
                  <TicketIcon className="h-5 w-5 ml-2" />
                  اطلاعات قبض
                </Typography>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      شماره قبض:
                    </Typography>
                    <Typography className="font-mono">
                      {ticket.ticketNumber}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      نوع تخلف:
                    </Typography>
                    <Typography>{ticket.violation}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      مبلغ:
                    </Typography>
                    <Typography className="font-bold">
                      {formatCurrency(ticket.amount)}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      تاریخ صدور:
                    </Typography>
                    <Typography>
                      {formatDate(ticket.issuedAt)}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      وضعیت پرداخت:
                    </Typography>
                    <Chip
                      value={getStatusText(ticket.status)}
                      color={getStatusColor(ticket.status)}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* Vehicle & Driver Information */}
              <div>
                <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center">
                  <TruckIcon className="h-5 w-5 ml-2" />
                  اطلاعات وسیله نقلیه
                </Typography>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      پلاک خودرو:
                    </Typography>
                    <Typography className="font-mono">
                      {ticket.plateNumber}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      مدل خودرو:
                    </Typography>
                    <Typography>{ticket.carModel}</Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      رنگ خودرو:
                    </Typography>
                    <Typography>{ticket.carColor || "-"}</Typography>
                  </div>
                </div>

                <Typography variant="h6" color="blue-gray" className="mt-6 mb-4 flex items-center">
                  <UserCircleIcon className="h-5 w-5 ml-2" />
                  اطلاعات راننده
                </Typography>
                
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      نام راننده:
                    </Typography>
                    <Typography>
                      {ticket.driverFullName || "-"}
                    </Typography>
                  </div>
                  <div className="flex justify-between">
                    <Typography variant="small" color="gray">
                      کد ملی:
                    </Typography>
                    <Typography>
                      {ticket.driverNationalId || "-"}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>


            {/* Cancel Button - Only for UNPAID tickets */}
            {ticket.status === 'UNPAID' && (
              <div className="mt-8 flex justify-end">
                <Button
                  color="red"
                  onClick={handleCancelTicket}
                  disabled={isCancelling}
                  className="flex items-center gap-2"
                >
                  {isCancelling ? (
                    <>
                      <Spinner className="h-4 w-4" />
                      در حال لغو...
                    </>
                  ) : "لغو قبض"}
                </Button>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Officer Information */}
        <Card className="mt-6 shadow-lg">
          <CardBody>
            <Typography variant="h6" color="blue-gray" className="mb-4 flex items-center">
              <IdentificationIcon className="h-5 w-5 ml-2" />
              اطلاعات مامور ثبت‌کننده
            </Typography>
            
            <div className="flex items-center">
              <div className="ml-4">
                <Typography variant="h6">
                  {userData.fname} {userData.lname}
                </Typography>
                <Typography variant="small" color="gray">
                   کد ملی: {userData.codeMeli || "-"}

                
                </Typography>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default TicketDetail;