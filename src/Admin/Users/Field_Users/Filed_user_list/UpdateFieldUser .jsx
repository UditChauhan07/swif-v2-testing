import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "../../../../Components/Header/Header";
import { update_FieldUser } from "../../../../lib/store"; // Assuming this is your update API function
import Swal from "sweetalert2";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Select from "react-select";
import { getNames } from "country-list";

const UpdateFieldUser = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const token = localStorage.getItem("UserToken");
  const location = useLocation();
  const { row: userData } = location.state || {};
  const countryOptions = getNames().map((country) => ({
    value: country,
    label: country,
  }));

  // Formik initial values based on passed data (userData)
  const formik = useFormik({
    initialValues: {
      name: userData.name || "",
      username: userData.username || "",
      contact_number: userData.contact_number || "",
      email: userData.email || "",
      password: "",
      profilePicture: null,
      country: userData.country || "",
      address: userData.address || "",
      company_id: userData.company_id || null,
      created_by: userData.created_by || null,
      created_by_id: userData.created_by_id || null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      username: Yup.string().required("Username is required"),
      contact_number: Yup.string()
        .required("Contact number is required")
        .matches(/^[0-9]+$/, "Contact number must be digits only"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      password: Yup.string().min(6, "Password must be at least 6 characters"),
      country: Yup.string().required("Country is required"),
      address: Yup.string().required("Address is required"),
    }),
    onSubmit: async (values) => {
      const formData = new FormData();
      for (const key in values) {
        if (key === "profilePicture") {
          if (values[key]) formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      }

      // console.log("Form", values);
      // console.log("hghh",userData.id)
      const response = await update_FieldUser(values, token, userData.id); // Assuming userData.id is the unique ID
      console.log("hghh", response);
      if (response.success) {
        Swal.fire({
          title: t("Success"),
          text: t("Field User Updated Successfully"),
          icon: "success",
          timer: 1400, // Time in milliseconds (1400 ms = 1.4 seconds)
          showConfirmButton: false, // Optional: Hide the confirm button
        });
        formik.resetForm();
        setTimeout(() => {
          navigate(`/users/field/list`); // Navigate to the field user list after successful update
        }, 1600);
      } else {
        Swal.fire("Error", response.message, "error");
      }
      //   console.log("Response", response);
    },
  });

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
              <h4 className="mb-0">{t("Update Field Agent Details")}</h4>
            </div>
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formName">
                    <Form.Label>
                      {t("Name")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Name")}
                      name="name"
                      maxLength={40}
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      isInvalid={formik.touched.name && formik.errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Label>
                      {t("Email")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={t("Enter Email")}
                      name="email"
                      maxLength={50}
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      isInvalid={formik.touched.email && formik.errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>
                      {t("Username")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Text className="d-block mb-1 text-muted">
                      {t("Field User can login via this Username")}
                    </Form.Text>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Username")}
                      name="username"
                      maxLength={20}
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      isInvalid={
                        formik.touched.username && formik.errors.username
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formPassword">
                    <Form.Label>
                      {t("Password")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Text className="d-block mb-1 text-muted">
                      {t("Leave blank to keep the current password")}
                    </Form.Text>
                    <Form.Control
                      type="password"
                      placeholder={t("Enter Password")}
                      name="password"
                      maxLength={30}
                      value={formik.values.password}
                      onChange={formik.handleChange}
                      isInvalid={
                        formik.touched.password && formik.errors.password
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formContactNumber">
                    <Form.Label>
                      {t("Contact Number")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder={t("Enter Contact Number")}
                      name="contact_number"
                      maxLength={16}
                      value={formik.values.contact_number}
                      onChange={formik.handleChange}
                      isInvalid={
                        formik.touched.contact_number &&
                        formik.errors.contact_number
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.contact_number}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                {/* 
                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formProfilePicture">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control
                      type="file"
                      name="profilePicture"
                      onChange={(e) => formik.setFieldValue("profilePicture", e.target.files[0])}
                    />
                  </Form.Group>
                </Col> */}

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formCountry">
                    <Form.Label>
                      {t("Country")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      options={countryOptions}
                      onChange={(selectedOption) =>
                        formik.setFieldValue("country", selectedOption.value)
                      }
                      value={countryOptions.find(
                        (option) => option.value === formik.values.country
                      )}
                      styles={{
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: "150px", // Limits dropdown height
                          overflowY: "auto",
                        }),
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.country}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formAddress">
                    <Form.Label>
                      {t("Address")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      placeholder={t("Enter Address")}
                      name="address"
                      maxLength={150}
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      isInvalid={
                        formik.touched.address && formik.errors.address
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.address}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="text-center">
                <Button
                  type="submit"
                  className="me-2"
                  style={{ backgroundColor: "#8d28dd", border: "none" }}
                >
                  {t("Update")}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate("/users/field/list")}
                >
                  {t("Cancel")}
                </Button>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateFieldUser;
