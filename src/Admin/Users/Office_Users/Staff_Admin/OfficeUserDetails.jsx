

    import React, { useState } from "react";
    import { Container, Row, Col, Image, Card,Button} from "react-bootstrap";
    import { useLocation } from "react-router-dom";
    import Header from "../../../../Components/Header/Header";

    import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BackButton from "../../../../utils/BackButton/BackButton";
    
    const OfficeUserDetails = () => {
        const location = useLocation();
          const { t } = useTranslation();
        
          const navigate = useNavigate();
        const { row } = location.state || {};
        console.log(row);
      return (
        <>
        <Header/>
        <div className="main-header-box mt-4">
            <div className="pages-box">
              <h4 className="mb-4">Office User Details</h4>
              <Container className="mt-4">
              <Row className="p-3">
                    <Col md={3} className="fw-bold">
                     First Name:
                    </Col>
                    <Col>{row.first_name
                    }</Col>
               </Row>
              <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      Last Name:
                    </Col>
                    <Col>{row.last_name
                    }</Col>
               </Row>
                  <Row className="p-3">
                  <Col md={3} className="fw-bold">
                    User Profile:
                  </Col>
                  <Col>
                    {row.profile_picture ? (
                      <Image
                        src={row.profile_picture}
                        alt="Logo"
                        fluid
                        rounded
                        style={{height:"150px",width:"150px"}}
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
                      Address:
                    </Col>
                    <Col>{row.Address ? row.Address : row.Address}</Col>
               </Row>
              <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      State:
                    </Col>
                    <Col>{row.Address ? row.state : row.state}</Col>
               </Row>
              <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      Country:
                    </Col>
                    <Col>{row.country}</Col>
               </Row>
               <Row className="p-3">
                    <Col md={3} className="fw-bold">
                    Zip_code:
                    </Col>
                    <Col>{row.zip_code}</Col>
               </Row>
              <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      Email:
                    </Col>
                    <Col>{row.email}</Col>
               </Row>
              <Row className="p-3">
                    <Col md={3} className="fw-bold">
                      Contact:
                    </Col>
                    <Col>{row.contact_number}</Col>
               </Row>
             
               {/* <Button
              variant="primary"
              type="submit"
              onClick={(e) => {
                e.preventDefault();
                navigate(-1); // Replace "/home" with your desired URL
              }}
            >
              {t("Back")}
            </Button> */}
              <BackButton/>
              </Container>
            </div>
          </div>  
        </>
      )
    }
    

    
export default OfficeUserDetails
