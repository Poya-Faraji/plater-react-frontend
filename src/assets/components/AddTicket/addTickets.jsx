import { useEffect, useState } from "react";
import { verifyToken } from "../../services/verifyToken";
import { useNavigate } from "react-router-dom";
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

const AddTicket = () => {
  const navigate = useNavigate();

  const [error, setError] = useState();
  const [isPlateVerifSuccess, setIsPlateVerifSuccess] = useState(false);

  const [isManual, setIsManual] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const OFFICER_ID = localStorage.getItem("officerId");

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
        throw new Error("لطفا تمامی فرم ها رو پرکنید !");
      }

      if (
        formData.first2digits.length !== 2 ||
        !/^\d+$/.test(formData.first2digits)
      ) {
        throw new Error("دو رقم اول حتما باید عدد 2 رقمی باشد !");
      }

      if (formData.letter.length !== 1 || /^\d+$/.test(formData.letter)) {
        throw new Error("حرف پلاک باید یک حرف باشد !");
      }

      if (
        formData.last3digits.length !== 3 ||
        !/^\d+$/.test(formData.last3digits)
      ) {
        throw new Error("سه رقم آخر حتما باید عدد 3 رقمی باشد !");
      }

      if (formData.citycode.length !== 2 || !/^\d+$/.test(formData.citycode)) {
        throw new Error("کد شهری حتما باید عدد 2 رقمی باشد !");
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
        throw new Error("مقدار جریمه و توضیحات اجبباری میباشد !");
      }

      if (!/^\d+$/.test(formData.amount)) {
        throw new Error("مقدار باید عدد باشد !");
      }

      if (/^\d+$/.test(formData.violation)) {
        throw new Error("توضیحات جریمه باید متن باشد !");
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
        throw new Error(errorMessage.error);
      }

      navigate("/dashboard", { replace: true });
    } catch (error) {
      setError(error.message);
    }
  };

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

        throw new Error("تشخیص پلاک ناموفق بود");
      }

      const result = await response.json();

      if (
        !result.first2digits ||
        !result.letter ||
        !result.last3digits ||
        !result.citycode
      ) {
        throw new Error(
          "نوع پلاک اشتباه میباشد. لطفا پلاک را بدرستی وارد کنید."
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
      setError("مشکل در تشخیص پلاک : " + err.message);
    } finally {
      setIsProcessing(false);
    }
  };
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      processPlateImage(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            ثبت جریمه جدید
          </Typography>
          {error && (
            <Typography color="red" className="font-semibold">
              {error} !!
            </Typography>
          )}
          {!error && isPlateVerifSuccess && (
            <div className="flex flex-col gap-0">
              <Typography className="text-green-600 font-semibold">
                بررسی صحت پلاک تایید شد
              </Typography>
            </div>
          )}

          <div className="flex items-center justify-center gap-3">
            <Button onClick={handleManualButton}>پلاک دستی</Button>
            <span>یا</span>
            <Button onClick={handleScanButton}>اسکن پلاک</Button>
          </div>

          {isManual && (
            <form className="mt-4 space-y-4" onSubmit={handleFormSubmission}>
              <Input
                label="دو رقم اول"
                type="number"
                name="first2digits"
                value={formData.first2digits}
                onChange={handleChange}
                required
              />

              <Select
                label="حرف"
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
                label="3 رقم آخر"
                name="last3digits"
                type="number"
                value={formData.last3digits}
                onChange={handleChange}
                required
              />

              <Input
                label="کد شهر"
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
                بررسی صحت پلاک
              </Button>

              {!error && isPlateVerifSuccess && (
                <>
                  <Input
                    label="مقدار جریمه ( به ریال ) "
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleTicketChange}
                    required
                  />

                  <Textarea
                    label="علت جریمه"
                    name="violation"
                    value={formData.violation}
                    onChange={handleTicketChange}
                    required
                  />

                  <Button className="w-full p-4" type="submit">
                    ثبت جریمه
                  </Button>
                </>
              )}
            </form>
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
                    در حال پردازش پلاک ماشین ...
                  </Typography>
                )}

                {scanResult && !isProcessing && (
                  <>
                    <div className="mt-3 p-3 bg-gray-100 rounded-md w-full">
                      <Typography variant="h6" className="mb-2">
                        پلاک یافت شده :
                      </Typography>
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="bg-white p-2 rounded flex flex-col justify-center items-center">
                          <Typography variant="small">شهر</Typography>
                          <Typography className="font-bold">
                            {scanResult.citycode}
                          </Typography>
                        </div>
                        <div className="bg-white p-2 rounded flex justify-center items-center">
                          <Typography className="font-bold">
                            {scanResult.last3digits}
                          </Typography>
                        </div>
                        <div className="bg-white p-2 rounded flex justify-center items-center">
                          <Typography className="font-bold">
                            {scanResult.letter}
                          </Typography>
                        </div>
                        <div className="bg-white p-2 rounded flex justify-center items-center">
                          <Typography className="font-bold">
                            {scanResult.first2digits}
                          </Typography>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={plateVerificationHandler}
                      type="button"
                      fullWidth
                      className="mt-6"
                    >
                      بررسی صحت پلاک خودرو
                    </Button>
                    {!error && isPlateVerifSuccess && (
                      <form
                        className="mt-4 space-y-4 w-full"
                        onSubmit={handleFormSubmission}
                      >
                        <Input
                          label="Amount"
                          name="amount"
                          type="number"
                          value={formData.amount}
                          onChange={handleTicketChange}
                          required
                          className="w-full"
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
                      </form>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AddTicket;
