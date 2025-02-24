// import React from 'react'
// import Header from '../../../../Components/Header/Header'
// import { Card, Container, Row, Col, Badge, Table } from "react-bootstrap"
// import { Check2Circle, XCircle } from "react-bootstrap-icons"

// const PackageCreateSys = () => {
//   const packages = [
//     {
//       package_id: "lite",
//       name: "Lite",
//       cost_per_month: 50,
//       features: {
//         add_customers: 100,
//         add_office_users: 5,
//         add_field_users: 20,
//         work_order_creation: 100,
//         work_order_execution: 100,
//       },
//       payg: true,
//       payg_rates: {
//         add_customers: 0.05,
//         add_office_users: 3,
//         add_field_users: 2,
//         work_order_creation: 0.15,
//         work_order_execution: 0.2,
//       },
//     },
//     {
//       package_id: "plus",
//       name: "Plus",
//       cost_per_month: 150,
//       features: {
//         add_customers: 500,
//         add_office_users: 20,
//         add_field_users: 100,
//         work_order_creation: 500,
//         work_order_execution: 500,
//       },
//       payg: true,
//       payg_rates: {
//         add_customers: 0.02,
//         add_office_users: 2,
//         add_field_users: 1,
//         work_order_creation: 0.1,
//         work_order_execution: 0.15,
//       },
//     },
//     {
//       package_id: "prime",
//       name: "Prime",
//       cost_per_month: 300,
//       features: {
//         add_customers: 1000,
//         add_office_users: 50,
//         add_field_users: 300,
//         work_order_creation: 1000,
//         work_order_execution: 1000,
//       },
//       payg: true,
//       payg_rates: {
//         add_customers: 0.01,
//         add_office_users: 1.5,
//         add_field_users: 0.75,
//         work_order_creation: 0.05,
//         work_order_execution: 0.1,
//       },
//     },
//   ]

//   const getBackgroundColor = (packageId) => {
//     switch (packageId) {
//       case "lite":
//         return "#f8f9fa"
//       case "plus":
//         return "#e9ecef"
//       case "prime":
//         return "#dee2e6"
//       default:
//         return "#ffffff"
//     }
//   }
//   return (
//     <>
//       <Header />
//       <div className="main-header-box">
//         <div className="mt-4 pages-box">
//       <Container fluid className="py-5" style={{ backgroundColor: "#f0f2f5" }}>
       
//           <div
//             className="form-header mb-4"
//             style={{
//               backgroundColor: "#2e2e32",
//               color: "white",
//               padding: "0px 0px",
//               borderRadius: "8px",
//             }}
//           >
//             <h4 className="mb-0">Plans and Packages</h4>
//           </div>
    
//         <Row className="justify-content-center">
//           {packages.map((pkg) => (
//             <Col key={pkg.package_id} xs={12} md={6} lg={4} className="mb-4">
//               <Card className="h-100 shadow-sm" style={{ backgroundColor: getBackgroundColor(pkg.package_id) }}>
//                 <Card.Header className="text-center">
//                   <h3>{pkg.name}</h3>
//                   <h2 className="mb-0">
//                     ${pkg.cost_per_month}
//                     <small>/month</small>
//                   </h2>
//                 </Card.Header>
//                 <Card.Body>
//                   <Table striped bordered hover size="sm">
//                     <thead>
//                       <tr>
//                         <th>Feature</th>
//                         <th>Limit</th>
//                         <th>PAYG Rate</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {Object.entries(pkg.features).map(([feature, limit]) => (
//                         <tr key={feature}>
//                           <td>{feature.replace(/_/g, " ")}</td>
//                           <td>{limit}</td>
//                           <td>${pkg.payg_rates[feature]}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </Table>
//                 </Card.Body>
//                 <Card.Footer className="text-center">
//                   <Badge bg={pkg.payg ? "success" : "danger"} className="mb-2">
//                     {pkg.payg ? (
//                       <>
//                         <Check2Circle /> PAYG Available
//                       </>
//                     ) : (
//                       <>
//                         <XCircle /> No PAYG
//                       </>
//                     )}
//                   </Badge>
//                 </Card.Footer>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </Container>
//       </div>
//       </div>
//     </>
//   )
// }

