import React, { useEffect, useState } from "react";
import Header from "../../../../Components/Header/Header";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { workOrderReportSingleCompany } from "../../../../lib/store";
import LoadingComp from "../../../../Components/Loader/LoadingComp";
import "./CompWOReport.css";

const CompanyWOreport = () => {
  const { t } = useTranslation();
  const [workOrderData, setWorkOrderData] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("UserToken"));
  const [companyId, setCompanyId] = useState(localStorage.getItem("companyId"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await workOrderReportSingleCompany(token, companyId);
        if (response.status === true) {
          setWorkOrderData(response.data);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="main-header-box mt-5">
        <div className="pages-box">
          <div
            className="form-header mb-4"
            style={{
              backgroundColor: "#2e2e32",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
          >
            <h4 className="mb-0" style={{ textAlign: "center" }}>
              {t("Work Order Report")}
            </h4>
          </div>
          {workOrderData ? (
            <Container className="mt-4">
              <Card className="shadow-lg rounded p-4">
                <div className="text-center">
                  <h5 className="text-uppercase mb-4">
                    {workOrderData.company_name}
                  </h5>
                </div>

                {/* Work Order Report Information */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Card className="p-3 shadow-sm">
                      <h6>{t("Scheduled per Day")}</h6>
                      <div className="text-muted fs-4">
                        {workOrderData.per_day}
                      </div>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="p-3 shadow-sm">
                      <h6>{t("Scheduled per Week")}</h6>
                      <div className="text-muted fs-4">
                        {workOrderData.per_week}
                      </div>
                    </Card>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Card className="p-3 shadow-sm">
                      <h6>{t("Scheduled per Month")}</h6>
                      <div className="text-muted fs-4">
                        {workOrderData.per_month}
                      </div>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="p-3 shadow-sm">
                      <h6>{t("Completed Work Orders per Day")}</h6>
                      <div className="text-muted fs-4">
                        {workOrderData.completed_per_day}
                      </div>
                    </Card>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col md={6}>
                    <Card className="p-3 shadow-sm">
                      <h6>{t("Completed Work Orders per Week")}</h6>
                      <div className="text-muted fs-4">
                        {workOrderData.completed_per_week}
                      </div>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="p-3 shadow-sm">
                      <h6>{t("Completed Work Orders per Month")}</h6>
                      <div className="text-muted fs-4">
                        {workOrderData.completed_per_month}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Container>
          ) : (
            <LoadingComp />
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyWOreport;
