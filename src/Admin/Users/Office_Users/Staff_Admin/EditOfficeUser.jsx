import React, { useState, useEffect } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import { Formik, Field, Form as FormikForm, ErrorMessage } from "formik";
import * as Yup from "yup";
import Header from "../../../../Components/Header/Header";
import { useNavigate, useLocation } from "react-router-dom";
import { edit_OfficeUser, fetchRolesList } from "../../../../lib/store";
import Swal from "sweetalert2";
import Select from "react-select";
import { getNames } from "country-list";


const validationSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .required("First Name is required")
    .min(4, "Must be at least 4 characters"),
  lastName: Yup.string()
    .trim()
    .required("Last Name is required")
    .min(4, "Must be at least 4 characters"),
  email: Yup.string()
    .trim()
    .email("Invalid email address")
    .required("Email is required"),
  // password: Yup.string()
  // .trim().min(6, "Password must be at least 6 characters")
  // .required("Password is required"),
  contactNumber: Yup.string()
    .trim()
    .matches(
      /^\+?\d{10,16}$/,
      "Must be a valid number with 10 to 16 digits (telecode optional)"
    )
    .required("Contact Number is required"),
  city: Yup.string().trim().required("City is required"),
  state: Yup.string().trim().required("State is required"),
  zip: Yup.string().trim().required("ZIP/Postal Code is required"),
  country: Yup.string().trim().required("Country is required"),
  role: Yup.string().trim().required("Role is required"),
});

const EditOfficeUser = () => {
  const [roles, setRoles] = useState([]);
  const token = localStorage.getItem("UserToken");
  const userid = localStorage.getItem("userId");
  const company_id = localStorage.getItem("companyId") || null;
  const navigate = useNavigate();
  const location = useLocation();
  const countryOptions = getNames().map((country) => ({
    value: country,
    label: country,
  }));
  
  const { row: userData } = location.state || {};
  console.log(userData);
  console.log("userData", userData);
  const officeuserId = userData.id || null;

  useEffect(() => {
    console.log("outsinde fetching officeuser");
    if (userid) {
      console.log("Inside fetching officeuser");
      fetchRolesList(userid, token)
        .then((response) => {
          setRoles(response.data);
          console.log("fetchRolesList", response);
        })
        .catch((error) => {
          console.log("error", error);
        });
    }
  }, [userid]);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    Swal.fire({
      title: "Updating...",
      text: "Updating Office User, please wait.",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    const formData = new FormData();
    formData.append("first_name", values.firstName);
    formData.append("last_name", values.lastName);
    formData.append("email", values.email);
    // formData.append("password", values.password);
    formData.append("contact_number", values.contactNumber);
    formData.append("city", values.city);
    formData.append("state", values.state);
    formData.append("zip_code", values.zip);
    formData.append("address", values.address);
    formData.append("country", values.country);
    formData.append("roleID", values.role);
    formData.append("isActive", values.activateUser);
    formData.append("company_id", company_id);

    const userData = {
      first_name: values.firstName,
      last_name: values.lastName,
      email: values.email,
      contact_number: values.contactNumber,
      city: values.city,
      state: values.state,
      zip_code: values.zip,
      Address: values.address,
      country: values.country,
      roleID: values.role,
      isActive: values.activateUser,
      company_id: company_id,
    };
    if (values.profilePicture instanceof File) {
      try {
        const base64 = await fileToBase64(values.profilePicture);
        userData.profile_picture = base64;
      } catch (error) {
        console.error("Error converting file to Base64:", error);
      }
    }

    console.log("formData", userData);
    edit_OfficeUser(userData, officeuserId, token)
      .then((response) => {
        if (response.status) {
          Swal.close();
          Swal.fire({
            title: "Success",
            text: "User Updated Successfully",
            icon: "success",
            timer: 1400, // Time in milliseconds (1400 ms = 1.4 seconds)
            showConfirmButton: false, // Optional: Hide the confirm buttonn
          });

          resetForm();
          setSubmitting(false);
          setTimeout(() => {
            navigate(-1);
          }, 1600);
        }
      })
      .catch((error) => {
        Swal.close();
        Swal.fire("Error", error.message, "error");

        console.log("error", error);
      });

    // const response = await updateOfficeUser(formData, token, userData.id);

    // if (response.status) {
    //   Swal.fire({
    //     title: "Success",
    //     text: "User Updated Successfully",
    //     icon: "success",
    //     timer: 1400, // Time in milliseconds (1400 ms = 1.4 seconds)
    //     showConfirmButton: false, // Optional: Hide the confirm buttonn
    //   });

    //   resetForm();
    //   setSubmitting(false);

    //   setTimeout(() => {
    //     navigate(`/users/office/${userData.role}`);
    //   }, 1600);
    // } else {
    //   Swal.fire("Error", response.message, "error");
    //   setSubmitting(false);
    // }
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
              <h4 className="mb-0">Edit User Details</h4>
            </div>

            <Formik
              initialValues={{
                firstName: userData.first_name || "",
                lastName: userData.last_name || "",
                email: userData.email || "",
                // password: "",
                contactNumber: userData.contact_number || "",
                city: userData.city || "",
                state: userData.state || "",
                zip: userData.zip_code || "",
                address: userData.Address || "",
                country: userData.country || "",
                role: userData.roleID || "",
                profilePicture: null,
                activateUser: userData.isActive == "1" ? true : false,
              }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ setFieldValue, isSubmitting,values }) => (
                <FormikForm>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name*</Form.Label>
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
                        <Form.Label>Last Name*</Form.Label>
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
                        <Form.Label>Email Address*</Form.Label>
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

                    {/* <Col md={6}>
                                      <Form.Group className="mb-3">
                                        <Form.Label>Password*</Form.Label>
                                        <Field className="form-control" type="password" name="password" maxLength={30}/>
                                        <ErrorMessage name="password" component="div" className="text-danger" />
                                      </Form.Group>
                                    </Col> */}

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Contact Number*</Form.Label>
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
                        <Form.Label>Profile Picture</Form.Label>
                        <input
                          className="form-control"
                          type="file"
                          onChange={(event) =>
                            setFieldValue(
                              "profilePicture",
                              event.target.files[0]
                            )
                          }
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>User's Address </Form.Label>
                        <Field
                          className="form-control"
                          as="textarea"
                          rows={2}
                          name="address"
                          maxLength={200}
                          onChange={(e) => setFieldValue('address', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>City*</Form.Label>
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
                        <Form.Label>State*</Form.Label>
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
                        <Form.Label>ZIP/Postal Code*</Form.Label>
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
                        <Form.Label>Country*</Form.Label>
                        <Select
                      options={countryOptions}
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

                    {/* <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Choose Role*</Form.Label>
                        <Field as="select" className="form-control" name="role">
                          <option value="">Select Role</option>
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
                    </Col> */}

                    <Col md={6} className="d-flex align-items-center">
                      <Field
                        type="checkbox"
                        name="activateUser"
                        className="form-check-input"
                      />
                      <label className="form-check-label ms-2">
                        Activate this User
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
                      Save
                    </Button>
                    <Button variant="secondary" type="reset" onClick={()=>navigate(-1)}>
                      Cancel
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

export default EditOfficeUser;
