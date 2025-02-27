import React, { useEffect, useState } from "react";
import { Table, Button, Form, Card } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import Header from "../../../../Components/Header/Header";
import { useTranslation } from "react-i18next";
import { getFieldUserAttendenceApi } from "../../../../lib/store";

const FieldUserAttendece = () => {
  const { t } = useTranslation();
  const [fieldUserData, setFieldUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  // console.log("filterDataa", filteredData);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  

  // Get companyId and token from local storage
  const [companyId] = useState(localStorage.getItem("companyId"));
  const [token] = useState(localStorage.getItem("UserToken"));
  // console.log('-------------------------fieldUserData', fieldUserData);
  // Fetch the Field User Attendence report when component mounts
  useEffect(() => {
    const fetchReport = async () => {
      if (!companyId) return;
      setIsLoading(true);
      try {
        const response = await getFieldUserAttendenceApi(companyId, token);
      
        if (response.status == true) {
          setFieldUserData(response.workOrders);
          setFilteredData(response.workOrders);
        }
      } catch (error) {
        console.error("Error fetching report:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [companyId, token]);

  // Filter the report data based on the search query.
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(fieldUserData);
    } else {
      const filtered = fieldUserData.filter(
        (item) =>
          item?.fieldUsers?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item?.workOrderId
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          item?.customerNameAddress
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase())
      );
      // console.log('filtered: ', filtered);
      setFilteredData(filtered);
    }
  }, [searchQuery, fieldUserData]);

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-5">
        <div className="pages-box">
          {/* Optional search filter */}
          <div className="d-flex justify-content-end align-items-center mb-3">
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder={t(
                  "Search by Field Users, WorkOrder ID or Customer Name & Address..."
                )}
                style={{ width: "300px" }}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="secondary" onClick={handleClear}>
                {t("Clear")}
              </Button>
            </div>
          </div>
          <Card style={{ border: "none" }}>
            <Card.Body style={{ padding: "0px" }}>
              <Table
                hover
                responsive
                className="align-middle"
                style={{ minWidth: "1150px" }}
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
                      {t("Field Users")}
                    </th>
                    <th
                      style={{
                        width: "10%",
                        textAlign: "left",
                        background: "#e5e5e5",
                      }}
                    >
                      {t("WO Date")}
                    </th>
                    <th
                      style={{
                        width: "25%",
                        textAlign: "left",
                        background: "#e5e5e5",
                      }}
                    >
                      {t("Customer Name & Address")}
                    </th>
                    <th
                      style={{
                        width: "15%",
                        textAlign: "left",
                        background: "#e5e5e5",
                      }}
                    >
                      {t("WorkOrder Id")}
                    </th>
                    <th
                      style={{
                        width: "10%",
                        textAlign: "left",
                        background: "#e5e5e5",
                      }}
                    >
                      {t("StartTime")}
                    </th>
                    <th
                      style={{
                        width: "10%",
                        textAlign: "left",
                        background: "#e5e5e5",
                      }}
                    >
                      {t("End Time")}
                    </th>
                    <th
                      style={{
                        width: "15%",
                        textAlign: "left",
                        background: "#e5e5e5",
                      }}
                    >
                      {t("Status")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        <BeatLoader
                          size={12}
                          color={"#3C3C3C"}
                          style={{ display: "flex", justifyContent: "center" }}
                        />
                        <p className="mt-2">{t("Loading...")}</p>
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        {t("No data found")}
                      </td>
                    </tr>
                  ) : (
                    filteredData.map((item, index) => (
                      <tr key={index}>
                        <td
                          style={{ padding: "15px 10px", fontSize: "0.9rem" }}
                        >
                          <strong>{item.workerName}</strong>
                        </td>
                        <td
                          style={{ padding: "15px 10px", fontSize: "0.9rem" }}
                        >
                          {item.created_at}
                        </td>
                        <td
                          style={{ padding: "15px 10px", fontSize: "0.9rem" }}
                        >
                          {item.customerName},{item.customerAddress}
                        </td>
                        <td
                          style={{ padding: "15px 10px", fontSize: "0.9rem" }}
                        >
                          {item.workOrderId}
                        </td>
                        <td
                          style={{ padding: "15px 10px", fontSize: "0.9rem" }}
                        >
                          <span
                            style={{
                              backgroundColor: "#fff3cd",
                              color: "#856404",
                              padding: "5px",
                              borderRadius: "4px",
                              display: "inline-block",
                              minWidth: "120px",
                              textAlign: "center",
                            }}
                          >
                            {item.punchIn || "N/A"}
                          </span>
                        </td>
                        <td
                          style={{ padding: "15px 10px", fontSize: "0.9rem" }}
                        >
                          <span
                            style={{
                              backgroundColor: "#d1ecf1",
                              color: "#0c5460",
                              padding: "5px",
                              borderRadius: "4px",
                              display: "inline-block",
                              minWidth: "120px",
                              textAlign: "center",
                            }}
                          >
                            {item.punchOut || "N/A"}
                          </span>
                        </td>
                        <td
                          style={{ padding: "15px 10px", fontSize: "0.9rem" }}
                        >
                          <span
                            style={{
                              backgroundColor: "#d4edda",
                              color: "#155724",
                              padding: "5px",
                              borderRadius: "4px",
                              display: "inline-block",
                              minWidth: "100px",
                              textAlign: "center",
                            }}
                          >
                            {item.punchIn ? "Present" : "Absent"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
};

export default FieldUserAttendece;
