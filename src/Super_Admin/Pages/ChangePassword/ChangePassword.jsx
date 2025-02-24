import React, { useState } from "react";
import Header from "../../../Components/Header/Header";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Card,
  Alert,
} from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import axios from "axios";
import { changePasswordApi } from "../../../lib/store";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [userId, setuserId] = useState(localStorage.getItem("userId"));
  const [token, settoken] = useState(localStorage.getItem("UserToken"));

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [passwordVisibility, setPasswordVisibility] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setError("");
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility({
      ...passwordVisibility,
      [field]: !passwordVisibility[field],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/;

    if (!formData.newPassword.trim()) {
      setError(t("Password is required."));
      return;
    }

    if (!passwordRegex.test(formData.newPassword)) {
      setError(
        t(
          "Password must be between 8 to 16 characters, include at least one uppercase letter, one number, and one special character."
        )
      );
      return;
    }

    // Check if confirm password is provided
  if (!formData.confirmPassword.trim()) {
    setError(t("Confirm Password is required."));
    return;
  }

  if (formData.newPassword !== formData.confirmPassword) {
    setError(t("Passwords do not match. Please try again."));
    return;
  }

  
    try {
      const finalData = {
        id: userId,
        new_password: formData.confirmPassword,
      };
      const response = await changePasswordApi(finalData, token);
      console.log("resss", response);
      if (response.status === true) {
        setSuccess(t("Password updated successfully!"));
      } else {
        setError(t("Failed to change password. Please try again."));
      }
      setFormData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("API Error:", err);
      setError(t("Failed to change password. Please try again."));
    }
  };

  return (
    <>
      <Header />
      <div className="main-header-box">
        <div className="mt-4 pages-box">
          <>
            <Card style={{ border: "none" }}>
              <div
                className="form-header mb-2"
                style={{
                  backgroundColor: "#2e2e32",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                <h4 className="mb-0">{t("Change Password")}</h4>
              </div>
              <Card.Body>
                {/* Display success or error message */}
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group
                        controlId="formNewPassword"
                        className="position-relative"
                      >
                        <Form.Label>{t("New Password")}*</Form.Label>
                        <Form.Control
                          type={
                            passwordVisibility.newPassword ? "text" : "password"
                          }
                          placeholder={t("Enter new password")}
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          
                        />
                        <Button
                          variant="link"
                          className="position-absolute end-0 translate-middle-y text-decoration-none"
                          style={{
                            top: "70%",
                          }}
                          onClick={() =>
                            togglePasswordVisibility("newPassword")
                          }
                        >
                          {passwordVisibility.newPassword ? (
                            <EyeSlash />
                          ) : (
                            <Eye />
                          )}
                        </Button>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group
                        controlId="formConfirmNewPassword"
                        className="position-relative"
                      >
                        <Form.Label>{t("Confirm New Password")}*</Form.Label>
                        <Form.Control
                          type={
                            passwordVisibility.confirmPassword
                              ? "text"
                              : "password"
                          }
                          placeholder={t("Confirm New Password")}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          
                        />
                        <Button
                          variant="link"
                          className="position-absolute end-0 translate-middle-y text-decoration-none"
                          style={{
                            top: "70%",
                          }}
                          onClick={() =>
                            togglePasswordVisibility("confirmPassword")
                          }
                        >
                          {passwordVisibility.confirmPassword ? (
                            <EyeSlash />
                          ) : (
                            <Eye />
                          )}
                        </Button>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="d-flex justify-content-center">
                    <Button
                      style={{
                        backgroundColor: "#8d28dd",
                        border: "none",
                      }}
                      type="submit"
                      className="me-3"
                    >
                      {t("Save")}
                    </Button>
                    <Button variant="secondary" type="button" onClick={()=>navigate("/dashboard")}>
                      {t("Cancel")}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
