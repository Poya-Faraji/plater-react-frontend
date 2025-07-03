import { useEffect, useState } from "react";
import {
  Input,
  Button,
  Typography,
  Card,
  CardBody,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";

const LOGIN_API_URL = import.meta.env.VITE_LOGIN_API_ENDPOINT;

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      // Calling API function
      const response = await loginUser(formData);

      localStorage.setItem("token", response.token);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // user register API function
  const loginUser = async (data) => {
    // Validate required fields
    if (!data.username || !data.password) {
      throw new Error("Username and Password are both required");
    }

    if (data.password.length < 6) {
      throw new Error("Password must be at least 6 characters long");
    }

    try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Login failed!");
      }

      const responseData = await response.json();

      if (responseData) {
        return responseData;
      }
    } catch (error) {
      return { msg: error.message };
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardBody className="flex flex-col gap-3">
          <Typography variant="h5" color="blue-gray">
            Login to account
          </Typography>
          <p>Enter your username and password to login</p>
          {error && (
            <Typography color="red" className="text-sm">
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Input
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />

            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              fullWidth
              disabled={isSubmitting}
              className="mt-6"
            >
              {isSubmitting ? "Loging in..." : "Login"}
            </Button>
          </form>

          <div>
            <Link to={"/signup"}>
              Don't have an account?
              <p className="text-blue-500 inline"> Create an account</p>
            </Link>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
