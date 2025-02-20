import React from "react";
import Header from "../../../../../Components/Header/Header";
import { Container, Row, Col, Card,Button } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const WorkOrderDetails = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const location = useLocation();
  const { workOrder } = location.state || {};
  console.log(workOrder);

  // Format ISO Timestamp
  function formatTimestamp(isoString) {
    if (!isoString) return "--";
    const date = new Date(isoString);
    return date.toLocaleString("en-US", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  }

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <Container>
          <h3 className="mb-4 text-center text-dark fw-bold">
            {t("Work Order Details")}
          </h3>

          {/* Customer Details */}
          <Card className="p-3 shadow-lg mb-4 border-0">
            <Card.Header
              className="text-white fw-bold"
              style={{ background: "#2e2e32" }}
            >
              {t("Customer Details")}
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Customer Name")}:
                </Col>
                <Col>
                  {workOrder?.customerDetailSection?.CustomerName || "--"}
                </Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Email Address")}:
                </Col>
                <Col>
                  {workOrder?.customerDetailSection?.CustomerEmail || "--"}
                </Col>
              </Row>
              {/* <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Customer Address")}:
                </Col>
                <Col>
                  {workOrder.customerDetailSection.CustomerAddress || "--"}
                </Col>
              </Row> */}
              {/* <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Billing Address")}:
                </Col>
                <Col>
                  {workOrder.customerDetailSection.BillingAddress || "--"}
                </Col>
              </Row> */}
              <Row>
                <Col md={4} className="fw-bold">
                  {t("Send Notification")}:
                </Col>
                <Col>
                  {workOrder?.customerDetailSection?.sendNotification
                    ? "Yes"
                    : "No"}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Basic Work Order Details */}
          <Card className="p-3 shadow-lg mb-4 border-0">
            <Card.Header
              className=" text-white fw-bold"
              style={{ background: "#2e2e32" }}
            >
              {t("Basic Work Order Details")}
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Start Date")}:
                </Col>
                <Col>{workOrder?.basicWorkorderDetails?.startDate || "--"}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Start Time")}:
                </Col>
                <Col>{workOrder?.basicWorkorderDetails?.startTime || "--"}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Expected Time")}({t("Hours")}):
                </Col>
                <Col>
                  {workOrder?.basicWorkorderDetails?.expectedTime || "--"}
                </Col>
              </Row>
              {/* <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Sales Person")}:
                </Col>
                <Col>{workOrder.basicWorkorderDetails.salesPerson || "--"}</Col>
              </Row> */}
              {/* <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Sales Person Contact")}:
                </Col>
                <Col>
                  {workOrder.basicWorkorderDetails.salesPersonContact || "--"}
                </Col>
              </Row> */}
              <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Worker Name")}:
                </Col>
                <Col>
                  {workOrder?.basicWorkorderDetails?.WorkerName || "--"}
                </Col>
              </Row>
              <Row>
                <Col md={4} className="fw-bold">
                  {t("Worker ID")}:
                </Col>
                <Col>{workOrder?.basicWorkorderDetails?.WorkerId || "--"}</Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Work Order Items */}
          <Card className="p-3 shadow-lg mb-4 border-0">
            <Card.Header
              className=" text-white fw-bold"
              style={{ background: "#2e2e32" }}
            >
              {t("Work Order Details")}
            </Card.Header>
            <Card.Body>
              {workOrder.workorderDetails &&
              workOrder.workorderDetails?.length > 0 ? (
                workOrder.workorderDetails.map((item, index) => (
                  <Row key={index} className="mb-2 border-bottom pb-2">
                    <Col md={4} className="fw-bold">
                      {t("Work Item")}:
                    </Col>
                    <Col>{item.workItem || "--"}</Col>
                    <Col md={4} className="fw-bold">
                      {t("Work Description")}:
                    </Col>
                    <Col>{item.workDescription || "--"}</Col>
                  </Row>
                ))
              ) : (
                <p className="text-muted">{t("No work items available")}</p>
              )}
            </Card.Body>
          </Card>

          {/* Extra Order Items */}
          {workOrder?.extraWorkDetails?.length > 0 && (
            <Card className="p-3 shadow-lg mb-4 border-0">
              <Card.Header
                className=" text-white fw-bold"
                style={{ background: "#2e2e32" }}
              >
                {t("Additional Work Details")}
              </Card.Header>
              <Card.Body>
                {workOrder?.extraWorkDetails &&
                workOrder?.extraWorkDetails?.length > 0 ? (
                  workOrder.extraWorkDetails.map((item, index) => (
                    <Row key={index} className="mb-2 border-bottom pb-2">
                      <Col md={4} className="fw-bold">
                        {t("Work Item")}:
                      </Col>
                      <Col>{item.workItem || "--"}</Col>
                      <Col md={4} className="fw-bold">
                        {t("Work Description")}:
                      </Col>
                      <Col>{item.workDescription || "--"}</Col>
                    </Row>
                  ))
                ) : (
                  <p className="text-muted">{t("No work items available")}</p>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Created At & Status */}
          <Card className="p-3 shadow-lg border-0">
            <Card.Header
              className=" text-white fw-bold"
              style={{ background: "#2e2e32" }}
            >
              {t("Work Order Status")}
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Created At")}:
                </Col>
                <Col>{formatTimestamp(workOrder.created_at)}</Col>
              </Row>
              <Row className="mb-2">
                <Col md={4} className="fw-bold">
                  {t("Updated At")}:
                </Col>
                <Col>{formatTimestamp(workOrder.updated_at)}</Col>
              </Row>
              <Row>
                <Col md={4} className="fw-bold">
                  {t("Status")}:
                </Col>
                <Col>
                  <span
                    className={`badge px-3 py-2 ${
                      workOrder.status === "ending"
                        ? "bg-warning text-dark"
                        : workOrder.status === "Completed"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {workOrder.status.toUpperCase()}
                  </span>
                </Col>
                {/* Conditionally render Remarks for canceled assignments */}
                {workOrder.status === "Assignment Canceled" && (
                  <Row className="mt-3">
                    <Col md={4} className="fw-bold">
                      {t("Remarks")}:
                    </Col>
                    <Col>
                      <div className="p-2 bg-light border rounded">
                        {workOrder.work_order_cancel_Reason || "--"}
                      </div>
                    </Col>
                  </Row>
                )}
              </Row>
            </Card.Body>
          </Card>
          <div className="mt-3 text-center">
              <Button variant="secondary" onClick={() => navigate("/workorder/list")}>
                {t("Back")}
              </Button>
            </div>
        </Container>
      </div>
    </>
  );
};

export default WorkOrderDetails;
