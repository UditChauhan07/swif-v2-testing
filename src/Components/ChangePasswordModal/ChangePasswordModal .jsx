import React, { useState } from "react";
import { Modal, Form, Button, Row, Col, Alert } from "react-bootstrap";
import { Eye, EyeSlash } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
// import { changePasswordApi } from "../../../lib/store"; // adjust the import path as needed
import "./ChangePass.css";
import { changePasswordApi } from "../../lib/store";

const ChangePasswordModal = ({ show, handleClose, userId }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState({
    newPassword: false,
    confirmPassword: false,
  });

  const token = localStorage.getItem("UserToken");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(null);
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
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

    // Validate password: 8-16 characters, one uppercase, one number, one special character

    try {
      const finalData = {
        id: userId,
        new_password: formData.confirmPassword,
      };
      const response = await changePasswordApi(finalData, token);
      // console.log("resss", response);
      if (response.status === true) {
        setSuccess(t("Password updated successfully!"));
        setFormData({ newPassword: "", confirmPassword: "" });
        setTimeout(() => {
          handleClose();
        }, 1000);
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
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdropClassName="transparent-backdrop" 
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: "transparent", border: "none" }}
      >
        <Modal.Title>{t("Change Password")}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: "transparent" }}>
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
                  type={passwordVisibility.newPassword ? "text" : "password"}
                  placeholder={t("Enter new password")}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
                <Button
                  variant="link"
                  className="position-absolute end-0 translate-middle-y text-decoration-none"
                  style={{ top: "70%" }}
                  onClick={() => togglePasswordVisibility("newPassword")}
                >
                  {passwordVisibility.newPassword ? <EyeSlash /> : <Eye />}
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
                    passwordVisibility.confirmPassword ? "text" : "password"
                  }
                  placeholder={t("Confirm New Password")}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                <Button
                  variant="link"
                  className="position-absolute end-0 translate-middle-y text-decoration-none"
                  style={{ top: "70%" }}
                  onClick={() => togglePasswordVisibility("confirmPassword")}
                >
                  {passwordVisibility.confirmPassword ? <EyeSlash /> : <Eye />}
                </Button>
              </Form.Group>
            </Col>
          </Row>
          <div className="d-flex justify-content-center">
            <Button
              style={{ backgroundColor: "#8d28dd", border: "none" }}
              type="submit"
              className="me-3"
            >
              {t("Save")}
            </Button>
            <Button variant="secondary" type="button" onClick={handleClose}>
              {t("Cancel")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ChangePasswordModal;
