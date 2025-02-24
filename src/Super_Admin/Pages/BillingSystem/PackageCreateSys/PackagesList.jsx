// import React from 'react'
// import { Card, Container, Row, Col, Badge, Table } from "react-bootstrap"
// import { Check2Circle, XCircle } from "react-bootstrap-icons"
// import "./PackageCreateSys.css" // External CSS file for custom styling
// import Header from '../../../../Components/Header/Header'
// const PackagesList = () => {
//     const packages = [
//         {
//           package_id: "lite",
//           name: "Lite",
//           cost_per_month: 50,
//           features: {
//             add_customers: 100,
//             add_office_users: 5,
//             add_field_users: 20,
//             work_order_creation: 100,
//             work_order_execution: 100,
//           },
//           payg: true,
//           payg_rates: {
//             add_customers: 0.05,
//             add_office_users: 3,
//             add_field_users: 2,
//             work_order_creation: 0.15,
//             work_order_execution: 0.2,
//           },
//         },
//         {
//           package_id: "plus",
//           name: "Plus",
//           cost_per_month: 150,
//           features: {
//             add_customers: 500,
//             add_office_users: 20,
//             add_field_users: 100,
//             work_order_creation: 500,
//             work_order_execution: 500,
//           },
//           payg: true,
//           payg_rates: {
//             add_customers: 0.02,
//             add_office_users: 2,
//             add_field_users: 1,
//             work_order_creation: 0.1,
//             work_order_execution: 0.15,
//           },
//         },
//         {
//           package_id: "prime",
//           name: "Prime",
//           cost_per_month: 300,
//           features: {
//             add_customers: 1000,
//             add_office_users: 50,
//             add_field_users: 300,
//             work_order_creation: 1000,
//             work_order_execution: 1000,
//           },
//           payg: true,
//           payg_rates: {
//             add_customers: 0.01,
//             add_office_users: 1.5,
//             add_field_users: 0.75,
//             work_order_creation: 0.05,
//             work_order_execution: 0.1,
//           },
//         },
//       ]
    
//       return (
//         <>
//           <Header/>
//           <div className="main-header-box">
//             <div className="mt-4 pages-box">
//               <Container fluid className="py-5 package-container">
//                 <div className="form-header">
//                   <h4 className="text-center">Plans and Packages</h4>
//                 </div>
    
//                 <Row className="justify-content-center">
//                   {packages.map((pkg) => (
//                     <Col key={pkg.package_id} xs={12} md={6} lg={4} className="mb-4">
//                       <Card className={`package-card package-${pkg.package_id}`}>
//                         <Card.Header className="text-center">
//                           <h3 className="package-title">{pkg.name}</h3>
//                           <h2 className="package-price">
//                             ${pkg.cost_per_month} <small>/month</small>
//                           </h2>
//                         </Card.Header>
//                         <Card.Body>
//                           <Table className="package-table" bordered hover size="sm">
//                             <thead>
//                               <tr className='text-center'>
//                                 <th>Feature</th>
//                                 <th>Limit</th>
//                                 <th>PAYG Rate</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {Object.entries(pkg.features).map(([feature, limit]) => (
//                                 <tr key={feature}>
//                                   <td>{feature.replace(/_/g, " ")}</td>
//                                   <td>{limit}</td>
//                                   <td>${pkg.payg_rates[feature]}</td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </Table>
//                         </Card.Body>
//                         <Card.Footer className="text-center">
//                           <Badge bg={pkg.payg ? "success" : "danger"} className="package-badge">
//                             {pkg.payg ? (
//                               <>
//                                 <Check2Circle /> PAYG Available
//                               </>
//                             ) : (
//                               <>
//                                 <XCircle /> No PAYG
//                               </>
//                             )}
//                           </Badge>
//                         </Card.Footer>
//                       </Card>
//                     </Col>
//                   ))}
//                 </Row>
//               </Container>
//             </div>
//           </div>
//         </>
//       )
// }

// export default PackagesList

