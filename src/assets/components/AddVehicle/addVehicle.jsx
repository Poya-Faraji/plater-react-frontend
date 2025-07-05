import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Input,
  Button,
  Typography,
  Card,
  CardBody,
  Select,
  Option,
} from "@material-tailwind/react";

const VEHICLE_API_URL = import.meta.env.VITE_CREATE_VEHICLE_API_ENDPOINT;

const OWNER_ID = localStorage.getItem("ownerID");

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

const AddVehicle = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    first2digits: "",
    letter: "",
    last3digits: "",
    citycode: "",
    model: "",
    color: "",
    year: "",
    owner_id: OWNER_ID,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createVehicleSuccess, setCreateVehicleSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isManual, setIsManual] = useState(false);
  const [isScan, setIsScan] = useState(false);

  const handleManualButton = () => {
    setIsManual(true);
    setIsScan(false);
  };

  const handleScanButton = () => {
    setIsManual(false);
    setIsScan(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const createVehicle = async (data) => {
    if (
      !data.first2digits ||
      !data.letter ||
      !data.last3digits ||
      !data.citycode ||
      !data.model ||
      !data.color ||
      !data.year
    ) {
      throw new Error("All fields are required");
    }



    // Validate form data
    if (data.first2digits.length !== 2 || !/^\d+$/.test(data.first2digits)) {
  
      throw new Error("First 2 digits must be 2 digits");
    }

    if (data.letter.length !== 1 || /^\d+$/.test(data.letter)) {
      throw new Error("Plate lettermust be 1 character");
    }
    if (data.last3digits.length !== 3 || !/^\d+$/.test(data.last3digits)) {
      throw new Error("Last 3 digits must be 3 digits ");
    }
    if (data.citycode.length !== 2 || !/^\d+$/.test(data.citycode)) {
      throw new Error("City code must be 2 digits");
    }

    if (/^\d+$/.test(data.model) || /^\d+$/.test(data.color)) {
      throw new Error("Model and Color must be a word");
    }

    if (data.year.length !== 4 || !/^\d+$/.test(data.year)) {
      throw new Error("Year must be 4 digits");
    }

    try {
      const response = await fetch(VEHICLE_API_URL, {
        method: "POST",
        headers: {
            Authorization: `${localStorage.getItem('token')}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Creating vehicle failed!");
      }

      const responseData = await response.json();

      if (responseData) {
        setCreateVehicleSuccess(true);
      }
    } catch (error) {
      return { msg: error.message };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Calling API function
      await createVehicle(formData);
    } catch (err) {
      setError(err.message || "Creating Vehicle failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      letter: value,
    }));
  };

  if (createVehicleSuccess) {
    navigate("/dashboard", { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            Create a new Vehicle
          </Typography>

          {error && (
            <Typography color="red" className="text-sm">
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Model"
                name="model"
                value={formData.model}
                onChange={handleChange}
                required
              />
              <Input
                label="Color"
                name="color"
                value={formData.color}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="year"
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
            />

            <div className="flex items-center justify-center gap-3">
              <Button onClick={handleManualButton}>Manual Plate</Button>
              <span>or</span>
              <Button onClick={handleScanButton}>Scan Plate</Button>
            </div>
            {isManual && (
              <>
                <Input
                  label="first 2 digits"
                  name="first2digits"
                  value={formData.first2digits}
                  onChange={handleChange}
                  required
                />

                <Select
                  label="Letter"
                  dir="rtl"
                  className="text-right"
                  value={formData.userType}
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
                  label="last 3 digits"
                  name="last3digits"
                  value={formData.last3digits}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="City code"
                  name="citycode"
                  value={formData.citycode}
                  onChange={handleChange}
                  required
                />
              </>
            )}

            {isScan && <div>Scan Plate</div>}
            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              className="mt-6"
            >
              {isSubmitting ? "Creating Vehicle..." : "Add Vehicle"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

export default AddVehicle;
