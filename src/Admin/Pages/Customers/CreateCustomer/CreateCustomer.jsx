import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Header from "../../../../Components/Header/Header";
import { createCustomerApi } from "../../../../lib/store";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CreateCustomer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [adminName] = useState(localStorage.getItem("name"));
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // Will store phone as a number once entered
    address: "",
    company_id: localStorage.getItem("companyId"),
    created_by: adminName,
  });
  const [token] = useState(localStorage.getItem("UserToken"));

  // Errors for each field
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    // For the phone field, convert the value to a number (if not empty)
    if (name === "phone") {
      newValue = value === "" ? "" : Number(value);
    }
    setFormData({
      ...formData,
      [name]: newValue,
    });

    // Clear validation errors when the user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      name: "",
      email: "",
      phone: "",
      address: "",
    };

    // Validate name: required, max length 15 and no numbers allowed.
    if (!formData.name.trim()) {
      newErrors.name = t("Name is required");
      isValid = false;
    } else if (formData.name.length > 20) {
      newErrors.name = t("Name must not exceed 20 characters");
      isValid = false;
    } else if (/\d/.test(formData.name)) {
      newErrors.name = t("Name should not contain numbers");
      isValid = false;
    }

    // Validate email using a stricter regex
    if (!formData.email.trim()) {
      newErrors.email = t("Email is required");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("Email is invalid");
      isValid = false;
    }

    // Validate phone: it must be a number and exactly 10 to 15 digits.
    if (formData.phone === "" || formData.phone === null) {
      newErrors.phone = t("Phone is required");
      isValid = false;
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = t("Phone must contain between 10 and 15 digits");
      isValid = false;
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = t("Address is required");
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const result = await Swal.fire({
      title: t("Are you sure?"),
      text: t("Do you want to create customer?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, create it!"),
      cancelButtonText: t("No, cancel"),
    });

    if (!result.isConfirmed) {
      console.log("Customer creation was cancelled");
      return;
    }

    Swal.fire({
      title: t("Processing..."),
      text: t("Creating Customer, please wait."),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await createCustomerApi(formData, token);

      Swal.close();
      // console.log("Form submitted successfully:", formData);

      if (response.status === true) {
        Swal.fire({
          title: t("Success!"),
          text: t("Customer created successfully."),
          icon: "success",
          confirmButtonText: t("OK"),
        }).then(() => {
          navigate("/customers/list");
        });
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          company_id: localStorage.getItem("userId"),
          created_by: adminName,
        });
      } else {
        Swal.fire({
          title: "Error!",
          text:
            response.message || t("There was an error creating the Customer."),
          icon: "error",
          confirmButtonText: t("Try Again"),
        });
      }
    } catch (error) {
      Swal.close();
      console.error("API Error:", error);
      Swal.fire({
        title: t("API Error!"),
        text: t("Something went wrong. Please try again later."),
        icon: "error",
        confirmButtonText: t("OK"),
      });
    }
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <div>
            <div
              className="form-header mb-4"
              style={{
                backgroundColor: "#2e2e32",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              <h4 className="mb-0">{t("Enter Customer Details")}</h4>
            </div>
            <Form onSubmit={handleSubmit}>
              <Row>
                {/* Name Field */}
                <Col md={12}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>
                      {t("Name")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Name")}
                      name="name"
                      value={formData.name}
                      max={20}
                      onChange={handleInputChange}
                      isInvalid={!!errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Email Field */}
                <Col md={12}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>
                      {t("Email Address")}{" "}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={t("Enter Email Address")}
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Phone Field */}
                <Col md={12}>
                  <Form.Group className="mb-3" controlId="formPhone">
                    <Form.Label>
                      {t("Phone")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      placeholder={t("Enter Phone Number")}
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      isInvalid={!!errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                {/* Address Field */}
                <Col md={12}>
                  <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>
                      {t("Address")} <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Address")}
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      isInvalid={!!errors.address}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center">
                <Button
                  type="submit"
                  className="me-2"
                  style={{
                    background: "#2e2e32",
                    border: "none",
                  }}
                >
                  {t("Save")}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate("/customers/list")}
                >
                  {t("Back")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CreateCustomer;
