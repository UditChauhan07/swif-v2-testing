import React, { useEffect, useState } from "react";
import Header from "../../../Components/Header/Header";
import { Container, Row, Col, Image, Card, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CompanyUpdateModal from "./CompanyUpdateModal";
import {
  getCompanyDetail,
  editCompanyApi,
  updateSingleCompany,
} from "../../../lib/store";
import LoadingComp from "../../../Components/Loader/LoadingComp";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const AdminProfile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Initial state for company details
  const [formData, setFormData] = useState({
    company_name: "",
    company_logo: "",
    city: "",
    address_line_1: "",
    country: "",
    zip_postal_code: "",
    company_contact_person_name: "",
    contact_person_phone: "",
    company_office_email: "",
    workingDays: [],
    companyState: "",
  });

  const [showModal, setShowModal] = useState(false);
  const [companyId] = useState(localStorage.getItem("companyId"));
  const [token] = useState(localStorage.getItem("UserToken"));
  const [isLoading, setIsLoading] = useState(false);
  const [companyData, setcompanyData] = useState();
  console.log("dasdsdsadsa", companyData);

  // Function to fetch company details
  const fetchCompanyData = async () => {
    try {
      setIsLoading(true);
      const response = await getCompanyDetail(companyId, token);
      if (response.status === true) {
        setFormData(response?.data);
        setcompanyData(response?.data);
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch company details on mount
  useEffect(() => {
    fetchCompanyData();
  }, [companyId, token]);

  // Modal show/hide handlers
  const handleShow = () => {
    setFormData(companyData);
    setShowModal(true);
  };
  const handleClose = () => {
    // Reset the formData to the latest fetched company data
    setFormData(companyData);
    setShowModal(false);
  };

  // Updated handleChange: receives a field name and its new value
  const handleChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      if (!(file instanceof Blob)) {
        return resolve(file);
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Convert company logo to Base64 if it's a file
    const companyLogoBase64 =
      formData.company_logo instanceof Blob
        ? await fileToBase64(formData.company_logo)
        : formData.company_logo;

    // Build companyData object from formData
    const companyData = {
      company_name: formData.company_name,
      company_logo: companyLogoBase64,
      address_line_1: formData.address_line_1,
      city: formData.city,
      country: formData.country,
      zip_postal_code: formData.zip_postal_code,
      company_contact_person_name: formData.company_contact_person_name,
      contact_person_phone: formData.contact_person_phone,
      company_office_email: formData.company_office_email,
      workingDays: formData.workingDays,
      companyState: formData.companyState,
    };

    console.log("companyData", companyData);

    // Show confirmation dialog
    const result = await Swal.fire({
      title: t("Are you sure?"),
      text: t("Do you want to update the company details?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, update it!"),
      cancelButtonText: t("No, cancel"),
    });

    if (!result.isConfirmed) {
      return;
    }

    // Show loading alert
    Swal.fire({
      title: t("Processing..."),
      text: t("Updating company details, please wait."),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await updateSingleCompany(companyId, token, companyData);
      Swal.close();

      if (response.status) {
        await Swal.fire({
          title: t("Success!"),
          text: t("Company updated successfully."),
          icon: "success",
          confirmButtonText: "OK",
        });
        handleClose();
        await fetchCompanyData();
      } else {
        Swal.fire({
          title: t("Error!"),
          text:
            response.message ||
            t("There was an error updating the company details."),
          icon: "error",
          confirmButtonText: t("Try Again"),
        });
      }
    } catch (error) {
      Swal.close();
      console.error("Error updating company", error);
      Swal.fire({
        title: t("API Error!"),
        text: t("Something went wrong. Please try again later."),
        icon: "error",
        confirmButtonText: "OK",
      });
    }

    handleClose();
  };

  return (
    <>
      <Header />
      <div className="main-header-box">
        <div className="mt-3 pages-box">
          {isLoading ? (
            <LoadingComp item="Details" />
          ) : (
            <>
              {/* Header Area */}
              <div
                className="d-flex justify-content-between align-items-center w-100 mb-4"
                style={{
                  backgroundColor: "#2e2e32",
                  padding: "10px 20px",
                  borderRadius: "8px",
                }}
              >
                <div>
                  <h4 className="mb-0 text-white">{t("Company Profile")}</h4>
                </div>
                <Button
                  variant="secondary"
                  className="px-4"
                  onClick={handleShow}
                  style={{
                    backgroundColor: "#808080",
                    border: "none",
                    color: "black",
                  }}
                >
                  {t("Update")}
                </Button>
              </div>

              <Container className="mt-1">
                <Card className="p-2 shadow-sm">
                  <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      {t("Company Name")}:
                    </Col>
                    <Col>{companyData?.company_name}</Col>
                  </Row>
                  <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      {t("Company Logo")}:
                    </Col>
                    <Col>
                      <Image
                        src={companyData?.company_logo}
                        alt="Logo"
                        fluid
                        rounded
                        style={{ height: "150px", width: "150px" }}
                      />
                    </Col>
                  </Row>
                  <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      {t("City")}:
                    </Col>
                    <Col>{companyData?.city}</Col>
                  </Row>
                  <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      {t("Address")}:
                    </Col>
                    <Col>{companyData?.address_line_1}</Col>
                  </Row>
                  <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      {t("Country")}:
                    </Col>
                    <Col>{companyData?.country}</Col>
                  </Row>
                  <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      {t("Zip Code")}:
                    </Col>
                    <Col>{companyData?.zip_postal_code}</Col>
                  </Row>
                  <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      {t("Contact Person Name")}:
                    </Col>
                    <Col>{companyData?.company_contact_person_name}</Col>
                  </Row>
                  <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      {t("Contact Phone")}:
                    </Col>
                    <Col>{companyData?.contact_person_phone}</Col>
                  </Row>
                  <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      {t("Office Email")}:
                    </Col>
                    <Col>{companyData?.company_office_email}</Col>
                  </Row>
                  <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      {t("Working Days")}:
                    </Col>
                    <Col>
                      {companyData?.workingDays?.map((day, index) => (
                        <span
                          key={index}
                          className="text-white me-2"
                          style={{
                            fontSize: "0.9rem",
                            borderRadius: "10px",
                            padding: "8px 12px",
                            background: "#2e2e32",
                          }}
                        >
                          {t(day)}
                        </span>
                      ))}
                    </Col>
                  </Row>
                </Card>
              </Container>
            </>
          )}
        </div>
      </div>

      {/* Update Modal Component */}
      <CompanyUpdateModal
        show={showModal}
        handleClose={handleClose}
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default AdminProfile;
