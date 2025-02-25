import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../../../../Components/Header/Header";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import {
  createPricingStructure,
  createUsageLimit,
  getPricingStructure,
  getUsageLimit,
  updatePricingStructure,
  updateUsageLimit,
} from "../../../../lib/store";
import LoadingComp from "../../../../Components/Loader/LoadingComp";
import { useTranslation } from "react-i18next";

const UsageLimitStrc = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    workOrderCreation: "",
    workOrderExecution: "",
    customerCreation: "",
    fieldUserCreation: "",
    officeUserCreation: "",
  });
  console.log("dataaa", formData);
  const [errors, setErrors] = useState({});
  const [pricingId, setPricingId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("UserToken"));
  const [loading, setLoading] = useState(false);

  // Fetch API when component mountsss
  useEffect(() => {
    fetchUsageLimit();
  }, []);

  const fetchUsageLimit = async () => {
    setLoading(true);
    try {
      const response = await getUsageLimit(token);
      if (response.data.status && response.data.data.length > 0) {
        const pricing = response.data.data[0];

        setFormData({
          workOrderCreation: pricing.workOrderCreation || "",
          workOrderExecution: pricing.workOrderExecution || "",
          customerCreation: pricing.customerCreation || "",
          fieldUserCreation: pricing.fieldUserCreation || "",
          officeUserCreation: pricing.officeUserCreation || "",
        });

        setPricingId(pricing?.id);
      }
    } catch (error) {
      console.error("Error fetching pricing data:", error);
      // Swal.fire("Error", "Failed to fetch pricing data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) newErrors[key] = t("Field is required.");
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Confirm before proceeding
    const confirmResult = await Swal.fire({
      title: t("Are you sure?"),
      text: pricingId
        ? t("Do you want to update the Usage Limit?")
        : t("Do you want to create a new Usage Limit?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, proceed!"),
      cancelButtonText: t("Cancel"),
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: t("Processing..."),
      text: t("Please wait while we save your data."),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    setLoading(true);
    try {
      const formattedData = {
        workOrderCreation: Number(formData.workOrderCreation),
        workOrderExecution: Number(formData.workOrderExecution),
        customerCreation: Number(formData.customerCreation),
        fieldUserCreation: Number(formData.fieldUserCreation),
        officeUserCreation: Number(formData.officeUserCreation),
      };

      let response;
      if (pricingId) {
        response = await updateUsageLimit(token, formattedData);
      } else {
        response = await createUsageLimit(token, formattedData);
        console.log("dadas", response);
        if (response.status === true) {
          setPricingId(response.data?.id);
          await fetchUsageLimit();
        }
      }

      if (response.status === true) {
        Swal.fire(
          t("Success"),
          t("Usage Limit saved successfully!"),
          "success"
        );
      } else {
        Swal.fire(t("Error"), t("Failed to save Usage Limit"), "error");
      }
    } catch (error) {
      console.error("Error saving Usage Limit:", error);
      Swal.fire(t("Error"), t("Something went wrong!"), "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <div
            className="text-center mb-4"
            style={{
              backgroundColor: "#2e2e32",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
          >
            <h4 className="mb-0">{t("Enter Limits Per Company")}</h4>
          </div>

          <div className="d-flex justify-content-center">
            <div style={{ width: "60%" }}>
              {loading ? (
                <LoadingComp />
              ) : (
                <Form onSubmit={handleSubmit}>
                  {/* Row 1 */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="formworkOrderCreation">
                        <Form.Label>
                          {t("WO Creation")}{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder={t("Enter WO Creation price")}
                          name="workOrderCreation"
                          value={formData.workOrderCreation}
                          onChange={handleInputChange}
                          isInvalid={!!errors.workOrderCreation}
                          min={0}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.workOrderCreation}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formworkOrderExecution">
                        <Form.Label>
                          {t("WO Execution")}{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder={t("Enter WO Execution price")}
                          name="workOrderExecution"
                          value={formData.workOrderExecution}
                          onChange={handleInputChange}
                          isInvalid={!!errors.workOrderExecution}
                          min={0}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.workOrderExecution}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Row 2 */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="formfieldUserCreation">
                        <Form.Label>
                          {t("User Creation")} (Field){" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder={t("Enter Field price")}
                          name="fieldUserCreation"
                          value={formData.fieldUserCreation}
                          onChange={handleInputChange}
                          isInvalid={!!errors.fieldUserCreation}
                          min={0}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.fieldUserCreation}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="formofficeUserCreation">
                        <Form.Label>
                          {t("User Creation")} (Office){" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder={t("Enter Office price")}
                          name="officeUserCreation"
                          value={formData.officeUserCreation}
                          onChange={handleInputChange}
                          isInvalid={!!errors.officeUserCreation}
                          min={0}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.officeUserCreation}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Row 3 */}
                  <Row className="mb-3 ">
                    <Col md={6}>
                      <Form.Group controlId="formCustomerCreation">
                        <Form.Label>
                          {t("Customer Creation")}{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder={t("Enter Customer Creation price")}
                          name="customerCreation"
                          value={formData.customerCreation}
                          onChange={handleInputChange}
                          isInvalid={!!errors.customerCreation}
                          min={0}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.customerCreation}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={loading}
                      style={{ background: "#2e2e32", border: "none" }}
                    >
                      {loading
                        ? t("Processing...")
                        : pricingId
                        ? t("Update")
                        : t("Create")}
                    </Button>
                  </div>
                </Form>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UsageLimitStrc;
