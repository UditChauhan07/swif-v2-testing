// 25 feb
// import React from "react"
// import Header from "../../../../Components/Header/Header"
// import { Formik, Form, Field, ErrorMessage } from "formik"
// import * as Yup from "yup"
// import { Container, Button, Card, Row, Col } from "react-bootstrap"

// const PackageCreateSys = () => {
//   // Base schema for all packages
//   const baseSchema = Yup.object({
//     packageType: Yup.string()
//       .oneOf(["subscription", "payg"])
//       .required("Please select a package type"),
//   })

//   // Schema for Subscription package
//   const subscriptionSchema = baseSchema.concat(
//     Yup.object({
//       name: Yup.string().required("Package name is required"),
//       cost_per_month: Yup.number()
//         .required("Cost per month is required")
//         .positive("Must be a positive value"),
//       features: Yup.object({
//         add_customers: Yup.number()
//           .required("Required")
//           .min(1, "Must be at least 1"),
//         add_office_users: Yup.number()
//           .required("Required")
//           .min(1, "Must be at least 1"),
//         add_field_users: Yup.number()
//           .required("Required")
//           .min(1, "Must be at least 1"),
//         work_order_creation: Yup.number()
//           .required("Required")
//           .min(1, "Must be at least 1"),
//         work_order_execution: Yup.number()
//           .required("Required")
//           .min(1, "Must be at least 1"),
//       }),
//       // For subscriptions, payg_rates is not used
//       payg_rates: Yup.object().notRequired(),
//     })
//   )

//   // Schema for PAYG package
//   const paygSchema = baseSchema.concat(
//     Yup.object({
//       // For PAYG packages, cost_per_month and features are not used.
//       cost_per_month: Yup.number().notRequired(),
//       features: Yup.object().notRequired(),
//       payg_rates: Yup.object({
//         add_customers: Yup.number()
//           .required("Required")
//           .min(0, "Must be at least 0"),
//         add_office_users: Yup.number()
//           .required("Required")
//           .min(0, "Must be at least 0"),
//         add_field_users: Yup.number()
//           .required("Required")
//           .min(0, "Must be at least 0"),
//         work_order_creation: Yup.number()
//           .required("Required")
//           .min(0, "Must be at least 0"),
//         work_order_execution: Yup.number()
//           .required("Required")
//           .min(0, "Must be at least 0"),
//       }),
//     })
//   )

//   // Use Yup.lazy to select the appropriate schema based on the values
//   const validationSchema = Yup.lazy((values) =>
//     values.packageType === "subscription" ? subscriptionSchema : paygSchema
//   )

//   return (
//     <>
//       <Header />
//       <div className="main-header-box">
//         <div className="mt-4 pages-box">
//           <Container className="d-flex justify-content-center align-items-center py-2">
//             <Card className="p-2 shadow-sm w-100" style={{ maxWidth: "900px" }}>
//               <div className="form-header mb-4">
//                 <h4 className="text-center">Create Package</h4>
//               </div>
//               <Formik
//                 initialValues={{
//                   packageType: "subscription", // default selection
//                   name: "",
//                   cost_per_month: "",
//                   features: {
//                     add_customers: "",
//                     add_office_users: "",
//                     add_field_users: "",
//                     work_order_creation: "",
//                     work_order_execution: "",
//                   },
//                   payg_rates: {
//                     add_customers: "",
//                     add_office_users: "",
//                     add_field_users: "",
//                     work_order_creation: "",
//                     work_order_execution: "",
//                   },
//                 }}
//                 validationSchema={validationSchema}
//                 onSubmit={(values, { resetForm }) => {
//                   let payload = {}
//                   if (values.packageType === "subscription") {
//                     payload = {
//                       packageType: values.packageType,
//                       name: values.name,
//                       cost_per_month: parseFloat(values.cost_per_month).toFixed(2),
//                       features: {
//                         add_customers: parseFloat(
//                           values.features.add_customers
//                         ).toFixed(2),
//                         add_office_users: parseFloat(
//                           values.features.add_office_users
//                         ).toFixed(2),
//                         add_field_users: parseFloat(
//                           values.features.add_field_users
//                         ).toFixed(2),
//                         work_order_creation: parseFloat(
//                           values.features.work_order_creation
//                         ).toFixed(2),
//                         work_order_execution: parseFloat(
//                           values.features.work_order_execution
//                         ).toFixed(2),
//                       },
//                       payg: false,
//                       payg_rates: {},
//                     }
//                   } else {
//                     payload = {
//                     packageType: values.packageType,
//                       name: values.name,
//                       cost_per_month: "0.00",
//                       features: {},
//                       payg: true,
//                       payg_rates: {
//                         add_customers: parseFloat(
//                           values.payg_rates.add_customers
//                         ).toFixed(2),
//                         add_office_users: parseFloat(
//                           values.payg_rates.add_office_users
//                         ).toFixed(2),
//                         add_field_users: parseFloat(
//                           values.payg_rates.add_field_users
//                         ).toFixed(2),
//                         work_order_creation: parseFloat(
//                           values.payg_rates.work_order_creation
//                         ).toFixed(2),
//                         work_order_execution: parseFloat(
//                           values.payg_rates.work_order_execution
//                         ).toFixed(2),
//                       },
//                     }
//                   }
//                   console.log("Submitted Values:", values)
//                   console.log("Payload:", payload)
//                   alert("Package Created Successfully!")
//                   resetForm()
//                 }}
//               >
//                 {({ values, setFieldValue }) => (
//                   <Form>
//                     {/* Package Type Selection */}
//                     <div className="mb-3">
//                       <label className="form-label me-3">Package Type:</label>
//                       <Field
//                         type="radio"
//                         name="packageType"
//                         value="subscription"
//                         id="subscriptionOption"
//                       />
//                       <label htmlFor="subscriptionOption" className="me-3">
//                         Subscription
//                       </label>
//                       <Field
//                         type="radio"
//                         name="packageType"
//                         value="payg"
//                         id="paygOption"
//                       />
//                       <label htmlFor="paygOption">Pay-As-You-Go</label>
//                       <ErrorMessage
//                         name="packageType"
//                         component="div"
//                         className="text-danger small"
//                       />
//                     </div>

                

