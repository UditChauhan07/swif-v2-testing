import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Spinner } from "react-bootstrap";
import Header from "../../../Components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap styles
import "./DashBoard.css";
import {
  getCompanyListApi,
  getSuperAdminDashboardDetails,
} from "../../../lib/store";
import { useTranslation } from "react-i18next";

// Helper function to truncate text with a custom maximum length
const truncateText = (text, maxLength) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

const DashBoard = () => {
  const { t } = useTranslation();

  const [totalCompanies, setTotalCompanies] = useState();
  const [totalWorkOrders, setTotalWorkOrders] = useState();
  const [companyList, setCompanyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("UserToken");

  useEffect(() => {
    const fetchCompanies = async () => {
      setLoading(true);
      try {
        const response = await getCompanyListApi(token);
        if (response.status === true) {
          setCompanyList(response?.data || []);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [token]);

  useEffect(() => {
    const fetchDashboardDetails = async () => {
      try {
        const response = await getSuperAdminDashboardDetails(token);
        if (response.success === true) {
          setTotalCompanies(response?.totalCompanies || 0);
          setTotalWorkOrders(response?.totalWorkOrders || 0);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchDashboardDetails();
  }, [token]);

  return (
    <>
      <Header />
      <div className="main-header-box">
        <div className="mt-4 pages-box">
          <Container fluid className="dashboard-content">
            {/* Stats Row */}
            <Row className="stats-row mb-4">
              <Col md={6}>
                <Card className="stats-card">
                  <Card.Body>
                    <h3>{totalCompanies || 0}</h3>
                    <p>{t("Total Companies")}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="stats-card">
                  <Card.Body>
                    <h3>{totalWorkOrders || 0}</h3>
                    <p>{t("Total Work Orders")}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Show Loader while waiting for API response */}
            {loading ? (
              <div className="text-center my-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">{t("Loading")}...</span>
                </Spinner>
                <p>
                  {t("Loading")} {t("Companies")}...
                </p>
              </div>
            ) : (
              <Row>
                {companyList.map((company) => (
                  <Col md={4} key={company.id}>
                    <Card className="company-card">
                      <Card.Img
                        className="company-logo"
                        variant="top"
                        src={
                          company.company.company_logo ||
                          "https://swif.truet.net/public/swifCompany/noLogo.jpg"
                        }
                        alt={`${company.company.company_name} logo`}
                      />
                      <Card.Body>
                        <Card.Title
                          style={{ textAlign: "center", color: "black" }}
                        >
                          <strong>
                            {truncateText(company?.company.company_name, 15)}
                          </strong>
                        </Card.Title>
                        <Card.Text
                          style={{ textAlign: "center", minHeight: "50px" }}
                        >
                          {truncateText(
                            `${company.company.address_line_1}, ${company.company.address_line_2}, ${company.company.companyState}, ${company.company.zip_postal_code}, ${company.company.country}`,
                            45
                          )}
                        </Card.Text>
                        <div
                          className="company-stats d-flex justify-content-around border rounded"
                          style={{ margin: "0px -16px 10px -16px" }}
                        >
                          <div className="stat-item text-center border-end">
                            <strong>
                              {company?.user_counts.totalCustomers || "0"}
                            </strong>
                            <div>{t("Total Customer")}</div>
                          </div>
                          <div className="stat-item text-center">
                            <strong>
                              {company?.user_counts.totalWorkOrders || "0"}
                            </strong>
                            <div>{t("Work Orders")}</div>
                          </div>
                        </div>
                        <Card.Text>
                          <strong>{t("Admin")}:</strong>{" "}
                          {truncateText(
                            `${company?.user?.first_name} ${company?.user?.last_name}`,
                            20
                          )}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Container>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
