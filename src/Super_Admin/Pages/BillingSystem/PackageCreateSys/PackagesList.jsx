// import { Card, Container, Row, Col, Badge, Table } from "react-bootstrap"
// import { Check2Circle, XCircle, Star } from "react-bootstrap-icons"
// import Header from "../../../../Components/Header/Header"

// const PackagesList = () => {
//   // Subscription packages (bundled)
//   const role=localStorage.getItem('Role')
//   const subscriptionPackages = [
//     {
//       package_id: "default",
//       name: "Default",
//       cost_per_month: 0,
//       features: {
//         add_customers: 2,
//         add_office_users: 1,
//         add_field_users: 5,
//         work_order_creation: 5,
//         work_order_execution: 5,
//       },
//       payg: false,
//       payg_rates: {}
//     },
//     {
//       package_id: "Basic",
//       name: "Basic",
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
//       package_id: "Premium",
//       name: "Premium",
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
//       package_id: "Enterprise",
//       name: "Enterprise",
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
//         <div className="mt-4 pages-box">
//           <Container fluid className="py-5 bg-light">
//             <Row className="justify-content-center">
//               <Col xs={12} lg={10}>
//                 <h1 className="text-center mb-5 display-4 fw-bold text-primary">{role=='SuperAdmin'?`Plans n' Packages`:'Choose Your Package'}</h1>

//                 {/* Subscription Packages Section */}
//                 <section className="mb-5">
//                   <h2 className="text-center mb-4">Subscription Packages</h2>
//                   <p className="text-center mb-5 text-muted">
//                     Choose a bundled package to enjoy comprehensive services. If you exceed your package limits, PAYG rates will apply.
//                   </p>
//                   <Row className="justify-content-center">
//                     {subscriptionPackages.map((pkg, index) => (
//                       <Col key={pkg.package_id} xs={12} md={6} lg={6} className="mb-4">
//                         <Card className={`h-100 shadow-sm ${index === 3 ? "border-primary" : ""}`}>
//                           <Card.Header className={`text-center py-3 ${index === 3 ? "bg-primary text-white" : ""}`}>
//                             <h3 className="package-title mb-0">
//                               {index === 3 && <Star className="me-2" />}
//                               {pkg.name}
//                             </h3>
//                           </Card.Header>
//                           <Card.Body className="d-flex flex-column">
//                             <h2 className="package-price text-center mb-4">
//                               ${pkg.cost_per_month} <small className="text-muted">/month</small>
//                             </h2>
//                             <Table className="package-table mb-4" borderless size="sm">
//                               <tbody>
//                                 {Object.entries(pkg.features).map(([feature, limit]) => (
//                                   <tr key={feature}>
//                                     <td className="text-capitalize">{feature.replace(/_/g, " ")}</td>
//                                     <td className="text-end fw-bold">{limit}</td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </Table>
//                             {/* <div className="mt-auto">
//                               <h5 className="text-center mb-3">PAYG Rates</h5>
//                               <Table className="package-table" borderless size="sm">
//                                 <tbody>
//                                   {pkg.payg ? (
//                                     Object.entries(pkg.payg_rates).map(([feature, rate]) => (
//                                       <tr key={feature}>
//                                         <td>{feature.replace(/_/g, " ")}</td>
//                                         <td className="text-end">${rate}</td>
//                                       </tr>
//                                     ))
//                                   ) : (
//                                     <tr>
//                                       <td colSpan="2" className="text-center">No PAYG</td>
//                                     </tr>
//                                   )}
//                                 </tbody>
//                               </Table>
//                             </div> */}
//                           </Card.Body>
//                           {/* <Card.Footer className="text-center bg-white">
//                             <Badge bg={pkg.payg ? "success" : "danger"} className="package-badge">
//                               {pkg.payg ? (
//                                 <>
//                                   <Check2Circle className="me-1" /> PAYG Available
//                                 </>
//                               ) : (
//                                 <>
//                                   <XCircle className="me-1" /> No PAYG
//                                 </>
//                               )}
//                             </Badge>
//                           </Card.Footer> */}
//                         </Card>
//                       </Col>
//                     ))}
//                   </Row>
//                 </section>

