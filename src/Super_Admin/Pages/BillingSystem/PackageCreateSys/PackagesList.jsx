import {
  Card,
  Container,
  Row,
  Col,
  Badge,
  Table,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { Check2Circle, XCircle, StarFill } from "react-bootstrap-icons";
import Header from "../../../../Components/Header/Header";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import {
  convertToSelectedCurrency,
  getCurrenPlan,
  getSubscriptionPackagesList,
  getUsageLimit,
} from "../../../../lib/store";
import LoadingComp from "../../../../Components/Loader/LoadingComp";
import { useNavigate } from "react-router-dom";
import getSymbolFromCurrency from "currency-symbol-map";
import { CheckCircleFill } from "react-bootstrap-icons";
import { BsInfoCircle } from "react-icons/bs"; // Font Awesome or Bootstrap Icons

const PackagesList = () => {
  const role = localStorage.getItem("Role");
  const token = localStorage.getItem("UserToken");
  const companyId = localStorage.getItem("companyId");
  const [subscriptionPackages, setSubscriptionPackages] = useState([]);
  const currencyCode = localStorage.getItem("currencyCode");
  const navigate = useNavigate();
  const decoded = jwtDecode(token);
  const [loading, setLoading] = useState(true);
  const [currencyData, setCurrencyData] = useState(null);
  const [currentPlan, setCurrentPlan] = useState({
    features: {},
  });
  const [defaultPlan, setDefaultPlan] = useState({
    add_customers: 0,
    add_office_users: 0,
    add_field_users: 0,
    work_order_creation: 0,
    work_order_execution: 0,
  });
  const [paygPlan, setpaygPlan] = useState({
    packageType: "",
    package_id: "",
    name: "",
    rates: {},
  });
  console.log("defaultPlan", currentPlan);
  const { t, i18n } = useTranslation();

  const fetchSubscriptionPackages = async () => {
    try {
      const response = await getSubscriptionPackagesList(token);
      console.log('-----resp',response.packages);
      const predefinedFeatureOrder = [
        "add_customers",
        "add_field_users",
        "add_office_users",
        "work_order_creation",
        "work_order_execution"
      ];
      
      const sortedPackages = response.packages
        ? [...response.packages]
            .filter((pkg) => pkg.packageType !== "payg")
            .sort((a, b) => a.cost_per_month - b.cost_per_month)
            .map((pkg) => ({
              ...pkg,
              features: Object.fromEntries(
                predefinedFeatureOrder
                  .filter((key) => key in pkg.features) // Keep only existing keys
                  .map((key) => [key, pkg.features[key]]) // Maintain order
              )
            }))
        : [];
      
      console.log('-----sort', sortedPackages); 
      setSubscriptionPackages(sortedPackages);
      
      // ✅ Ensure PAYG Plan Features are Sorted
      const paygPlan = response.packages.find((pkg) => pkg.packageType === "payg");
      
      if (paygPlan) {
        setpaygPlan({
          packageType: paygPlan.packageType || "payg",
          package_id: paygPlan.package_id || 0,
          name: paygPlan.name || "",
          rates: Object.fromEntries(
            predefinedFeatureOrder
              .filter((key) => key in paygPlan.features) // Keep only existing keys
              .map((key) => [key, paygPlan.features[key]]) // Maintain order
          )
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };
  const fetchCurrentPlan = async () => {
    try {
      const response = await getCurrenPlan(token, companyId);
      console.log("current plan", response);
      if (response)
        setCurrentPlan({
          features: {
            add_customers: response.package.customerCreation || 0,
            add_office_users: response.package.officeUserCreation || 0,
            add_field_users: response.package.fieldUserCreation || 0,
            work_order_creation: response.package.workOrderCreation || 0,
            work_order_execution: response.package.workOrderExecution || 0,
          },
          name: response.package.planName || "",
          planTotalCost: response.package.planTotalCost || 0,
          cost_per_month: response.package.taxAbleAmount || 0,
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (decoded?.role != "SuperAdmin" && currencyCode) {
      convertToSelectedCurrency(null, currencyCode, token) // countryname,currency code, token
        .then((data) => {
          setCurrencyData(data);
        })
        .catch((error) => console.error("Error:", error));
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchSubscriptionPackages();
      if (token && companyId) {
        fetchCurrentPlan();
      }
    }
  }, [token]);

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
    navigate("/billings/package-edit", { state: { packageData } });
  };

  const handleCreateNewPlan = () => {
    if (subscriptionPackages) navigate("/billings/package-creation");
  };

  function calculateTaxPercentage(costIncludingTax, planCost) {
    if (planCost === 0) return 0;
    const taxAmount = costIncludingTax - planCost;
    const taxPercentage = (taxAmount / planCost) * 100;
    return taxPercentage;
  }
  const taxPercentage = calculateTaxPercentage(
    currentPlan.cost_per_month,
    currentPlan.planTotalCost
  );

  function calculateTaxableLimit(limit, taxPercentage) {
    return limit * (1 + taxPercentage / 100);
  }

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          {loading ? (
            <LoadingComp />
          ) : (
            <Container fluid className="py-1">
              {/* {decoded?.role === "SuperAdmin" && (
                <Button onClick={handleCreateNewPlan}>
                  {t("Create A New plan")}
                </Button>
              )} */}

              {/* current plan if company admin */}
              {decoded?.role !== "SuperAdmin" &&
                Object.entries(currentPlan)?.length > 0 && (
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
                          <Col xs={12} md={6} lg={4} className="mb-2">
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
                                {currentPlan.name != "payg" && (
                                  <h2
                                    className="text-center mb-4 fw-bold"
                                    style={{ color: "#2980b9" }}
                                  >
                                    {getSymbolFromCurrency(
                                      currencyData?.target_currency
                                    ) || "$ "}{" "}
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
                                    <OverlayTrigger
                                      placement="right"
                                      overlay={
                                        <Tooltip id="tooltip-service-tax">
                                          {" "}
                                          {t("Service Tax Included")} - (
                                          {taxPercentage.toFixed(2)})%{" "}
                                        </Tooltip>
                                      }
                                    >
                                      <BsInfoCircle
                                        style={{
                                          fontSize: "16px",
                                          marginLeft: "10px",
                                        }}
                                      />
                                    </OverlayTrigger>
                                  </h2>
                                )}
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
                                              {currentPlan.name === "payg"
                                                ? currencyData?.exchange_rate
                                                  ? `${
                                                      getSymbolFromCurrency(
                                                        currencyData?.target_currency
                                                      ) || "$ "
                                                    }  ${(
                                                      currencyData?.exchange_rate *
                                                      limit
                                                    ).toFixed(2)}`
                                                  : limit
                                                : `${limit}`}
                                            </td>
                                          </tr>
                                        )
                                      )}
                                  </tbody>
                                </Table>
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </section>
                    </Col>
                  </Row>
                )}
              {decoded?.role !== "SuperAdmin" &&
                Object.entries(currentPlan)?.length == 0 && (
                  <Row className="justify-content-center">
                    <Col xs={12} lg={11}>
                      <section className="mb-5">
                        <h5 className="text-center mb-3 fw-bold text-danger">
                          ( {t("You don't have any active plan")} )
                        </h5>
                      </section>
                    </Col>
                  </Row>
                )}

              {/* Separation Line */}
              {decoded?.role !== "SuperAdmin" &&
                Object.entries(currentPlan)?.length > 0 && (
                  <hr
                    style={{
                      border: "none",
                      borderTop: "2px solid black",
                      margin: "2rem auto",
                      width: "80%",
                    }}
                  />
                )}

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
                        : Object.entries(currentPlan).length > 0
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
                          {/* Subscription Plans */}
                          {subscriptionPackages?.map((pkg, index) => {
                            const taxableLimit = calculateTaxableLimit(
                              pkg?.cost_per_month,
                              taxPercentage
                            );
                            return (
                              <Col
                                key={pkg.package_id}
                                xs={12}
                                md={6}
                                lg={4}
                                className="mb-4"
                              >
                                <Card
                                  className={`h-100 shadow-lg ${
                                    index === subscriptionPackages.length - 2
                                      ? "border-primary scale-on-hover"
                                      : " mb-2 scale-on-hover"
                                  }`}
                                  style={{
                                    border:"1px solid #8080804d",
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
                                            taxableLimit
                                          ).toFixed(2)
                                        : pkg.cost_per_month}{" "}
                                      <small
                                        style={{
                                          fontSize: "0.7rem",
                                          color: "#7f8c8d",
                                        }}
                                      >
                                        {pkg?.name?.toLowerCase() !==
                                          "default" && (
                                          <>
                                            <span>/mo</span>
                                            <OverlayTrigger
                                              placement="bottom"
                                              overlay={
                                                <Tooltip id="tooltip-service-tax">
                                                  {t("Service Tax Included")} -
                                                  ({taxPercentage.toFixed(2)})%
                                                </Tooltip>
                                              }
                                            >
                                              <BsInfoCircle
                                                style={{
                                                  fontSize: "12px",
                                                  marginLeft: "10px",
                                                }}
                                              />
                                            </OverlayTrigger>
                                          </>
                                        )}
                                      </small>
                                    </h2>
                                    <Table
                                      className="mb-4"
                                      borderless
                                      size="sm"
                                    >
                                      <tbody>
                                        {Object.entries(pkg.features).map(
                                          ([feature, limit]) => (
                                            <tr
                                              key={feature}
                                              style={{
                                                borderBottom:
                                                  "1px solid #ecf0f1",
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
                                    {decoded?.role === "SuperAdmin" && (
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
                                </Card>
                              </Col>
                            );
                          })}

                          {/* PAYG Plan (Now inside the same Row) */}
                          {Object?.entries(paygPlan?.rates).length > 0 && (
                            <Col xs={12} md={6} lg={4} className="mb-4">
                              <Card
                                className="shadow-lg h-100 scale-on-hover"
                                style={{
                                  borderRadius: "15px",
                                  border:"1px solid #8080804d",
                                  overflow: "hidden",
                                }}
                              >
                                <Card.Header className="text-center py-4" style={{background:"#f8f9fa",border:"none"}}>
                                  <h3 className="mb-0 fw-bold">
                                    {t(
                                      paygPlanMapping[
                                        paygPlan?.name?.toLocaleLowerCase()
                                      ] || paygPlan?.name
                                    )}
                                  </h3>
                                </Card.Header>
                                <Card.Body className="p-4">
                                  <Table
                                    className="mb-4"
                                    
                                    size="sm"
                                    style={{
                                      borderCollapse: "separate",
                                      borderSpacing: "0 5px",
                                    }}
                                  >
                                    <thead>
                                      <tr
                                        style={{ backgroundColor: "#ecf0f1" }}
                                      >
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
                                              {t(
                                                featureMapping[feature] ||
                                                  feature.replace(/_/g, " ")
                                              )}
                                            </td>
                                            <td
                                              className="text-end fw-semibold py-2"
                                              style={{ color: "#2980b9" }}
                                            >
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
                                      variant="outline-primary"
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
                              {/* <Card.Footer className="text-center py-3 bg-white">
                                  <Badge
                                    bg="primary"
                                    className="fw-normal"
                                    style={{
                                      padding: "6px 10px",
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    <Check2Circle className="me-1" />{" "}
                                    {t("Fully Flexible")}
                                  </Badge>
                                </Card.Footer> */}
                              </Card>
                            </Col>
                          )}
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
