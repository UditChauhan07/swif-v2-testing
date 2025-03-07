import React, { useState } from "react";
import {
  Container,
  Row,
  Card,
  Button,
  Form,
  InputGroup,
  Spinner,
} from "react-bootstrap";
import "./Login.css";
import { LoginApi } from "../../lib/store";
import { useNavigate } from "react-router-dom";
import { usePermissions } from "../../context/PermissionContext";
import { useTranslation } from "react-i18next";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const { i18n } = useTranslation();
  const { setPermissions } = usePermissions();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });
    setIsLoading(true);
    try {
      const response = await LoginApi(formData);
      console.log("response", response);
      if (response.status === true) {
        localStorage.setItem("UserToken", response.token);
        localStorage.setItem("userId", response.userId);
        localStorage.setItem("Role", response.user.role);
        localStorage.setItem("userEmail", response.user.email);
        localStorage.setItem("profilePic", response.user.profile_picture);
        localStorage.setItem("name", response.user.first_name);
        localStorage.setItem("companyId", response.company_id);
        localStorage.setItem("language", "en");
        localStorage.setItem("currencyCode", response?.currencyCode);

        if (response.skipTutorial || response.skipTutorial === "true") {
          localStorage.setItem("guidlines", "unactive");
        } else {
          localStorage.setItem("guidlines", "active");
        }
        localStorage.setItem("companyName", response.company_name);
        localStorage.setItem("companyLogo", response.company_logo);
        localStorage.setItem("defaultTimezone", response.company_timezone);
        localStorage.setItem("roleID", response.roleID);
        if (
          response.user.role === "Admin" ||
          response.user.role === "SuperAdmin"
        ) {
          localStorage.setItem("SessionId", response.sessionId);
        }
        localStorage.setItem("defaultLanguage", response.company_language);
        if (
          response.user.role === "Admin" ||
          response.user.role === "SuperAdmin"
        ) {
          localStorage.setItem("SessionId", response.sessionId);
        }

        if (response.user.role === "SuperAdmin") {
          i18n.changeLanguage("en");
        } else if (response.user.role === "Admin") {
          i18n.changeLanguage(response.company_language);
        }

        setPermissions(response.rolesPermissions || []);
        setIsLoading(false);
        if (
          response.user.role === "Admin" ||
          response.user.role === "office_Admin"
        ) {
          navigate("/dashboard/admin");
        } else {
          navigate("/dashboard");
        }
      } else {
        if (response.message.toLowerCase().includes("user")) {
          setErrors({ email: response.message, password: "" });
        } else if (response.message.toLowerCase().includes("password")) {
          setErrors({ email: "", password: response.message });
        } else {
          setErrors({ email: response.message, password: "" });
        }
      }
    } catch (apiError) {
      console.error("Login API Error:", apiError.message);
      setErrors({
        email: "A server error occurred. Please try again later.",
        password: "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <Container className="d-flex justify-content-center align-items-center vh-100">
        <Card className="shadow-lg p-4 rounded-4 w-50">
          <div className="text-center mb-3">
            <img
              src="https://swif.truet.net/public/swifCompany/logo/logo.png"
              alt="Logo"
              width="80"
            />
          </div>

          <h4 className="text-center fw-bold mb-4">Sign in to Your Account</h4>

          <Form onSubmit={handleSubmit}>
            {/* Email Field */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
                required
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email}
                </Form.Control.Feedback>
              )}
            </Form.Group>

            {/* Password Field with Eye Toggle */}
            <Form.Group className="mb-3" controlId="formPassword">
              <Form.Label>Password</Form.Label>
              <InputGroup>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  required
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </Button>
                {errors.password && (
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                )}
              </InputGroup>
            </Form.Group>

            <div className="d-grid">
              <Button
                variant="dark"
                type="submit"
                disabled={isLoading}
                className="rounded-pill"
              >
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Loading...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </div>
          </Form>
        </Card>
      </Container>
    </div>
  );
};

export default Login;
