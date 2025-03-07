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
import Select from "react-select";

// Helper component for time dropdowns using react-select
const TimeDropdown = ({ label, time, setTime }) => {
  const { t } = useTranslation();
  const hoursOptions = Array.from({ length: 24 }, (_, i) => {
    const value = i.toString().padStart(2, "0");
    return { value, label: value };
  });
  const minutesOptions = Array.from({ length: 60 }, (_, i) => {
    const value = i.toString().padStart(2, "0");
    return { value, label: value };
  });

  // Parse the current time string ("HH:MM") or default to "00:00"
  const [hours, minutes] =
    time && time.includes(":") ? time.split(":") : ["--", "--"];

  const selectedHoursOption = hoursOptions.find(
    (option) => option.value === hours
  );
  const selectedMinutesOption = minutesOptions.find(
    (option) => option.value === minutes
  );

  return (
    <div>
      <Form.Label>{label}:</Form.Label>
      <div className="d-flex">
        <div>
          <div>
            <small>{t("Hours")}</small>
          </div>
          <Select
            options={hoursOptions}
            placeholder={t("--")}
            value={selectedHoursOption}
            onChange={(selectedOption) =>
              setTime(`${selectedOption.value}:${minutes}`)
            }
            styles={{
              container: (provided) => ({ ...provided, width: 100 }),
            }}
          />
        </div>
        <div className="ms-3">
          <div>
            <small>{t("Minutes")}</small>
          </div>
          <Select
            options={minutesOptions}
            placeholder={t("--")}
            value={selectedMinutesOption}
            onChange={(selectedOption) =>
              setTime(`${hours}:${selectedOption.value}`)
            }
            styles={{
              container: (provided) => ({ ...provided, width: 100 }),
            }}
          />
        </div>
      </div>
    </div>
  );
};

const WorkOrderTime = () => {
  const [intervalTime, setIntervalTime] = useState("");
  const [defaultWorkTime, setDefaultWorkTime] = useState("");
  const [bufferTime, setBufferTime] = useState("");
  const [isLoading, setIsLoading] = useState(false); // For form submission
  const [isInitialLoading, setIsInitialLoading] = useState(false); // For initial API call
  const [companyId] = useState(localStorage.getItem("companyId"));
  const [token] = useState(localStorage.getItem("UserToken"));
  const { t } = useTranslation();

  // Helper: convert "HH:MM" to total minutes
  const convertTimeToMinutes = (timeStr) => {
    if (!timeStr || !timeStr.includes(":")) return 0;
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  };

  const fetchWorkOrderTime = async () => {
    if (!companyId || !token) return;

    setIsInitialLoading(true);
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
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrderTime();
  }, [companyId, token]);

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

    // Minimum duration is 10 minutes (i.e. more than 00:00)
    const minMinutes = 10;
    if (convertTimeToMinutes(intervalTime) < minMinutes) {
      Swal.fire({
        icon: "error",
        title: t("Validation Error"),
        text: t("Interval Time must be more than 10 minutes."),
      });
      return false;
    }
    if (convertTimeToMinutes(defaultWorkTime) < minMinutes) {
      Swal.fire({
        icon: "error",
        title: t("Validation Error"),
        text: t("Default Work Time must be more than 10 minutes."),
      });
      return false;
    }
    if (convertTimeToMinutes(bufferTime) < minMinutes) {
      Swal.fire({
        icon: "error",
        title: t("Validation Error"),
        text: t("Buffer Time must be more than 10 minutes."),
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
    console.log("finalData", finalData);

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
              <p>{t("Loading")}...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <style>
        {`
          .css-l9r7pz-container {
            width: 115px;
          }
        `}
      </style>
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
                <Card className="p-3" style={{ minWidth: "350px" }}>
                  <TimeDropdown
                    label={t("Interval Time")}
                    time={intervalTime}
                    setTime={setIntervalTime}
                  />
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3" style={{ minWidth: "350px" }}>
                  <TimeDropdown
                    label={t("Default Work Time (Hours)")}
                    time={defaultWorkTime}
                    setTime={setDefaultWorkTime}
                  />
                </Card>
              </Col>
              <Col md={4}>
                <Card className="p-3" style={{ minWidth: "350px" }}>
                  <TimeDropdown
                    label={t("Buffer Time")}
                    time={bufferTime}
                    setTime={setBufferTime}
                  />
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
