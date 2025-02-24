import React, { useState } from "react";
import Header from "../../../../../Components/Header/Header";
import { Container, Row, Col, Image, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

const CompanyDetails = () => {
    const { t } = useTranslation(); 
  const location = useLocation();
  const { company } = location.state || {};
  console.log('company',company);
  const base64String =company.company.company_logo

  function formatTimestamp(timestamp) {
    // Extract seconds and nanoseconds
    const { _seconds, _nanoseconds } = timestamp;

    // Create a Date object
    const date = new Date(_seconds * 1000 + _nanoseconds / 1000000);

    // Define options for formatting
    const options = {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };

    // Format the date
    return date.toLocaleString("en-US", options);
  }

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <h4 className="mb-4">{t("Company Details")}</h4>
          <Container className="mt-4">
            <Card className="p-2 shadow-sm">
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Name")}:
                </Col>
                <Col>{company.company.company_name}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Logo")}:
                </Col>
                <Col>
                  {company.company.company_logo ? (
                    <Image
                      src={company.company.company_logo}
                      alt="Logo"
                      fluid
                      rounded
                      style={{height:"150px",width:"150px",objectFit:"cover"}}
                    />
                  ) : (
                    <Image
                      src="https://swif.truet.net/public/swifCompany/noLogo.jpg"
                      alt="Logo"
                      fluid
                      rounded
                      style={{height:"100px",width:"200px"}}
                    />
                  )}
                </Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Address")}:
                </Col>
                <Col>{company.company.address_line_1}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company City")}:
                </Col>
                <Col>{company.company.city}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company State")}:
                </Col>
                <Col>{company.company.companyState}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Zip")}:
                </Col>
                <Col>{company.company.zip_postal_code}</Col>
              </Row>
          
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Working Day")}:
                </Col>
                <Col>
                  {company.company.workingDays.map((day, index) => (
                    <span
                      key={index}
                      className=" text-white me-2"
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
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Office Email Address")}:
                </Col>
                <Col>{company.company.company_office_email}</Col>
              </Row>
            
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Admin Name")}:
                </Col>
                <Col>{company.user.first_name?company.user.first_name:'--'}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Admin Email")}:
                </Col>
                <Col>{company.user.email?company.user.email:'--'}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Admin Contact Number")}:
                </Col>
                <Col>{company.user.contact_number?company.user.contact_number:'--'}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Admin Address")}:
                </Col>
                <Col>{company.user.Address?company.user.Address:'--'}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Admin City")}:
                </Col>
                <Col>{company.user.city?company.user.city:'--'}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Admin State")}:
                </Col>
                <Col>{company.user.state?company.user.state:'--'}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Company Admin Country")}:
                </Col>
                <Col>{company.user.state?company.user.country:'--'}</Col>
              </Row>
              {/* <Row className="p-3">
                <Col md={3} className="fw-bold">
                  Company Package:
                </Col>
                <Col>{company.company.package}</Col>
              </Row> */}
              {/* <Row className="p-3">
                <Col md={3} className="fw-bold">
                  Company Admin last Login:
                </Col>
                <Col>--</Col>
              </Row> */}
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Created At")}:
                </Col>
                <Col>{formatTimestamp(company.company.created_at)}</Col>
              </Row>
            </Card>
          </Container>
        </div>
      </div>
    </>
  );
};

export default CompanyDetails;
