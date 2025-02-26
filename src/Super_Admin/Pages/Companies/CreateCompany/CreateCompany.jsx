import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card, 
  Badge,
  ListGroup,
  Button,
  InputGroup,
  ToggleButtonGroup,
  ToggleButton,
} from "react-bootstrap";
import Header from "../../../../Components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import { createCompanyApi, getSubscriptionPackagesList, getTaxationDetails } from "../../../../lib/store";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import imageCompression from "browser-image-compression";
import Select from "react-select";
import { getNames } from "country-list";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CreateCompany = () => {
  const { t, i18n } = useTranslation();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [countryListDetails, setcountryListDetails] = useState();
  const [subscriptionPlanList, setsubscriptionPlanList] = useState();
  const [selectedPlan, setselectedPlan] = useState({})
  // console.log("countryListDetails", countryListDetails,subscriptionPlanList,selectedPlan);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await getTaxationDetails(token);
        if (response.status === 200) {
          const array = Object.values(response?.data?.data);
          const sortedArray = array.sort((a, b) =>
            a?.countryName.localeCompare(b?.countryName)
          );
          setcountryListDetails(sortedArray || []);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchCountry();
  }, []);

  useEffect(()=>{
    const fetchSubscriptionPlan = async () => {
      try {
        const response = await getSubscriptionPackagesList(token);
        console.log('package respppppppppp',response);
        const sortedPackages = response.packages
          ? [...response.packages]
              // .filter((pkg) => pkg.packageType !== "payg") // Exclude 'payg' packages
              .sort((a, b) => a.cost_per_month - b.cost_per_month)
          : [];
          setsubscriptionPlanList(sortedPackages||[]);
      } catch (error) {
        console.error('error while fetching subscription pacakage list',error);
      }
    };
    fetchSubscriptionPlan();
  },[])

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
    language: "",

    // Step 2: Company Basic Details
    companyName: "",
    companyLogo: null,
    addressLine1: "",
    contactCity: "",
    companyState: "",
    //  Country details
    contactCountry: "",
    taxName: "",
    taxPercentage: "",
    countryName: "",
    currencyCode: "",
    // ss
    contactZip: "",
    contactPerson: "",
    contactPhone: "",
    officeEmail: "",
    certificationName: "",
    certificationNumber: "",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    companyStatus: true,
    additionalCertifications: [],

    // Step 3: Contact Information

    addressLine2: "",

    officePhone: "",

    // Step 4: Other Settings
    package: "",
    packageDescritption: "",
    workOrderTime: "04:00",
    quotationCost: "0.15",
    freeQuotations: "51",
    primaryWorkOrderCost: "0.10",
    executionWorkOrderCost: "0.40",
    freeWorkOrders: "101",
    customerAddressFormat: "US",
  });
  console.log("dsada", formData);
  const [imageErrors, setImageErrors] = useState({
    profilePicture: "",
    companyLogo: "",
  });
  const navigate = useNavigate();
  const [token, settoken] = useState(localStorage.getItem("UserToken"));
  // console.log("formData", formData);
  const [errors, setErrors] = useState({});
  const countryOptions = getNames().map((country) => ({
    value: country,
    label: country,
  }));

  const countryOptions2 = countryListDetails?.map((country) => ({
    value: country.countryName,
    label: country.countryName,
  }));

  const handleNext = () => {
    // Check if there's an email error indicating a duplicate
    if (
      errors.email &&
      errors.email.includes("User with this email already exists.")
    ) {
      Swal.fire({
        title: t("Fix Error"),
        text: t("Please change the email address before proceeding."),
        icon: "warning",
      });
      return; // prevent advancing to the next step
    }

   
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
    setFormData((prev) => {
      let updatedFormData = { ...prev, [field]: value };

      if (field === "contactCountry") {
        const selectedCountry = countryListDetails.find(
          (country) => country.countryName === value
        );
        updatedFormData.countryName = selectedCountry
          ? selectedCountry.alphaCode
          : "";
        updatedFormData.taxName = selectedCountry
          ? selectedCountry.taxName
          : "-";
        updatedFormData.taxPercentage = selectedCountry
          ? selectedCountry.taxPercentage
          : "-";
        updatedFormData.currencyCode = selectedCountry
          ? selectedCountry.currencyCode
          : "-";
      }

      return updatedFormData;
    });

    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      const isAlphanumeric = /^[a-zA-Z0-9]*$/;
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isPhone = /^[0-9]{10,15}$/;
      const isAlpha = /^[a-zA-Z ]*$/;
      const isAlphanumericWithSpaces = /^[a-zA-Z0-9 ]*$/;
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/;

      switch (field) {
        case "firstName":
          if (!value.trim()) {
            newErrors.firstName = t("First Name is required.");
          } else if (value.length > 60 || !isAlpha.test(value)) {
            newErrors.firstName = t(
              "First Name must be 1-60 characters, letters only."
            );
          } else {
            delete newErrors.firstName;
          }
          break;

        case "lastName":
          if (!value.trim()) {
            newErrors.lastName = t("Last Name is required.");
          } else if (value.length > 60 || !isAlpha.test(value)) {
            newErrors.lastName = t(
              "Last Name must be 1-60 characters, letters only."
            );
          } else {
            delete newErrors.lastName;
          }
          break;

        case "email":
          if (!value.trim() || !isEmail.test(value)) {
            newErrors.email = t("Valid Email Address is required.");
          } else {
            delete newErrors.email;
          }
          break;

        case "password":
          // Password validation: 8-16 characters, at least one uppercase, one number, one special character.
          if (!value.trim()) {
            newErrors.password = t("Password is required.");
          } else if (!passwordRegex.test(value)) {
            newErrors.password = t(
              "Password must be between 8 to 16 characters, include at least one uppercase letter, one number, and one special character."
            );
          } else {
            delete newErrors.password;
          }
          break;

        case "contactNumber":
          if (!value.trim()) {
            newErrors.contactNumber = t("Contact Number is required.");
          } else if (!isPhone.test(value)) {
            newErrors.contactNumber = t(
              "Valid Contact Number (10-15 digits) is required."
            );
          } else {
            delete newErrors.contactNumber;
          }
          break;

        case "address":
          if (value.trim() && value.length < 5) {
            newErrors.address = t(
              "Address must be at least 5 characters long."
            );
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
            newErrors.city = t("City must be 2-60 characters, letters only.");
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
            newErrors.state = t("State must be 2-60 characters, letters only.");
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
            newErrors.zip = t(
              "ZIP/Postal Code must be at least 3 characters, alphanumeric only."
            );
          } else {
            delete newErrors.zip;
          }
          break;

        case "language":
          if (!value) {
            newErrors.language = t("Language selection is required.");
          } else {
            delete newErrors.language;
          }
          break;

        case "companyName":
          if (!value.trim()) {
            newErrors.companyName = t("Company Name is required.");
          } else if (value.length > 60 || !isAlpha.test(value)) {
            newErrors.companyName = t(
              "Company Name must be 1-60 characters, no numbers."
            );
          } else {
            delete newErrors.companyName;
          }
          break;

        case "currency":
          if (!value) {
            newErrors.currency = t("Currency is required.");
          } else {
            delete newErrors.currency;
          }
          break;

        case "timeZone":
          if (!value) {
            newErrors.timeZone = t("Time Zone is required.");
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
            newErrors.taxName = t(
              "Tax Name must be 1-60 characters, letters only."
            );
          } else {
            delete newErrors.taxName;
          }
          break;

        case "taxPercentage":
          if (isNaN(value) || value < 0 || value > 40) {
            newErrors.taxPercentage = t(
              "Tax Percentage must be a number between 0 and 40."
            );
          } else {
            delete newErrors.taxPercentage;
          }
          break;

        case "certificationName":
          if (value.trim() && value.length < 3) {
            newErrors.certificationName = t(
              "Certification Name must be at least 3 characters."
            );
          } else {
            delete newErrors.certificationName;
          }
          break;

        case "certificationNumber":
          if (value.trim() && value.length < 3) {
            newErrors.certificationNumber = t(
              "Certification Number must be at least 3 characters."
            );
          } else {
            delete newErrors.certificationNumber;
          }
          break;

        case "addressLine1":
          if (!value.trim()) {
            newErrors.addressLine1 = t("Address Line 1 is required.");
          } else if (value.length < 5) {
            newErrors.addressLine1 = t(
              "Address Line 1 must be at least 5 characters."
            );
          } else {
            delete newErrors.addressLine1;
          }
          break;

        case "addressLine2":
          if (value.trim() && value.length < 5) {
            newErrors.addressLine2 = t(
              "Address Line 2 must be at least 5 characters."
            );
          } else {
            delete newErrors.addressLine2;
          }
          break;

        case "contactCity":
          if (!value.trim()) {
            newErrors.contactCity = t("City is required.");
          } else if (
            value.length < 2 ||
            value.length > 60 ||
            !isAlpha.test(value)
          ) {
            newErrors.contactCity = t(
              "City must be 2-60 characters, letters only."
            );
          } else {
            delete newErrors.contactCity;
          }
          break;

        case "companyState":
          if (!value.trim()) {
            newErrors.companyState = t("State is required.");
          } else if (
            value.length < 2 ||
            value.length > 60 ||
            !isAlpha.test(value)
          ) {
            newErrors.companyState = t(
              "State must be 2-60 characters, letters only."
            );
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
            newErrors.contactZip = t(
              "ZIP/Postal Code must be at least 3 characters, alphanumeric only."
            );
          } else {
            delete newErrors.contactZip;
          }
          break;

        case "contactPerson":
          if (!value.trim()) {
            newErrors.contactPerson = t("Contact Person Required");
          } else {
            delete newErrors.contactPerson;
          }
          break;

        case "contactPhone":
          if (!value.trim() || !isPhone.test(value)) {
            newErrors.contactPhone = t(
              "Valid Person Phone (10-15 digits) is required."
            );
          } else {
            delete newErrors.contactPhone;
          }
          break;
        case "officePhone":
          if (!value.trim() || !isPhone.test(value)) {
            newErrors.officePhone = t(
              "Valid Office Phone (10-15 digits) is required."
            );
          } else {
            delete newErrors.officePhone;
          }
          break;

        case "officeEmail":
          if (!value.trim() || !isEmail.test(value)) {
            newErrors.officeEmail = t(
              "Valid Office Email Address is required."
            );
          } else {
            delete newErrors.officeEmail;
          }
          break;

        case "workingDays":
          if (!value || value.length < 1) {
            newErrors.workingDays = t(
              "Please select at least one working day."
            );
          } else {
            delete newErrors.workingDays;
          }
          break;

        case "workOrderTime":
          if (!value.trim()) {
            newErrors.workOrderTime = t("Default Work Order Time is required.");
          } else {
            delete newErrors.workOrderTime;
          }
          break;

        case "quotationCost":
          if (isNaN(value) || value < 0 || value > 1000) {
            newErrors.quotationCost = t(
              "Quotation Cost must be a number between 0 and 1000."
            );
          } else {
            delete newErrors.quotationCost;
          }
          break;

        case "primaryWorkOrderCost":
          if (isNaN(value) || value < 0 || value > 1000) {
            newErrors.primaryWorkOrderCost = t(
              "Primary Work Order Cost must be a number between 0 and 1000."
            );
          } else {
            delete newErrors.primaryWorkOrderCost;
          }
          break;

        case "executionWorkOrderCost":
          if (isNaN(value) || value < 0 || value > 1000) {
            newErrors.executionWorkOrderCost = t(
              "Execution Work Order Cost must be a number between 0 and 1000."
            );
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

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/;

    switch (step) {
      case 1:
        // First Name Validation
        if (!formData.firstName || !formData.firstName.trim()) {
          newErrors.firstName = t("First Name is required.");
        } else if (
          formData.firstName.length > 60 ||
          !isAlpha.test(formData.firstName)
        ) {
          newErrors.firstName = t(
            "First Name must be 1-60 characters, letters only."
          );
        }

        // Last Name Validation
        if (!formData.lastName || !formData.lastName.trim()) {
          newErrors.lastName = t("Last Name is required.");
        } else if (
          formData.lastName.length > 60 ||
          !isAlpha.test(formData.lastName)
        ) {
          newErrors.lastName = t(
            "Last Name must be 1-60 characters, letters only."
          );
        }
        if (
          !formData.email ||
          !formData.email.trim() ||
          !isEmail.test(formData.email)
        )
          newErrors.email = t("Valid Email Address is required.");

        // Password validation for step 1:
        if (!formData.password || !formData.password.trim()) {
          newErrors.password = t("Password is required.");
        } else if (!passwordRegex.test(formData.password)) {
          newErrors.password = t(
            "Password must be between 8 to 16 characters, include at least one uppercase letter, one number, and one special character."
          );
        }

        // Contact Number Validation
        if (!formData.contactNumber || !formData.contactNumber.trim()) {
          newErrors.contactNumber = t("Contact Number is required.");
        } else if (!isPhone.test(formData.contactNumber)) {
          newErrors.contactNumber = t(
            "Valid Contact Number (10-15 digits) is required."
          );
        }

        if (!formData.language) {
          newErrors.language = t("Language selection is required.");
        }

        break;

      case 2:
        if (!formData.companyName || !formData.companyName.trim()) {
          newErrors.companyName = t("Company Name is required.");
        } else if (
          formData.companyName.length > 60 ||
          !isAlpha.test(formData.companyName)
        ) {
          newErrors.companyName = t(
            "Company Name must be 1-60 characters, no numbers."
          );
        }

        if (!formData.addressLine1 || !formData.addressLine1.trim()) {
          newErrors.addressLine1 = t("Address Line 1 is required.");
        } else if (formData.addressLine1.length < 5) {
          newErrors.addressLine1 = t(
            "Address Line 1 must be at least 5 characters."
          );
        }

        if (!formData.contactCity || !formData.contactCity.trim()) {
          newErrors.contactCity = t("City is required.");
        } else if (
          formData.contactCity.length < 2 ||
          formData.contactCity.length > 60 ||
          !isAlpha.test(formData.contactCity)
        ) {
          newErrors.contactCity = t(
            "City must be 2-60 characters, letters only."
          );
        }

        if (!formData.companyState || !formData.companyState.trim()) {
          newErrors.companyState = t("State is required.");
        } else if (
          formData.companyState.length < 2 ||
          formData.companyState.length > 60 ||
          !isAlpha.test(formData.companyState)
        ) {
          newErrors.companyState = t(
            "State must be 2-60 characters, letters only."
          );
        }

        if (!formData.workingDays || formData.workingDays.length < 1) {
          newErrors.workingDays = t("Please select at least one working day.");
        }

        if (
          !formData.contactZip ||
          !formData.contactZip.trim() ||
          formData.contactZip.length < 3 ||
          !isAlphanumericWithSpaces.test(formData.contactZip)
        )
          newErrors.contactZip = t(
            "ZIP/Postal Code must be at least 3 characters, alphanumeric only."
          );
        if (!formData.contactPerson || !formData.contactPerson.trim())
          newErrors.contactPerson = t("Contact Person is required.");
        if (!formData.contactPhone.trim())
          if (!formData.officeEmail.trim())
            newErrors.officeEmail = t("Office Email Address is required.");
          if (!formData.package.trim())
            newErrors.package = t("Required");

        break;
      default:
        break;
    }

    return newErrors;
  };

  // New: Compress image files before updating state
  const handleImageChange = async (field, file) => {
    if (file) {
      const allowedTypes = ["image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setImageErrors((prev) => ({
          ...prev,
          [field]: "Only JPEG and PNG formats are allowed.",
        }));
        return;
      } else {
        setImageErrors((prev) => ({
          ...prev,
          [field]: "",
        }));
      }

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
        setFormData((prev) => ({
          ...prev,
          [field]: file,
        }));
      }
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

  const handleSubmit = async () => {
    const currentErrors = validateStep(currentStep);
    console.log(currentErrors);
    if (
      Object.keys(errors).length > 0 ||
      Object.keys(currentErrors).length > 0
    ) {
      return;
    }
    const languageCode = formData.language === "English" ? "en" : "es";
    try {
      // ✅ Convert files to Base64 (if they exist)
      const profilePictureBase64 = formData.profilePicture
        ? await fileToBase64(formData.profilePicture)
        : null;

      const companyLogoBase64 = formData.companyLogo
        ? await fileToBase64(formData.companyLogo)
        : null;
      // Build and filter certificates array
      const primaryCert = {
        name: formData.certificationName,
        number: formData.certificationNumber,
      };

      let allCertificates = [];
      if (primaryCert.name.trim() !== "" || primaryCert.number.trim() !== "") {
        allCertificates.push(primaryCert);
      }
      if (
        formData.additionalCertifications &&
        formData.additionalCertifications.length > 0
      ) {
        const filteredAdditional = formData.additionalCertifications.filter(
          (cert) => cert.name.trim() !== "" || cert.number.trim() !== ""
        );
        allCertificates = allCertificates.concat(filteredAdditional);
      }
      const companyData = {
        company_name: formData.companyName,
        company_logo: companyLogoBase64,
        certificates: allCertificates,

        address_line_1: formData.addressLine1,
        city: formData.contactCity,
        country: formData.contactCountry,
        zip_postal_code: formData.contactZip,
        package_id:formData.package,
        package_name: formData.packageDescritption,
        company_contact_person_name: formData.contactPerson,
        contact_person_phone: formData.contactPhone,
        company_office_email: formData.officeEmail,
        workingDays: formData.workingDays,
        companyStatus: formData.companyStatus,
        companyState: formData.companyState,
        language: languageCode,

        alphaCode: formData.countryName,
        companyCountryName: formData.contactCountry,
        taxName: formData.taxName,
        taxPercentage: formData.taxPercentage,
        currencyCode:formData.currencyCode
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

      console.log("Final Data:", companyData, userdata);
      const result = await Swal.fire({
        title: t("Are you sure?"),
        text: t("Do you want to create this company?"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: t("Yes, create it!"),
        cancelButtonText: t("No, cancel"),
      });

      if (!result.isConfirmed) {
        console.log("Company creation cancelled");
        return;
      }

      // Show loading alert while API is executing
      Swal.fire({
        title: t("Processing..."),
        text: t("Creating company, please wait."),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      // ✅ Send as JSON (No FormData needed)
      const response = await createCompanyApi({ companyData, userdata }, token);
      console.log("response", response);
      Swal.close();
      if (response.success) {
        Swal.fire({
          title: t("Success!"),
          text: t("Company created successfully."),
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/company/companies"); // Navigate after confirmation
        });
      } else {
        if (
          response.message &&
          response.message.includes("User with this email already exists.")
        ) {
          handlePrevious();
          setErrors((prevErrors) => ({
            ...prevErrors,
            email: t("User with this email already exists."),
          }));
        }
        Swal.fire({
          title: "Error!",
          text:
            response.message || t("There was an error creating the company."),
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
      console.log("Response:", response);
    } catch (error) {
      console.error("Error submitting data:", error);
      Swal.close();
      Swal.fire({
        title: "API Error!",
        text: error || t("Something went wrong. Please try again later."),
        icon: "error",
        confirmButtonText: t("OK"),
      });
    }
  };

  const featureMapping = {
    add_customers: "Add Customers",
    add_office_users: "Add Office Users",
    add_field_users: "Add Field Users",
    work_order_creation: "Work Order Creation",
    work_order_execution: "Work Order Execution",
  };
  
  const subscriptionPlanMapping = {
    default: "Default",
    basic: "Basic",
    premium: "Premium",
    enterprise: "Enterprise",
    payg: "Pay as You Go",
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
                      accept="image/jpeg, image/png"
                      onChange={(e) =>
                        handleImageChange("profilePicture", e.target.files[0])
                      }
                      isInvalid={!!imageErrors.profilePicture}
                    />
                    {imageErrors.profilePicture && (
                      <Form.Text className="text-danger">
                        {imageErrors.profilePicture}
                      </Form.Text>
                    )}
                    <Form.Text className="text-muted">
                      {t("Only JPEG and PNG formats allowed.")}
                    </Form.Text>
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
                    <InputGroup hasValidation>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder={`${t("Enter")} ${t("Super Admin")} ${t(
                          "Password"
                        )}`}
                        value={formData.password}
                        maxLength={20}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        isInvalid={!!errors.password}
                      />
                      <InputGroup.Text
                        style={{ cursor: "pointer" }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </InputGroup.Text>
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
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
                      placeholder={t("Select a country")}
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
                      isInvalid={!!errors.zip}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.zip}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span>{" "}
                      {t("Select Language")}:
                    </Form.Label>
                    <Form.Select
                      as="select"
                      value={formData.language}
                      onChange={(e) => handleChange("language", e.target.value)}
                      isInvalid={!!errors.language}
                    >
                      <option value="">{t("Select Language")}</option>
                      <option value="English">English</option>
                      <option value="Spanish">Spanish</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      {errors.language}
                    </Form.Control.Feedback>
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
                      accept="image/jpeg, image/png"
                      onChange={(e) =>
                        handleImageChange("companyLogo", e.target.files[0])
                      }
                      isInvalid={!!imageErrors.companyLogo}
                    />
                    {imageErrors.companyLogo && (
                      <Form.Text className="text-danger">
                        {imageErrors.companyLogo}
                      </Form.Text>
                    )}
                    <Form.Text className="text-muted">
                      Only JPEG and PNG formats allowed.
                    </Form.Text>
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

                  {/* Countryy */}
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <span className="text-danger">*</span> {t("Country")}:
                    </Form.Label>
                    <Select
                      options={countryOptions2}
                      onChange={(selectedOption) =>
                        handleChange("contactCountry", selectedOption.value)
                      }
                      value={countryOptions2.find(
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

                  {/* Country Tax Details */}
                  <Form.Group className="mb-3">
                    <Form.Label style={{display:"flex",justifyContent:"center",alignItems:"center",marginBottom:"20px"}}>
                      <span className="text-danger">*</span>{" "}
                      {t("Country Tax Name")}:{" "}
                      <Form.Control
                        type="text"
                        value={formData.taxName || ""}
                        disabled
                        style={{
                          display: "inline-block",
                          width: "73%",
                          marginLeft: "10px",
                          backgroundColor: "#f8f9fa", // Light grey background to indicate it's disabled
                          border: "1px solid #ced4da",
                          fontWeight: "bold",
                        }}
                      />
                    </Form.Label>
                    <Form.Group className="mb-3">
                      {/* Country Tax Percentage */}
                      <Form.Label>
                        <span className="text-danger">*</span>{" "}
                        {t("Country Tax %")}:{" "}
                        <Form.Control
                          type="number"
                          value={formData.taxPercentage || ""}
                          onChange={(e) =>
                            handleChange(
                              "taxPercentage",
                              e.target.value ? Number(e.target.value) : ""
                            )
                          }
                          placeholder="%"
                          min={1}
                          style={{
                            display: "inline-block",
                            width: "80px", // Small input box
                            textAlign: "center",
                            marginLeft: "10px",
                          }}
                        />
                      </Form.Label>
                      <Form.Label style={{marginLeft:"7px"}}>
                        <span className="text-danger">*</span>{" "}
                        {t("Country Currency")}:{" "}
                        <Form.Control
                          type="text"
                          value={formData.currencyCode || ""}
                          disabled
                          style={{
                            display: "inline-block",
                            width: "auto",
                            marginLeft: "10px",
                            backgroundColor: "#f8f9fa", // Light grey background to indicate it's disabled
                            border: "1px solid #ced4da",
                            fontWeight: "bold",
                          }}
                        />
                      </Form.Label>
                    </Form.Group>
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
                        style={{ zIndex: "0" }}
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
                        Default (mon, tue, wed, thr, fri)
                      </Form.Text>
                      {errors.workingDays && (
                        <div className="text-danger mt-1">
                          {errors.workingDays}
                        </div>
                      )}
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Button
                variant="primary"
                type="button"
                className="mt-1 mb-2"
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

              {formData.additionalCertifications?.map((cert, index) => (
                <Row key={index} className="mt-2">
                  <Col md={6}>
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
                  <Col
                    md={6}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <Form.Group className="mb-3" style={{ width: "90%" }}>
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
                    <Button
                      variant="danger"
                      style={{
                        width: "40px",
                        height: "40px",
                        padding: "0",
                        fontSize: "18px",
                      }}
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

              {/* choose plan */}
              <Form.Group className="mb-3">
              <Form.Label>
                <span className="text-danger">*</span> {t("Choose Plan")}:
              </Form.Label>
              <Select
                  options={subscriptionPlanList?.map((option) => ({
                    value: option.name,
                    label: option.name,
                    package_id:option.package_id,
                    features: option.features,
                  }))} 
                  onChange={(selectedOption) =>{
                    handleChange("package", selectedOption?.package_id)
                    handleChange("packageDescritption", selectedOption?.value)
                    setselectedPlan({name: selectedOption.value,features:selectedOption.features} ||{})
                  }
                    
                  }
                  value={subscriptionPlanList
                    ?.map((option) => ({ value: option.name, label: option.name }))
                    .find((opt) => opt.value === formData.package)}
                  styles={{
                    menuList: (provided) => ({
                      ...provided,
                      maxHeight: "150px", // Limits dropdown height
                      overflowY: "auto",
                    }),
                  }}
                  required
                />
              <Form.Control.Feedback type="invalid">
                {errors.package}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Selected Plan Details */}
      {selectedPlan?.name && (
        <Card className="mt-3 mb-3 shadow-sm border-0">
          <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
            {t(subscriptionPlanMapping[selectedPlan?.name] ||selectedPlan.name.replace(/_/g, " "))}
              {/* {selectedPlan?.name} */}
              </h5>
            <Badge bg="light" text="dark">
            { t("Selected Plan")}
            </Badge>
          </Card.Header>
          <Card.Body>
            <ListGroup variant="flush">
              {Object.entries(selectedPlan.features)?.map(([key, value]) => (
                <ListGroup.Item
                  key={key}
                  className="d-flex justify-content-between align-items-center"
                >
                  <span>
                    {/* {t(key.replace(/_/g, " ").toLowerCase()).replace(
                      /\b\w/g,
                      (char) => char.toUpperCase()
                    )} */}
                        {t(featureMapping[key] || key.replace(/_/g, " "))}
                  </span>
                  <Badge bg="success" pill>
                    {value}
                  </Badge>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      )}

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
              variant="primary"
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

export default CreateCompany;
