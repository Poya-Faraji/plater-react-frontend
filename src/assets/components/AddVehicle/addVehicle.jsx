import { useEffect, useState } from "react";
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

import {verifyToken} from "../../services/verifyToken"

const VEHICLE_API_URL = import.meta.env.VITE_CREATE_VEHICLE_API_ENDPOINT;
const PLATE_API_URL = import.meta.env.VITE_PLATE_API_URL;


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

const ENGLISH_TO_PERSIAN = {
  be: "ب",
  dal: "د",
  ein: "ع",
  he: "ح",
  jim: "ج",
  lam: "ل",
  mim: "م",
  nun: "ن",
  qaf: "ق",
  sad: "ص",
  sin: "س",
  ta: "ط",
  te: "ت",
  vav: "و",
  ye: "ی",
  zhe: "ز",
};

const AddVehicle = () => {

  const OWNER_ID = localStorage.getItem("ownerID");
  const navigate = useNavigate();

  useEffect(() => {
     
     
    const checkAuth = async () => {
      const isAuthenticated = await verifyToken();
      if (!isAuthenticated) {
        navigate("/login", { replace: true });
      }
      if(!OWNER_ID) {
        navigate('/dashboard', {replace: true})
      }
    };


    checkAuth();
  }, [navigate]);

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

  // Plate scanning states
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanResult, setScanResult] = useState(null);

  const handleManualButton = () => {
    setIsManual(true);
    setIsScan(false);
    setScanResult(null);
    setSelectedImage(null);
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      processPlateImage(file);
    }
  };

  const processPlateImage = async (file) => {
    setIsProcessing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(PLATE_API_URL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const mutliplePlateError = await response.json().then((data) => {
          return data.detail;
        });
        if (mutliplePlateError) {
          throw new Error(mutliplePlateError);
        }

        throw new Error("Failed to detect plate");
      }

      const result = await response.json();

      if (
        !result.first2digits ||
        !result.letter ||
        !result.last3digits ||
        !result.citycode
      ) {
        throw new Error(
          "Plate format is incorrect. Please provide correct plate format."
        );
      }

      // Convert English letter to Persian
      const persianLetter = ENGLISH_TO_PERSIAN[result.letter] || result.letter;

      // Update form data with detected values
      setFormData((prev) => ({
        ...prev,
        first2digits: result.first2digits,
        letter: persianLetter,
        last3digits: result.last3digits,
        citycode: result.citycode,
      }));

      // Store result for display
      setScanResult({
        ...result,
        letter: persianLetter,
      });
    } catch (err) {
      setError("Plate detection error: " + err.message);
    } finally {
      setIsProcessing(false);
    }
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

    if (data.first2digits.length !== 2 || !/^\d+$/.test(data.first2digits)) {
      throw new Error("First 2 digits must be 2 digits");
    }

    if (data.letter.length !== 1 || /^\d+$/.test(data.letter)) {
      throw new Error("Plate letter must be 1 character");
    }

    if (data.last3digits.length !== 3 || !/^\d+$/.test(data.last3digits)) {
      throw new Error("Last 3 digits must be 3 digits");
    }

    if (data.citycode.length !== 2 || !/^\d+$/.test(data.citycode)) {
      throw new Error("City code must be 2 digits");
    }

    if (/^\d+$/.test(data.model) || /^\d+$/.test(data.color)) {
      throw new Error("Model and Color must be words");
    }

    if (data.year.length !== 4 || !/^\d+$/.test(data.year)) {
      throw new Error("Year must be 4 digits");
    }

    try {
      const response = await fetch(VEHICLE_API_URL, {
        method: "POST",
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(
          errorData.message || errorData.error || "Creating vehicle failed!"
        );
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
              label="Year"
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
                  label="First 2 digits"
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

            {isScan && (
              <div className="space-y-4">
                <div className="flex flex-col items-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isProcessing}
                    className="mb-3"
                  />

                  {selectedImage && (
                    <div className="mt-2 mb-4">
                      <Typography variant="small" className="mb-2">
                        Selected Image:
                      </Typography>
                      <img
                        src={URL.createObjectURL(selectedImage)}
                        alt="Plate preview"
                        className="max-h-40 rounded-md"
                      />
                    </div>
                  )}

                  {isProcessing && (
                    <Typography className="text-blue-500">
                      Processing plate image...
                    </Typography>
                  )}

                  {scanResult && !isProcessing && (
                    <div className="mt-3 p-3 bg-gray-100 rounded-md w-full">
                      <Typography variant="h6" className="mb-2">
                        Detected Plate:
                      </Typography>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-white p-2 rounded flex justify-center items-center">
                          <Typography className="font-bold">
                            {scanResult.first2digits}
                          </Typography>
                        </div>
                        <div className="bg-white p-2 rounded flex justify-center items-center">
                          <Typography className="font-bold">
                            {scanResult.letter}
                          </Typography>
                        </div>
                        <div className="bg-white p-2 rounded flex justify-center items-center">
                          <Typography className="font-bold">
                            {scanResult.last3digits}
                          </Typography>
                        </div>
                        <div className="bg-white p-2 rounded flex flex-col justify-center items-center">
                          <Typography variant="small">City</Typography>
                          <Typography className="font-bold">
                            {scanResult.citycode}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

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