// export default PackageCreateSys

// import React from "react"
// import Header from "../../../../Components/Header/Header"
// import { Formik, Form, Field, ErrorMessage } from "formik"
// import * as Yup from "yup"
// import { Container, Button, Card } from "react-bootstrap"

// const PackageCreateSys = () => {
//   const validationSchema = Yup.object().shape({
//     name: Yup.string().required("Package name is required"),
//     cost_per_month: Yup.number()
//       .required("Cost per month is required")
//       .positive("Must be a positive value"),
//     features: Yup.object().shape({
//       add_customers: Yup.number().required("Required").min(1, "Must be at least 1"),
//       add_office_users: Yup.number().required("Required").min(1, "Must be at least 1"),
//       add_field_users: Yup.number().required("Required").min(1, "Must be at least 1"),
//       work_order_creation: Yup.number().required("Required").min(1, "Must be at least 1"),
//       work_order_execution: Yup.number().required("Required").min(1, "Must be at least 1"),
//     }),
//     payg: Yup.boolean(),
//     payg_rates: Yup.object().shape({
//       add_customers: Yup.number().required("Required").min(0, "Must be at least 0"),
//       add_office_users: Yup.number().required("Required").min(0, "Must be at least 0"),
//       add_field_users: Yup.number().required("Required").min(0, "Must be at least 0"),
//       work_order_creation: Yup.number().required("Required").min(0, "Must be at least 0"),
//       work_order_execution: Yup.number().required("Required").min(0, "Must be at least 0"),
//     }),
//   })

//   return (
//     <>
//     <Header />
//     <div className="main-header-box">
//       <div className="mt-4 pages-box">
//     <Container className="py-5">
//       <Card className="p-4 shadow-sm">
//         <h3 className="text-center mb-4">Create Subscription Package</h3>

//         <Formik
//           initialValues={{
//             name: "",
//             cost_per_month: "",
//             features: {
//               add_customers: "",
//               add_office_users: "",
//               add_field_users: "",
//               work_order_creation: "",
//               work_order_execution: "",
//             },
//             payg: false,
//             payg_rates: {
//               add_customers: "",
//               add_office_users: "",
//               add_field_users: "",
//               work_order_creation: "",
//               work_order_execution: "",
//             },
//           }}
//           validationSchema={validationSchema}
//           onSubmit={(values, { resetForm }) => {
//             console.log("Submitted Values:", values)
//             alert("Package Created Successfully!")
//             resetForm()
//           }}
//         >
//           {({ values, setFieldValue }) => (
//             <Form>
//               {/* Package Name */}
//               <div className="mb-3">
//                 <label>Package Name</label>
//                 <Field type="text" name="name" className="form-control" />
//                 <ErrorMessage name="name" component="div" className="text-danger" />
//               </div>

//               {/* Cost Per Month */}
//               <div className="mb-3">
//                 <label>Cost Per Month ($)</label>
//                 <Field type="number" name="cost_per_month" className="form-control" />
//                 <ErrorMessage name="cost_per_month" component="div" className="text-danger" />
//               </div>

//               {/* Features */}
//               <h5 className="mt-4">Feature Limits</h5>
//               {Object.keys(values.features).map((feature) => (
//                 <div key={feature} className="mb-3">
//                   <label>{feature.replace(/_/g, " ")}</label>
//                   <Field type="number" name={`features.${feature}`} className="form-control" />
//                   <ErrorMessage name={`features.${feature}`} component="div" className="text-danger" />
//                 </div>
//               ))}

//               {/* PAYG Checkbox */}
//               <div className="mb-3 form-check">
//                 <Field
//                   type="checkbox"
//                   name="payg"
//                   className="form-check-input"
//                   id="paygCheckbox"
//                   checked={values.payg}
//                   onChange={(e) => setFieldValue("payg", e.target.checked)}
//                 />
//                 <label className="form-check-label" htmlFor="paygCheckbox">
//                   Enable PAYG (Pay-As-You-Go)
//                 </label>
//               </div>

