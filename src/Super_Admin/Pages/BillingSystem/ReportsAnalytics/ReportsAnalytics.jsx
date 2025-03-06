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

  const billingTypeOptions = [
    { value: "All", label: "All" },
    { value: "Default", label: "Default" },
    { value: "Basic", label: "Basic" },
    { value: "Premium", label: "Premium" },
    { value: "Enterprise", label: "Enterprise" },
    { value: "Payg", label: "Payg" },
    { value: "Custom", label: "Custom" },
  ];

  // States for filters and API data
  const [selectedCompany, setSelectedCompany] = useState();
  const [companyError, setCompanyError] = useState("");
  const [selectedBillingType, setSelectedBillingType] = useState("all");
  const [companyLoader, setcompanyLoader] = useState(false);
  const [companyList, setcompanyList] = useState();
  const [getSingleCompanyData, setgetSingleCompanyData] = useState();
  const [error, setError] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [allbillStatusCount, setAllbillStatusCount] = useState({});
  const [clearFilter, SetclearFilter] = useState(false);
  const [topCompaniesData, setTopCompaniesData] = useState([]);
  const [grandTotals, setGrandTotals] = useState({
    totalCustomers: 0,
    totalFieldUsers: 0,
    totalOfficeUsers: 0,
    totalWorkOrders: 0,
    totalRevenue: 0,
  });
  console.log("grandtotal", grandTotals);

  const defaultInvoiceStatusData = [
    { name: t("Paid"), value: allbillStatusCount?.Paid || 0 },
    { name: t("Pending"), value: allbillStatusCount?.Pending || 0 },
    { name: t("Overdue"), value: allbillStatusCount?.Overdue || 0 },
    { name: t("Failed"), value: allbillStatusCount?.Failed || 0 },
  ];

  // Date calculations
  const today2 = new Date().toISOString().split("T")[0];
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  const formattedOneMonthAgo = oneMonthAgo.toISOString().split("T")[0];
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1); // Subtract 1 year

  const formattedOneYearAgo = oneYearAgo.toISOString().split("T")[0];
  const [endDate, setEndDate] = useState(formattedToday);
  const [startDate, setStartDate] = useState(formattedOneYearAgo);
  const [invoices, setInvoices] = useState();

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
          usage: grandTotals.executedWorkOrder,
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
        // const response = await getReportAllCompany();
        const response = await getReportSingleCompany(
          selectedCompany,
          selectedBillingType,
          startDate,
          endDate
        );
        console.log("Default response:", response);
        if (response.status === 200) {
          // setGrandTotals(response.data.analytics.featuresCount);
          setGrandTotals({
            totalCustomers:
              response?.data?.analytics?.featuresCount?.customersCreated || 0,
            totalFieldUsers:
              response?.data?.analytics?.featuresCount?.fieldUsersCreated || 0,
            totalOfficeUsers:
              response?.data?.analytics?.featuresCount?.usersCreated || 0,
            totalWorkOrders:
              response?.data.analytics?.featuresCount?.totalWorkOrders || 0,
            executedWorkOrder:
              response.data?.analytics?.featuresCount?.executedWorkOrders || 0,
            totalRevenue: response?.data?.analytics?.totalRevenue || 0,
          });
          setAllbillStatusCount(response?.data?.analytics?.billStatusCount);
          setInvoices(response?.data?.analytics?.invoices);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setAnalyticsLoading(false);
      }
    };
    fetchDefaultData();
  }, [clearFilter]);
  console.log(clearFilter);
  // Handle filter change and API call
  const handleFilterChange = async () => {
    // if (!selectedCompany) {
    //   setCompanyError(t("Company is required"));
    //   return;
    // } else {
    //   setCompanyError("");
    // }
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

  useEffect(() => {
    if (invoices && invoices.length > 0) {
      const getTopPayingCompanies = (invoiceList) => {
        const companyRevenue = invoiceList.reduce((acc, invoice) => {
          if (invoice.payment_status === "Paid") {
            const company_name = invoice.company_name || "Unknown";
            acc[company_name] =
              (acc[company_name] || 0) + Number(invoice.total || 0);
          }
          return acc;
        }, {});
        const sortedCompanies = Object.entries(companyRevenue)
          .map(([company_name, totalRevenue]) => ({
            company_name,
            totalRevenue,
          }))
          .sort((a, b) => b.totalRevenue - a.totalRevenue); //
        console.log("sortedCompanies", sortedCompanies);
        console.log("Top 3 Companies:", sortedCompanies.slice(0, 3));

        return sortedCompanies.slice(0, 3);
      };

      const topCompanies = getTopPayingCompanies(invoices);
      console.log("Top Paying Companies:", topCompanies);

      setTopCompaniesData(topCompanies);
    }
  }, [invoices]);

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
                      <Button
                        variant="secondary"
                        onClick={() => {
                          setEndDate(formattedToday);
                          setStartDate(formattedOneYearAgo);
                          setSelectedCompany();
                          SetclearFilter((prev) => !prev);
                        }}
                        className="me-2"
                      >
                        {t("Clear Filter")}
                      </Button>
                      <Button variant="primary" onClick={handleFilterChange}>
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

                          {/* <Select
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
                          /> */}
                          <Select
                            isLoading={companyLoader}
                            options={[
                              { value: "all", label: "All Companies" }, 
                              ...(Array.isArray(companyList)
                                ? companyList.map((company) => ({
                                    value: company.id,
                                    label: company.company_name,
                                  }))
                                : []), 
                            ]}
                            value={
                              [
                                { value: "all", label: "All Companies" },
                                ...(Array.isArray(companyList)
                                  ? companyList.map((company) => ({
                                      value: company.id,
                                      label: company.company_name,
                                    }))
                                  : []),
                              ].find(
                                (opt) => opt.value === selectedCompany
                              ) || { value: "all", label: "All Companies" }
                            }
                            onChange={(selected) => {
                              setSelectedCompany(
                                selected?.value === "all"
                                  ? undefined
                                  : selected?.value
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
              {invoiceStatusChartData && (
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
                            {/* <th>{t("Last Invoice Date")}</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {topCompaniesData.map((item, index) => (
                            <tr key={index}>
                              <td>{item.company_name}</td>
                              <td>{item.totalRevenue}</td>
                              {/* <td>{item.lastInvoiceDate}</td> */}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ReportsAnalytics;
