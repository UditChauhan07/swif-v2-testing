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
import "bootstrap/dist/css/bootstrap.min.css";
import {
  createCompanyApi,
  editCompanyApi,
  getSubscriptionPackagesList,
  getTaxationDetails,
} from "../../../../../lib/store";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../../../../Components/Header/Header";
import { useTranslation } from "react-i18next";
import imageCompression from "browser-image-compression";
import Select from "react-select";
import { getNames } from "country-list";
import ChangePasswordModal from "../../../../../Components/ChangePasswordModal/ChangePasswordModal ";
import { PencilSquare, Check2 } from "react-bootstrap-icons"; // Bootstrap Icons

const EditCompany = () => {
  const { t, i18n } = useTranslation();
  const countryOptions = getNames().map((country) => ({
    value: country,
    label: country,
  }));
  const [currentStep, setCurrentStep] = useState(1);
  const { state } = useLocation();
  const { company = {}, user = {} } = state.company || {};
  console.log("Company------", state.company);
  const [companyId, setcompanyId] = useState(state?.company?.company.id);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passChangeId, setpassChangeId] = useState();
  const [userId, setuserId] = useState(state?.company?.user.id);
  const [editMode, setEditMode] = useState({}); // Track which fields are editable
  const [isEditingTotal, setIsEditingTotal] = useState(false); // Toggle total cost edit mode
  const [prevcharges, setPharges] = useState({
    name: state.company?.company?.charges?.planName,
    Interval: state.company?.company?.charges?.Interval,
    currency: state.company?.company?.charges?.currency,
    features: {
      add_customers: state.company?.charges?.company?.customerCreation,
      add_office_users: state.company?.company?.charges?.officeUserCreation,
      add_field_users: state.company?.company?.charges?.fieldUserCreation,
      work_order_creation: state.company?.company?.charges?.workOrderCreation,
      work_order_execution: state.company?.company?.charges?.workOrderExecution,
    },
    cost_per_month: state.company?.company?.charges?.planTotalCost,
  }); //

  const [imageErrors, setImageErrors] = useState({
    profilePicture: "",
    companyLogo: "",
  });
  const [subscriptionPlanList, setsubscriptionPlanList] = useState();
  const [selectedPlan, setselectedPlan] = useState({
    name: state.company?.company?.charges?.planName,
    features: {
      add_customers: state.company?.charges?.company?.customerCreation,
      add_office_users: state.company?.company?.charges?.officeUserCreation,
      add_field_users: state.company?.company?.charges?.fieldUserCreation,
      work_order_creation: state.company?.company?.charges?.workOrderCreation,
      work_order_execution: state.company?.company?.charges?.workOrderExecution,
    },
    cost_per_month: state.company?.company?.charges?.planTotalCost,
  });
  const [featureDifferences, setFeatureDifferences] = useState(null);

  const [countryListDetails, setcountryListDetails] = useState();
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
  useEffect(() => {
    const fetchSubscriptionPlan = async () => {
      try {
        const response = await getSubscriptionPackagesList(token);
        // console.log("package respppppppppp", response);
        const sortedPackages = response.packages
          ? [...response.packages]
              // .filter((pkg) => pkg.packageType !== "payg") // Exclude 'payg' packages
              .sort((a, b) => a.cost_per_month - b.cost_per_month)
          : [];
        setsubscriptionPlanList(sortedPackages || []);
      } catch (error) {
        console.error("error while fetching subscription pacakage list", error);
      }
    };
    fetchSubscriptionPlan();
  }, []);

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
    currency: "",
    timeZone: "",
    taxName: "",
    taxPercentage: "",
    certificationName: "",
    certificationNumber: "",
    additionalCertifications: [],
    charges: {},

    // Step 3: Contact Information
    addressLine1: "",
    addressLine2: "",
    contactCity: "",
    companyState: "",
    //  Country details
    contactCountry: "",
    taxName: "",
    taxPercentage: "",
    countryName: "",
    currencyCode: "",
    // ss
    contactCountry: "",
    contactZip: "",
    contactPerson: "",
    contactPhone: "",
    officePhone: "",
    officeEmail: "",

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
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday"],
    companyStatus: true,
  });

  const countryOptions2 = countryListDetails?.map((country) => ({
    value: country.countryName,
    label: country.countryName,
  }));

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
        language: company.language === "en" ? "English" : "Spanish",

        // Step 2: Company Basic Details
        companyName: company.company_name || "",
        companyLogo: null,
        currency: company.currency || "",
        timeZone: company.time_zone || "",
        taxName: company.tax_name || "",
        taxPercentage: company.tax_percentage || "",
        certificationName: company.certificates?.[0]?.name || "",
        certificationNumber: company.certificates?.[0]?.number || "",
        charges: company.charges || {},
        // Only show additional certifications if there are more than one.
        additionalCertifications:
          company.certificates && company.certificates.length > 1
            ? company.certificates.slice(1)
            : [],

        // Step 3: Contact Information
        addressLine1: company.address_line_1 || "",
        addressLine2: company.address_line_2 || "",
        contactCity: company.city || "",
        contactCountry: company.country || "",
        //  Country details
        contactCountry: company.companyCountryName || "",
        taxName: company.taxName || "",
        taxPercentage: company.taxPercentage || "",
        countryName: company.alphaCode || "",
        currencyCode: company.currencyCode || "",
        // ss
        companyState: company.companyState || "",
        contactZip: company.zip_postal_code || "",
        contactPerson: company.company_contact_person_name || "",
        contactPhone: company.contact_person_phone || "",
        officePhone: company.company_office_phone || "",
        officeEmail: company.company_office_email || "",
        package: company?.package_id || "",
        packageDescritption: company?.package_name || "",
        // Step 4: Other Settings
        // package: company.package_id || "",
        // packageDescritption: company.package_name || [],
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

  useEffect(() => {
    if (formData.packageDescritption) {
      const selectedOption = subscriptionPlanList?.find(
        (option) => option.name === formData.packageDescritption
      );

      if (selectedOption) {
        setselectedPlan({
          name: selectedOption.name,
          features: selectedOption.features || [],
          costPerMonth: selectedOption.cost_per_month,
        });
      }
    }
    // if (state.company.charges) {
    //   const charges = state.company.charges;
    //   // const selectedOption = subscriptionPlanList?.find(
    //   //   (option) => option.name === formData.packageDescritption
    //   // );

    //   // if (selectedOption) {
    //   //   setselectedPlan({
    //   //     name:  selectedOption.name,
    //   //     features: selectedOption.features || [],
    //   //     costPerMonth: selectedOption.cost_per_month,
    //   //   });
    //   // }else{
    //     setselectedPlan({
    //       name:  charges?.planName,
    //       features: {
    //         add_customers: charges?.customerCreation,
    //         add_office_users: charges?.officeUserCreation,
    //         add_field_users: charges?.fieldUserCreation,
    //         work_order_creation: charges?.workOrderCreation,
    //         work_order_execution: charges?.workOrderExecution,
    //       },
    //       cost_per_month: charges?.planTotalCost,
    //     });
    //   // }
    // }
  }, [setselectedPlan]);

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
    setFormData((prev) => {
      let updatedFormData = { ...prev, [field]: value };

      if (field === "contactCountry") {
        const selectedCountry = countryListDetails?.find(
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

        case "language":
          if (!value) {
            newErrors.language = t("Language selection is required.");
          } else {
            delete newErrors.language;
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

        if (!formData.language) {
          newErrors.language = t("Language selection is required.");
        }
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
    const charges = {
      currency: formData?.currencyCode || "USD",
      planName: selectedPlan.name || formData.packageDescritption,
      Interval: "monthly",
    };

    if (formData.packageDescritption == "payg") {
      charges.customerCreation = selectedPlan?.features?.add_customers || 0;
      charges.fieldUserCreation = selectedPlan?.features?.add_field_users || 0;
      charges.officeUserCreation =
        selectedPlan?.features?.add_office_users || 0;
      charges.workOrderCreation =
        selectedPlan?.features?.work_order_creation || 0;
      charges.workOrderExecution =
        selectedPlan?.features?.work_order_execution || 0;
    } else {
      charges.customerCreation = selectedPlan?.features?.add_customers || 0;
      charges.fieldUserCreation = selectedPlan?.features?.add_field_users || 0;
      charges.officeUserCreation =
        selectedPlan?.features?.add_office_users || 0;
      charges.workOrderCreation =
        selectedPlan?.features?.work_order_creation || 0;
      charges.workOrderExecution =
        selectedPlan?.features?.work_order_execution || 0;
      charges.planTotalCost = selectedPlan?.cost_per_month || 0;
      charges.taxAbleAmount = selectedPlan?.cost_per_month ? selectedPlan.cost_per_month + (selectedPlan.cost_per_month * (formData.taxPercentage || 0) / 100) : 0;   
    }
    if (
      Object.keys(errors).length > 0 ||
      Object.keys(currentErrors).length > 0
    ) {
      return;
    }
    const languageCode = formData.language === "English" ? "en" : "es";
    // console.log("Submit---", formData);
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
      // address_line_2: formData.addressLine2,
      city: formData.contactCity,
      country: formData.contactCountry,
      zip_postal_code: formData.contactZip,

      company_contact_person_name: formData.contactPerson,
      contact_person_phone: formData.contactPhone,
      // company_office_phone: formData.officePhone,
      company_office_email: formData.officeEmail,

      workingDays: formData.workingDays,
      companyStatus: formData.companyStatus,
      companyState: formData.companyState,
      language: languageCode,
      package_id: formData?.package,
      package_name: formData.packageDescritption,
      alphaCode: formData.countryName,
      companyCountryName: formData.contactCountry,
      taxName: formData.taxName,
      taxPercentage: formData.taxPercentage,
      currencyCode: formData.currencyCode,
      charges,
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

  const toggleEditMode = (featureKey) => {
    setEditMode((prev) => ({
      ...prev,
      [featureKey]: !prev[featureKey],
    }));
  };

  // Function to update feature limits dynamically
  const handleFeatureChange = (featureKey, newValue) => {
    const updatedFeatures = {
      ...selectedPlan.features,
      [featureKey]: Number(newValue),
    };

    // Example: Calculate cost dynamically (Modify as per your pricing model)
    const newCost = Object.values(updatedFeatures).reduce(
      (acc, val) => acc + val * 5,
      0
    );

    setselectedPlan((prev) => ({
      ...prev,
      features: updatedFeatures,
      cost_per_month:
        selectedPlan?.name?.toLowerCase() === "payg"? 0 : prev.cost_per_month, // Only auto-update cost if PAYG
      name: selectedPlan?.name.toLowerCase() === "payg" ? prev.name : "Custom",
    }));
  };

  // Function to manually update total cost (for non-PAYG plans)
  const handleTotalCostChange = (newCost) => {
    setselectedPlan((prev) => ({
      ...prev,
      cost_per_month: Number(newCost),
      name: selectedPlan?.name.toLowerCase() === "payg" ? prev.name : "Custom",
    }));
  };

  const SubscriptionOptions = [
    prevcharges
      ? {
          value: prevcharges.name || "N/A", // Prevent undefined errors
          label: "Current Plan", // Label as "Current Plan"
          package_id: "current_plan", // Unique identifier
          features: prevcharges.features || [], // Default to empty array if undefined
          cost_per_month: prevcharges.cost_per_month || 0, // Default value
        }
      : null, // Add null check if prevcharges is missing
    ...(Array.isArray(subscriptionPlanList)
      ? subscriptionPlanList.map((option) => ({
          value: option.name || "N/A",
          label: option.name || "Unnamed Plan",
          package_id: option.package_id || "unknown",
          features: option.features || [],
          cost_per_month: option.cost_per_month || 0,
        }))
      : []), // If subscriptionPlanList is undefined, return an empty array instead of throwing an error
  ].filter(Boolean); // Removes `null` values from the array
  

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
                    <div className="d-flex align-items-center">
                      <Button
                        style={{ background: "#2e2e32", border: "none" }}
                        onClick={() => setShowChangePassword(true)}
                        className="ms-2"
                      >
                        {t("Change Password")}
                      </Button>
                    </div>
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
                      value={countryOptions?.find(
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
                      <option value="">Select Language</option>
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
                      value={countryOptions2?.find(
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
                    <Form.Label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "20px",
                      }}
                    >
                      <span className="text-danger">*</span>{" "}
                      {t("Country Tax Name")}:{" "}
                      <Form.Control
                        type="text"
                        value={formData.taxName || ""}
                        disabled
                        style={{
                          display: "inline-block",
                          width: "50%",
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
                      <Form.Label style={{ marginLeft: "7px" }}>
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
                        Default (mon, tue, wed, thus, fri)
                      </Form.Text>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              <Button
                variant="primary"
                type="button"
                className=" mb-2"
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
              {/* <Select
                options={subscriptionPlanList?.map((option) => ({
                  value: option.name,
                  label: option.name,
                  package_id: option.package_id,
                  features: option.features,
                  cost_per_month: option?.cost_per_month,
                }))}
                onChange={(selectedOption) => {
                  handleChange("package", selectedOption?.package_id);
                  handleChange("packageDescritption", selectedOption?.value);
                  setselectedPlan(
                    {
                      name: selectedOption?.value,
                      features: selectedOption?.features,
                      cost_per_month: selectedOption?.cost_per_month,
                    } || {}
                  );
                }}
                value={
                  subscriptionPlanList?.find(
                    (option) => option?.name === formData.packageDescritption
                  ) // Directly find matching option
                    ? {
                        value: formData.packageDescritption,
                        label: formData.packageDescritption,
                      }
                    : null
                } // Ensure null when no match
                styles={{
                  menuList: (provided) => ({
                    ...provided,
                    maxHeight: "150px", // Limits dropdown height
                    overflowY: "auto",
                  }),
                }}
                required
              /> */}
              <Select
                options={
SubscriptionOptions 

                //   [
                //   {
                //     value: prevcharges.name, // Set name from prevcharges
                //     // label: `${prevcharges.name} (Current Plan)`, // Label as "Current Plan"
                //     label: `Current Plan`, // Label as "Current Plan"
                //     package_id: "current_plan", // Set a unique identifier for the current plan
                //     features: prevcharges.features, // Include features from prevcharges
                //     cost_per_month: prevcharges.cost_per_month, // Cost per month from prevcharges
                //   },
                //   ...subscriptionPlanList?.map((option) => ({
                //     value: option.name,
                //     label: option.name,
                //     package_id: option.package_id,
                //     features: option.features,
                //     cost_per_month: option?.cost_per_month,
                //   })),
                // ]
              }
                onChange={(selectedOption) => {
                  if (selectedOption.package_id === "current_plan") {
                    handleChange("package", selectedOption?.package_id);
                    handleChange("packageDescritption", selectedOption?.value);
                    setselectedPlan({
                      name: selectedOption?.value,
                      features: selectedOption?.features,
                      cost_per_month: selectedOption?.cost_per_month,
                    });
                  } else {
                    handleChange("package", selectedOption?.package_id);
                    handleChange("packageDescritption", selectedOption?.value);
                    setselectedPlan({
                      name: selectedOption?.value,
                      features: selectedOption?.features,
                      cost_per_month: selectedOption?.cost_per_month,
                    });
                  }
                }}
                value={
                  // subscriptionPlanList?.find(
                  //   (option) => option?.name === formData.packageDescritption
                  // )
                  //   ? {
                  //       value: formData.packageDescritption,
                  //       label: formData.packageDescritption,
                  //     }
                  //   : prevcharges.name // If no matching option, default to prevcharges name
                  subscriptionPlanList?.find(
                    (option) => option?.name != formData?.charges.planName
                  )
                    ? {
                        value: selectedPlan.name,
                        label: selectedPlan.name,
                      }
                    : {
                        value: formData?.charges.planName,
                        label: formData?.charges.planName,
                      }
                }
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
              // <Card className="mt-3 mb-3 shadow-sm border-0">
              //   <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              //     <h5 className="mb-0">
              //     {t(subscriptionPlanMapping[selectedPlan.name] ||selectedPlan.name.replace(/_/g, " "))}
              //       {/* {selectedPlan?.name} */}
              //       </h5>
              //     <Badge bg="light" text="dark">
              //      { t("Selected Plan")}
              //     </Badge>
              //   </Card.Header>
              //   <Card.Body>
              //     <ListGroup variant="flush">
              //       {Object.entries(selectedPlan.features).map(([key, value]) => (
              //         <ListGroup.Item
              //           key={key}
              //           className="d-flex justify-content-between align-items-center"
              //         >
              //           <span>
              //             {/* {t(key.replace(/_/g, " ").toLowerCase()).replace(
              //               /\b\w/g,
              //               (char) => char.toUpperCase()
              //             )} */}
              //                 {t(featureMapping[key] || key.replace(/_/g, " "))}
              //           </span>
              //           <Badge bg="success" pill>
              //             {value}
              //           </Badge>
              //         </ListGroup.Item>
              //       ))}
              //     </ListGroup>
              //   </Card.Body>
              // </Card>
              <></>
            )}

            {selectedPlan?.name && (
              <Card className="mt-3 mb-3 shadow-sm border-0">
                <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">
                    {t(
                      subscriptionPlanMapping[selectedPlan.name] ||
                        selectedPlan.name.replace(/_/g, " ")
                    )}
                  </h5>
                  <Badge bg="light" text="dark">
                    {t("Selected Plan")}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span><p className="text-sm fw-bold">{t("Features")}</p></span>
                      <p className="Text-sm fw-bold">{selectedPlan?.name.toLowerCase() !== "payg"? t("Usage Limit"):t(`$ Per Usage`)}</p>
                    </ListGroup.Item>
                    {Object.entries(selectedPlan.features).map(
                      ([key, value]) => (
                        <ListGroup.Item
                          key={key}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <span>
                            {t(featureMapping[key] || key.replace(/_/g, " "))}
                          </span>
                          <div className="d-flex align-items-center">
                            {editMode[key] ? (
                              <>
                                <Form.Control
                                  type="number"
                                  value={value}
                                  min="0"
                                  className="w-50 text-center"
                                  onChange={(e) =>
                                    handleFeatureChange(key, e.target.value)
                                  }
                                />
                                <Check2
                                  className="ms-2 text-success"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "1.2rem",
                                  }}
                                  onClick={() => toggleEditMode(key)}
                                />
                              </>
                            ) : (
                              <>
                                <Badge bg="success" pill>
                                  {value}
                                </Badge>
                                <PencilSquare
                                  className="ms-2 text-primary"
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "1.2rem",
                                  }}
                                  onClick={() => toggleEditMode(key)}
                                />
                              </>
                            )}
                          </div>
                        </ListGroup.Item>
                      )
                    )}

                    {/* Editable Total Cost for Non-PAYG Plans */}
                    {selectedPlan?.name.toLowerCase() != "payg" &&
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <span>
                        <p className="fw-bold">
                          {t("Total Cost")} ({t("Per Month")})
                        </p>
                      </span>
                      <div className="d-flex align-items-center">
                        {selectedPlan?.name.toLowerCase() === "payg" ? (
                          <p className="fw-bold">
                            $ {selectedPlan?.cost_per_month}
                          </p>
                        ) : isEditingTotal ? (
                          <>
                            <Form.Control
                              type="number"
                              value={selectedPlan.cost_per_month}
                              className="w-50 text-center"
                              onChange={(e) =>
                                handleTotalCostChange(e.target.value)
                              }
                            />
                            <Check2
                              className="ms-2 text-success"
                              style={{ cursor: "pointer", fontSize: "1.2rem" }}
                              onClick={() => setIsEditingTotal(false)}
                            />
                          </>
                        ) : (
                          <>
                            <p className="fw-bold">
                              $ {selectedPlan?.cost_per_month}
                            </p>
                            <PencilSquare
                              className="ms-2 text-primary"
                              style={{ cursor: "pointer", fontSize: "1.2rem" }}
                              onClick={() => setIsEditingTotal(true)}
                            />
                          </>
                        )}
                      </div>
                    </ListGroup.Item>
                    }
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
        {showChangePassword && (
          <ChangePasswordModal
            show={showChangePassword}
            handleClose={() => setShowChangePassword(false)}
            userId={userId}
          />
        )}
      </div>
    </>
  );
};

export default EditCompany;