//               {/* PAYG Rates */}
//               {values.payg && (
//                 <>
//                   <h5 className="mt-4">PAYG Rates ($ per unit)</h5>
//                   {Object.keys(values.payg_rates).map((rate) => (
//                     <div key={rate} className="mb-3">
//                       <label>{rate.replace(/_/g, " ")}</label>
//                       <Field type="number" name={`payg_rates.${rate}`} className="form-control" />
//                       <ErrorMessage name={`payg_rates.${rate}`} component="div" className="text-danger" />
//                     </div>
//                   ))}
//                 </>
//               )}

//               {/* Submit Button */}
//               <Button type="submit" variant="primary" className="w-100 mt-3">
//                 Create Package
//               </Button>
//             </Form>
//           )}
//         </Formik>
//       </Card>
//     </Container>
//     </div>
//     </div>
//     </>
//   )
// }

// export default PackageCreateSys

//21 feb
// import React from "react"
// import Header from "../../../../Components/Header/Header"
// import { Formik, Form, Field, ErrorMessage } from "formik"
// import * as Yup from "yup"
// import { Container, Button, Card, Row, Col } from "react-bootstrap"

// const PackageCreateSys = () => {
//   const validationSchema = Yup.object().shape({
//     name: Yup.string().required("Package name is required"),
//     cost_per_month: Yup.number()
//       .required("Cost per month is required")
//       .positive("Must be a positive value"),
//     features: Yup.object().shape({
//       add_customers: Yup.number().required("Required").min(1, "Must be at least 1"),
//       add_office_users: Yup.number().required("Required").min(1, "Must be at least 1"),
//       add_field_users: Yup.number().required("Required").min(1, "Must be at least 1"),
//       work_order_creation: Yup.number().required("Required").min(1, "Must be at least 1"),
//       work_order_execution: Yup.number().required("Required").min(1, "Must be at least 1"),
//     }),
//     payg: Yup.boolean(),
//     payg_rates: Yup.object().shape({
//       add_customers: Yup.number().required("Required").min(0, "Must be at least 0"),
//       add_office_users: Yup.number().required("Required").min(0, "Must be at least 0"),
//       add_field_users: Yup.number().required("Required").min(0, "Must be at least 0"),
//       work_order_creation: Yup.number().required("Required").min(0, "Must be at least 0"),
//       work_order_execution: Yup.number().required("Required").min(0, "Must be at least 0"),
//     }),
//   })

//   // const handleNumericInput = (e, maxDigits = 7, decimalPlaces = 2) => {
//   //   let { value } = e.target;
  
//   //   // Allow only numbers and a single dot
//   //   value = value.replace(/[^0-9.]/g, "");
  
//   //   // Ensure only one decimal point
//   //   const parts = value.split(".");
//   //   if (parts.length > 2) {
//   //     value = parts[0] + "." + parts.slice(1).join("");
//   //   }
  
//   //   // Restrict integer and decimal length
//   //   if (value.includes(".")) {
//   //     let [integer, decimal] = value.split(".");
  
//   //     // Limit integer part
//   //     if (integer.length > maxDigits - decimalPlaces) {
//   //       integer = integer.slice(0, maxDigits - decimalPlaces);
//   //     }
  
//   //     // Limit decimal part
//   //     if (decimal.length > decimalPlaces) {
//   //       decimal = decimal.slice(0, decimalPlaces);
//   //     }
  
//   //     value = integer + "." + decimal;
//   //   } else {
//   //     // No decimal case: limit full length
//   //     if (value.length > maxDigits) {
//   //       value = value.slice(0, maxDigits);
//   //     }
//   //   }
  
//   //   // Prevent leading zero issue (except for "0.")
//   //   if (value.startsWith("00")) {
//   //     value = "0";
//   //   } else if (value.startsWith(".")) {
//   //     value = "0.";
//   //   }
  
//   //   e.target.value = value;
//   // };
  
  
  
