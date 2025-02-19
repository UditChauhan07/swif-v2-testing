import React, { useState } from "react";
import Header from "../../../../Components/Header/Header";
import { Form, Row, Col, Button } from "react-bootstrap";

const DefaultPricingStructure = () => {
  const [formData, setFormData] = useState({
    woCreation: "",
    woExecution: "",
    customerCreation: "",
    userCreationField: "",
    userCreationOffice: "",
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Remove error if the field has a valid (non-empty) value
    if (value.trim() !== "") {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.woCreation) newErrors.woCreation = "This field is required.";
    if (!formData.woExecution) newErrors.woExecution = "This field is required.";
    if (!formData.customerCreation)
      newErrors.customerCreation = "This field is required.";
    if (!formData.userCreationField)
      newErrors.userCreationField = "This field is required.";
    if (!formData.userCreationOffice)
      newErrors.userCreationOffice = "This field is required.";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // All validations passed: handle the form submission (e.g., API call)
      console.log("Form submitted successfully:", formData);
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

          {/* Center the form */}
          <div className="d-flex justify-content-center">
            <div style={{ width: "60%" }}>
              <Form onSubmit={handleSubmit}>
                {/* Row 1: WO Creation & WO Execution */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formWoCreation">
                      <Form.Label>
                        WO Creation <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter WO Creation price"
                        name="woCreation"
                        value={formData.woCreation}
                        onChange={handleInputChange}
                        isInvalid={!!errors.woCreation}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.woCreation}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formWoExecution">
                      <Form.Label>
                        WO Execution <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter WO Execution price"
                        name="woExecution"
                        value={formData.woExecution}
                        onChange={handleInputChange}
                        isInvalid={!!errors.woExecution}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.woExecution}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                {/* Row 2: Customer Creation & Currency */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formCustomerCreation">
                      <Form.Label>
                        Customer Creation <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Customer Creation price"
                        name="customerCreation"
                        value={formData.customerCreation}
                        onChange={handleInputChange}
                        isInvalid={!!errors.customerCreation}
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

                {/* Row 3: User Creation (Field) & User Creation (Office) */}
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="formUserCreationField">
                      <Form.Label>
                        User Creation (Field) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Field price"
                        name="userCreationField"
                        value={formData.userCreationField}
                        onChange={handleInputChange}
                        isInvalid={!!errors.userCreationField}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.userCreationField}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="formUserCreationOffice">
                      <Form.Label>
                        User Creation (Office) <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        placeholder="Enter Office price"
                        name="userCreationOffice"
                        value={formData.userCreationOffice}
                        onChange={handleInputChange}
                        isInvalid={!!errors.userCreationOffice}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.userCreationOffice}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="text-center">
                  <Button
                    type="submit"
                    style={{ background: "#2e2e32", border: "none" }}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DefaultPricingStructure;