//                 {/* Pay as You Go Service Section */}
//                 <section>
//                   <h2 className="text-center mb-4">Pay as You Go Service</h2>
//                   <p className="text-center mb-5 text-muted">
//                     Pay for each usage—charges are applied per feature as you go.
//                   </p>
//                   <Row className="justify-content-center">
//                     <Col xs={12} md={8} lg={6}>
//                       <Card className="shadow-sm">
//                         <Card.Header className="text-center py-3 bg-info text-white">
//                           <h3 className="package-title mb-0">{paygPlan.name}</h3>
//                         </Card.Header>
//                         <Card.Body>
//                           <Table className="package-table" hover size="sm">
//                             <thead>
//                               <tr>
//                                 <th>Feature</th>
//                                 <th className="text-end">Rate (per usage)</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {Object.entries(paygPlan.rates).map(([feature, rate]) => (
//                                 <tr key={feature}>
//                                   <td>{feature.replace(/_/g, " ")}</td>
//                                   <td className="text-end">${rate}</td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </Table>
//                           <p className="text-center mt-4 mb-0 text-muted">
//                             If you choose the Pay as You Go service, you will be charged per usage for each feature as listed above.
//                           </p>
//                         </Card.Body>
//                         <Card.Footer className="text-center bg-white">
//                           <Badge bg="info" className="package-badge">
//                             <Check2Circle className="me-1" /> Flexible PAYG
//                           </Badge>
//                         </Card.Footer>
//                       </Card>
//                     </Col>
//                   </Row>
//                 </section>
//               </Col>
//             </Row>
//           </Container>
//         </div>
//       </div>
//     </>
//   )
// }

// export default PackagesList

