import React from "react";
import Header from "../../../../Components/Header/Header";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";


const EditPackage = ({ initialValues, onSubmit }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const packageData = location.state?.package || null;
    console.log('package data', packageData)
  const baseSchema = Yup.object({
    packageType: Yup.string()
      .oneOf(["subscription", "payg"])
      .required("Please select a package type"),
  });

  const subscriptionSchema = baseSchema.concat(
    Yup.object({
      name: Yup.string().required("Package name is required"),
      cost_per_month: Yup.number()
        .required("Cost per month is required")
        .positive("Must be a positive value"),
      features: Yup.object({
        add_customers: Yup.number().required("Required").min(1, "Must be at least 1"),
        add_office_users: Yup.number().required("Required").min(1, "Must be at least 1"),
        add_field_users: Yup.number().required("Required").min(1, "Must be at least 1"),
        work_order_creation: Yup.number().required("Required").min(1, "Must be at least 1"),
        work_order_execution: Yup.number().required("Required").min(1, "Must be at least 1"),
      }),
      payg_rates: Yup.object().notRequired(),
    })
  );

  const paygSchema = baseSchema.concat(
    Yup.object({
      cost_per_month: Yup.number().notRequired(),
      features: Yup.object().notRequired(),
      payg_rates: Yup.object({
        add_customers: Yup.number().required("Required").min(0, "Must be at least 0"),
        add_office_users: Yup.number().required("Required").min(0, "Must be at least 0"),
        add_field_users: Yup.number().required("Required").min(0, "Must be at least 0"),
        work_order_creation: Yup.number().required("Required").min(0, "Must be at least 0"),
        work_order_execution: Yup.number().required("Required").min(0, "Must be at least 0"),
      }),
    })
  );

  const validationSchema = Yup.lazy((values) =>
    values.packageType === "subscription" ? subscriptionSchema : paygSchema
  );

  return (
    <>
      <Header />
      <div className="main-header-box py-4" style={{ backgroundColor: "#f5f7fa" }}>
        <Container className="d-flex justify-content-center align-items-center">
          <Card className="p-4 shadow-lg w-100" style={{ maxWidth: "900px", border: "none", borderRadius: "15px" }}>
            <Formik
            //   initialValues={initialValues}
            initialValues={{
                packageType: "payg",
                name: "",
                cost_per_month: "",
                features: {
                  add_customers: "",
                  add_office_users: "",
                  add_field_users: "",
                  work_order_creation: "",
                  work_order_execution: "",
                },
                payg_rates: {
                  add_customers: "",
                  add_office_users: "",
                  add_field_users: "",
                  work_order_creation: "",
                  work_order_execution: "",
                },
              }}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                let payload = {};
                if (values.packageType === "subscription") {
                  payload = {
                    packageType: values.packageType,
                    name: values.name,
                    cost_per_month: parseFloat(values.cost_per_month).toFixed(2),
                    features: {
                      add_customers: parseFloat(values.features.add_customers).toFixed(2),
                      add_office_users: parseFloat(values.features.add_office_users).toFixed(2),
                      add_field_users: parseFloat(values.features.add_field_users).toFixed(2),
                      work_order_creation: parseFloat(values.features.work_order_creation).toFixed(2),
                      work_order_execution: parseFloat(values.features.work_order_execution).toFixed(2),
                    },
                    payg: false,
                    payg_rates: {},
                  };
                } else {
                  payload = {
                    packageType: values.packageType,
                    name: values.name || "payg",
                    cost_per_month: "0.00",
                    features: {
                      add_customers: parseFloat(values.payg_rates.add_customers).toFixed(2),
                      add_office_users: parseFloat(values.payg_rates.add_office_users).toFixed(2),
                      add_field_users: parseFloat(values.payg_rates.add_field_users).toFixed(2),
                      work_order_creation: parseFloat(values.payg_rates.work_order_creation).toFixed(2),
                      work_order_execution: parseFloat(values.payg_rates.work_order_execution).toFixed(2),
                    },
                    payg: true,
                  };
                }
                console.log("Updated Values:", values);
                console.log("Payload:", payload);
                alert("Package Updated Successfully!");
                onSubmit(payload);
                resetForm();
              }}
            >
              {({ values }) => (
                <Form>
                  <div className="mb-4 text-capitalize">
                    <label className="form-label fw-semibold">Package Type</label>
                    <Field type="text" name="packageType" className="form-control" disabled />
                  </div>
                  {values?.packageType === "subscription" && (
                    <>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Package Name</label>
                        <Field type="text" name="name" className="form-control" maxLength={50} disabled />
                      </div>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">Cost Per Month ($)</label>
                        <Field type="text" name="cost_per_month" className="form-control" />
                      </div>
                      <div className="mb-4">
                        <h5 className="fw-semibold">Feature Limits</h5>
                        <Row>
                          {Object.keys(values.features).map((feature) => (
                            <Col md={6} key={feature} className="mb-3">
                              <label className="form-label text-capitalize">{feature.replace(/_/g, " ")}</label>
                              <Field type="text " name={`features.${feature}`} className="form-control" />
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </>
                  )}
                  {values.packageType === "payg" && (
                    <div className="mb-4">
                      <h5 className="fw-semibold">PAYG Rates ($ per usage)</h5>
                      <Row>
                        {Object.keys(values.payg_rates).map((rate) => (
                          <Col md={6} key={rate} className="mb-3">
                            <label className="form-label text-capitalize">{rate.replace(/_/g, " ")}</label>
                            <Field type="text" name={`payg_rates.${rate}`} className="form-control" />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                  <Button type="submit" variant="primary" className="w-100 mt-3">Update Package</Button>
                </Form>
              )}
            </Formik>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default EditPackage;
