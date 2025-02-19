import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Swal from "sweetalert2";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../../../../../Components/Header/Header";
import { editCustomerApi } from "../../../../../lib/store";
import { useTranslation } from "react-i18next";

const CustomerEdit = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { customer } = location.state || {};


  const [formData, setFormData] = useState({
    name: customer?.name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    address: customer?.address || "",
    company_id: customer?.company_id || localStorage.getItem("userId"),
    created_by: customer?.created_by || "",
  });

  const [token] = useState(localStorage.getItem("UserToken"));

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
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
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email is invalid";
      isValid = false;
    }

    // Validate phone: it must be a number and between 10-15 digits
if (!formData.phone || String(formData.phone).trim() === "") {
  newErrors.phone = "Phone is required";
  isValid = false;
} else if (!/^\d{10,15}$/.test(String(formData.phone))) {
  newErrors.phone = "Phone must contain between 10 and 15 digits";
  isValid = false;
}


    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
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
      text: t("Do you want to update this customer?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, update it!"),
      cancelButtonText: t("No, cancel"),
    });

    if (!result.isConfirmed) {
      console.log("Customer update was cancelled");
      return;
    }

    Swal.fire({
      title: t("Processing..."),
      text: t("Updating customer, please wait."),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const customerId = customer.user_id;
      const response = await editCustomerApi(customerId, formData, token);

      Swal.close();

      if (response.status === true) {
        Swal.fire({
          title: t("Success!"),
          text: t("Customer updated successfully."),
          icon: "success",
          confirmButtonText: t("OK"),
        }).then(() => {
          navigate("/customers/list");
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.message || t("There was an error updating the customer."),
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
              <h4 className="mb-0">{t("Update Customer Details")}</h4>
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
                      type="text"
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
                    background: "#8d28dd",
                    border: "none",
                  }}
                >
                  {t("Update")}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate("/customers/list")}
                >
                  {t("Back to Customer List")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerEdit;
