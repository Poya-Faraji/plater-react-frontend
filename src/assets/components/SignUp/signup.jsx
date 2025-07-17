import { useState } from "react";
import {
  Input,
  Button,
  Typography,
  Card,
  CardBody,
  Select,
  Option,
} from "@material-tailwind/react";
import { Link } from "react-router-dom";

const REGISTER_API_URL = import.meta.env.VITE_REGISTER_API_ENDPOINT;

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    fname: "",
    lname: "",
    codeMeli: "",
    userType: "",
    phoneNumber: "", // default value
    address: "",
    postalCode: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      userType: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Calling API function
      const response = await registerUser(formData);

      localStorage.setItem("token", response.token);
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // user register API function
  const registerUser = async (data) => {
    // Validate required fields
    if (
      !data.username ||
      !data.password ||
      !data.fname ||
      !data.lname ||
      !data.codeMeli ||
      !data.phoneNumber
    ) {
      throw new Error("All fields are required");
    }

    // Validate form data
    if (data.codeMeli.length !== 10 || !/^\d+$/.test(data.codeMeli)) {
      throw new Error("Code Meli must be 10 digits");
    }

    if (data.phoneNumber.length !== 11 || !/^\d+$/.test(data.phoneNumber)) {
      throw new Error("Phone number must be 11 digits");
    }

    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    try {
      const response = await fetch(REGISTER_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Registeration failed!");
      }

      const responseData = await response.json();

      if (responseData) {
        setRegistrationSuccess(true);
        return responseData;
      }
    } catch (error) {
      return { msg: error.message };
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-96">
          <CardBody className="flex flex-col gap-4">
            <Typography variant="h4" color="blue-gray">
              Registration Successful!
            </Typography>
            <Typography>
              Your account has been created successfully. You can now log in.
            </Typography>
            <Link to={"/login"} onClick={() => setRegistrationSuccess(false)}>
              <Button className="w-4/5">Go to login page.</Button>
            </Link>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardBody className="flex flex-col gap-4">
          <Typography variant="h4" color="blue-gray">
            ساخت حساب کاربری
          </Typography>
          <p>فرم های زیر را پر کنید.</p>
          {error && (
            <Typography color="red" className="text-sm">
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="نام"
                name="fname"
                value={formData.fname}
                onChange={handleChange}
                required
              />
              <Input
                label="نام خانوادگی"
                name="lname"
                value={formData.lname}
                onChange={handleChange}
                required
              />
            </div>

            <Input
              label="نام کاربری ( به لاتین  )"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <Input
              label="گذرواژه"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Input
              label="کد ملی"
              name="codeMeli"
              value={formData.codeMeli}
              onChange={handleChange}
              required
            />

            <Input
              label="تلفن همراه"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />

            <Input
              label="کد پستی"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />

            <Select
              label="نوع کاربر"
              value={formData.userType}
              onChange={handleSelectChange}
            >
              <Option value="OWNER">Owner</Option>
              <Option value="OFFICER">Officer</Option>
            </Select>

            <textarea
              className="w-full border border-gray-400 rounded-lg p-1"
              placeholder="آدرس خود را وارد کنید..."
              name="address"
              value={formData.address}
              onChange={handleChange}
            />

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              className="mt-6"
            >
              {isSubmitting ? "در حال ثبت نام ..." : "ثبت نام"}
            </Button>
          </form>

          <div>
            <Link to={"/login"}>
              از قبل حساب کاربری دارید ؟{" "}
              <p className="text-blue-500 inline">وارد شوید</p>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default SignUp;
