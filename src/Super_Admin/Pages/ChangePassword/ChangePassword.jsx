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

const ChangePassword = () => {
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

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
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
        setSuccess("Password updated successfully!");
      } else {
        setError("Failed to change password. Please try again.");
      }
      setFormData({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      console.error("API Error:", err);
      setError("Failed to change password. Please try again.");
    }
  };

  return (
    <>
      <Header />
      <div className="main-header-box">
        <div className="mt-4 pages-box">
          <Container>
            <Card style={{ border: "none" }}>
              <div
                className="form-header mb-2"
                style={{
                  backgroundColor: "#8d28dd",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                <h4 className="mb-0">Change Password</h4>
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
                        <Form.Label>New Password*</Form.Label>
                        <Form.Control
                          type={
                            passwordVisibility.newPassword ? "text" : "password"
                          }
                          placeholder="Enter new password"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          required
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
                        <Form.Label>Confirm New Password*</Form.Label>
                        <Form.Control
                          type={
                            passwordVisibility.confirmPassword
                              ? "text"
                              : "password"
                          }
                          placeholder="Confirm new password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
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
                      Save
                    </Button>
                    <Button variant="secondary" type="button">
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Container>
        </div>
      </div>
    </>
  );
};

export default ChangePassword;
