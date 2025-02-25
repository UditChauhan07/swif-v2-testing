import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Header from "../../../../Components/Header/Header";
import { Form, Row, Col, Button, Spinner } from "react-bootstrap";
import {
  createPricingStructure,
  getPricingStructure,
  updatePricingStructure,
} from "../../../../lib/store";
import LoadingComp from "../../../../Components/Loader/LoadingComp";

const DefaultPricingStructure = () => {
  const [formData, setFormData] = useState({
    workOrderCreation: "",
    workOrderExecution: "",
    customerCreation: "",
    fieldUserCreation: "",
    officeUserCreation: "",
  });
  const [errors, setErrors] = useState({});
  const [pricingId, setPricingId] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("UserToken"));
  const [loading, setLoading] = useState(false);

  // Fetch API when component mountsss
  useEffect(() => {
    fetchPricingData();
  }, []);

  const fetchPricingData = async () => {
    setLoading(true);
    try {
      const response = await getPricingStructure(token);
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
      if (!formData[key]) newErrors[key] = "This field is required.";
    });

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Confirm before proceeding
    const confirmResult = await Swal.fire({
      title: "Are you sure?",
      text: pricingId
        ? "Do you want to update the pricing structure?"
        : "Do you want to create a new pricing structure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, proceed!",
      cancelButtonText: "Cancel",
    });

    if (!confirmResult.isConfirmed) return;

    Swal.fire({
      title: "Processing...",
      text: "Please wait while we save your data.",
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
        response = await updatePricingStructure(
          token,
          formattedData,
          pricingId
        );
      } else {
        response = await createPricingStructure(token, formattedData);
        setPricingId(response.data?.id);
      }

      if (response.status === true) {
        Swal.fire(
          "Success",
          "Pricing structure saved successfully!",
          "success"
        );
      } else {
        Swal.fire("Error", "Failed to save pricing structure", "error");
      }
    } catch (error) {
      console.error("Error saving pricing data:", error);
      Swal.fire("Error", "Something went wrong!", "error");
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
            <h4 className="mb-0">Enter Pricing Structure Details</h4>
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
                          WO Creation <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter WO Creation price"
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
                          WO Execution <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter WO Execution price"
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
                      <Form.Group controlId="formCustomerCreation">
                        <Form.Label>
                          Customer Creation{" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter Customer Creation price"
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
                    <Col md={6}>
                      <Form.Group controlId="formCurrency">
                        <Form.Label>Currency</Form.Label>
                        <Form.Control type="text" value="USD" disabled />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Row 3 */}
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="formfieldUserCreation">
                        <Form.Label>
                          User Creation (Field){" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter Field price"
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
                          User Creation (Office){" "}
                          <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          placeholder="Enter Office price"
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

                  <div className="text-center">
                    <Button
                      type="submit"
                      disabled={loading}
                      style={{ background: "#2e2e32", border: "none" }}
                    >
                      {loading
                        ? "Processing..."
                        : pricingId
                        ? "Update"
                        : "Create"}
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

export default DefaultPricingStructure;
