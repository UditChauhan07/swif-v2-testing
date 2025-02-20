import React, { useEffect, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
} from "react-bootstrap";
import Header from "../../../../Components/Header/Header";
import "bootstrap/dist/css/bootstrap.min.css";
import "./CreateWorkOrder.css";
import {
  createWorkOrderApi,
  fetch_FieldUserOfCompany,
  getCustomerList,
  workOrderTimeGetApi,
} from "../../../../lib/store";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const CreateWorkOrder = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [copmanyId] = useState(localStorage.getItem("companyId"));
  const [token] = useState(localStorage.getItem("UserToken"));
  const company_id = localStorage.getItem("companyId") || null;

  const getCurrentTimeHHMM = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const convertTimeStringToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const convertMinutesToTimeString = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const computeExpectedTimeOptions = (defaultTime, intervalTime) => {
    const baseMinutes = convertTimeStringToMinutes(defaultTime);
    const intervalMinutes = convertTimeStringToMinutes(intervalTime);
    const options = [];
    for (let i = 1; i <= 24; i++) {
      const totalMinutes = baseMinutes + i * intervalMinutes;
      if (totalMinutes > 720) break; // 720 minutes is 12:00 PM
      options.push(convertMinutesToTimeString(totalMinutes));
    }
    return options;
  };

  // Customer Detail Section state
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [sendNotification, setSendNotification] = useState("Yes");
  const [selectedCustomerId, setSelectedCustomerId] = useState("");

  // Basic Workorder Details state
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState(getCurrentTimeHHMM());
  const [expectedTime, setExpectedTime] = useState("00:00");
  console.log("timeeee", expectedTime);
  const [selectedWorkers, setSelectedWorkers] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");

  const [customersList, setcustomersList] = useState([]);
  const [workersLsit, setworkersLsit] = useState([]);

  const [intervalTime, setIntervalTime] = useState("");
  const [defaultWorkTime, setDefaultWorkTime] = useState("");
  // console.log("dasda", defaultWorkTime);

  const [workItems, setWorkItems] = useState([
    { id: 1, workItem: "", itemDesc: "" },
  ]);

  const [errors, setErrors] = useState({});

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await getCustomerList(copmanyId, token); // Fetch customers from API
        setcustomersList(response?.customers || []);
      } catch (error) {
        console.error("Error fetching customers:", error);
      }
    };

    fetchCustomers();
  }, [copmanyId, token]);

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const response = await fetch_FieldUserOfCompany(company_id, token);
        setworkersLsit(response?.data || []);
      } catch (error) {
        console.error("Error fetching workers:", error);
      }
    };

    fetchWorkers();
  }, [company_id, token]);

  useEffect(() => {
    const getWorkOrderTime = async () => {
      if (!company_id || !token) return; // Ensure companyId and token are available

      try {
        const response = await workOrderTimeGetApi(company_id, token);
        console.log("API Response:", response);

        if (response?.workOrderSettings) {
          setIntervalTime(response.workOrderSettings.intervalTime || "");
          setDefaultWorkTime(
            response.workOrderSettings.defaultWorkOrderTime || ""
          );
          // setBufferTime(response.workOrderSettings.bufferTime || "");
        } else {
          console.log("Work order settings not found in response");
        }
      } catch (error) {
        console.error("Error fetching work order time:", error);
      }
    };

    getWorkOrderTime();
  }, [company_id, token]);

  useEffect(() => {
    if (defaultWorkTime) {
      setExpectedTime(defaultWorkTime);
    }
  }, [defaultWorkTime]);

  const addWorkItemRow = () => {
    setWorkItems([
      ...workItems,
      { id: Date.now(), workItem: "", itemDesc: "" },
    ]);
  };

  const removeWorkItemRow = (id) => {
    setWorkItems(workItems.filter((row) => row.id !== id));
  };

  const handleWorkItemChange = (id, field, value) => {
    const updatedWorkItems = workItems.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    setWorkItems(updatedWorkItems);

    // Clear the error if all work items and descriptions are non-empty and within length limits
    const allValid = updatedWorkItems.every(
      (row) =>
        row.workItem.trim() &&
        row.itemDesc.trim() &&
        row.workItem.length <= 100 &&
        row.itemDesc.length <= 200
    );
    if (allValid) {
      clearError("workItems");
    }
  };

  const clearError = (field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  const handleCustomerChange = (e) => {
    const selectedId = e.target.value;
    setSelectedCustomer(selectedId);
    setSelectedCustomerId(selectedId);
    if (selectedId) clearError("selectedCustomer");
  };

  const handleWorkerChange = (e) => {
    const selectedId = e.target.value;
    setSelectedWorkers(selectedId);
    setSelectedWorkerId(selectedId);
    if (selectedId) clearError("selectedWorkers");
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedCustomer)
      newErrors.selectedCustomer = t("Customer is required");
    if (!startDate) newErrors.startDate = t("Start Date is required");
    if (!startTime) newErrors.startTime = t("Start Time is required");
    if (!expectedTime) newErrors.expectedTime = t("Expected Time is required");
    if (!selectedWorkers)
      newErrors.selectedWorkers = t("Select Workers is required");

    if (
      workItems.length === 0 ||
      workItems.some((row) => !row.workItem.trim() || !row.itemDesc.trim())
    ) {
      newErrors.workItems = t(
        "At least one Work Item and Description are required."
      );
    }
    // Validate maximum character length for each work item and description
    if (workItems.some((row) => row.workItem.length > 100)) {
      newErrors.workItems = t("Work Item must not exceed 100 characters");
    }
    if (workItems.some((row) => row.itemDesc.length > 200)) {
      newErrors.workItems = t(
        "Item Description must not exceed 200 characters"
      );
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitWorkOrder = async () => {
    if (!validate()) return;

    // Find customer details
    const selectedCustomerData = customersList?.find(
      (customer) => customer.id === selectedCustomerId
    );
    const customerName = selectedCustomerData ? selectedCustomerData.name : "";
    const customerEmail = selectedCustomerData
      ? selectedCustomerData.email
      : "";

    // Find worker details
    const selectedWorkerData = workersLsit?.find(
      (worker) => worker.id === selectedWorkerId
    );
    const workerName = selectedWorkerData ? selectedWorkerData.name : "";

    const finalData = {
      companyId: company_id,
      customerDetailSection: {
        CustomerId: selectedCustomerId,
        CustomerName: customerName,
        CustomerEmail: customerEmail,
        sendNotification: sendNotification === "Yes" ? true : false,
      },
      basicWorkorderDetails: {
        startDate,
        startTime,
        expectedTime,
        WorkerId: selectedWorkerId,
        WorkerName: workerName,
      },
      workorderDetails: workItems.map((row) => ({
        workItem: row.workItem,
        workDescription: row.itemDesc,
      })),
    };

    console.log("Final Data Sent:", finalData);

    const result = await Swal.fire({
      title: t("Are you sure?"),
      text: t("Do you want to create Work Order?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, create it!"),
      cancelButtonText: t("No, cancel"),
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: t("Processing..."),
      text: t("Creating Work Order, please wait."),
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const response = await createWorkOrderApi(finalData, token);
      Swal.close();

      if (response.status === true) {
        Swal.fire({
          title: t("Success!"),
          text: t("Work Order created successfully."),
          icon: "success",
          confirmButtonText: t("OK"),
        }).then(() => {
          navigate("/workorder/list");
        });
      } else {
        Swal.fire({
          title: "Error!",
          html:
            response.message ||
            t("There was an error creating the Work Order."),
          icon: "error",
          confirmButtonText: "Try Again",
        });
      }
    } catch (error) {
      Swal.close();
      Swal.fire({
        title: t("API Error!"),
        text: t("Something went wrong. Please try again later."),
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  const expectedTimeOptions = [
    { value: defaultWorkTime, label: `${defaultWorkTime} (Default)` },
    ...computeExpectedTimeOptions(defaultWorkTime, intervalTime).map(
      (option) => ({
        value: option,
        label: option,
      })
    ),
  ];

  // Optional: Define custom styles for react-select
  const customStyles = {
    control: (provided) => ({
      ...provided,
      height: "37px", // Set custom height
      minHeight: "37px",
    }),
    option: (provided) => ({
      ...provided,
      lineHeight: "15px", // Custom line height for options
    }),
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <Container>
            {/* Customer Detail Section */}
            <Card className="mb-4">
              <Card.Header className="bg-purple text-white">
                {t("Customer Detail Section")}
              </Card.Header>
              <Card.Body>
                <Form>
                  {/* Select Customer */}
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3} className="required-label">
                      {t("Select Customer")}:
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Select
                        value={selectedCustomer}
                        onChange={handleCustomerChange}
                      >
                        <option value="">{t("Select Customer")}</option>
                        {customersList?.map((customer) => (
                          <option key={customer.id} value={customer.id}>
                            {customer.name}
                          </option>
                        ))}
                      </Form.Select>
                      {errors.selectedCustomer && (
                        <div className="text-danger">
                          {errors.selectedCustomer}
                        </div>
                      )}
                    </Col>
                  </Form.Group>

                  {/* Send Notification */}
                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm={3} className="required-label">
                      {t("Send Notification to Customer")}?
                    </Form.Label>
                    <Col sm={9}>
                      <Form.Check
                        type="radio"
                        label={t("Yes")}
                        name="sendNotification"
                        id="notificationYes"
                        inline
                        onChange={() => setSendNotification("Yes")}
                        checked={sendNotification === "Yes"}
                      />
                      <Form.Check
                        type="radio"
                        label={t("No")}
                        name="sendNotification"
                        id="notificationNo"
                        inline
                        onChange={() => setSendNotification("No")}
                        checked={sendNotification === "No"}
                      />
                    </Col>
                  </Form.Group>
                </Form>
              </Card.Body>
            </Card>

            {/* Basic Workorder Details */}
            <Card className="mb-4">
              <Card.Header className="bg-purple text-white">
                {t("Basic Workorder Details")}
              </Card.Header>
              <Card.Body>
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="required-label">
                          {t("Start Date")}:
                        </Form.Label>
                        <Form.Control
                          type="date"
                          value={startDate}
                          min={new Date().toISOString().split("T")[0]} // Restrict past dates
                          onChange={(e) => {
                            setStartDate(e.target.value);
                            if (e.target.value) clearError("startDate");
                          }}
                        />
                        {errors.startDate && (
                          <div className="text-danger">{errors.startDate}</div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="required-label">
                          {t("Start Time")}:
                        </Form.Label>
                        <Form.Control
                          type="time"
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                            if (e.target.value) clearError("startTime");
                          }}
                        />
                        {errors.startTime && (
                          <div className="text-danger">{errors.startTime}</div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="required-label">
                          {t("Expected Time Required ( Hours )")} :
                        </Form.Label>
                        {defaultWorkTime && intervalTime ? (
                          <Select
                            value={
                              expectedTime
                                ? expectedTimeOptions.find(
                                    (option) => option.value === expectedTime
                                  )
                                : null
                            }
                            onChange={(selectedOption) => {
                              setExpectedTime(selectedOption.value);
                              clearError("expectedTime");
                            }}
                            options={expectedTimeOptions}
                            styles={customStyles}
                          />
                        ) : (
                          <Form.Control
                            type="text"
                            value={expectedTime}
                            readOnly
                          />
                        )}
                        {errors.expectedTime && (
                          <div className="text-danger">
                            {errors.expectedTime}
                          </div>
                        )}
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="required-label">
                          {t("Select Workers")}:
                        </Form.Label>
                        <Form.Select
                          value={selectedWorkers}
                          onChange={handleWorkerChange}
                        >
                          <option value="">{t("Select Workers")}</option>
                          {workersLsit?.map((worker) => (
                            <option key={worker.id} value={worker.id}>
                              {worker.name}
                            </option>
                          ))}
                        </Form.Select>
                        {errors.selectedWorkers && (
                          <div className="text-danger">
                            {errors.selectedWorkers}
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>

            {/* Workorder Details Table */}
            <Card className="mb-4">
              <Card.Header className="bg-purple text-white d-flex justify-content-between align-items-center">
                <span>{t("Workorder Details")}</span>
              </Card.Header>
              <Card.Body>
                <Table bordered responsive>
                  <thead>
                    <tr className="bg-light">
                      <th>
                        {t("Work Item")} <span className="text-danger">*</span>
                      </th>
                      <th>
                        {t("Item Description")}{" "}
                        <span className="text-danger">*</span>
                      </th>
                      <th className="text-center">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={addWorkItemRow}
                          disabled={
                            workItems.length === 0 ||
                            !(
                              workItems[workItems.length - 1].workItem.trim() &&
                              workItems[workItems.length - 1].itemDesc.trim()
                            )
                          }
                        >
                          {t("Add More")}
                        </Button>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {workItems.map((row, index) => (
                      <tr key={row.id}>
                        <td>
                          <Form.Control
                            type="text"
                            placeholder={t("Enter Work Item")}
                            value={row.workItem}
                            onChange={(e) =>
                              handleWorkItemChange(
                                row.id,
                                "workItem",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td>
                          <Form.Control
                            type="text"
                            placeholder={t("Enter Item Description")}
                            value={row.itemDesc}
                            onChange={(e) =>
                              handleWorkItemChange(
                                row.id,
                                "itemDesc",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          {index > 0 && (
                            <Button
                              variant="danger"
                              size="sm"
                              onClick={() => removeWorkItemRow(row.id)}
                            >
                              ✖
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  {errors.workItems && (
                    <div className="text-danger mt-2">{errors.workItems}</div>
                  )}
                </Table>
              </Card.Body>
            </Card>

            {/* Submit Workorder */}
            <div className="text-center mb-4">
              <Button onClick={handleSubmitWorkOrder} type="submit">
                {t("Submit Workorder")}
              </Button>
            </div>
          </Container>
        </div>
      </div>
    </>
  );
};

export default CreateWorkOrder;