//                     {values.packageType === "subscription" && (
//                       <>
//                           {/* Package Name */}
//                     <div className="mb-3">
//                       <label className="form-label">Package Name</label>
//                       <Field
//                         type="text"
//                         name="name"
//                         className="form-control"
//                         maxLength={50}
//                       />
//                       <ErrorMessage
//                         name="name"
//                         component="div"
//                         className="text-danger small"
//                       />
//                     </div>
//                         {/* Cost Per Month for Subscription */}
//                         <div className="mb-3">
//                           <label className="form-label">
//                             Cost Per Month ($)
//                           </label>
//                           <Field
//                             type="text"
//                             name="cost_per_month"
//                             className="form-control"
//                             maxLength={9}
//                             onInput={(e) => {
//                               e.target.value = e.target.value
//                                 .replace(/[^0-9.]/g, "")
//                                 .replace(/(\..*)\./g, "$1")
//                             }}
//                           />
//                           <ErrorMessage
//                             name="cost_per_month"
//                             component="div"
//                             className="text-danger small"
//                           />
//                         </div>

//                         {/* Feature Limits for Subscription */}
//                         <h5 className="mt-4">Feature Limits</h5>
//                         <Row>
//                           {Object.keys(values.features).map((feature) => (
//                             <Col md={6} key={feature} className="mb-3">
//                               <label className="form-label">
//                                 {feature.replace(/_/g, " ")}
//                               </label>
//                               <Field
//                                 type="text"
//                                 name={`features.${feature}`}
//                                 className="form-control"
//                                 maxLength={9}
//                                 onInput={(e) => {
//                                   e.target.value = e.target.value
//                                     .replace(/[^0-9.]/g, "")
//                                     .replace(/(\..*)\./g, "$1")
//                                 }}
//                               />
//                               <ErrorMessage
//                                 name={`features.${feature}`}
//                                 component="div"
//                                 className="text-danger small"
//                               />
//                             </Col>
//                           ))}
//                         </Row>
//                       </>
//                     )}

//                     {values.packageType === "payg" && (
//                       <>
//                         {/* PAYG Rates for PAYG Package */}
//                         <h5 className="mt-4">PAYG Rates (in $ per usage)</h5>
//                         <Row>
//                           {Object.keys(values.payg_rates).map((rate) => (
//                             <Col md={6} key={rate} className="mb-3">
//                               <label className="form-label">
//                                 {rate.replace(/_/g, " ")}
//                               </label>
//                               <Field
//                                 type="text"
//                                 name={`payg_rates.${rate}`}
//                                 className="form-control"
//                                 maxLength={9}
//                                 onInput={(e) => {
//                                   e.target.value = e.target.value
//                                     .replace(/[^0-9.]/g, "")
//                                     .replace(/(\..*)\./g, "$1")
//                                 }}
//                               />
//                               <ErrorMessage
//                                 name={`payg_rates.${rate}`}
//                                 component="div"
//                                 className="text-danger small"
//                               />
//                             </Col>
//                           ))}
//                         </Row>
//                       </>
//                     )}