//   return (
//     <>
//       <Header />
//       <div className="main-header-box">
//         <div className="mt-4 pages-box">
//         <div className="form-header">
//                   <h4 className="text-center">Create Subscription Package</h4>
//                 </div>
//           <Container className="d-flex justify-content-center align-items-center py-2">
//             <Card className="p-2 shadow-sm w-100" style={{ maxWidth: "900px" }}>

//               <Formik
//                 initialValues={{
//                   name: "",
//                   cost_per_month: "",
//                   features: {
//                     add_customers: "",
//                     add_office_users: "",
//                     add_field_users: "",
//                     work_order_creation: "",
//                     work_order_execution: "",
//                   },
//                   payg: false,
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
//                   console.log("Submitted Values:", values)
//                   const payload = {
//                     name: values.name,
//                     cost_per_month: parseFloat(values.cost_per_month).toFixed(2),
//                     features: {
//                       add_customers: parseFloat(values.features.add_customers).toFixed(2),
//                       add_office_users: parseFloat(values.features.add_office_users).toFixed(2),
//                       add_field_users: parseFloat(values.features.add_field_users).toFixed(2),
//                       work_order_creation: parseFloat(values.features.work_order_creation).toFixed(2),
//                       work_order_execution: parseFloat(values.features.work_order_execution).toFixed(2),
//                     },
//                     payg: values.payg,
//                     payg_rates: {
//                       add_customers: parseFloat(values.payg_rates.add_customers).toFixed(2),
//                       add_office_users: parseFloat(values.payg_rates.add_office_users),
//                       add_field_users: parseFloat(values.payg_rates.add_field_users).toFixed(2),
//                       work_order_creation: parseFloat(values.payg_rates.work_order_creation).toFixed(2),
//                       work_order_execution: parseFloat(values.payg_rates.work_order_execution).toFixed(2),
//                     },
//                   }
//                   console.log("Payload:", payload)
//                   alert("Package Created Successfully!")
//                   resetForm()
//                 }}
//               >
//                 {({ values, setFieldValue }) => (
//                   <Form>
//                     {/* Package Name */}
//                     <div className="mb-3">
//                       <label className="form-label">Package Name</label>
//                       <Field type="text" name="name" className="form-control" maxlength={50}/>
//                       <ErrorMessage name="name" component="div" className="text-danger small" />
//                     </div>

//                     {/* Cost Per Month */}
//                     <div className="mb-3">
//                       <label className="form-label">Cost Per Month ($)</label>
//                       <Field type="text" name="cost_per_month" className="form-control" maxlength={9} onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")}}/>
//                       <ErrorMessage name="cost_per_month" component="div" className="text-danger small" />
//                     </div>

//                     {/* Features */}
//                     <h5 className="mt-4">Feature Limits</h5>
//                     <Row>
//                       {Object.keys(values.features).map((feature) => (
//                         <Col md={6} key={feature} className="mb-3">
//                           <label className="form-label">{feature.replace(/_/g, " ")}</label>
//                           <Field type="text" name={`features.${feature}`} className="form-control" maxlength={9} onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")}}/>
//                           <ErrorMessage name={`features.${feature}`} component="div" className="text-danger small" />
//                         </Col>
//                       ))}
//                     </Row>

//                     {/* PAYG Checkbox */}
//                     <div className="mb-3 form-check">
//                       <Field
//                         type="checkbox"
//                         name="payg"
//                         className="form-check-input"
//                         id="paygCheckbox"
//                         checked={values.payg}
//                         onChange={(e) => setFieldValue("payg", e.target.checked)}
//                       />
//                       <label className="form-check-label" htmlFor="paygCheckbox">
//                         Enable PAYG (Pay-As-You-Go)
//                       </label>
//                     </div>

//                     {/* PAYG Rates */}
//                     {values.payg && (
//                       <>
//                         <h5 className="mt-4">PAYG Rates ($ per unit)</h5>
//                         <Row>
//                           {Object.keys(values.payg_rates).map((rate) => (
//                             <Col md={6} key={rate} className="mb-3">
//                               <label className="form-label">{rate.replace(/_/g, " ")}</label>
//                               <Field type="text" name={`payg_rates.${rate}`} className="form-control" maxlength={9} onInput={(e) => {e.target.value = e.target.value.replace(/[^0-9.]/g, "").replace(/(\..*)\./g, "$1")}} />
//                               <ErrorMessage name={`payg_rates.${rate}`} component="div" className="text-danger small" />
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





