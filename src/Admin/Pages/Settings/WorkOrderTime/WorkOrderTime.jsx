import React, { useEffect, useState } from "react";
import Header from "../../../../Components/Header/Header";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Spinner,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { workOrderTimeApi, workOrderTimeGetApi } from "../../../../lib/store";

const WorkOrderTime = () => {
  const [intervalTime, setIntervalTime] = useState("");
  const [defaultWorkTime, setDefaultWorkTime] = useState("");
  const [bufferTime, setBufferTime] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [isInitialLoading, setIsInitialLoading] = useState(false); // For initial API call
  const [companyId] = useState(localStorage.getItem("companyId"));
  const [token] = useState(localStorage.getItem("UserToken"));
  const { t } = useTranslation();

  const fetchWorkOrderTime = async () => {
    if (!companyId || !token) return;

    setIsInitialLoading(true); // Start initial loading
    try {
      const response = await workOrderTimeGetApi(companyId, token);
      console.log("API Response:", response);

      if (response?.workOrderSettings) {
        setIntervalTime(response.workOrderSettings.intervalTime || "");
        setDefaultWorkTime(
          response.workOrderSettings.defaultWorkOrderTime || ""
        );
        setBufferTime(response.workOrderSettings.bufferTime || "");
      } else {
        console.log("Work order settings not found in response");
      }
    } catch (error) {
      console.error("Error fetching work order time:", error);
    } finally {
      setIsInitialLoading(false); // Stop initial loading regardless of outcome
    }
  };

  useEffect(() => {
    fetchWorkOrderTime()
  }, [companyId,token])
  

  // Validate the form fields
  const validateForm = () => {
    if (!intervalTime || !defaultWorkTime || !bufferTime) {
      Swal.fire({
        icon: "error",
        title: t("Validation Error"),
        text: t("All fields are required!"),
      });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await Swal.fire({
      title: t("Are you sure?"),
      text: t("Do you want to submit the work order time?"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("Yes, Submit"),
      cancelButtonText: t("No, Cancel"),
    });

    if (!result.isConfirmed) {
      return;
    }

    const finalData = {
      intervalTime,
      defaultWorkOrderTime: defaultWorkTime,
      bufferTime,
    };

    Swal.fire({
      title: t("Submitting..."),
      text: t("Please wait while we save your data."),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setIsLoading(true);
    try {
      const response = await workOrderTimeApi(finalData, companyId, token);
      console.log("Response:", response);
      if (response.status === true) {
        Swal.fire({
          icon: "success",
          title: t("Success"),
          text: t("Work order time saved successfully!"),
        });
        await fetchWorkOrderTime();
      } else {
        Swal.fire({
          icon: "error",
          title: t("Error"),
          text: t("Failed to save work order time. Please try again."),
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: t("Error"),
        text: t("Something went wrong. Please check your network."),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loader until the initial API call is complete
  if (isInitialLoading) {
    return (
      <>
        <Header />
        <div className="main-header-box mt-4">
          <div className="pages-box">
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">{t("Loading")}...</span>
              </Spinner>
              <p>
                {t("Loading")}...
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
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
            <h4 className="mb-0">{t("Work Order Time")}</h4>
          </div>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={4}>
                <Card className="p-3">
                  <Form.Group controlId="intervalTime">
                    <Form.Label>{t("Interval Time")}:</Form.Label>
                    <Form.Control
                      type="time"
                      value={intervalTime}
                      onChange={(e) => setIntervalTime(e.target.value)}
                      placeholder={t("Enter Interval Time")}
                      required
                    />
                  </Form.Group>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3">
                  <Form.Group controlId="defaultWorkTime">
                    <Form.Label>{t("Default Work Time (Hours)")}:</Form.Label>
                    <Form.Control
                      type="time"
                      value={defaultWorkTime}
                      onChange={(e) => setDefaultWorkTime(e.target.value)}
                      placeholder={t("Enter Default Work Time")}
                      required
                    />
                  </Form.Group>
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3">
                  <Form.Group controlId="bufferTime">
                    <Form.Label>{t("Buffer Time")}:</Form.Label>
                    <Form.Control
                      type="time"
                      value={bufferTime}
                      onChange={(e) => setBufferTime(e.target.value)}
                      placeholder={t("Enter Buffer Time")}
                      required
                    />
                  </Form.Group>
                </Card>
              </Col>
            </Row>
            <div className="text-center">
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? t("Submitting...") : t("Submit")}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default WorkOrderTime;