import {
  Card,
  Container,
  Row,
  Col,
  Badge,
  Table,
  Button,
} from "react-bootstrap";
import { Check2Circle, XCircle, StarFill } from "react-bootstrap-icons";
import Header from "../../../../Components/Header/Header";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  convertToSelectedCurrency,
  getSubscriptionPackagesList,
  getUsageLimit,
} from "../../../../lib/store";
import LoadingComp from "../../../../Components/Loader/LoadingComp";
import { useNavigate } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import { CheckCircleFill } from "react-bootstrap-icons";
const PackagesList = () => {
  const role = localStorage.getItem("Role");
  const token = localStorage.getItem("UserToken");
  const [subscriptionPackages, setSubscriptionPackages] = useState([]);
  const currencyCode = localStorage.getItem("currencyCode");
  const navigate = useNavigate();
  const decoded = jwtDecode(token);
  // console.log('decoded',decoded);
  const [loading, setLoading] = useState(true);
  const [currencyData, setCurrencyData] = useState(null);
  const [currentPlan, setCurrentPlan] = useState([]);
  const [defaultPlan, setDefaultPlan] = useState({
    add_customers: 0,
    add_office_users: 0,
    add_field_users: 0,
    work_order_creation: 0,
    work_order_execution: 0
  });
  const [paygPlan, setpaygPlan] = useState({
    packageType:"",
    package_id: "",
    name: "",
    rates: {},
  });
  // console.log('defaultPlan',defaultPlan,subscriptionPackages)
  // const [paygPlan, setPaygPlan] = useState(null);
  const { t, i18n } = useTranslation();

  const fetchSubscriptionPackages = async () => {
    try {
      const response = await getSubscriptionPackagesList(token);
    const response2 = await getUsageLimit(token);
    if (response2.data.status && response2.data.data.length > 0) {
     
          // console.log('dsdsdsdsdsdsdsdsds',response2.data);
          setDefaultPlan({
          add_customers:response2.data?.data[0]?.customerCreation|| 0,
          add_office_users: response2.data?.data[0]?.officeUserCreation|| 0,
          add_field_users: response2.data?.data[0]?.fieldUserCreation || 0,
          work_order_creation: response2.data?.data[0]?.workOrderCreation|| 0,
          work_order_execution: response2.data?.data[0]?.workOrderExecution || 0
        });
          // setDefaultPlan(response2.data)
    }
      // console.log(response);
      const sortedPackages = response.packages
        ? [...response.packages]
            .filter((pkg) => pkg.packageType !== "payg") // Exclude 'payg' packages
            .sort((a, b) => a.cost_per_month - b.cost_per_month)
        : [];
      setSubscriptionPackages(sortedPackages);

      const paygPlan = response.packages.filter(
        (pkg) => pkg.packageType === "payg"
      );
      // console.log("Payg Plan", paygPlan);
      setpaygPlan({
        packageType:paygPlan[0].packageType||"payg",
        package_id: paygPlan[0].package_id || 0,
        name: paygPlan[0].name || "",
        rates: paygPlan[0].features || 0 || {},
      });
      setLoading(false);
      if (decoded?.role != "SuperAdmin" && decoded?.package_id) {
        const userPackage = response.packages.find(
          (pkg) => pkg.package_id === decoded.package_id
        );
        if (userPackage) setCurrentPlan(userPackage);
      }
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (decoded?.role != "SuperAdmin" && currencyCode) {
      // console.log("countryyyyyyyyyyyy",country)
      convertToSelectedCurrency(null, currencyCode, token) // countryname,currency code, token
        .then((data) => {
          // console.log("dataaaaaaa",data)
          setCurrencyData(data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, []);

  useEffect(() => {
    if (token) {
      // console.log("Token hit", token);
      fetchSubscriptionPackages();
    }
  }, [token]);

  // const subscriptionPackages = [
  //   {
  //     package_id: "default",
  //     name: "Default",
  //     cost_per_month: 0,
  //     features: { add_customers: 2, add_office_users: 1, add_field_users: 5, work_order_creation: 5, work_order_execution: 5 },
  //     payg: false,
  //     payg_rates: {},
  //   },
  //   {
  //     package_id: "Basic",
  //     name: "Basic",
  //     cost_per_month: 50,
  //     features: { add_customers: 100, add_office_users: 5, add_field_users: 20, work_order_creation: 100, work_order_execution: 100 },
  //     payg: true,
  //     payg_rates: { add_customers: 0.05, add_office_users: 3, add_field_users: 2, work_order_creation: 0.15, work_order_execution: 0.2 },
  //   },
  //   {
  //     package_id: "Premium",
  //     name: "Premium",
  //     cost_per_month: 150,
  //     features: { add_customers: 500, add_office_users: 20, add_field_users: 100, work_order_creation: 500, work_order_execution: 500 },
  //     payg: true,
  //     payg_rates: { add_customers: 0.02, add_office_users: 2, add_field_users: 1, work_order_creation: 0.1, work_order_execution: 0.15 },
  //   },
  //   {
  //     package_id: "Enterprise",
  //     name: "Enterprise",
  //     cost_per_month: 300,
  //     features: { add_customers: 1000, add_office_users: 50, add_field_users: 300, work_order_creation: 1000, work_order_execution: 1000 },
  //     payg: true,
  //     payg_rates: { add_customers: 0.01, add_office_users: 1.5, add_field_users: 0.75, work_order_creation: 0.05, work_order_execution: 0.1 },
  //   },
  // ];

  // const paygPlan = {
  //   package_id: "payg",
  //   name: "Pay as You Go",
  //   rates: { add_customers: 0.06, add_office_users: 3.5, add_field_users: 2.5, work_order_creation: 0.2, work_order_execution: 0.25 },
  // };
  const featureMapping = {
    add_customers: "Add Customers",
    add_office_users: "Add Office Users",
    add_field_users: "Add Field Users",
    work_order_creation: "Work Order Creation",
    work_order_execution: "Work Order Execution",
  };
  const subscriptionPlanMapping = {
    default: "Default",
    basic: "Basic",
    premium: "Premium",
    enterprise: "Enterprise",
  };
  const paygPlanMapping = {
    payg: "Pay as You Go",
  };
  const handleEdit = async (packageData) => {
    // update plan
    // call update plan API
    // console.log('edit plan',packageData);
   
      navigate("/billings/package-edit", { state: { packageData } });

    
  };

  const handleCreateNewPlan = () => {
    if (subscriptionPackages) navigate("/billings/package-creation");
  };
// console.log('create new plan', currentPlan);
  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          {loading ? (
            <LoadingComp />
          ) : (
            <Container fluid className="py-1">
              {decoded?.role === "SuperAdmin" && (
                <Button onClick={handleCreateNewPlan}>
                  {t("Create A New plan")}
                </Button>
              )}

              {/* current plan if company admin */}
              {decoded?.role !== "SuperAdmin" && Object.entries(currentPlan)?.length>0 &&
               (
                <Row className="justify-content-center">
                  <Col xs={12} lg={11}>
                    <section className="mb-5">
                      <h1
                        className="text-center mb-3 fw-bold"
                        style={{ color: "#2c3e50", fontSize: "2.5rem" }}
                      >
                        {t("Your Current Plan")}
                      </h1>
                      <p
                        className="text-center mb-5 text-muted"
                        style={{
                          maxWidth: "700px",
                          minWidth: "700px",
                          margin: "0 auto",
                        }}
                      >
                        {t(
                          "Here’s the plan you’re currently subscribed to. Manage or upgrade anytime."
                        )}
                      </p>
                      <Row className="justify-content-center g-4">
                        <Col xs={12} md={6} lg={4} className="mb-4">
                          <Card
                            className="h-100 shadow-lg border-success"
                            style={{
                              borderRadius: "15px",
                              overflow: "hidden",
                              transition: "transform 0.3s",
                            }}
                          >
                            <Card.Header
                              className="text-center bg-success text-white py-4"
                              style={{ borderBottom: "none" }}
                            >
                              <h3 className="mb-0 fw-bold d-flex align-items-center justify-content-center">
                                <CheckCircleFill
                                  className="me-2"
                                  style={{ color: "#fff" }}
                                />
                                {t(
                                  subscriptionPlanMapping[
                                    currentPlan?.name?.toLocaleLowerCase()
                                  ] || currentPlan?.name
                                )}
                              </h3>
                              <Badge bg="light" text="dark" className="mt-2">
                                {t("Active")}
                              </Badge>
                            </Card.Header>
                            <Card.Body className="d-flex flex-column p-4">
                              <h2
                                className="text-center mb-4 fw-bold"
                                style={{ color: "#2980b9" }}
                              >
                                {getSymbolFromCurrency(
                                  currencyData?.target_currency
                                ) || "$"}
                                {currencyData?.exchange_rate
                                  ? (
                                      currencyData?.exchange_rate *
                                      currentPlan?.cost_per_month
                                    ).toFixed(2)
                                  : currentPlan?.cost_per_month}{" "}
                                <small
                                  style={{
                                    fontSize: "0.7rem",
                                    color: "#7f8c8d",
                                  }}
                                >
                                  /mo
                                </small>
                              </h2>
                              <Table className="mb-4" borderless size="sm">
                                <tbody>
                                  {currentPlan?.features &&
                                    Object.entries(currentPlan.features).map(
                                      ([feature, limit]) => (
                                        <tr
                                          key={feature}
                                          style={{
                                            borderBottom: "1px solid #ecf0f1",
                                          }}
                                        >
                                          <td
                                            className="text-capitalize py-2"
                                            style={{ color: "#34495e" }}
                                          >
                                            {t(
                                              featureMapping[feature] ||
                                                feature.replace(/_/g, " ")
                                            )}
                                          </td>
                                          <td
                                            className="text-end fw-semibold py-2"
                                            style={{ color: "#2c3e50" }}
                                          >
                                            {limit}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                </tbody>
                              </Table>
                              {/* <Button
                        variant="outline-success"
                        className="mt-auto w-100 fw-semibold"
                        style={{ borderRadius: "8px", padding: "10px" }}
                        // onClick={() => handleManagePlan(currentPlan)}
                      >
                        {t("Manage Plan")}
                      </Button> */}
                            </Card.Body>
                          </Card>
                        </Col>
                      </Row>
                    </section>
                  </Col>
                </Row>
                  
              )}
              {decoded?.role !== "SuperAdmin" && Object.entries(currentPlan)?.length==0 &&
               (
                <Row className="justify-content-center">
                  <Col xs={12} lg={11}>
                    <section className="mb-5">
                      <h5
                        className="text-center mb-3 fw-bold text-danger"
                        // style={{ color: "#2c3e50", fontSize: "2.5rem" }}
                      >
                       ( {t("You don't have any active plan")} )
                      </h5>
                      {/* <p
                        className="text-center mb-5 text-muted"
                        style={{
                          maxWidth: "700px",
                          minWidth: "700px",
                          margin: "0 auto",
                        }}
                      >
                        {t(
                          "Explore our plans to find the perfect fit for your needs."
                        )}
                      </p> */}
                      </section>
                      </Col>
                      </Row>
               )}


              {/* Separation Line */}
              {decoded?.role !== "SuperAdmin" && Object.entries(currentPlan)?.length>0 &&
              <hr
                  style={{
                    border: "none",
                    borderTop: "2px solid black",
                    margin: "2rem auto",
                    width: "80%"
                  }}
              />
                }


              <Row className="justify-content-center">
                {Object.keys(paygPlan.rates).length > 0 ||
                subscriptionPackages.length > 0 ? (
                  <Col xs={12} lg={11}>
                    <h1
                      className="text-center mb-3 fw-bold"
                      style={{ color: "#2c3e50", fontSize: "2.5rem" }}
                    >
                    
                      {role === "SuperAdmin"
                      ? t("Plans & Packages")
                      :Object.entries(currentPlan).length>0
                          ? t("Other plans you can checkout")
                          : t("Choose Your Perfect Plan")}
                    </h1>

                    {/* Subscription Packages Section */}
                    {subscriptionPackages.length > 0 && (
                      <section className="mb-5">
                        <h2
                          className="text-center fw-semibold mb-3"
                          style={{ color: "#34495e", fontSize: "1.75rem" }}
                        >
                          {t("Subscription Packages")}
                        </h2>
                        <p
                          className="text-center mb-5 text-muted"
                          style={{ maxWidth: "700px", margin: "0 auto" }}
                        >
                          {t("Select A Plan Tailored To Your Needs .")}{" "}
                          {/* {t(
                        "Select A Plan Tailored To Your Needs . Exceed Your Limits ? PAYG Rates Kick In Seamlessly ."
                      )}{" "} */}
                        </p>
                        <Row className="justify-content-center g-4">
                          {subscriptionPackages?.map((pkg, index) => (
                            <Col
                              key={pkg.package_id}
                              xs={12}
                              md={6}
                              lg={3}
                              className="mb-4"
                            >
                              <Card
                                className={`h-100 shadow-lg ${
                                  index === subscriptionPackages.length - 2
                                    ? "border-primary scale-on-hover"
                                    : "border-light mb-2"
                                }`}
                                style={{
                                  borderRadius: "15px",
                                  overflow: "hidden",
                                  transition: "transform 0.3s",
                                }}
                              >
                                <Card.Header
                                  className={`text-center  ${
                                    index === subscriptionPackages.length - 2
                                      ? "bg-primary text-white py-3"
                                      : "bg-light text-dark py-4"
                                  }`}
                                  style={{ borderBottom: "none" }}
                                >
                                  <h3 className="mb-0 fw-bold d-flex align-items-center justify-content-center">
                                    {index ===
                                      subscriptionPackages.length - 2 && (
                                      <StarFill
                                        className="me-2"
                                        style={{ color: "#ffd700" }}
                                      />
                                    )}

                                    {t(
                                      subscriptionPlanMapping[
                                        pkg?.name?.toLocaleLowerCase()
                                      ] || pkg?.name
                                    )}
                                    {/* {pkg.name} */}
                                  </h3>
                                  {index ===
                                    subscriptionPackages.length - 2 && (
                                    <Badge
                                      bg="warning"
                                      text="dark"
                                      className="mt-2"
                                    >
                                      {t("Most Popular")}
                                    </Badge>
                                  )}
                                </Card.Header>
                                <Card.Body className="d-flex flex-column p-4">
                                  <h2
                                    className="text-center mb-4 fw-bold"
                                    style={{ color: "#2980b9" }}
                                  >
                                    {getSymbolFromCurrency(
                                      currencyData?.target_currency
                                    ) || "$"}
                                    {currencyData?.exchange_rate
                                      ? (
                                          currencyData?.exchange_rate *
                                          pkg.cost_per_month
                                        ).toFixed(2)
                                      : pkg.cost_per_month}{" "}
                                    <small
                                      style={{
                                        fontSize: "0.7rem",
                                        color: "#7f8c8d",
                                      }}
                                    >
                                     {pkg?.name?.toLowerCase() != "default" && '/mo'}
                                    </small>
                                  </h2>
                                  <Table className="mb-4" borderless size="sm">
                                    <tbody>
                                     
                                      {Object.entries(pkg.features).map(
                                        ([feature, limit]) => (
                                          <tr
                                            key={feature}
                                            style={{
                                              borderBottom: "1px solid #ecf0f1",
                                            }}
                                          >
                                            <td
                                              className="text-capitalize py-2"
                                              style={{ color: "#34495e" }}
                                            >
                                              {/* {feature.replace(/_/g, " ")} */}
                                              {t(
                                                featureMapping[feature] ||
                                                  feature.replace(/_/g, " ")
                                              )}
                                            </td>
                                            {/* { feature} */}
                                            <td
                                              className="text-end fw-semibold py-2 "
                                              style={{ color: "#2c3e50" }}
                                            >
                                               {/* {pkg?.name=='Default'? defaultPlan.feature :limit}
                                               {pkg?.name?.toLowerCase() === "default"
                                                  ? defaultPlan?.[feature] ?? "N/A" */}
                                                  { limit}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                    </tbody>
                                  </Table>
                                  {decoded?.role === "SuperAdmin"  && (
                                    <Button
                                      variant={
                                        index === 2
                                          ? "primary"
                                          : "outline-primary"
                                      }
                                      className="mt-auto w-100 fw-semibold"
                                      style={{
                                        borderRadius: "8px",
                                        padding: "10px",
                                      }}
                                      onClick={() => handleEdit(pkg)}
                                    >
                                      {t("Edit")}
                                    </Button>
                                  )}
                                </Card.Body>
                                {/* <Card.Footer className="text-center py-3 bg-white">
                          <Badge
                            bg={pkg.payg ? "success" : "danger"}
                            className="fw-normal"
                            style={{ padding: "6px 10px", fontSize: "0.9rem" }}
                          >
                            {pkg.payg ? (
                              <>
                                <Check2Circle className="me-1" /> PAYG Enabled
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
                    )}

                    {/* Pay as You Go Section */}
                    {Object?.entries(paygPlan?.rates).length > 0 && (
                      <section>
                        <h2
                          className="text-center fw-semibold mb-3"
                          style={{ color: "#34495e", fontSize: "1.75rem" }}
                        >
                          {" "}
                          {t("Pay As You Go")}
                        </h2>
                        <p
                          className="text-center mb-5 text-muted"
                          style={{ maxWidth: "700px", margin: "0 auto" }}
                        >
                          {t(
                            "Flexible Pricing—Pay Only For What You Use , When You Use It ."
                          )}
                        </p>
                        <Row className="justify-content-center">
                          <Col xs={12} md={8} lg={5}>
                            <Card
                              className="shadow-lg"
                              style={{
                                borderRadius: "15px",
                                overflow: "hidden",
                              }}
                            >
                              <Card.Header className="text-center py-4 bg-info text-white">
                                <h3 className="mb-0 fw-bold">
                                  {t(
                                    paygPlanMapping[
                                      paygPlan?.name?.toLocaleLowerCase()
                                    ] || paygPlan?.name
                                  )}
                                  {/* {paygPlan.name} */}
                                </h3>
                              </Card.Header>
                              <Card.Body className="p-4">
                                <Table
                                  className="mb-4"
                                  hover
                                  size="sm"
                                  style={{
                                    borderCollapse: "separate",
                                    borderSpacing: "0 5px",
                                  }}
                                >
                                  <thead>
                                    <tr style={{ backgroundColor: "#ecf0f1" }}>
                                      <th
                                        className="py-2"
                                        style={{ color: "#34495e" }}
                                      >
                                        {t("Feature")}
                                      </th>
                                      <th
                                        className="text-end py-2"
                                        style={{ color: "#34495e" }}
                                      >
                                        {t("Rate ($)")}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object?.entries(paygPlan?.rates)?.map(
                                      ([feature, rate]) => (
                                        <tr key={feature}>
                                          <td
                                            className="text-capitalize py-2"
                                            style={{ color: "#2c3e50" }}
                                          >
                                            {/* {feature.replace(/_/g, " ")} */}
                                            {t(
                                              featureMapping[feature] ||
                                                feature.replace(/_/g, " ")
                                            )}
                                          </td>
                                          <td
                                            className="text-end fw-semibold py-2"
                                            style={{ color: "#2980b9" }}
                                          >
                                            {/* ${rate} */}
                                            {getSymbolFromCurrency(
                                              currencyData?.target_currency
                                            ) || "$"}
                                            {currencyData?.exchange_rate
                                              ? (
                                                  currencyData?.exchange_rate *
                                                  rate
                                                ).toFixed(2)
                                              : rate}
                                          </td>
                                        </tr>
                                      )
                                    )}
                                  </tbody>
                                </Table>
                                {decoded?.role === "SuperAdmin" && (
                                  <Button
                                    variant="outline-info"
                                    className="w-100 fw-semibold"
                                    onClick={() => handleEdit(paygPlan)}
                                    style={{
                                      borderRadius: "8px",
                                      padding: "10px",
                                    }}
                                  >
                                    {t("Edit")}
                                  </Button>
                                )}
                              </Card.Body>
                              <Card.Footer className="text-center py-3 bg-white">
                                <Badge
                                  bg="info"
                                  className="fw-normal"
                                  style={{
                                    padding: "6px 10px",
                                    fontSize: "0.9rem",
                                  }}
                                >
                                  <Check2Circle className="me-1" />{" "}
                                  {t("Fully Flexible")}
                                </Badge>
                              </Card.Footer>
                            </Card>
                          </Col>
                        </Row>
                      </section>
                    )}
                  </Col>
                ) : (
                  <Col xs={12} lg={11}>
                    <h1
                      className="text-center mb-5 fw-bold"
                      style={{ color: "#2c3e50", fontSize: "2.5rem" }}
                    >
                      {t("No Subscription Packages Available")}
                    </h1>
                  </Col>
                )}
              </Row>
            </Container>
          )}
        </div>
      </div>

      {/* Custom CSS */}
      <style jsx>{`
        .scale-on-hover:hover {
          transform: scale(1.05);
          transition: transform 0.3s ease-in-out;
        }
        .card {
          transition: transform 0.3s ease-in-out;
        }
        .card:hover {
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1) !important;
        }
      `}</style>
    </>
  );
};

export default PackagesList;

{
  /* <div
className="main-header-box"
style={{
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  minHeight: "100vh",
}}
> */
}