// import React from 'react'
// import { Card, Container, Row, Col, Badge, Table } from "react-bootstrap"
// import { Check2Circle, XCircle } from "react-bootstrap-icons"
// import "./PackageCreateSys.css" // External CSS file for custom styling
// import Header from '../../../../Components/Header/Header'

// const PackagesList = () => {
//   // Subscription packages (bundled)
//   const subscriptionPackages = [
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
//   ];

//   // PAYG plan with no base cost – rates apply per usage of each feature.
//   const paygPlan = {
//     package_id: "payg",
//     name: "Pay as You Go Service",
//     rates: {
//       add_customers: 0.06,
//       add_office_users: 3.5,
//       add_field_users: 2.5,
//       work_order_creation: 0.20,
//       work_order_execution: 0.25,
//     }
//   };

//   return (
//     <>
//       <Header />
//       <div className="main-header-box">
//         <div className="mt-4 pages-box">
//           <Container fluid className="py-5 package-container">
            
//             {/* Subscription Packages Section */}
//             <div className="subscription-section mb-5">
//               <div className="section-heading text-center mb-4">
//                 <h2 className="heading-title">Subscription Packages</h2>
//                 <hr className="heading-underline" />
//                 <p className="heading-subtitle">
//                   Choose a bundled package to enjoy comprehensive services. If you exceed your package limits, PAYG rates will apply.
//                 </p>
//               </div>
//               <Row className="justify-content-center">
//                 {subscriptionPackages.map((pkg) => (
//                   <Col key={pkg.package_id} xs={12} md={6} lg={4} className="mb-4">
//                     <Card className={`package-card package-${pkg.package_id}`}>
//                       <Card.Header className="text-center">
//                         <h3 className="package-title">{pkg.name}</h3>
//                         <h2 className="package-price">
//                           ${pkg.cost_per_month} <small>/month</small>
//                         </h2>
//                       </Card.Header>
//                       <Card.Body>
//                         <Table className="package-table" bordered hover size="sm">
//                           <thead>
//                             <tr className="text-center">
//                               <th>Feature</th>
//                               <th>Limit</th>
//                               <th>PAYG Rate</th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {Object.entries(pkg.features).map(([feature, limit]) => (
//                               <tr key={feature}>
//                                 <td>{feature.replace(/_/g, " ")}</td>
//                                 <td>{limit}</td>
//                                 <td>${pkg.payg_rates[feature]}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </Table>
//                       </Card.Body>
//                       <Card.Footer className="text-center">
//                         <Badge bg={pkg.payg ? "success" : "danger"} className="package-badge">
//                           {pkg.payg ? (
//                             <>
//                               <Check2Circle /> PAYG Available
//                             </>
//                           ) : (
//                             <>
//                               <XCircle /> No PAYG
//                             </>
//                           )}
//                         </Badge>
//                       </Card.Footer>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//             </div>

//             {/* Pay as You Go Service Section */}
//             <div className="payg-section">
//               <div className="section-heading text-center mb-4">
//                 <h2 className="heading-title">Pay as You Go Service</h2>
//                 <hr className="heading-underline" />
//                 <p className="heading-subtitle">
//                   Pay for each usage—charges are applied per feature as you go.
//                 </p>
//               </div>
//               <Row className="justify-content-center">
//                 <Col xs={12} md={6} lg={4} className="mb-4">
//                   <Card className="package-card package-payg">
//                     <Card.Header className="text-center">
//                       <h3 className="package-title">{paygPlan.name}</h3>
//                       <h2 className="package-price">
//                         <small>Per Usage Charges</small>
//                       </h2>
//                     </Card.Header>
//                     <Card.Body>
//                       <Table className="package-table" bordered hover size="sm">
//                         <thead>
//                           <tr className="text-center">
//                             <th>Feature</th>
//                             <th>Rate (per usage)</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {Object.entries(paygPlan.rates).map(([feature, rate]) => (
//                             <tr key={feature}>
//                               <td>{feature.replace(/_/g, " ")}</td>
//                               <td>${rate}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                       <p className="text-center mt-3">
//                         If you choose the Pay as You Go service, you will be charged per usage for each feature as listed above.
//                       </p>
//                     </Card.Body>
//                     <Card.Footer className="text-center">
//                       <Badge bg="info" className="package-badge">
//                         <Check2Circle /> Flexible PAYG
//                       </Badge>
//                     </Card.Footer>
//                   </Card>
//                 </Col>
//               </Row>
//             </div>

