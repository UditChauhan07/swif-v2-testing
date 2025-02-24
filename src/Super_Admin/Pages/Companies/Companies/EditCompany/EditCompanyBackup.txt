import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  InputGroup,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { createCompanyApi, editCompanyApi } from "../../../../../lib/store";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../../../../Components/Header/Header";
import { useTranslation } from "react-i18next";
import imageCompression from "browser-image-compression";
import Select from "react-select";
import { getNames } from "country-list";

const EditCompany = () => {
  const { t, i18n } = useTranslation();
  const countryOptions = getNames().map((country) => ({
    value: country,
    label: country,
  }));
  const [currentStep, setCurrentStep] = useState(1);
  const { state } = useLocation();
  const { company = {}, user = {} } = state.company || {};
  // console.log("Company------", state.company);
  const [companyId, setcompanyId] = useState(state.company.company.id);

  const [formData, setFormData] = useState({
    // Step 1: Super Admin Details
    firstName: "",
    lastName: "",
    profilePicture: null,
    contactNumber: "",
    email: "",
    password: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zip: "",

    // Step 2: Company Basic Details
    companyName: "",
    companyLogo: null,
    currency: "",
    timeZone: "",
    taxName: "",
    taxPercentage: "",
    certificationName: "",
    certificationNumber: "",
    additionalCertifications: [],

    // Step 3: Contact Information
    addressLine1: "",
    addressLine2: "",
    contactCity: "",
    companyState: "",
    contactCountry: "",
    contactZip: "",
    contactPerson: "",
    contactPhone: "",
    officePhone: "",
    officeEmail: "",

    // Step 4: Other Settings
    package: "Full Pack",
    packageDescritption: [
      "Each Quotation creation Charge will be 0.15/quotation.",
      "Each Contract creation Charge will be 0.00/contract.",
      "Each Work Order creation Charge will be 0.10/work order.",
      "Each Work Order charge further 0.40 after complete Work Order.",
    ],
    workOrderTime: "04:00",
    quotationCost: "0.15",
    freeQuotations: "51",
    primaryWorkOrderCost: "0.10",
    executionWorkOrderCost: "0.40",
    freeWorkOrders: "101",
    customerAddressFormat: "US",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    companyStatus: true,
  });

  useEffect(() => {
    if (company && user) {
      setFormData((prev) => ({
        ...prev,
        // Step 1: Super Admin Details
        firstName: user.first_name || "",
        lastName: user.last_name || "",
        profilePicture: null,
        contactNumber: user.contact_number || "",
        email: user.email || "",
        address: user.Address || "",
        city: user.city || "",
        state: user.state || "",
        country: user.country || "",
        zip: user.zip_code || "",

        // Step 2: Company Basic Details
        companyName: company.company_name || "",
        companyLogo: null,
        currency: company.currency || "",
        timeZone: company.time_zone || "",
        taxName: company.tax_name || "",
        taxPercentage: company.tax_percentage || "",
        certificationName: company.certificates?.[0]?.name || "",
        certificationNumber: company.certificates?.[0]?.number || "",
        additionalCertifications: company.certificates || [],

        // Step 3: Contact Information
        addressLine1: company.address_line_1 || "",
        addressLine2: company.address_line_2 || "",
        contactCity: company.city || "",
        contactCountry: company.country || "",
        companyState: company.companyState || "",
        contactZip: company.zip_postal_code || "",
        contactPerson: company.company_contact_person_name || "",
        contactPhone: company.contact_person_phone || "",
        officePhone: company.company_office_phone || "",
        officeEmail: company.company_office_email || "",

        // Step 4: Other Settings
        package: company.package || "",
        packageDescritption: company.packageDescritption || [],
        workOrderTime: company.workOrderTime || "",
        quotationCost: company.quotationCost || "",
        freeQuotations: company.freeQuotations || "",
        primaryWorkOrderCost: company.primaryWorkOrderCost || "",
        executionWorkOrderCost: company.executionWorkOrderCost || "",
        freeWorkOrders: company.freeWorkOrders || "",
        customerAddressFormat: company.customerAddressFormat || "",
        workingDays: company.workingDays || [],
        companyStatus: company.companyStatus ?? true, // Ensures `true` if undefined
      }));
    }
  }, []);
  const navigate = useNavigate();
  const [token, settoken] = useState(localStorage.getItem("UserToken"));
  console.log("formData", formData);
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    const currentErrors = validateStep(currentStep);
    if (Object.keys(currentErrors).length === 0) {
      setErrors({});
      if (currentStep < 2) setCurrentStep((prev) => prev + 1);
    } else {
      setErrors(currentErrors);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      const isAlphanumeric = /^[a-zA-Z0-9]*$/;
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isPhone = /^[0-9]{10,15}$/;
      const isAlpha = /^[a-zA-Z ]*$/;
      const isAlphanumericWithSpaces = /^[a-zA-Z0-9 ]*$/;

      switch (field) {
        case "firstName":
          if (
            !value.trim() ||
            value.length < 1 ||
            value.length > 60 ||
            !isAlpha.test(value)
          ) {
            newErrors.firstName =
              "First Name must be 1-60 characters, letters only.";
          } else {
            delete newErrors.firstName;
          }
          break;

        case "lastName":
          if (
            !value.trim() ||
            value.length < 1 ||
            value.length > 60 ||
            !isAlpha.test(value)
          ) {
            newErrors.lastName =
              "Last Name must be 1-60 characters, letters only.";
          } else {
            delete newErrors.lastName;
          }
          break;

        case "email":
          if (!value.trim() || !isEmail.test(value)) {
            newErrors.email = "Valid Email Address is required.";
          } else {
            delete newErrors.email;
          }
          break;

        // case "password":
        //   if (
        //     !value.trim() ||
        //     value.length < 1 ||
        //     value.length > 60 ||
        //     !isAlphanumeric.test(value)
        //   ) {
        //     newErrors.password =
        //       "Password must be 1-60 alphanumeric characters, no spaces.";
        //   } else {
        //     delete newErrors.password;
        //   }
        //   break;

        case "contactNumber":
          if (!value.trim() || !isPhone.test(value)) {
            newErrors.contactNumber =
              "Valid Contact Number (10-15 digits) is required.";
          } else {
            delete newErrors.contactNumber;
          }
          break;

        case "address":
          if (value.trim() && value.length < 5) {
            newErrors.address = "Address must be at least 5 characters long.";
          } else {
            delete newErrors.address;
          }
          break;

        case "city":
          if (
            !value.trim() ||
            value.length < 2 ||
            value.length > 60 ||
            !isAlpha.test(value)
          ) {
            newErrors.city = "City must be 2-60 characters, letters only.";
          } else {
            delete newErrors.city;
          }
          break;

        case "state":
          if (
            !value.trim() ||
            value.length < 2 ||
            value.length > 60 ||
            !isAlpha.test(value)
          ) {
            newErrors.state = "State must be 2-60 characters, letters only.";
          } else {
            delete newErrors.state;
          }
          break;

        case "zip":
          if (
            !value.trim() ||
            value.length < 3 ||
            !isAlphanumericWithSpaces.test(value)
          ) {
            newErrors.zip =
              "ZIP/Postal Code must be at least 3 characters, alphanumeric only.";
          } else {
            delete newErrors.zip;
          }
          break;

        case "companyName":
          if (
            !value.trim() ||
            value.length < 1 ||
            value.length > 60 ||
            !isAlpha.test(value)
          ) {
            newErrors.companyName =
              "Company Name must be 1-60 characters, no numbers.";
          } else {
            delete newErrors.companyName;
          }
          break;

        case "currency":
          if (!value) {
            newErrors.currency = "Currency is required.";
          } else {
            delete newErrors.currency;
          }
          break;

        case "timeZone":
          if (!value) {
            newErrors.timeZone = "Time Zone is required.";
          } else {
            delete newErrors.timeZone;
          }
          break;

        case "taxName":
          if (
            !value.trim() ||
            value.length < 1 ||
            value.length > 60 ||
            !isAlpha.test(value)
          ) {
            newErrors.taxName =
              "Tax Name must be 1-60 characters, letters only.";
          } else {
            delete newErrors.taxName;
          }
          break;

        case "taxPercentage":
          if (isNaN(value) || value < 0 || value > 40) {
            newErrors.taxPercentage =
              "Tax Percentage must be a number between 0 and 40.";
          } else {
            delete newErrors.taxPercentage;
          }
          break;

        case "certificationName":
          if (value.trim() && value.length < 3) {
            newErrors.certificationName =
              "Certification Name must be at least 3 characters.";
          } else {
            delete newErrors.certificationName;
          }
          break;

        case "certificationNumber":
          if (value.trim() && value.length < 3) {
            newErrors.certificationNumber =
              "Certification Number must be at least 3 characters.";
          } else {
            delete newErrors.certificationNumber;
          }
          break;

        case "addressLine1":
          if (!value.trim() || value.length < 5) {
            newErrors.addressLine1 =
              "Address Line 1 must be at least 5 characters.";
          } else {
            delete newErrors.addressLine1;
          }
          break;

        case "addressLine2":
          if (value.trim() && value.length < 5) {
            newErrors.addressLine2 =
              "Address Line 2 must be at least 5 characters.";
          } else {
            delete newErrors.addressLine2;
          }
          break;

        case "contactCity":
          if (
            !value.trim() ||
            value.length < 2 ||
            value.length > 60 ||
            !isAlpha.test(value)
          ) {
            newErrors.contactCity =
              "City must be 2-60 characters, letters only.";
          } else {
            delete newErrors.contactCity;
          }
          break;

        case "companyState":
          if (
            !value.trim() ||
            value.length < 2 ||
            value.length > 60 ||
            !isAlpha.test(value)
          ) {
            newErrors.companyState =
              "State must be 2-60 characters, letters only.";
          } else {
            delete newErrors.companyState;
          }
          break;

        case "contactZip":
          if (
            !value.trim() ||
            value.length < 3 ||
            !isAlphanumericWithSpaces.test(value)
          ) {
            newErrors.contactZip =
              "ZIP/Postal Code must be at least 3 characters, alphanumeric only.";
          } else {
            delete newErrors.contactZip;
          }
          break;

        case "contactPerson":
          if (!value.trim()) {
            newErrors.contactPerson = "Contact Person Required";
          } else {
            delete newErrors.contactPerson;
          }
          break;

        case "contactPhone":
          if (!value.trim() || !isPhone.test(value)) {
            newErrors.contactPhone =
              "Valid Person Phone (10-15 digits) is required.";
          } else {
            delete newErrors.contactPhone;
          }
          break;
        case "officePhone":
          if (!value.trim() || !isPhone.test(value)) {
            newErrors.officePhone =
              "Valid Office Phone (10-15 digits) is required.";
          } else {
            delete newErrors.officePhone;
          }
          break;

        case "officeEmail":
          if (!value.trim() || !isEmail.test(value)) {
            newErrors.officeEmail = "Valid Office Email Address is required.";
          } else {
            delete newErrors.officeEmail;
          }
          break;

        case "workOrderTime":
          if (!value.trim()) {
            newErrors.workOrderTime = "Default Work Order Time is required.";
          } else {
            delete newErrors.workOrderTime;
          }
          break;

        case "quotationCost":
          if (isNaN(value) || value < 0 || value > 1000) {
            newErrors.quotationCost =
              "Quotation Cost must be a number between 0 and 1000.";
          } else {
            delete newErrors.quotationCost;
          }
          break;

        case "primaryWorkOrderCost":
          if (isNaN(value) || value < 0 || value > 1000) {
            newErrors.primaryWorkOrderCost =
              "Primary Work Order Cost must be a number between 0 and 1000.";
          } else {
            delete newErrors.primaryWorkOrderCost;
          }
          break;

        case "executionWorkOrderCost":
          if (isNaN(value) || value < 0 || value > 1000) {
            newErrors.executionWorkOrderCost =
              "Execution Work Order Cost must be a number between 0 and 1000.";
          } else {
            delete newErrors.executionWorkOrderCost;
          }
          break;

        default:
          break;
      }
      return newErrors;
    });
  };
  const validateStep = (step) => {
    const newErrors = {};
    const isAlphanumeric = /^[a-zA-Z0-9]*$/;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isPhone = /^[0-9]{10,15}$/;
    const isAlpha = /^[a-zA-Z ]*$/;
    const isAlphanumericWithSpaces = /^[a-zA-Z0-9 ]*$/;

    switch (step) {
      case 1:
        if (
          !formData.firstName ||
          !formData.firstName.trim() ||
          formData.firstName.length < 1 ||
          formData.firstName.length > 60 ||
          !isAlpha.test(formData.firstName)
        )
          newErrors.firstName =
            "First Name must be 1-60 characters, letters only.";
        if (
          !formData.lastName ||
          !formData.lastName.trim() ||
          formData.lastName.length < 1 ||
          formData.lastName.length > 60 ||
          !isAlpha.test(formData.lastName)
        )
          newErrors.lastName =
            "Last Name must be 1-60 characters, letters only.";
        if (
          !formData.email ||
          !formData.email.trim() ||
          !isEmail.test(formData.email)
        )
          newErrors.email = "Valid Email Address is required.";
        // if (
        //   !formData.password ||
        //   !formData.password.trim() ||
        //   formData.password.length < 1 ||
        //   formData.password.length > 60 ||
        //   !isAlphanumeric.test(formData.password)
        // )
        //   newErrors.password =
        //     "Password must be 1-60 alphanumeric characters, no spaces.";

        if (!formData.contactNumber || !isPhone.test(formData.contactNumber))
          newErrors.contactNumber =
            "Valid Contact Number (10-15 digits) is required.";
        break;

      case 2:
        if (
          !formData.companyName ||
          !formData.companyName.trim() ||
          formData.companyName.length < 1 ||
          formData.companyName.length > 60 ||
          !isAlpha.test(formData.companyName)
        )
          newErrors.companyName =
            "Company Name must be 1-60 characters, no numbers.";

        if (
          !formData.addressLine1 ||
          !formData.addressLine1.trim() ||
          formData.addressLine1.length < 5
        )
          newErrors.addressLine1 =
            "Address Line 1 must be at least 5 characters.";
        // if (formData.addressLine2 && formData.addressLine2.length < 5)
        //   newErrors.addressLine2 =
        //     "Address Line 2 must be at least 5 characters.";
        if (
          !formData.contactCity ||
          !formData.contactCity.trim() ||
          formData.contactCity.length < 2 ||
          formData.contactCity.length > 60 ||
          !isAlpha.test(formData.contactCity)
        )
          newErrors.contactCity = "City must be 2-60 characters, letters only.";
        if (
          !formData.companyState ||
          !formData.companyState.trim() ||
          formData.companyState.length < 2 ||
          formData.companyState.length > 60 ||
          !isAlpha.test(formData.companyState)
        )
          newErrors.companyState =
            "State must be 2-60 characters, letters only.";
        if (
          !formData.contactZip ||
          !formData.contactZip.trim() ||
          formData.contactZip.length < 3 ||
          !isAlphanumericWithSpaces.test(formData.contactZip)
        )
          newErrors.contactZip =
            "ZIP/Postal Code must be at least 3 characters, alphanumeric only.";
        if (!formData.contactPerson || !formData.contactPerson.trim())
          newErrors.contactPerson = "Contact Person is required.";
        if (!formData.contactPhone.trim())
          if (!formData.officeEmail.trim())
            newErrors.officeEmail = "Office Email Address is required.";

        break;
      default:
        break;
    }

    return newErrors;
  };

  // New: Compress image files before updating state
  const handleImageChange = async (field, file) => {
    if (file && file.type.startsWith("image/")) {
      const options = {
        maxSizeMB: 0.6,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        setFormData((prev) => ({
          ...prev,
          [field]: compressedFile,
        }));
      } catch (error) {
        console.error("Error compressing image", error);
        // Fallback to original file if compression fails
        setFormData((prev) => ({
          ...prev,
          [field]: file,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: file,
      }));
    }
  };
  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        return null;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async () => {
    const currentErrors = validateStep(currentStep);
    console.log(currentErrors);
    if (
      Object.keys(errors).length > 0 ||
      Object.keys(currentErrors).length > 0
    ) {
      return;
    }
    console.log("Submit---", formData);
    const profilePictureBase64 = formData.profilePicture
      ? await fileToBase64(formData.profilePicture)
      : null;

    const companyLogoBase64 = formData.companyLogo
      ? await fileToBase64(formData.companyLogo)
      : null;

    const allCertificates = [
      {
        name: formData.certificationName,
        number: formData.certificationNumber,
      },
      ...formData.additionalCertifications,
    ];

    const companyData = {
      company_name: formData.companyName,
      company_logo: companyLogoBase64,
      // currency: formData.currency,
      // time_zone: formData.timeZone,
      // tax_name: formData.taxName,
      // tax_percentage: formData.taxPercentage,
      certificates: allCertificates,

      address_line_1: formData.addressLine1,
      // address_line_2: formData.addressLine2,
      city: formData.contactCity,
      country: formData.contactCountry,
      zip_postal_code: formData.contactZip,

      company_contact_person_name: formData.contactPerson,
      contact_person_phone: formData.contactPhone,
      // company_office_phone: formData.officePhone,
      company_office_email: formData.officeEmail,

      // package: formData.package,
      // packageDescritption: formData.packageDescritption,
      // workOrderTime: formData.workOrderTime,
      // primaryWorkOrderCost: formData.primaryWorkOrderCost,
      // quotationCost: formData.quotationCost,
      // executionWorkOrderCost: formData.executionWorkOrderCost,
      // freeQuotations: formData.freeQuotations,
      // freeWorkOrders: formData.freeWorkOrders,
      // customerAddressFormat: formData.customerAddressFormat,
      workingDays: formData.workingDays,
      companyStatus: formData.companyStatus,
      companyState: formData.companyState,
    };
    const userdata = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      Address: formData.address,
      city: formData.city,
      state: formData.state,
      contact_number: formData.contactNumber,
      country: formData.country,
      email: formData.email,
      password: formData.password,
      zip_code: formData.zip,
      profile_picture: profilePictureBase64,
    };

    const finalData = {
      companyData,
      userdata,
    };

    console.log("Transformed finalData", companyData, "\navigator", userdata);

    // const formDataToSend = new FormData();
    // formDataToSend.append("userdata", JSON.stringify(userdata)); // Stringify userdata
    // formDataToSend.append("companyData", JSON.stringify(companyData)); // Stringify companyData
    // if (formData.profilePicture) {
    //   formDataToSend.append("profile_picture", formData.profilePicture);
    // }
    // if (formData.companyLogo) {
    //   formDataToSend.append("company_logo", formData.companyLogo);
    // }

    console.log("Final FormData: ", { companyData, userdata });
    try {
      // Show confirmation alert before API call
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "Do you want to create this company?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, create it!",
        cancelButtonText: "No, cancel",
      });

      if (!result.isConfirmed) {
        console.log("Company creation cancelled");
        return;
      }

      // Show loading alert while API is executing
      Swal.fire({
        title: "Processing...",
        text: "Updating company, please wait.",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // Call API
      console.log("companyId: ", companyId);
      const response = await editCompanyApi(
        companyId,
        { companyData, userdata },
        token
      );
      console.log("response", response);

      // Close loading alert
      Swal.close();

      if (response.status) {
        Swal.fire({
          title: "Success!",
          text: "Company Updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/company/companies"); // Navigate after confirmation
        });
      } else {
        Swal.fire({
          title: "Error!",
          text: response.message || "There was an error creating the company.",
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.close(); // Ensure loading is closed
      console.error("Error Updating company", error);

      Swal.fire({
        title: "API Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <>
      <Header />
      <div className="main-header-box">
        {currentStep === 1 && (
          <Container
            className="mt-4 pages-box"
            style={{
              backgroundColor: "white",
              borderRadius: "22px",
              padding: "25px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="form-header mb-4"
              style={{
                backgroundColor: "#2e2e32",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              <h4 className="mb-0">{t("Company Super Admin Details")}</h4>
            </div>
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span> {t("First Name")}:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`${t("Enter")} ${t("Super Admin")} ${t(
                        "First Name"
                      )}`}
                      value={formData.firstName}
                      maxLength={50}
                      onChange={(e) =>
                        handleChange("firstName", e.target.value)
                      }
                      isInvalid={!!errors.firstName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.firstName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span> {t("Last Name")}:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`${t("Enter")} ${t("Super Admin")} ${t(
                        "Last Name"
                      )}`}
                      maxLength={50}
                      value={formData.lastName}
                      onChange={(e) => handleChange("lastName", e.target.value)}
                      isInvalid={!!errors.lastName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.lastName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("Profile Picture")}:</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange("profilePicture", e.target.files[0])
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span>{" "}
                      {t("Contact Number")}:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`${t("Enter")} ${t("Super Admin")} ${t(
                        "Contact Number"
                      )}`}
                      value={formData.contactNumber}
                      maxLength={15}
                      onChange={(e) =>
                        handleChange("contactNumber", e.target.value)
                      }
                      isInvalid={!!errors.contactNumber}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contactNumber}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span>{" "}
                      {t("Email Address")}:
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={`${t("Enter")} ${t("Super Admin")} ${t(
                        "Email Address"
                      )}`}
                      value={formData.email}
                      maxLength={30}
                      onChange={(e) => handleChange("email", e.target.value)}
                      isInvalid={!!errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span>{" "}
                      {t("Admin Password")}:
                    </Form.Label>
                    <Form.Control
                      type="password"
                      placeholder={`${t("Enter")} ${t("Super Admin")} ${t(
                        "Password"
                      )}`}
                      value={formData.password}
                      maxLength={20}
                      onChange={(e) => handleChange("password", e.target.value)}
                      isInvalid={!!errors.password}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("Address")}:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`${t("Enter")} ${t("Super Admin")} ${t(
                        "Address"
                      )}`}
                      value={formData.address}
                      maxLength={50}
                      onChange={(e) => handleChange("address", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("City")}:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`${t("Enter")} ${t("Super Admin")} ${t(
                        "City"
                      )}`}
                      value={formData.city}
                      maxLength={15}
                      onChange={(e) => handleChange("city", e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("State")}:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`${t("Enter")} ${t("Super Admin")} ${t(
                        "State"
                      )}`}
                      value={formData.state}
                      maxLength={15}
                      onChange={(e) => handleChange("state", e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("Country")}:</Form.Label>
                    <Select
                      options={countryOptions}
                      onChange={(selectedOption) =>
                        handleChange("country", selectedOption.value)
                      }
                      value={countryOptions.find(
                        (option) => option.value === formData.country
                      )}
                      styles={{
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: "150px", // Limits dropdown height
                          overflowY: "auto",
                        }),
                      }}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("ZIP/Postal Code")}:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={`${t("Enter")} ${t("Super Admin")} ${t(
                        "ZIP/Postal Code"
                      )}`}
                      value={formData.zip}
                      maxLength={10}
                      onChange={(e) => handleChange("zip", e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
            <Button type="submit" onClick={handleNext}>
              {t("Next")}
            </Button>
          </Container>
        )}
        {currentStep === 2 && (
          <Container
            className="mt-4"
            style={{
              backgroundColor: "white",
              borderRadius: "22px",
              padding: "25px",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div
              className="form-header mb-4"
              style={{
                backgroundColor: "#2e2e32",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              <h4 className="mb-0">{t("Company Basic Details (Mandatory)")}</h4>
            </div>
            <Form className="mb-3">
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span> {t("Company Name")}
                      :
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Company Name")}
                      value={formData.companyName}
                      maxLength={20}
                      onChange={(e) =>
                        handleChange("companyName", e.target.value)
                      }
                      isInvalid={!!errors.companyName}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.companyName}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("Company Logo")}:</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        handleImageChange("companyLogo", e.target.files[0])
                      }
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span>{" "}
                      {t("Company Contact Person Name")}:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Company Contact Person Name")}
                      value={formData.contactPerson}
                      maxLength={30}
                      onChange={(e) =>
                        handleChange("contactPerson", e.target.value)
                      }
                      isInvalid={!!errors.contactPerson}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contactPerson}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span>{" "}
                      {t("Contact Person Phone")}:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Company Person Phone")}
                      value={formData.contactPhone}
                      maxLength={15}
                      onChange={(e) =>
                        handleChange("contactPhone", e.target.value)
                      }
                      isInvalid={!!errors.contactPhone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contactPhone}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span>{" "}
                      {t("Company Office Email Address")}:
                    </Form.Label>
                    <Form.Control
                      type="email"
                      placeholder={t("Enter Company Office Email Address")}
                      value={formData.officeEmail}
                      maxLength={30}
                      onChange={(e) =>
                        handleChange("officeEmail", e.target.value)
                      }
                      isInvalid={!!errors.officeEmail}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.officeEmail}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span> {t("Address Line")}{" "}
                      1:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Company Address")}
                      value={formData.addressLine1}
                      maxLength={50}
                      onChange={(e) =>
                        handleChange("addressLine1", e.target.value)
                      }
                      isInvalid={!!errors.addressLine1}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.addressLine1}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span> {t("City")}:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Company Address's City")}
                      value={formData.contactCity}
                      maxLength={15}
                      onChange={(e) =>
                        handleChange("contactCity", e.target.value)
                      }
                      isInvalid={!!errors.contactCity}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contactCity}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span> {t("State")}:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Company Address's State")}
                      value={formData.companyState}
                      maxLength={15}
                      onChange={(e) =>
                        handleChange("companyState", e.target.value)
                      }
                      isInvalid={!!errors.companyState}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.companyState}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span> {t("Country")}:
                    </Form.Label>
                    <Select
                      options={countryOptions}
                      onChange={(selectedOption) =>
                        handleChange("contactCountry", selectedOption.value)
                      }
                      value={countryOptions.find(
                        (option) => option.value === formData.contactCountry
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
                      {errors.contactCountry}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span>{" "}
                      {t("ZIP/Postal Code")}:
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Company Address's Zipcode")}
                      value={formData.contactZip}
                      maxLength={20}
                      onChange={(e) =>
                        handleChange("contactZip", e.target.value)
                      }
                      isInvalid={!!errors.contactZip}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.contactZip}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("Working Day")}:</Form.Label>
                    <div>
                      <ToggleButtonGroup
                        type="checkbox"
                        className="d-flex flex-wrap"
                        value={formData.workingDays}
                        onChange={(value) =>
                          handleChange("workingDays", value.filter(Boolean))
                        }
                        style={{zIndex:"0"}}
                      >
                        {[
                          "Monday",
                          "Tuesday",
                          "Wednesday",
                          "Thursday",
                          "Friday",
                        ].map((day, index) => (
                          <ToggleButton
                            key={index}
                            id={`btn-${day}`}
                            value={day}
                            variant="outline-primary"
                            className="me-2 mb-2"
                          >
                            {t(day)}
                          </ToggleButton>
                        ))}
                        {["Saturday", "Sunday"].map((day, index) => (
                          <ToggleButton
                            key={index}
                            id={`btn-${day}`}
                            value={day}
                            variant="outline-secondary"
                            className="me-2 mb-2"
                          >
                            {t(day)}
                          </ToggleButton>
                        ))}
                      </ToggleButtonGroup>
                      <Form.Text muted>
                        Default (mon, tue, wed, thus, fri)
                      </Form.Text>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("Certification Name")}:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Company Certification Name")}
                      value={formData.certificationName}
                      maxLength={30}
                      onChange={(e) =>
                        handleChange("certificationName", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>{t("Certification Number")}:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder={t("Enter Company Certification Number")}
                      value={formData.certificationNumber}
                      maxLength={20}
                      onChange={(e) =>
                        handleChange("certificationNumber", e.target.value)
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Button
                variant="primary"
                type="button"
                className="mt-3"
                style={{
                  background: "#6c757d",
                  border: "none",
                  color: "white",
                }}
                onClick={() => {
                  const newCertification = { name: "", number: "" };
                  const updatedCertifications = [
                    ...(formData.additionalCertifications || []),
                    newCertification,
                  ];
                  handleChange(
                    "additionalCertifications",
                    updatedCertifications
                  );
                }}
              >
                {t("Add More")}
              </Button>

              {formData.additionalCertifications?.map((cert, index) => (
                <Row key={index} className="mt-3">
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {t("Additional Certification Name")}:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t("Enter Additional Certification Name")}
                        value={cert.name}
                        maxLength={30}
                        onChange={(e) => {
                          const updatedCertifications = [
                            ...formData.additionalCertifications,
                          ];
                          updatedCertifications[index].name = e.target.value;
                          handleChange(
                            "additionalCertifications",
                            updatedCertifications
                          );
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={5}>
                    <Form.Group className="mb-3">
                      <Form.Label>
                        {t("Additional Certification Number")}:
                      </Form.Label>
                      <Form.Control
                        type="text"
                        placeholder={t("Enter Additional Certification Number")}
                        value={cert.number}
                        maxLength={20}
                        onChange={(e) => {
                          const updatedCertifications = [
                            ...formData.additionalCertifications,
                          ];
                          updatedCertifications[index].number = e.target.value;
                          handleChange(
                            "additionalCertifications",
                            updatedCertifications
                          );
                        }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} className="d-flex align-items-center">
                    <Button
                      variant="danger"
                      onClick={() => {
                        const updatedCertifications =
                          formData.additionalCertifications.filter(
                            (_, i) => i !== index
                          );
                        handleChange(
                          "additionalCertifications",
                          updatedCertifications
                        );
                      }}
                    >
                      X
                    </Button>
                  </Col>
                </Row>
              ))}
            </Form>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Company Status"
                checked={formData.companyStatus}
                onChange={(e) =>
                  handleChange("companyStatus", e.target.checked)
                }
              />
            </Form.Group>
            <Button
              variant="secondary"
              onClick={handlePrevious}
              className="me-2"
            >
              {t("Previous")}
            </Button>
            <Button
              type="submit"
              onClick={() => {
                handleNext();
                handleSubmit();
              }}
            >
              {t("Submit")}
            </Button>
          </Container>
        )}
      </div>
    </>
  );
};

export default EditCompany;