import React from "react"
import Header from "../../../../Components/Header/Header"
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { Container, Button, Card, Row, Col } from "react-bootstrap"

const PackageCreateSys = () => {
  // Base schema for all packages
  const baseSchema = Yup.object({
    packageType: Yup.string()
      .oneOf(["subscription", "payg"])
      .required("Please select a package type"),
  })

  // Schema for Subscription package
  const subscriptionSchema = baseSchema.concat(
    Yup.object({
      name: Yup.string().required("Package name is required"),
      cost_per_month: Yup.number()
        .required("Cost per month is required")
        .positive("Must be a positive value"),
      features: Yup.object({
        add_customers: Yup.number()
          .required("Required")
          .min(1, "Must be at least 1"),
        add_office_users: Yup.number()
          .required("Required")
          .min(1, "Must be at least 1"),
        add_field_users: Yup.number()
          .required("Required")
          .min(1, "Must be at least 1"),
        work_order_creation: Yup.number()
          .required("Required")
          .min(1, "Must be at least 1"),
        work_order_execution: Yup.number()
          .required("Required")
          .min(1, "Must be at least 1"),
      }),
      // For subscriptions, payg_rates is not used
      payg_rates: Yup.object().notRequired(),
    })
  )

  // Schema for PAYG package
  const paygSchema = baseSchema.concat(
    Yup.object({
      // For PAYG packages, cost_per_month and features are not used.
      cost_per_month: Yup.number().notRequired(),
      features: Yup.object().notRequired(),
      payg_rates: Yup.object({
        add_customers: Yup.number()
          .required("Required")
          .min(0, "Must be at least 0"),
        add_office_users: Yup.number()
          .required("Required")
          .min(0, "Must be at least 0"),
        add_field_users: Yup.number()
          .required("Required")
          .min(0, "Must be at least 0"),
        work_order_creation: Yup.number()
          .required("Required")
          .min(0, "Must be at least 0"),
        work_order_execution: Yup.number()
          .required("Required")
          .min(0, "Must be at least 0"),
      }),
    })
  )

  // Use Yup.lazy to select the appropriate schema based on the values
  const validationSchema = Yup.lazy((values) =>
    values.packageType === "subscription" ? subscriptionSchema : paygSchema
  )

  return (
    <>
      <Header />
      <div className="main-header-box">
        <div className="mt-4 pages-box">
          <Container className="d-flex justify-content-center align-items-center py-2">
            <Card className="p-2 shadow-sm w-100" style={{ maxWidth: "900px" }}>
              <div className="form-header mb-4">
                <h4 className="text-center">Create Package</h4>
              </div>
              <Formik
                initialValues={{
                  packageType: "subscription", // default selection
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
                  let payload = {}
                  if (values.packageType === "subscription") {
                    payload = {
                      packageType: values.packageType,
                      name: values.name,
                      cost_per_month: parseFloat(values.cost_per_month).toFixed(2),
                      features: {
                        add_customers: parseFloat(
                          values.features.add_customers
                        ).toFixed(2),
                        add_office_users: parseFloat(
                          values.features.add_office_users
                        ).toFixed(2),
                        add_field_users: parseFloat(
                          values.features.add_field_users
                        ).toFixed(2),
                        work_order_creation: parseFloat(
                          values.features.work_order_creation
                        ).toFixed(2),
                        work_order_execution: parseFloat(
                          values.features.work_order_execution
                        ).toFixed(2),
                      },
                      payg: false,
                      payg_rates: {},
                    }
                  } else {
                    payload = {
                    packageType: values.packageType,
                      name: values.name,
                      cost_per_month: "0.00",
                      features: {},
                      payg: true,
                      payg_rates: {
                        add_customers: parseFloat(
                          values.payg_rates.add_customers
                        ).toFixed(2),
                        add_office_users: parseFloat(
                          values.payg_rates.add_office_users
                        ).toFixed(2),
                        add_field_users: parseFloat(
                          values.payg_rates.add_field_users
                        ).toFixed(2),
                        work_order_creation: parseFloat(
                          values.payg_rates.work_order_creation
                        ).toFixed(2),
                        work_order_execution: parseFloat(
                          values.payg_rates.work_order_execution
                        ).toFixed(2),
                      },
                    }
                  }
                  console.log("Submitted Values:", values)
                  console.log("Payload:", payload)
                  alert("Package Created Successfully!")
                  resetForm()
                }}
              >
                {({ values, setFieldValue }) => (
                  <Form>
                    {/* Package Type Selection */}
                    <div className="mb-3">
                      <label className="form-label me-3">Package Type:</label>
                      <Field
                        type="radio"
                        name="packageType"
                        value="subscription"
                        id="subscriptionOption"
                      />
                      <label htmlFor="subscriptionOption" className="me-3">
                        Subscription
                      </label>
                      <Field
                        type="radio"
                        name="packageType"
                        value="payg"
                        id="paygOption"
                      />
                      <label htmlFor="paygOption">Pay-As-You-Go</label>
                      <ErrorMessage
                        name="packageType"
                        component="div"
                        className="text-danger small"
                      />
                    </div>

                

                    {values.packageType === "subscription" && (
                      <>
                          {/* Package Name */}
                    <div className="mb-3">
                      <label className="form-label">Package Name</label>
                      <Field
                        type="text"
                        name="name"
                        className="form-control"
                        maxLength={50}
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="text-danger small"
                      />
                    </div>
                        {/* Cost Per Month for Subscription */}
                        <div className="mb-3">
                          <label className="form-label">
                            Cost Per Month ($)
                          </label>
                          <Field
                            type="text"
                            name="cost_per_month"
                            className="form-control"
                            maxLength={9}
                            onInput={(e) => {
                              e.target.value = e.target.value
                                .replace(/[^0-9.]/g, "")
                                .replace(/(\..*)\./g, "$1")
                            }}
                          />
                          <ErrorMessage
                            name="cost_per_month"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        {/* Feature Limits for Subscription */}
                        <h5 className="mt-4">Feature Limits</h5>
                        <Row>
                          {Object.keys(values.features).map((feature) => (
                            <Col md={6} key={feature} className="mb-3">
                              <label className="form-label">
                                {feature.replace(/_/g, " ")}
                              </label>
                              <Field
                                type="text"
                                name={`features.${feature}`}
                                className="form-control"
                                maxLength={9}
                                onInput={(e) => {
                                  e.target.value = e.target.value
                                    .replace(/[^0-9.]/g, "")
                                    .replace(/(\..*)\./g, "$1")
                                }}
                              />
                              <ErrorMessage
                                name={`features.${feature}`}
                                component="div"
                                className="text-danger small"
                              />
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}

                    {values.packageType === "payg" && (
                      <>
                        {/* PAYG Rates for PAYG Package */}
                        <h5 className="mt-4">PAYG Rates (in $ per usage)</h5>
                        <Row>
                          {Object.keys(values.payg_rates).map((rate) => (
                            <Col md={6} key={rate} className="mb-3">
                              <label className="form-label">
                                {rate.replace(/_/g, " ")}
                              </label>
                              <Field
                                type="text"
                                name={`payg_rates.${rate}`}
                                className="form-control"
                                maxLength={9}
                                onInput={(e) => {
                                  e.target.value = e.target.value
                                    .replace(/[^0-9.]/g, "")
                                    .replace(/(\..*)\./g, "$1")
                                }}
                              />
                              <ErrorMessage
                                name={`payg_rates.${rate}`}
                                component="div"
                                className="text-danger small"
                              />
                            </Col>
                          ))}
                        </Row>
                      </>
                    )}

                    {/* Submit Button */}
                    <Button type="submit" variant="primary" className="w-100 mt-3">
                      Create Package
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card>
          </Container>
        </div>
      </div>
    </>
  )
}

export default PackageCreateSys