//           </Container>
//         </div>
//       </div>
//     </>
//   )
// }

// export default PackagesList;
  
// import { Card, Container, Row, Col, Badge, Table } from "react-bootstrap"
// import { Check2Circle, XCircle, Star } from "react-bootstrap-icons"
// import Header from "../../../../Components/Header/Header"

// const PackagesList = () => {
//   // Subscription packages (bundled)
//   const subscriptionPackages = [
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

//   // PAYG plan with no base cost – rates apply per usage of each feature.
//   const paygPlan = {
//     package_id: "payg",
//     name: "Pay as You Go Service",
//     rates: {
//       add_customers: 0.06,
//       add_office_users: 3.5,
//       add_field_users: 2.5,
//       work_order_creation: 0.2,
//       work_order_execution: 0.25,
//     },
//   }

//   return (
//     <>
//       <Header />
//       <div className="main-header-box">
//      <div className="mt-4 pages-box">
//       <Container fluid className="py-5 bg-light">
//         <Row className="justify-content-center">
//           <Col xs={12} lg={10}>
//             <h1 className="text-center mb-5 display-4 fw-bold text-primary">Choose Your Package</h1>

//             {/* Subscription Packages Section */}
//             <section className="mb-5">
//               <h2 className="text-center mb-4">Subscription Packages</h2>
//               <p className="text-center mb-5 text-muted">
//                 Choose a bundled package to enjoy comprehensive services. If you exceed your package limits, PAYG rates
//                 will apply.
//               </p>
//               <Row className="justify-content-center">
//                 {subscriptionPackages.map((pkg, index) => (
//                   <Col key={pkg.package_id} xs={12} md={6} lg={4} className="mb-4">
//                     <Card className={`h-100 shadow-sm ${index === 1 ? "border-primary" : ""}`}>
//                       <Card.Header className={`text-center py-3 ${index === 1 ? "bg-primary text-white" : ""}`}>
//                         <h3 className="package-title mb-0">
//                           {index === 1 && <Star className="me-2" />}
//                           {pkg.name}
//                         </h3>
//                       </Card.Header>
//                       <Card.Body className="d-flex flex-column">
//                         <h2 className="package-price text-center mb-4">
//                           ${pkg.cost_per_month} <small className="text-muted">/month</small>
//                         </h2>
//                         <Table className="package-table mb-4" borderless size="sm">
//                           <tbody>
//                             {Object.entries(pkg.features).map(([feature, limit]) => (
//                               <tr key={feature}>
//                                 <td>{feature.replace(/_/g, " ")}</td>
//                                 <td className="text-end fw-bold">{limit}</td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </Table>
//                         <div className="mt-auto">
//                           <h5 className="text-center mb-3">PAYG Rates</h5>
//                           <Table className="package-table" borderless size="sm">
//                             <tbody>
//                               {Object.entries(pkg.payg_rates).map(([feature, rate]) => (
//                                 <tr key={feature}>
//                                   <td>{feature.replace(/_/g, " ")}</td>
//                                   <td className="text-end">${rate}</td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </Table>
//                         </div>
//                       </Card.Body>
//                       <Card.Footer className="text-center bg-white">
//                         <Badge bg={pkg.payg ? "success" : "danger"} className="package-badge">
//                           {pkg.payg ? (
//                             <>
//                               <Check2Circle className="me-1" /> PAYG Available
//                             </>
//                           ) : (
//                             <>
//                               <XCircle className="me-1" /> No PAYG
//                             </>
//                           )}
//                         </Badge>
//                       </Card.Footer>
//                     </Card>
//                   </Col>
//                 ))}
//               </Row>
//             </section>

