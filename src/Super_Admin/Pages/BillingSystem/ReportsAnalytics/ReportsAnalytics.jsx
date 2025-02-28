import React, { useState } from "react";
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

// Sample Data
const featureUsageData = [
  { feature: "Work Order Created", usage: 500 },
  { feature: "Work Order Executed", usage: 400 },
  { feature: "User Created", usage: 100 },
  { feature: "Feature Execution", usage: 300 },
];

const invoiceStatusData = [
  { name: "Paid", value: 60 },
  { name: "Pending", value: 20 },
  { name: "Overdue", value: 15 },
  { name: "Failed", value: 5 },
];

const topCompaniesData = [
  { companyName: "Company A", totalPaid: 2000, lastInvoiceDate: "2023-01-10" },
  { companyName: "Company B", totalPaid: 3000, lastInvoiceDate: "2023-02-15" },
  { companyName: "Company C", totalPaid: 1500, lastInvoiceDate: "2023-03-05" },
];

const durationOptions = [
  { value: "", label: "Select Duration" },
  { value: "last30", label: "Last 30 Days" },
  { value: "last90", label: "Last 90 Days" },
  { value: "lastYear", label: "Last Year" },
];

const companyOptions = [
  { value: "", label: "Select Company" },
  { value: "Company A", label: "Company A" },
  { value: "Company B", label: "Company B" },
  { value: "Company C", label: "Company C" },
  { value: "Company D", label: "Company D" },
];

const billingTypeOptions = [
  { value: "", label: "Select Billing Type" },
  { value: "Subscription", label: "Subscription" },
  { value: "PAYG", label: "PAYG" },
];

const ReportsAnalytics = () => {
  // States for filters
  const [selectedDuration, setSelectedDuration] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBillingType, setSelectedBillingType] = useState("");

  // Handle filter change
  const handleFilterChange = () => {
    console.log({
      selectedDuration,
      selectedCompany,
      selectedBillingType,
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
                  <h5 className="mb-3">Filter Options</h5>
                  <Form>
                    <Row className="g-3 align-items-end">
                      {/* Duration Filter */}
                      <Col md={3}>
                        <Form.Group controlId="filterDuration">
                          <Form.Label>Duration</Form.Label>
                          <Select
                            options={durationOptions}
                            value={durationOptions.find(
                              (opt) => opt.value === selectedDuration
                            )}
                            onChange={(selected) =>
                              setSelectedDuration(
                                selected ? selected.value : ""
                              )
                            }
                            classNamePrefix="react-select"
                            styles={customSelectStyles}
                          />
                        </Form.Group>
                      </Col>

                      {/* Company Filter */}
                      <Col md={3}>
                        <Form.Group controlId="filterCompany">
                          <Form.Label>Company</Form.Label>
                          <Select
                            options={companyOptions}
                            value={companyOptions.find(
                              (opt) => opt.value === selectedCompany
                            )}
                            onChange={(selected) =>
                              setSelectedCompany(selected ? selected.value : "")
                            }
                            classNamePrefix="react-select"
                            styles={customSelectStyles}
                          />
                        </Form.Group>
                      </Col>

                      {/* Billing Type Filter */}
                      <Col md={3}>
                        <Form.Group controlId="filterBillingType">
                          <Form.Label>Billing Type</Form.Label>
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

                      {/* Apply Button */}
                      <Col md={3}>
                        <Button
                          variant="secondary"
                          onClick={handleFilterChange}
                        >
                          Apply Filters
                        </Button>
                      </Col>
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
                  <Card.Title>Total Revenue</Card.Title>
                  <Card.Text>
                    <strong>$15,000</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Work Orders Created</Card.Title>
                  <Card.Text>
                    <strong>500</strong>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Work Orders Executed</Card.Title>
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
                  <Card.Title>Feature Usage Overview</Card.Title>
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
                  <Card.Title>Invoice Status Report</Card.Title>
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
                                ? "#4a4a50" // Dark Gray
                                : index === 1
                                ? "#5c5c63" // Medium Gray
                                : index === 2
                                ? "#787880" // Lighter Gray
                                : "#9a9aa0" // Lightest Gray
                            }
                            stroke="none" // Removes the default border
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
                  <Card.Title>Top Paying Companies</Card.Title>
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>Company Name</th>
                        <th>Total Paid Amount</th>
                        <th>Last Invoice Date</th>
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
