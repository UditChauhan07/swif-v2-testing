import React, { useEffect, useState } from "react";
import { Table, Button, Form, Card } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import Header from "../../../../Components/Header/Header";
import { useTranslation } from "react-i18next";
import {
  getCompanyListApi,
  getFieldUserAttendenceApi,
} from "../../../../lib/store";
import LoadingComp from "../../../../Components/Loader/LoadingComp";
import PaginationComp from "../../../../Components/PaginationComp/PaginationComp";
// import PaginationComp from "./PaginationComp"; // adjust the path as needed

const FieldUserAttendece = () => {
  const { t } = useTranslation();
  const [fieldUserData, setFieldUserData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [token] = useState(localStorage.getItem("UserToken"));

  // State for companies dropdown and selected company details
  const [companies, setCompanies] = useState([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [selectedCompanyName, setSelectedCompanyName] = useState("");
  const [isCompanyLoading, setIsCompanyLoading] = useState(true);
  const [companyListLoading, setcompanyListLoading] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportError, setreportError] = useState();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsCompanyLoading(true);
      try {
        const response = await getCompanyListApi(token);
        if (response.status === true) {
          const companyList = response.data.map((item) => ({
            id: item.company.id,
            name: item.company.company_name,
          }));
          setCompanies(companyList);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsCompanyLoading(false);
      }
    };
    fetchCompanies();
  }, [token]);

  const handleCompanySearch = async () => {
    if (!selectedCompanyId) return;
    setIsLoading(true);
    setcompanyListLoading(true);
    try {
      const response = await getFieldUserAttendenceApi(
        selectedCompanyId,
        token
      );
      console.log("Report response:", response);
      if (response.status === true) {
        setFieldUserData(response.workOrders);
        setFilteredData(response.workOrders);
        setShowReport(true);
        setcompanyListLoading(false);
      } else {
        setreportError(response.message);
        setcompanyListLoading(false);
        setFieldUserData([]);
        setFilteredData([]);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter the field user data based on the search query
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
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset to first page when filtering changes
  }, [searchQuery, fieldUserData]);

  const handleClear = () => {
    setSearchQuery("");
  };

  // Calculate the current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Header />
      <div className="main-header-box mt-5">
        <div className="pages-box">
          {/* Company dropdown and Search button */}
          {isCompanyLoading ? (
            <LoadingComp />
          ) : (
            <div className="d-flex justify-content-center align-items-center mb-3">
              <div className="d-flex align-items-center gap-2">
                <Form.Label className="mb-0">{t("Select Company")}</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedCompanyId}
                  onChange={(e) => {
                    const compId = e.target.value;
                    setSelectedCompanyId(compId);
                    const comp = companies.find((c) => c.id === compId);
                    setSelectedCompanyName(comp ? comp.name : "");
                  }}
                  style={{ width: "400px" }}
                >
                  <option value="">-- {t("Select Company")} --</option>
                  {companies.map((comp) => (
                    <option
                      key={comp.id}
                      value={comp.id}
                      className="text-capitalize"
                    >
                      {comp.name}
                    </option>
                  ))}
                </Form.Control>
                <Button
                  style={{
                    backgroundColor: "#2e2e32",
                    color: "white",
                    border: "none",
                  }}
                  onClick={handleCompanySearch}
                  disabled={isCompanyLoading || !selectedCompanyId}
                >
                  {t("Search")}
                </Button>
              </div>
            </div>
          )}

          {/* Show message until a company is selected and searched */}
          {!showReport ? (
            <>
              {companyListLoading ? (
                <LoadingComp />
              ) : (
                !isCompanyLoading && (
                  <>
                    <div className="text-center my-4">
                      <h4>
                        {t(
                          "Please select a company and click Search to view details"
                        )}
                      </h4>
                    </div>
                    {filteredData.length === 0 && reportError && (
                      <div
                        className="text-center my-4"
                        style={{
                          backgroundColor: "#ffe6e6",
                          color: "#d9534f",
                          padding: "10px",
                          fontWeight: "bold",
                          borderRadius: "5px",
                        }}
                      >
                        <h5>{t("No Data Found")}</h5>
                      </div>
                    )}
                  </>
                )
              )}
            </>
          ) : (
            <>
              {/* Display selected company name and search filter */}
              <div className="d-flex justify-content-between">
                <h5 className="mb-4">
                  {t("Company")}: {selectedCompanyName}
                </h5>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="d-flex gap-2">
                    <Form.Control
                      type="text"
                      placeholder={t(
                        "Search by Field Users, WorkOrder ID or Customer Name & Address..."
                      )}
                      className="me-2"
                      style={{ width: "300px" }}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button variant="secondary" onClick={handleClear}>
                      {t("Clear")}
                    </Button>
                  </div>
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
                      <tr
                        style={{ backgroundColor: "#E7EAF3", color: "#3C3C3C" }}
                      >
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
                              style={{
                                display: "flex",
                                justifyContent: "center",
                              }}
                            />
                            <p className="mt-2">{t("Loading...")}</p>
                          </td>
                        </tr>
                      ) : currentItems.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="text-center py-5">
                            {t("No data found")}
                          </td>
                        </tr>
                      ) : (
                        currentItems.map((item, index) => {
                          // const createdAt = yourData.created_at; // { _seconds: 1741252559, _nanoseconds: 251000000 }
                          // const createdAtDate = createdAt?.toDate(); // Convert Timestamp to Date
                          // const formattedDate = createdAtDate?.toLocaleString(); // You can use other formats like toLocaleDateString(), toLocaleTimeString(), etc.
                          return(
                          <tr key={index}>
                            <td
                              style={{
                                padding: "15px 10px",
                                fontSize: "0.9rem",
                              }}
                            >
                              <strong>{item.workerName}</strong>
                            </td>
                            <td
                              style={{
                                padding: "15px 10px",
                                fontSize: "0.9rem",
                              }}
                            >
                              {item.formattedDate}
                            </td>
                            <td
                              style={{
                                padding: "15px 10px",
                                fontSize: "0.9rem",
                              }}
                            >
                              {item.customerName},{item.customerAddress}
                            </td>
                            <td
                              style={{
                                padding: "15px 10px",
                                fontSize: "0.9rem",
                              }}
                            >
                              {item.workOrderId}
                            </td>
                            <td
                              style={{
                                padding: "15px 10px",
                                fontSize: "0.9rem",
                              }}
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
                              style={{
                                padding: "15px 10px",
                                fontSize: "0.9rem",
                              }}
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
                              style={{
                                padding: "15px 10px",
                                fontSize: "0.9rem",
                              }}
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
                          )
                        })
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              {/* Pagination Component */}
              {filteredData.length > itemsPerPage && (
                <PaginationComp
                  totalItems={filteredData.length}
                  currentPage={currentPage}
                  rowsPerPage={itemsPerPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FieldUserAttendece;