//             {/* Pay as You Go Service Section */}
//             <section>
//               <h2 className="text-center mb-4">Pay as You Go Service</h2>
//               <p className="text-center mb-5 text-muted">
//                 Pay for each usage—charges are applied per feature as you go.
//               </p>
//               <Row className="justify-content-center">
//                 <Col xs={12} md={8} lg={6}>
//                   <Card className="shadow-sm">
//                     <Card.Header className="text-center py-3 bg-info text-white">
//                       <h3 className="package-title mb-0">{paygPlan.name}</h3>
//                     </Card.Header>
//                     <Card.Body>
//                       <Table className="package-table" hover size="sm">
//                         <thead>
//                           <tr>
//                             <th>Feature</th>
//                             <th className="text-end">Rate (per usage)</th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {Object.entries(paygPlan.rates).map(([feature, rate]) => (
//                             <tr key={feature}>
//                               <td>{feature.replace(/_/g, " ")}</td>
//                               <td className="text-end">${rate}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </Table>
//                       <p className="text-center mt-4 mb-0 text-muted">
//                         If you choose the Pay as You Go service, you will be charged per usage for each feature as
//                         listed above.
//                       </p>
//                     </Card.Body>
//                     <Card.Footer className="text-center bg-white">
//                       <Badge bg="info" className="package-badge">
//                         <Check2Circle className="me-1" /> Flexible PAYG
//                       </Badge>
//                     </Card.Footer>
//                   </Card>
//                 </Col>
//               </Row>
//             </section>
//           </Col>
//         </Row>
//       </Container>
//       </div>
//       </div>
//     </>
//   )
// }

// export default PackagesList

import { Card, Container, Row, Col, Badge, Table } from "react-bootstrap"
import { Check2Circle, XCircle, Star } from "react-bootstrap-icons"
import Header from "../../../../Components/Header/Header"

