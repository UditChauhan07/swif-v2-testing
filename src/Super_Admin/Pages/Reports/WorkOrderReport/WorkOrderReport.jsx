import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import Header from "../../../../Components/Header/Header";
import { workOrderReportAllCompany } from "../../../../lib/store";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const WorkOrderReport = () => {
  const { t } = useTranslation();
  const [workOrderData, setWorkOrderData] = useState({});
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState(localStorage.getItem("UserToken"));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await workOrderReportAllCompany(token);
        if (response.status === true) {
          setWorkOrderData(response?.data || {});
          setFilteredData(response?.data || {}); 
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter the work order data based on the search query
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(workOrderData);
    } else {
      const filtered = Object.keys(workOrderData).filter((key) =>
        workOrderData[key].company_name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
      const filteredWorkOrders = filtered.reduce((acc, key) => {
        acc[key] = workOrderData[key];
        return acc;
      }, {});
      setFilteredData(filteredWorkOrders);
    }
  }, [searchQuery, workOrderData]);

  // Function to format work order data into a consumable array
  function formatWorkOrderData() {
    return Object.keys(filteredData).map((key) => ({
      companyId: key,
      companyName: filteredData[key].company_name,
      perDay: filteredData[key].per_day,
      perWeek: filteredData[key].per_week,
      perMonth: filteredData[key].per_month,
      completedPerDay: filteredData[key].completed_per_day,
      completedPerWeek: filteredData[key].completed_per_week,
      completedPerMonth: filteredData[key].completed_per_month,
    }));
  }

  // Handle clearing search input
  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">{t("Work Order Report")}</h4>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder={t("Search by Company Name...")}
                className="me-2"
                style={{ width: "250px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="secondary" onClick={handleClear}>
                {t("Clear")}
              </Button>
            </div>
          </div>

          <Table
            hover
            responsive
            className="align-middle"
            style={{ minWidth: "1650px" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#E7EAF3", color: "#3C3C3C" }}>
                <th
                  style={{
                    width: "15%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Company Id")}
                </th>
                <th
                  style={{
                    width: "15%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Company Name")}
                </th>
                <th
                  style={{
                    width: "7%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Per Day")}
                </th>
                <th
                  style={{
                    width: "7%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Per Week")}
                </th>
                <th
                  style={{
                    width: "7%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Per Month")}
                </th>
                <th
                  style={{
                    width: "8%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Completed Per Day")}
                </th>
                <th
                  style={{
                    width: "8%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Completed Per Week")}
                </th>
                <th
                  style={{
                    width: "8%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Completed Per Month")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    <BeatLoader
                      size={12}
                      color={"#3C3C3C"}
                      style={{ display: "flex", justifyContent: "center" }}
                    />
                    <p className="mt-2">{t("Loading...")}</p>
                  </td>
                </tr>
              ) : Object.keys(filteredData).length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
                    {t("No data found")}
                  </td>
                </tr>
              ) : (
                formatWorkOrderData().map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      <strong>{item.companyId}</strong>
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      <strong className="text-capitalize">{item.companyName}</strong>
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.perDay}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.perWeek}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.perMonth}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.completedPerDay}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.completedPerWeek}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.completedPerMonth}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default WorkOrderReport;
