import React from "react";
import Header from "../../../../Components/Header/Header";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Swal from "sweetalert2";
import { editSubscriptionPackages } from "../../../../lib/store";
import BackButton from "../../../../utils/BackButton/BackButton";

const EditPackage = ({ initialValues, onSubmit }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
  const token =localStorage.getItem("UserToken");
  const { packageData } = location.state || {}
    console.log('package data', packageData)


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
      <div className="pages-box">
        <Container className="d-flex justify-content-center align-items-center">
          <Card className="p-4 shadow-lg w-100" style={{ maxWidth: "900px", border: "none", borderRadius: "15px" }}>
            <Formik
              initialValues={packageData}
            // initialValues={{
            //     packageType: "payg",
            //     name: "",
            //     cost_per_month: "",
            //     features: {
            //       add_customers: "",
            //       add_office_users: "",
            //       add_field_users: "",
            //       work_order_creation: "",
            //       work_order_execution: "",
            //     },
            //     payg_rates: {
            //       add_customers: "",
            //       add_office_users: "",
            //       add_field_users: "",
            //       work_order_creation: "",
            //       work_order_execution: "",
            //     },
            //   }}
              validationSchema={validationSchema}
              onSubmit={async(values, { resetForm }) => {
                let payload = {};
              if (values.packageType === "subscription") {
                  payload = {
                    package_id:values.package_id,
                    // packageType: values.packageType,
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
                    package_id:values.package_id,
                    // packageType: values.packageType,
                    // name: values.name||"payg",
                    // cost_per_month: 0.00,
                    payg: true,
                    // payg_rates: {
                      features:{
                      add_customers: Number(parseFloat(values.payg_rates.add_customers).toFixed(2)),
                      add_office_users: Number(parseFloat(values.payg_rates.add_office_users).toFixed(2)),
                      add_field_users: Number(parseFloat(values.payg_rates.add_field_users).toFixed(2)),
                      work_order_creation: Number(parseFloat(values.payg_rates.work_order_creation).toFixed(2)),
                      work_order_execution:Number( parseFloat(values.payg_rates.work_order_execution).toFixed(2)),
                    },
                  };
                }
                // console.log("Updated Values:", values);
                // console.log("Payload:", payload);
                try{
                
                  Swal.fire({
                    title: t("Processing..."),
                    text: t("Please wait, while updating package"),
                    allowOutsideClick: false,
                    showConfirmButton: false,
                    didOpen: () => {
                      Swal.showLoading();
                    },
                  });
                  const response=await editSubscriptionPackages(token,payload);
                  Swal.close();
                  console.log("Responsedsd:", response);
                  if(response.success || response.success==true){
                    Swal.close();
                    Swal.fire(t("success"), t("Package updated successfully!"), "success")
                    .then(() => {
                      navigate('/billings/package-List')
                    })
                    
                  }
                  else{
                    Swal.close();
                    Swal.fire(t("error"), t("Failed to update package"), "error");
                  }

                  resetForm();
                }
                catch(error){
                  console.error("Error updating package", error);
                  alert("Error updating package. Please try again later.");
                  Swal.close();
                }

                
              }}
            >
              {({ values }) => (
                <Form>
                  <div className="mb-4 text-capitalize">
                    <label className="form-label fw-semibold">{t("Package Type")}</label>
                    <Field type="text" name="packageType" className="form-control" disabled />
                  </div>
                  {values?.packageType === "subscription" && (
                    <>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">{t("Package Name")}</label>
                        <Field type="text" name="name" className="form-control" maxLength={50} />
                      </div>
                      <div className="mb-4">
                        <label className="form-label fw-semibold">{t("Cost Per Month")} ($)</label>
                        <Field type="text" name="cost_per_month" className="form-control" />
                      </div>
                      <div className="mb-4">
                        <h5 className="fw-semibold">{t("Feature Limits")}</h5>
                        <Row>
                          {Object.keys(values.features).map((feature) => (
                            <Col md={6} key={feature} className="mb-3">
                              <label className="form-label text-capitalize">
                                {/* {feature.replace(/_/g, " ")} */}
                                {t(featureMapping[feature] || feature.replace(/_/g, " "))}
                                </label>
                              <Field type="text " name={`features.${feature}`} className="form-control" />
                            </Col>
                          ))}
                        </Row>
                      </div>
                    </>
                  )}
                  {values.packageType === "payg" && (
                    <div className="mb-4">
                      <h5 className="fw-semibold">{t("PAYG Rates ($ per usage)")}</h5>
                      <Row>
                        {Object.keys(values.payg_rates).map((rate) => (
                          <Col md={6} key={rate} className="mb-3">
                            <label className="form-label text-capitalize">
                              {/* {rate.replace(/_/g, " ")} */}
                              {t(featureMapping[rate] || rate.replace(/_/g, " "))}
                              </label>
                            <Field type="text" name={`payg_rates.${rate}`} className="form-control" />
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
                  <Button type="submit" variant="primary" className="w-100 mt-3">{t("Update Package")}</Button>
                </Form>
              )}
            </Formik>
          </Card>
        </Container>
        <div className="d-flex justify-content-center mt-2"><BackButton/></div>
        
      </div>
      </div>
    </>
  );
};

export default EditPackage;
