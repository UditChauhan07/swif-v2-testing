import React, { useState } from "react";
import Header from "../../../../../Components/Header/Header";
import { Container, Row, Col, Image, Card,Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";


const CustomerDetails = () => {
  const { t } = useTranslation(); 
  const navigate = useNavigate()
  
  const location = useLocation();
  const { customer } = location.state || {};
  console.log(customer);

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
          <h4 className="mb-4">{t("Customer Details")}</h4>
          <Container className="mt-4">
            <Card className="p-2 shadow-sm">
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Name")}:
                </Col>
                <Col>{customer.name}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Customer Id")}:
                </Col>
                <Col>{customer.id}</Col>
              </Row>

              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Phone Number")}:
                </Col>
                <Col>{customer.phone}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Email Address")}:
                </Col>
                <Col>{customer.email}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Address")}:
                </Col>
                <Col>{customer.address || "--"}</Col>
              </Row>
              <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Created At")}:
                </Col>
                <Col>{formatTimestamp(customer.created_at)}</Col>
              </Row>
            </Card>
            <div className="mt-4 text-center">
              <Button variant="secondary" onClick={() => navigate("/customers/list")}>
                {t("Back")}
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default CustomerDetails;
