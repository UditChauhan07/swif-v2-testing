import React, { useEffect, useState } from "react";
import Header from "../../../../Components/Header/Header";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import Select from "react-select";
import { customSelectStyles } from "../../../../utils/SelectStyle/SelectStyle";
import { useTranslation } from "react-i18next";
import { getCompanyListApi } from "../../../../lib/store";

const ReportsAnalytics = () => {
  const { t } = useTranslation();
  const [token, setToken] = useState(localStorage.getItem("UserToken"));

  // Sample Data with translations
  const featureUsageData = [
    { feature: t("Work Order Created"), usage: 500 },
    { feature: t("Work Order Executed"), usage: 400 },
    { feature: t("User Created"), usage: 100 },
    { feature: t("Feature Execution"), usage: 300 },
  ];

  const invoiceStatusData = [
    { name: t("Paid"), value: 60 },
    { name: t("Pending"), value: 20 },
    { name: t("Overdue"), value: 15 },
    { name: t("Failed"), value: 5 },
  ];

  const topCompaniesData = [
    {
      companyName: "Company A",
      totalPaid: 2000,
      lastInvoiceDate: "2023-01-10",
    },
    {
      companyName: "Company B",
      totalPaid: 3000,
      lastInvoiceDate: "2023-02-15",
    },
    {
      companyName: "Company C",
      totalPaid: 1500,
      lastInvoiceDate: "2023-03-05",
    },
  ];

  const billingTypeOptions = [
    { value: "both", label: "Both" },
    { value: "payg", label: "PAYG" },
    { value: "subscription", label: "Subscription" },
  ];

  // States for filters
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [selectedBillingType, setSelectedBillingType] = useState("both");

  // GetData
  const [companyList, setcompanyList] = useState();

  const today2 = new Date().toISOString().split("T")[0];

  // Calculate today's date in YYYY-MM-DD format
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  // Calculate the date one month ago
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const formattedOneMonthAgo = oneMonthAgo.toISOString().split("T")[0];

  const [endDate, setEndDate] = useState(formattedToday);
  const [startDate, setStartDate] = useState(formattedOneMonthAgo);

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const response = await getCompanyListApi(token);
        if (response.status === true) {
          const companiesData = response?.data?.map((item) => ({
            company_name: item.company.company_name,
            id: item.company.id,
          }));
          setcompanyList(companiesData);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };
    fetchCompany();
  }, []);

  // Handle filter change
  const handleFilterChange = () => {
    if (!selectedCompany) {
      setCompanyError(t("Company is required"));
      return;
    } else {
      setCompanyError("");
    }
    console.log({
      selectedCompany,
      selectedBillingType,
      startDate,
      endDate,
    });
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          {/* Filters */}
          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <div className="d-flex justify-content-between">
                    <h5 className="mb-3">{t("Filter Options")}</h5>
                    <div>
                      <Button variant="secondary" onClick={handleFilterChange}>
                        {t("Apply Filters")}
                      </Button>
                    </div>
                  </div>
                  <Form>
                    <Row className="g-3">
                      {/* Company Filter */}
                      <Col md={3}>
                        <Form.Group controlId="filterCompany">
                          <Form.Label>{t("Company")}</Form.Label>
                          <Select
                            options={companyList?.map((company) => ({
                              value: company.id,
                              label: company.company_name,
                            }))}
                            value={companyList
                              ?.map((company) => ({
                                value: company.id,
                                label: company.company_name,
                              }))
                              .find((opt) => opt.value === selectedCompany)}
                            onChange={(selected) => {
                              setSelectedCompany(
                                selected ? selected.value : ""
                              );
                              // Clear error on selection
                              if (selected) setCompanyError("");
                            }}
                            classNamePrefix="react-select"
                            styles={customSelectStyles}
                          />
                          {companyError && (
                            <div className="text-danger mt-1">
                              {companyError}
                            </div>
                          )}
                        </Form.Group>
                      </Col>

                      {/* Billing Type Filter */}
                      <Col md={3}>
                        <Form.Group controlId="filterBillingType">
                          <Form.Label>{t("Billing Type")}</Form.Label>
                          <Select
                            options={billingTypeOptions}
                            value={billingTypeOptions.find(
                              (opt) => opt.value === selectedBillingType
                            )}
                            onChange={(selected) =>
                              setSelectedBillingType(
                                selected ? selected.value : ""
                              )
                            }
                            classNamePrefix="react-select"
                            styles={customSelectStyles}
                          />
                        </Form.Group>
                      </Col>

                      {/* Start Date Filter */}
                      <Col md={3}>
                        <Form.Group controlId="filterStartDate">
                          <Form.Label>{t("Start Date")}</Form.Label>
                          <Form.Control
                            type="date"
                            value={startDate}
                            max={today2}
                            onChange={(e) => setStartDate(e.target.value)}
                          />
                        </Form.Group>
                      </Col>

                      {/* End Date Filter */}
                      <Col md={3}>
                        <Form.Group controlId="filterEndDate">
                          <Form.Label>{t("End Date")}</Form.Label>
                          <Form.Control
                            type="date"
                            value={endDate}
                            max={today2}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </Form.Group>
                      </Col>

                      {/* Apply Button */}
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Total Revenue, Work Orders Created and Executed */}
          <Row className="mb-4">
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>{t("Total Revenue")}</Card.Title>
                  <Card.Text>
                    <strong>$15,000</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>{t("Work Orders Created")}</Card.Title>
                  <Card.Text>
                    <strong>500</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>{t("Work Orders Executed")}</Card.Title>
                  <Card.Text>
                    <strong>500</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Feature Usage Overview (Bar Chart) */}
          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Card.Title>{t("Feature Usage Overview")}</Card.Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={featureUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="feature" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" fill="#2e2e32" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Invoice Status Report (Pie Chart) */}
          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Card.Title>{t("Invoice Status Report")}</Card.Title>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={invoiceStatusData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label
                      >
                        {invoiceStatusData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? "#4a4a50"
                                : index === 1
                                ? "#5c5c63"
                                : index === 2
                                ? "#787880"
                                : "#9a9aa0"
                            }
                            stroke="none"
                            onMouseDown={(e) => e.preventDefault()}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Top Paying Companies Table */}
          <Row className="mb-4">
            <Col md={12}>
              <Card>
                <Card.Body>
                  <Card.Title>{t("Top Paying Companies")}</Card.Title>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>{t("Company Name")}</th>
                        <th>{t("Total Paid Amount")}</th>
                        <th>{t("Last Invoice Date")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topCompaniesData.map((item, index) => (
                        <tr key={index}>
                          <td>{item.companyName}</td>
                          <td>{item.totalPaid}</td>
                          <td>{item.lastInvoiceDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
};

export default ReportsAnalytics;