const PackagesList = () => {
  // Subscription packages (bundled)
  const role=localStorage.getItem('Role')
  const subscriptionPackages = [
    {
      package_id: "default",
      name: "Default",
      cost_per_month: 0,
      features: {
        add_customers: 2,
        add_office_users: 1,
        add_field_users: 5,
        work_order_creation: 5,
        work_order_execution: 5,
      },
      payg: false,
      payg_rates: {}
    },
    {
      package_id: "Basic",
      name: "Basic",
      cost_per_month: 50,
      features: {
        add_customers: 100,
        add_office_users: 5,
        add_field_users: 20,
        work_order_creation: 100,
        work_order_execution: 100,
      },
      payg: true,
      payg_rates: {
        add_customers: 0.05,
        add_office_users: 3,
        add_field_users: 2,
        work_order_creation: 0.15,
        work_order_execution: 0.2,
      },
    },
    {
      package_id: "Premium",
      name: "Premium",
      cost_per_month: 150,
      features: {
        add_customers: 500,
        add_office_users: 20,
        add_field_users: 100,
        work_order_creation: 500,
        work_order_execution: 500,
      },
      payg: true,
      payg_rates: {
        add_customers: 0.02,
        add_office_users: 2,
        add_field_users: 1,
        work_order_creation: 0.1,
        work_order_execution: 0.15,
      },
    },
    {
      package_id: "Enterprise",
      name: "Enterprise",
      cost_per_month: 300,
      features: {
        add_customers: 1000,
        add_office_users: 50,
        add_field_users: 300,
        work_order_creation: 1000,
        work_order_execution: 1000,
      },
      payg: true,
      payg_rates: {
        add_customers: 0.01,
        add_office_users: 1.5,
        add_field_users: 0.75,
        work_order_creation: 0.05,
        work_order_execution: 0.1,
      },
    },

  ]

  // PAYG plan with no base cost – rates apply per usage of each feature.
  const paygPlan = {
    package_id: "payg",
    name: "Pay as You Go Service",
    rates: {
      add_customers: 0.06,
      add_office_users: 3.5,
      add_field_users: 2.5,
      work_order_creation: 0.2,
      work_order_execution: 0.25,
    },
  }

  return (
    <>
      <Header />
      <div className="main-header-box">
        <div className="mt-4 pages-box">
          <Container fluid className="py-5 bg-light">
            <Row className="justify-content-center">
              <Col xs={12} lg={10}>
                <h1 className="text-center mb-5 display-4 fw-bold text-primary">{role=='SuperAdmin'?`Plans n' Packages`:'Choose Your Package'}</h1>

                {/* Subscription Packages Section */}
                <section className="mb-5">
                  <h2 className="text-center mb-4">Subscription Packages</h2>
                  <p className="text-center mb-5 text-muted">
                    Choose a bundled package to enjoy comprehensive services. If you exceed your package limits, PAYG rates will apply.
                  </p>
                  <Row className="justify-content-center">
                    {subscriptionPackages.map((pkg, index) => (
                      <Col key={pkg.package_id} xs={12} md={6} lg={6} className="mb-4">
                        <Card className={`h-100 shadow-sm ${index === 3 ? "border-primary" : ""}`}>
                          <Card.Header className={`text-center py-3 ${index === 3 ? "bg-primary text-white" : ""}`}>
                            <h3 className="package-title mb-0">
                              {index === 3 && <Star className="me-2" />}
                              {pkg.name}
                            </h3>
                          </Card.Header>
                          <Card.Body className="d-flex flex-column">
                            <h2 className="package-price text-center mb-4">
                              ${pkg.cost_per_month} <small className="text-muted">/month</small>
                            </h2>
                            <Table className="package-table mb-4" borderless size="sm">
                              <tbody>
                                {Object.entries(pkg.features).map(([feature, limit]) => (
                                  <tr key={feature}>
                                    <td className="text-capitalize">{feature.replace(/_/g, " ")}</td>
                                    <td className="text-end fw-bold">{limit}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </Table>
                            {/* <div className="mt-auto">
                              <h5 className="text-center mb-3">PAYG Rates</h5>
                              <Table className="package-table" borderless size="sm">
                                <tbody>
                                  {pkg.payg ? (
                                    Object.entries(pkg.payg_rates).map(([feature, rate]) => (
                                      <tr key={feature}>
                                        <td>{feature.replace(/_/g, " ")}</td>
                                        <td className="text-end">${rate}</td>
                                      </tr>
                                    ))
                                  ) : (
                                    <tr>
                                      <td colSpan="2" className="text-center">No PAYG</td>
                                    </tr>
                                  )}
                                </tbody>
                              </Table>
                            </div> */}
                          </Card.Body>
                          {/* <Card.Footer className="text-center bg-white">
                            <Badge bg={pkg.payg ? "success" : "danger"} className="package-badge">
                              {pkg.payg ? (
                                <>
                                  <Check2Circle className="me-1" /> PAYG Available
                                </>
                              ) : (
                                <>
                                  <XCircle className="me-1" /> No PAYG
                                </>
                              )}
                            </Badge>
                          </Card.Footer> */}
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </section>

                {/* Pay as You Go Service Section */}
                <section>
                  <h2 className="text-center mb-4">Pay as You Go Service</h2>
                  <p className="text-center mb-5 text-muted">
                    Pay for each usage—charges are applied per feature as you go.
                  </p>
                  <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                      <Card className="shadow-sm">
                        <Card.Header className="text-center py-3 bg-info text-white">
                          <h3 className="package-title mb-0">{paygPlan.name}</h3>
                        </Card.Header>
                        <Card.Body>
                          <Table className="package-table" hover size="sm">
                            <thead>
                              <tr>
                                <th>Feature</th>
                                <th className="text-end">Rate (per usage)</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(paygPlan.rates).map(([feature, rate]) => (
                                <tr key={feature}>
                                  <td>{feature.replace(/_/g, " ")}</td>
                                  <td className="text-end">${rate}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          <p className="text-center mt-4 mb-0 text-muted">
                            If you choose the Pay as You Go service, you will be charged per usage for each feature as listed above.
                          </p>
                        </Card.Body>
                        <Card.Footer className="text-center bg-white">
                          <Badge bg="info" className="package-badge">
                            <Check2Circle className="me-1" /> Flexible PAYG
                          </Badge>
                        </Card.Footer>
                      </Card>
                    </Col>
                  </Row>
                </section>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  )
}

export default PackagesList

