import { useEffect, useState } from "react";
import { verifyToken } from "../../services/verifyToken";
import { replace, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  Input,
  Option,
  Select,
  Textarea,
  Typography,
} from "@material-tailwind/react";

const VERIFY_PLATE_URL = import.meta.env.VITE_VERIFY_PLATE_API_ENDPOINT;
const CREATE_TICKET_URL = import.meta.env.VITE_CREATE_TICKET_API_ENDPOINT;

const SELECT_LETTERS = [
  "ب",
  "د",
  "ع",
  "ح",
  "ج",
  "ل",
  "م",
  "ن",
  "ق",
  "ص",
  "س",
  "ط",
  "ت",
  "و",
  "ی",
  "ز",
];

const OFFICER_ID = localStorage.getItem("officerId");

const AddTicket = () => {
  const navigate = useNavigate();

  const [error, setError] = useState();
  const [isPlateVerifSuccess, setIsPlateVerifSuccess] = useState(false);

  const [formData, setFormData] = useState({
    first2digits: "",
    letter: "",
    last3digits: "",
    citycode: "",
    officer_id: OFFICER_ID,
    amount: "",
    violation: "",
    vehicle_id: "",
  });

  useEffect(() => {
    const checkAuth = async () => {
      const isAuthenticated = await verifyToken();
      if (!isAuthenticated) {
        navigate("/login", { replace: true });
      }
    };

    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsPlateVerifSuccess(false);
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      letter: value,
    }));
    setIsPlateVerifSuccess(false);
  };

  const handleTicketChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const plateVerificationHandler = async () => {
    setError("");

    try {
      if (
        !formData.citycode ||
        !formData.letter ||
        !formData.first2digits ||
        !formData.last3digits
      ) {
        throw new Error("All fields are required !");
      }

      if (
        formData.first2digits.length !== 2 ||
        !/^\d+$/.test(formData.first2digits)
      ) {
        throw new Error("First 2 digits must be 2 digits");
      }

      if (formData.letter.length !== 1 || /^\d+$/.test(formData.letter)) {
        throw new Error("Plate letter must be 1 character");
      }

      if (
        formData.last3digits.length !== 3 ||
        !/^\d+$/.test(formData.last3digits)
      ) {
        throw new Error("Last 3 digits must be 3 digits");
      }

      if (formData.citycode.length !== 2 || !/^\d+$/.test(formData.citycode)) {
        throw new Error("City code must be 2 digits");
      }

      const response = await fetch(`${VERIFY_PLATE_URL}`, {
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(errorMessage.error);
      }

      const { vehicleId } = await response.json();
      setFormData((prev) => ({ ...prev, vehicle_id: vehicleId }));

      setError("");
      setIsPlateVerifSuccess(true);
    } catch (error) {
      setError(error.message);
    }
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    try {
      if (!formData.amount || !formData.violation) {
        throw new Error("Amount and violation are required !");
      }

      if (!/^\d+$/.test(formData.amount)) {
        throw new Error("Amount must be digits !");
      }

      if (/^\d+$/.test(formData.violation)) {
        throw new Error("Violation must be text");
      }

      const response = await fetch(`${CREATE_TICKET_URL}`, {
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        
        console.log(formData);
        
      
        throw new Error(errorMessage.error);
      }



      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Create a new Ticket
          </Typography>
          {error && (
            <Typography color="red" className="font-semibold">
              {error} !!
            </Typography>
          )}
          {!error && isPlateVerifSuccess && (
            <div className="flex flex-col gap-0">
              <Typography className="text-green-600 font-semibold">
                Vehicle verification success.
              </Typography>
            </div>
          )}

          <form className="mt-4 space-y-4" onSubmit={handleFormSubmission}>
            <Input
              label="First 2 digits"
              type="number"
              name="first2digits"
              value={formData.first2digits}
              onChange={handleChange}
              required
            />

            <Select
              label="Letter"
              dir="rtl"
              className="text-right"
              value={formData.letter}
              onChange={handleSelectChange}
            >
              {SELECT_LETTERS.map((item, index) => (
                <Option
                  key={index}
                  dir="rtl"
                  value={item}
                  className="text-right"
                >
                  {item}
                </Option>
              ))}
            </Select>

            <Input
              label="Last 3 digits"
              name="last3digits"
              type="number"
              value={formData.last3digits}
              onChange={handleChange}
              required
            />

            <Input
              label="City code"
              name="citycode"
              type="number"
              value={formData.citycode}
              onChange={handleChange}
              required
            />

            <Button
              onClick={plateVerificationHandler}
              type="button"
              fullWidth
              className="mt-6"
            >
              Verify Plate
            </Button>

            {!error && isPlateVerifSuccess && (
              <>
                <Input
                  label="Amount"
                  name="amount"
                  type="number"
                  value={formData.amount}
                  onChange={handleTicketChange}
                  required
                />

                <Textarea
                  label="Violation"
                  name="violation"
                  value={formData.violation}
                  onChange={handleTicketChange}
                  required
                />

                <Button className="w-full p-4" type="submit">
                  Create Ticket
                </Button>
              </>
            )}
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddTicket;
