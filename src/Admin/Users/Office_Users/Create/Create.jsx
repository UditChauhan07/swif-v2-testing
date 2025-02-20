import React, { useState, useEffect, useTransition } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../../../../Components/Header/Header";
import { usePermissions } from "../../../../context/PermissionContext";
import { createOfficeUser, fetchRolesList } from "../../../../lib/store";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import imageCompression from "browser-image-compression";
import Select from "react-select";
import { getNames } from "country-list";

const Create = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState([]);
  console.log("dads", roles);
  const token = localStorage.getItem("UserToken");
  const userid = localStorage.getItem("companyId");
  const company_id = localStorage.getItem("companyId") || null;
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

  const countryOptions = getNames().map((country) => ({
    value: country,
    label: country,
  }));

  const validationSchema = Yup.object({
    firstName: Yup.string()
      .trim()
      .required(t("First Name is required"))
      .min(4, t("Must be at least 4 characters")),
    lastName: Yup.string()
      .trim()
      .required(t("Last Name is required"))
      .min(4, t("Must be at least 4 characters")),
    email: Yup.string()
      .trim()
      .email(t("Invalid email address"))
      .required(t("Email is required")),
    password: Yup.string()
      .trim()
      .min(6, t("Password must be at least 6 characters"))
      .required(t("Password is required")),
    contactNumber: Yup.string()
      .trim()
      .matches(
        /^\+?\d{10,16}$/,
        t("Must be a valid number with 10 to 16 digits (telecode optional)")
      )
      .required(t("Contact Number is required")),
    city: Yup.string().trim().required(t("City is required")),
    state: Yup.string().trim().required(t("State is required")),
    zip: Yup.string().trim().required(t("ZIP/Postal Code is required")),
    // address: Yup.string().required(t("First Name is required")),
    country: Yup.string().trim().required(t("Country is required")),
    role: Yup.string().trim().required(t("Role is required")),
  });

  useEffect(() => {
    if (userid) {
      fetchRolesList(userid, token).then((response) => {
        setRoles(response?.data);
      });
    }
  }, [userid]);

  // New: Compress image files before updating state
  const handleImageChange = async (field, file, setFieldValue) => {
    if (file && file.type.startsWith("image/")) {
      const options = {
        maxSizeMB: 0.6,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        setFieldValue(field, compressedFile);
      } catch (error) {
        console.error("Error compressing image", error);
        setFieldValue(field, file);
      }
    } else {
      setFieldValue(field, file);
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <div className="">
            <div
              className="form-header mb-4"
              style={{
                backgroundColor: "#2e2e32",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              <h4 className="mb-0">{t("Enter User Details")}</h4>
            </div>

            {/* Formik Form */}
            <Formik
              initialValues={{
                firstName: "",
                lastName: "",
                email: "",
                password: "",
                contactNumber: "",
                city: "",
                state: "",
                zip: "",
                address: "",
                country: "",
                role: "",
                profilePicture: null,
                activateUser: true,
              }}
              validationSchema={validationSchema}
              onSubmit={async (values, { setSubmitting, resetForm }) => {
                Swal.fire({
                  title: "Creating...",
                  text: "Creating Office User, please wait.",
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });
                setSubmitting(true);
                const formData = new FormData();
                formData.append("first_name", values.firstName);
                formData.append("last_name", values.lastName);
                formData.append("email", values.email);
                formData.append("password", values.password);
                formData.append("contact_number", values.contactNumber);
                formData.append("city", values.city);
                formData.append("state", values.state);
                formData.append("zip_code", values.zip);
                formData.append("Address", values.address);
                formData.append("country", values.country);
                formData.append("roleID", values.role);
                formData.append("isActive", values.activateUser ? "1" : "0");
                formData.append("company_id", company_id);
                // Append profile picture if selected
                if (values.profilePicture instanceof File) {
                  try {
                    const base64 = await fileToBase64(values.profilePicture);
                    console.log(values.profilePicture, base64);
                    setProfile(base64);
                  } catch (error) {
                    console.error("Error converting file to Base64:", error);
                  }
                }
                console.log("formDataaaa", formData);

                const finalData = {
                  first_name: values.firstName,
                  company_id: company_id,
                  last_name: values.lastName,
                  email: values.email,
                  password: values.password,
                  contact_number: values.contactNumber,
                  city: values.city,
                  state: values.state,
                  zip_code: values.zip,
                  Address: values.address,
                  country: values.country,
                  roleID: values.role,
                  profile_picture: profile,
                  isActive: values.activateUser,
                };
                if (values.profilePicture instanceof File) {
                  try {
                    const base64 = await fileToBase64(values.profilePicture);
                    console.log(values.profilePicture, base64);
                    setProfile(base64);
                    finalData.profile_picture = base64 || null;
                  } catch (error) {
                    console.error("Error converting file to Base64:", error);
                  }
                }

                console.log("finalDataa", values);

                const submitData = await createOfficeUser(finalData, token);
                Swal.close();
                console.log("submitDataa", submitData);
                // console.log('response',submitData)
                if (submitData.status) {
                  Swal.fire({
                    title: "Success",
                    text: "User Created Successfully",
                    icon: "success",
                    timer: 1400, // Time in milliseconds (1400 ms = 1.4 seconds)
                    showConfirmButton: false, // Optional: Hide the confirm button
                  });
                  values.profilePicture = null;
                  resetForm();
                  const roleName = roles?.find(
                    (role) => role.id === values.role
                  )?.roleName;
                  setTimeout(() => {
                    navigate(`/users/office/${roleName}?id=${values.role}`);
                  }, 1600);
                  setSubmitting(false);
                } else {
                  Swal.fire("Error", "User Created Successfully", "error");
                }
              }}
            >
              {({ setFieldValue, isSubmitting, values }) => (
                <FormikForm>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("First Name")}*</Form.Label>
                        <Field
                          className="form-control"
                          type="text"
                          name="firstName"
                          maxLength={40}
                        />
                        <ErrorMessage
                          name="firstName"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("Last Name")}*</Form.Label>
                        <Field
                          className="form-control"
                          type="text"
                          name="lastName"
                          maxLength={40}
                        />
                        <ErrorMessage
                          name="lastName"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("Email Address")}*</Form.Label>
                        <Field
                          className="form-control"
                          type="email"
                          name="email"
                          maxLength={50}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("Password")}*</Form.Label>
                        <Field
                          className="form-control"
                          type="password"
                          name="password"
                          maxLength={30}
                        />
                        <ErrorMessage
                          name="password"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("Contact Number")}*</Form.Label>
                        <Field
                          className="form-control"
                          type="tel"
                          name="contactNumber"
                          maxLength={20}
                        />
                        <ErrorMessage
                          name="contactNumber"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("Profile Picture")}</Form.Label>
                        <input
                          className="form-control"
                          type="file"
                          onChange={(event) =>
                            handleImageChange(
                              "profilePicture",
                              event.target.files[0],
                              setFieldValue
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("User's Address")} </Form.Label>
                        <Field
                          className="form-control"
                          as="textarea"
                          rows={2}
                          name="address"
                          maxLength={200}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("City")}*</Form.Label>
                        <Field
                          className="form-control"
                          type="text"
                          name="city"
                          maxLength={40}
                        />
                        <ErrorMessage
                          name="city"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("State")}*</Form.Label>
                        <Field
                          className="form-control"
                          type="text"
                          name="state"
                          maxLength={40}
                        />
                        <ErrorMessage
                          name="state"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("ZIP/Postal Code")}*</Form.Label>
                        <Field
                          className="form-control"
                          type="text"
                          name="zip"
                          maxLength={10}
                        />
                        <ErrorMessage
                          name="zip"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("Country")}*</Form.Label>
                        <Select
                          options={countryOptions}
                          placeholder={t("Select a country")}

                          onChange={(selectedOption) =>
                            setFieldValue("country", selectedOption.value)
                          }
                          value={countryOptions.find(
                            (option) => option.value === values.country
                          )}
                          styles={{
                            menuList: (provided) => ({
                              ...provided,
                              maxHeight: "150px", // Limits dropdown height
                              overflowY: "auto",
                            }),
                          }}
                        />
                        <ErrorMessage
                          name="country"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>{t("Choose Role")}*</Form.Label>
                        <Field as="select" className="form-control" name="role">
                          <option value="">{t("Select Role")}</option>
                          {roles?.length > 0 &&
                            roles?.map((role) => (
                              <option key={role.id} value={role.id}>
                                {role.roleName}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          name="role"
                          component="div"
                          className="text-danger"
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6} className="d-flex align-items-center">
                      <Field
                        type="checkbox"
                        name="activateUser"
                        className="form-check-input"
                      />
                      <label className="form-check-label ms-2">
                        {t("Activate this User")}
                      </label>
                    </Col>
                  </Row>

                  <div className="text-center">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting}
                      className="me-2"
                    >
                      {t("Save")}
                    </Button>
                    <Button
                      variant="secondary"
                      type="reset"
                      onClick={() => navigate("/dashboard/admin")}
                    >
                      {t("Cancel")}
                    </Button>
                  </div>
                </FormikForm>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
};

export default Create;
