import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import Header from "../../../../../Components/Header/Header";
import { useTranslation } from "react-i18next";

const InvoicePayDetails = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  // The invoice details should be passed in the state when navigating to this page
  const invoice = location.state?.invoice;

  // Sample fallback invoice data if none is passed
  const sampleInvoice = {
    invoiceId: "INV001",
    invoiceDate: "2023-01-01",
    companyName: "Acme Corp",
    companyAddress: "123 Main St, City, Country",
    companyContact: "+1 555-1234",
    itemizedDetails: [
      { description: "Subscription Package Charges", amount: 1000 },
      { description: "WO Creation Charges", amount: 200 },
      { description: "Execution Charges", amount: 150 },
      { description: "User/Customer Creation Charges", amount: 100 },
    ],
    subscriptionCharges: 1000,
    featureUsageCharges: 450,
    taxesDiscountsFees: 50,
    totalAmount: 1500,
    currency: "USD",
    status: "Pending",
    paymentHistory: [
      { date: "2023-01-05", amount: 500, status: "Paid", method: "Stripe" },
      { date: "2023-01-10", amount: 500, status: "Paid", method: "Stripe" },
    ],
  };

  // Use the passed invoice or fallback sampleInvoice if not provided
  const inv = invoice || sampleInvoice;

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <Container className="pages-box">
          {/* Invoice Header */}

          <Card className="mb-4">
            <Card.Header>{t("Invoice Detail")}</Card.Header>
            <Card.Body>
              <p>
                <strong>{t("Invoice ID")}:</strong> {inv.invoiceId}
              </p>
              <p>
                <strong>{t("Invoice Date")}:</strong> {inv.invoiceDate}
              </p>
            </Card.Body>
          </Card>

          {/* Company Details */}
          <Card className="mb-4">
            <Card.Header>{t("Company Details")}</Card.Header>
            <Card.Body>
              <p>
                <strong>{t("Company Name")}:</strong> {inv.companyName}
              </p>
              <p>
                <strong>{t("Address")}:</strong> {inv.companyAddress}
              </p>
              <p>
                <strong>{t("Contact")}:</strong> {inv.companyContact}
              </p>
              <p>
                <strong>{t("Company Admin")}:</strong> {inv.companyContact}
              </p>
              <p>
                <strong>{t("Company Admin Email")}:</strong> {inv.companyContact}
              </p>
            </Card.Body>
          </Card>

          {/* Itemized Billing Details */}
          <Card className="mb-4">
            <Card.Header>{t("Itemized Billing Details")}</Card.Header>
            <Card.Body>
              <Table responsive bordered>
                <thead>
                  <tr>
                    <th>{t("Description")}</th>
                    <th>{t("Amount")}</th>
                  </tr>
                </thead>
                <tbody>
                  {inv?.itemizedDetails?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.description}</td>
                      <td>{item.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              <Row className="mt-3">
                <Col md={4}>
                  <p>
                    <strong>{t("Subscription Package Charges")}:</strong>{" "}
                    {inv.subscriptionCharges}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>{t("Feature Usage Charges")}:</strong>{" "}
                    {inv.featureUsageCharges}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>{t("Taxes, Discounts, Additional Fees")}:</strong>{" "}
                    {inv.taxesDiscountsFees}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Total & Payment Status */}
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h5>
                    <strong>{t("Total Amount")}:</strong> {inv.totalAmount}{" "}
                    {inv.currency}
                  </h5>
                </Col>
                
              </Row>
            </Card.Body>
          </Card>

          {/* Payment History */}
          {inv.paymentHistory && inv.paymentHistory.length > 0 && (
            <Card className="mb-4">
              <Card.Header>{t("Payment History")}</Card.Header>
              <Card.Body>
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>{t("Date")}</th>
                      <th>{t("Amount")}</th>
                      <th>{t("Status")}</th>
                      <th>{t("Method")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inv.paymentHistory.map((payment, index) => (
                      <tr key={index}>
                        <td>{payment.date}</td>
                        <td>{payment.amount}</td>
                        <td>{payment.status}</td>
                        <td>{payment.method}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* Back Button */}
          <Button
            style={{ background: "#2e2e32", color: "white", border: "none" }}
            onClick={() => navigate(-1)}
          >
            {t("Back")}
          </Button>
        </Container>
      </div>
    </>
  );
};

export default InvoicePayDetails;
