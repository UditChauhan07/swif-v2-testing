import React, { useState } from "react";
import { Container, Row, Col, Image, Card } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import Header from "../../../../Components/Header/Header";
import { useTranslation } from "react-i18next";
import BackButton from "../../../../utils/BackButton/BackButton";


const FieldUserDetails = () => {
        const { t } = useTranslation(); 
    const location = useLocation();
    const { row } = location.state || {};
    // console.log(row);
  return (
    <>
    <Header/>
    <div className="main-header-box mt-4">
        <div className="pages-box">
          <h4 className="mb-4">{t("Field Agent Details")}</h4>
          <Container className="mt-4">
          <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Agent Id")}:
                </Col>
                <Col>{row?.id ? row.id:'--'}</Col>
           </Row>
          <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Name")}:
                </Col>
                <Col>{row?.name ? row.name:'--'}</Col>
           </Row>
           <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Username")}:
                </Col>
                <Col>{row?.username ?row.username:'--'}</Col>
           </Row>
           <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Contact")}:
                </Col>
                <Col>{row?.contact_number ? row.contact_number :'--'}</Col>
           </Row>
           <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Email")}:
                </Col>
                <Col>{row?.email ? row.email :'--'}</Col>
           </Row>
          <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Address")}:
                </Col>
                <Col>{row?.address ? row.address :'--'}</Col>
           </Row>
          <Row className="p-3">
                <Col md={3} className="fw-bold">
                  {t("Country")}:
                </Col>
                <Col>{row.country ? row.country :'--'}</Col>
           </Row>          
          <BackButton/>
          </Container>
        </div>
      </div>  
    </>
  )
}

export default FieldUserDetails