//                     {/* Submit Button */}
//                     <Button type="submit" variant="primary" className="w-100 mt-3">
//                       Create Package
//                     </Button>
//                   </Form>
//                 )}
//               </Formik>
//             </Card>
//           </Container>
//         </div>
//       </div>
//     </>
//   )
// }

// export default PackageCreateSys


import React from "react";
import Header from "../../../../Components/Header/Header";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { CreateSubscriptionPackage } from "../../../../lib/store";
import Swal from "sweetalert2";

const PackageCreateSys = () => {
  
  const { t, i18n } = useTranslation();
  const token =localStorage.getItem("UserToken");
  // Validation schemas remain unchanged
  const baseSchema = Yup.object({
    packageType: Yup.string()
      .oneOf(["subscription", "payg"])
      .required(t("Please select a package type")),
  });
  
  const subscriptionSchema = baseSchema.concat(
    Yup.object({
      name: Yup.string().required(t("Package name is required")),
      cost_per_month: Yup.number()
        .required(t("Cost per month is required")),
        // .positive(t("Must be a positive value")),
      features: Yup.object({
        add_customers: Yup.number().required(t("Required")).min(1, t("Must be at least 1")),
        add_office_users: Yup.number().required(t("Required")).min(1, t("Must be at least 1")),
        add_field_users: Yup.number().required(t("Required")).min(1, t("Must be at least 1")),
        work_order_creation: Yup.number().required(t("Required")).min(1, t("Must be at least 1")),
        work_order_execution: Yup.number().required(t("Required")).min(1, t("Must be at least 1")),
      }),
      payg_rates: Yup.object().notRequired(),
    })
  );
  
  const paygSchema = baseSchema.concat(
    Yup.object({
      cost_per_month: Yup.number().notRequired(),
      features: Yup.object().notRequired(),
      payg_rates: Yup.object({
        add_customers: Yup.number().required(t("Required")).min(0, t("Must be at least 0")),
        add_office_users: Yup.number().required(t("Required")).min(0, t("Must be at least 0")),
        add_field_users: Yup.number().required(t("Required")).min(0, t("Must be at least 0")),
        work_order_creation: Yup.number().required(t("Required")).min(0, t("Must be at least 0")),
        work_order_execution: Yup.number().required(t("Required")).min(0, t("Must be at least 0")),
      }),
    })
  );

  const validationSchema = Yup.lazy((values) =>
    values.packageType === "subscription" ? subscriptionSchema : paygSchema
  );

  const featureMapping = {
    add_customers: "Add Customers",
    add_office_users: "Add Office Users",
    add_field_users: "Add Field Users",
    work_order_creation: "Work Order Creation",
    work_order_execution: "Work Order Execution",
  };

  return (
    <>
      <Header />
      <div className="main-header-box py-4" style={{ backgroundColor: "#f5f7fa" }}>
        <Container className="d-flex justify-content-center align-items-center">
          <Card className="p-4 shadow-lg w-100" style={{ maxWidth: "900px", border: "none", borderRadius: "15px" }}>
            <div className="form-header mb-4 text-center">
              <h4 className="fw-bold" style={{ color: "#2c3e50" }}>{t("Create Package")}</h4>
              <p className="text-muted">{t("Configure your package details below")}</p>
            </div>
            <Formik
              initialValues={{
                packageType: "subscription",
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
              onSubmit={async(values, { resetForm }) => {
                let payload = {};
                if (values.packageType === "subscription") {
                  payload = {
                    packageType: values.packageType,
                    name: values.name,
                    cost_per_month: Number(parseFloat(values.cost_per_month || 0).toFixed(2)),
                    features: {
                      add_customers: Number(parseFloat(values.features.add_customers || 0).toFixed(2)),
                      add_office_users: Number(parseFloat(values.features.add_office_users || 0).toFixed(2)),
                      add_field_users: Number(parseFloat(values.features.add_field_users || 0).toFixed(2)),
                      work_order_creation: Number(parseFloat(values.features.work_order_creation || 0).toFixed(2)),
                      work_order_execution: Number(parseFloat(values.features.work_order_execution || 0).toFixed(2)),
                    },
                    payg: false,
                    payg_rates: {},
                  };
                } else {
                  payload = {
                    packageType: values.packageType,
                    name: values.name||"payg",
                    cost_per_month: 0.00,
                    // features: {},
                    payg: true,
                    // payg_rates: {
                      features:{
                      add_customers: Number(parseFloat(values.payg_rates.add_customers).toFixed(2)),
                      add_office_users: Number(parseFloat(values.payg_rates.add_office_users).toFixed(2)),
                      add_field_users: Number(parseFloat(values.payg_rates.add_field_users).toFixed(2)),
                      work_order_creation: Number(parseFloat(values.payg_rates.work_order_creation).toFixed(2)),
                      work_order_execution: Number(parseFloat(values.payg_rates.work_order_execution).toFixed(2)),
                    },
                  };
                }
                console.log("Submitted Values:", values);
                console.log("Payload:", payload);
                Swal.fire({
                  title: t("Processing..."),
                  text: t("Please wait, while creating package"),
                  allowOutsideClick: false,
                  showConfirmButton: false,
                  didOpen: () => {
                    Swal.showLoading();
                  },
                });
                
                const response=await CreateSubscriptionPackage(token,payload);
                Swal.close();
                console.log("Responsedsd:", response);
                if(response.success==true){
                 
                  Swal.fire(t("success"), t("Package Created Successfully!"), "success");                }
                else{
                  Swal.fire(t("error"), response.error || t("Failed to create package"), "error");
                }
                resetForm();
              }}
            >
              {({ values }) => (
                <Form>
                  {/* Package Type Selection */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold" style={{ color: "#34495e" }}>{t("Package Type")}</label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <Field type="radio" name="packageType" value="subscription" id="subscriptionOption" className="form-check-input" />
                        <label htmlFor="subscriptionOption" className="form-check-label">{t("Subscription")}</label>
                      </div>
                      <div className="form-check">
                        <Field type="radio" name="packageType" value="payg" id="paygOption" className="form-check-input" />
                        <label htmlFor="paygOption" className="form-check-label">{t("Pay As You Go")}</label>
                      </div>
                    </div>
                    <ErrorMessage name="packageType" component="div" className="text-danger small mt-1" />
                  </div>

                  {values.packageType === "subscription" && (
                    <>
                      {/* Package Name */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold" style={{ color: "#34495e" }}>{t("Package Name")}</label>
                        <Field
                          type="text"
                          name="name"
                          className="form-control"
                          maxLength={50}
                          style={{ borderRadius: "8px", padding: "10px" }}
                        />
                        <ErrorMessage name="name" component="div" className="text-danger small mt-1" />
                      </div>

                      {/* Cost Per Month */}
                      <div className="mb-4">
                        <label className="form-label fw-semibold" style={{ color: "#34495e" }}>{t("Cost Per Month")} ($)</label>
                        <Field
                          type="text"
                          name="cost_per_month"
                          className="form-control"
                          maxLength={9}
                          onInput={(e) => {
                            e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
                          }}
                          style={{ borderRadius: "8px", padding: "10px" }}
                        />
                        <ErrorMessage name="cost_per_month" component="div" className="text-danger small mt-1" />
                      </div>

                      {/* Feature Limits */}
                      <div className="mb-4">
                        <h5 className="fw-semibold mb-3" style={{ color: "#2c3e50" }}>{t("Feature Limits")}</h5>
                        <Row>
                          {Object.keys(values.features).map((feature) => (
                            <Col md={6} key={feature} className="mb-3">
                              <label className="form-label text-capitalize" style={{ color: "#34495e" }}>
                                {/* {feature.replace(/_/g, " ")} */}
                                 {t(featureMapping[feature] || feature.replace(/_/g, " "))}
                              </label>
                              <Field
                                type="text"
                                name={`features.${feature}`}
                                className="form-control"
                                maxLength={9}
                                onInput={(e) => {
                                  e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
                                }}
                                style={{ borderRadius: "8px", padding: "10px" }}
                              />
                              <ErrorMessage name={`features.${feature}`} component="div" className="text-danger small mt-1" />
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </>
                  )}

                  {values.packageType === "payg" && (
                    <div className="mb-4">
                      <h5 className="fw-semibold mb-3" style={{ color: "#2c3e50" }}>  {t("PAYG Rates ($ per usage)")}</h5>
                      <Row>
                        {Object.keys(values.payg_rates).map((rate) => (
                          <Col md={6} key={rate} className="mb-3">
                            <label className="form-label text-capitalize" style={{ color: "#34495e" }}>
                              {/* {rate.replace(/_/g, " ")} */}
                              {t(featureMapping[rate] || rate.replace(/_/g, " "))}
                            </label>
                            <Field
                              type="text"
                              name={`payg_rates.${rate}`}
                              className="form-control"
                              maxLength={9}
                              onInput={(e) => {
                                e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1");
                              }}
                              style={{ borderRadius: "8px", padding: "10px" }}
                            />
                            <ErrorMessage name={`payg_rates.${rate}`} component="div" className="text-danger small mt-1" />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    variant="primary"
                    className="w-100 mt-3 fw-semibold"
                    style={{ padding: "12px", borderRadius: "8px", backgroundColor: "#2980b9", border: "none" }}
                  >{t("Create Package")}
                  
                  </Button>
                </Form>
              )}
            </Formik>
          </Card>
        </Container>
      </div>
    </>
  );
};

export default PackageCreateSys;