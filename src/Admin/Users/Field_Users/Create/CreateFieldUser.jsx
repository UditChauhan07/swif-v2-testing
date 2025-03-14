import React from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Header from "../../../../Components/Header/Header";
import { create_FieldUser } from "../../../../lib/store";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getNames } from "country-list";
import Select from "react-select";
import { BeatLoader } from "react-spinners";

const CreateFieldUser = () => {
  const { t } = useTranslation();
  const countries = getNames();
  const navigate = useNavigate();
  const token = localStorage.getItem("UserToken");
  const company_id = localStorage.getItem("companyId") || null;
  const created_by = localStorage.getItem("name") || null;
  const created_by_id = localStorage.getItem("userId") || null;

  const formik = useFormik({
    initialValues: {
      name: "",
      username: "",
      contact_number: "",
      email: "",
      password: "",
      profilePicture: null,
      country: "",
      address: "",
      company_id: company_id,
      created_by: created_by,
      created_by_id: created_by_id,
    },
    validationSchema: Yup.object({
      name: Yup.string().required(t("Name is required")),
      username: Yup.string().required(t("Username is required")),
      contact_number: Yup.string()
        .required(t("Contact number is required"))
        .matches(/^[0-9]+$/, t("Contact number must be digits only")),
      email: Yup.string()
        .email(t("Invalid email format"))
        .required(t("Email is required")),
      password: Yup.string()
        .required(t("Password is required"))
        .min(8, t("Password must be at least 8 characters"))
        .max(16, t("Password must not exceed 16 characters"))
        .matches(
          /[A-Z]/,
          t("Password must contain at least one uppercase letter")
        )
        .matches(
          /[a-z]/,
          t("Password must contain at least one lowercase letter")
        )
        .matches(/[0-9]/, t("Password must contain at least one number"))
        .matches(
          /[\W_]/,
          t("Password must contain at least one special character")
        ),
      country: Yup.string().required(t("Country is required")),
      address: Yup.string().required(t("Address is required")),
    }),
    onSubmit: async (values) => {
      Swal.fire({
        title: t("Processing..."),
        text: t("Creating field user, please wait."),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      for (const key in values) {
        if (key === "profilePicture") {
          if (values[key]) formData.append(key, values[key]);
        } else {
          formData.append(key, values[key]);
        }
      }
      console.log("Form", values);

      const response = await create_FieldUser(values, token);
      Swal.close();
      if (response.success) {
        Swal.fire({
          title: t("Success"),
          text: t("Field User Created Successfully"),
          icon: "success",
          timer: 1400,
          showConfirmButton: false,
        });
        formik.resetForm();
        formik.values.profilePicture = null;
        setTimeout(() => {
          navigate(`/users/field/list`);
        }, 1600);
      } else {
        Swal.fire("Error", response.error, "error");
      }
      console.log("Response", response);
    },
  });

  // Custom submit handler that scrolls to the first error field if validation fails.
  const handleSubmitWithScroll = async (e) => {
    e.preventDefault();
    const errors = await formik.validateForm();
    if (Object.keys(errors).length > 0) {
      // Mark all fields as touched so that error messages appear.
      formik.setTouched(
        Object.keys(errors).reduce((acc, key) => ({ ...acc, [key]: true }), {})
      );
      // Wait for error messages to render, then scroll to the first field with an error.
      setTimeout(() => {
        const firstErrorFieldName = Object.keys(errors)[0];
        const errorElement = document.querySelector(
          `[name="${firstErrorFieldName}"]`
        );
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: "smooth", block: "center" });
          errorElement.focus();
        }
      }, 100);
    } else {
      formik.handleSubmit(e);
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
              <h4 className="mb-0">{t("Enter Field Agent Details")}</h4>
            </div>
            <Form onSubmit={handleSubmitWithScroll}>
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
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(
                          /[^a-zA-Z\s]/g,
                          ""
                        );
                      }}
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
                    <Form.Text className="d-block mb-1 text-muted">
                      {t("Field User can login via this Email")}
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-3" controlId="formUsername">
                    <Form.Label>
                      {t("Username")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Text className="d-block mb-1 text-muted">
                      {/* {t("Field User can login via this Username")} */}
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
                    <Form.Text className="d-block mb-1 text-muted">
                      {t("Field User can login via this Password")}
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group className="mb-4" controlId="formContactNumber">
                    <Form.Label>
                      {t("Contact Number")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder={t("Enter Contact Number")}
                      name="contact_number"
                      maxLength={16}
                      minLength={10}
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

                <Col md={6}>
                  <Form.Group className="mb-4" controlId="formCountry">
                    <Form.Label>
                      {t("Country")}
                      <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      options={countries.map((country) => ({
                        label: country,
                        value: country,
                      }))}
                      onChange={(selectedOption) =>
                        formik.setFieldValue("country", selectedOption.value)
                      }
                      value={
                        countries.find((c) => c === formik.values.country)
                          ? {
                              label: formik.values.country,
                              value: formik.values.country,
                            }
                          : null
                      }
                      styles={{
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: "150px",
                          overflowY: "auto",
                        }),
                      }}
                    />
                    {formik.touched.country && formik.errors.country && (
                      <div className="text-danger">{formik.errors.country}</div>
                    )}
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
                  {t("Save")}
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate("/dashboard/admin")}
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

export default CreateFieldUser;
