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
  Legend,
} from "recharts";
import Select from "react-select";
import { customSelectStyles } from "../../../../utils/SelectStyle/SelectStyle";
import { useTranslation } from "react-i18next";
import {
  getCompanyListApi,
  getReportAllCompany,
  getReportSingleCompany,
} from "../../../../lib/store";
import LoadingComp from "../../../../Components/Loader/LoadingComp";

// Custom legend renderer for the Invoice Status Report PieChart
const renderCustomLegend = (props) => {
  const { payload } = props;
  return (
    <div style={{ padding: 10 }}>
      {payload.map((entry, index) => (
        <div
          key={`legend-item-${index}`}
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: 4,
          }}
        >
          <div
            style={{
              width: 12,
              height: 12,
              backgroundColor: entry.color,
              marginRight: 8,
            }}
          ></div>
          <span>
            {entry.value}: {entry.payload.value}
          </span>
        </div>
      ))}
    </div>
  );
};

const ReportsAnalytics = () => {
  const { t } = useTranslation();
  const [token] = useState(localStorage.getItem("UserToken"));

  const defaultInvoiceStatusData = [
    { name: t("Paid"), value: 60 },
    { name: t("Pending"), value: 20 },
    { name: t("Overdue"), value: 15 },
    { name: t("Failed"), value: 5 },
  ];

  const billingTypeOptions = [
    { value: "both", label: "Both" },
    { value: "payg", label: "PAYG" },
    { value: "subscription", label: "Subscription" },
  ];

  // States for filters and API data
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companyError, setCompanyError] = useState("");
  const [selectedBillingType, setSelectedBillingType] = useState("both");
  const [companyLoader, setcompanyLoader] = useState(false);
  const [companyList, setcompanyList] = useState();
  const [getSingleCompanyData, setgetSingleCompanyData] = useState();
  const [error, setError] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [grandTotals, setGrandTotals] = useState(null);
  console.log("grandtotal", grandTotals);

  // Date calculations
  const today2 = new Date().toISOString().split("T")[0];
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const formattedOneMonthAgo = oneMonthAgo.toISOString().split("T")[0];

  const [endDate, setEndDate] = useState(formattedToday);
  const [startDate, setStartDate] = useState(formattedOneMonthAgo);

  // Transform API data for charts when available; otherwise, use defaults.
  const featureUsageChartData = getSingleCompanyData
    ? [
        {
          feature: t("Total Work Orders"),
          usage: getSingleCompanyData.featuresCount.totalWorkOrders,
        },
        {
          feature: t("Executed Work Orders"),
          usage: getSingleCompanyData.featuresCount.executedWorkOrders,
        },
        {
          feature: t("Users Created"),
          usage: getSingleCompanyData.featuresCount.usersCreated,
        },
        {
          feature: t("Field Users Created"),
          usage: getSingleCompanyData.featuresCount.fieldUsersCreated,
        },
        {
          feature: t("Customers Created"),
          usage: getSingleCompanyData.featuresCount.customersCreated,
        },
      ]
    : grandTotals
    ? [
        {
          feature: t("Total Work Orders"),
          usage: grandTotals.totalWorkOrders,
        },
        {
          feature: t("Executed Work Orders"),
          usage: grandTotals.executedWorkOrder || "2",
        },
        {
          feature: t("Users Created"),
          usage: grandTotals.totalOfficeUsers,
        },
        {
          feature: t("Field Users Created"),
          usage: grandTotals.totalFieldUsers,
        },
        {
          feature: t("Customers Created"),
          usage: grandTotals.totalCustomers,
        },
      ]
    : [];

  const invoiceStatusChartData = getSingleCompanyData
    ? Object.keys(getSingleCompanyData.billStatusCount).map((key) => ({
        name: t(key),
        value: getSingleCompanyData.billStatusCount[key],
      }))
    : defaultInvoiceStatusData;

  // Fetch company list on mount
  useEffect(() => {
    const fetchCompany = async () => {
      setcompanyLoader(true);
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
      } finally {
        setcompanyLoader(false);
      }
    };
    fetchCompany();
  }, [token]);

  // Fetch default data (grand totals) on mount
  useEffect(() => {
    const fetchDefaultData = async () => {
      setAnalyticsLoading(true);
      try {
        const response = await getReportAllCompany();
        console.log("Default response:", response);
        if (response.status === 200) {
          setGrandTotals(response.data.grandTotals);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchDefaultData();
  }, []);

  // Handle filter change and API call
  const handleFilterChange = async () => {
    if (!selectedCompany) {
      setCompanyError(t("Company is required"));
      return;
    } else {
      setCompanyError("");
    }
    setAnalyticsLoading(true);
    setError(null);
    try {
      const response = await getReportSingleCompany(
        selectedCompany,
        selectedBillingType,
        startDate,
        endDate
      );
      console.log("API Response:", response);
      if (response.status === 200) {
        setgetSingleCompanyData(response.data.analytics);
      } else {
        setError(
          response.error || t("An error occurred while retrieving data.")
        );
      }
    } catch (err) {
      console.log("Error API", err);
      setError(t("An error occurred while retrieving data."));
    } finally {
      setAnalyticsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <style>
        {`
          .recharts-legend-wrapper {
             top: 0px !important;
              /* additional custom styles here */
              }
        `}
      </style>
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
                            isLoading={companyLoader}
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
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Analytics Section */}
          {analyticsLoading ? (
            <LoadingComp />
          ) : error ? (
            <div
              className="text-center my-4"
              style={{
                backgroundColor: "#ffe6e6",
                color: "#d9534f",
                padding: "10px",
                fontWeight: "bold",
                borderRadius: "5px",
              }}
            >
              <h5>{error}</h5>
            </div>
          ) : (
            <>
              {/* Revenue and Work Orders Cards */}
              <Row className="mb-4">
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>{t("Total Revenue")}</Card.Title>
                      <Card.Text>
                        <strong>
                          {getSingleCompanyData
                            ? `$${getSingleCompanyData.totalRevenue}`
                            : grandTotals
                            ? `$${grandTotals.totalRevenue}`
                            : "$15,000"}
                        </strong>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>{t("Work Orders Created")}</Card.Title>
                      <Card.Text>
                        <strong>
                          {getSingleCompanyData
                            ? getSingleCompanyData.featuresCount.totalWorkOrders
                            : grandTotals
                            ? grandTotals.totalWorkOrders
                            : "20"}
                        </strong>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card>
                    <Card.Body>
                      <Card.Title>{t("Work Orders Executed")}</Card.Title>
                      <Card.Text>
                        <strong>
                          {getSingleCompanyData
                            ? getSingleCompanyData.featuresCount
                                .executedWorkOrders
                            : grandTotals
                            ? grandTotals.executedWorkOrder || "2"
                            : "20"}
                        </strong>
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
                        <BarChart data={featureUsageChartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="feature" />
                          <YAxis allowDecimals={false} />
                          <Tooltip />
                          <Bar dataKey="usage" fill="#2e2e32" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Conditionally show Invoice Status Report (with custom legend) only if filtered data is available */}
              {getSingleCompanyData && (
                <Row className="mb-4">
                  <Col md={12}>
                    <Card>
                      <Card.Body>
                        <Card.Title>{t("Invoice Status Report")}</Card.Title>
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={invoiceStatusChartData}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={120}
                              label
                            >
                              {invoiceStatusChartData.map((entry, index) => (
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
                            <Legend
                              layout="vertical"
                              align="right"
                              verticalAlign="middle"
                              content={renderCustomLegend}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportsAnalytics;
