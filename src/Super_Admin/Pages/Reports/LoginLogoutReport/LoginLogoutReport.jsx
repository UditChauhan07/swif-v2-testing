import React, { useEffect, useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import Header from "../../../../Components/Header/Header";
import { useTranslation } from "react-i18next";
import { getLoginLogoutRecords } from "../../../../lib/store";
import PaginationComp from "../../../../Components/PaginationComp/PaginationComp";

const LoginLogoutReport = () => {
  const { t } = useTranslation();
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [token] = useState(localStorage.getItem("UserToken"));

  // New state for user type filter; default is "office_user"
  const [userType, setUserType] = useState("office_user");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Change as needed

  // Fetch the login/logout records from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLoginLogoutRecords(token);
        console.log("Response:", response);
        if (response.status === true) {
          // Filter out any records where companyName is "unknown"
          const sortedData = response?.data?.filter(
            (data) => data?.companyName.toLowerCase() !== "unknown"
          );
          console.log("Sorted data:", sortedData);
          setReportData(sortedData);
          setFilteredData(sortedData);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [token]);

  // Filter data based on the search query (searching by Company Name)
  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(reportData);
    } else {
      const filtered = reportData.filter((item) =>
        item?.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
    // Reset current page when filtering changes
    setCurrentPage(1);
  }, [searchQuery, reportData]);

  const handleClear = () => {
    setSearchQuery("");
  };

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">{t("Login/Logout Report")}</h4>
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
          {/* Minimal user type filter */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <Form.Label>{t("User Type")}</Form.Label>
              <Form.Control
                as="select"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                style={{ width: "200px" }}
              >
                <option value="office_user">{t("Office User")}</option>
                <option value="field_user">{t("Field User")}</option>
              </Form.Control>
            </div>
            <h5 className="mb-0">
              {t("Selected User:")}{" "}
              {userType === "office_user" ? t("Office User") : t("Field User")}
            </h5>
          </div>

          {/* Inline style to enforce a black border for all table cells */}
          <style>{`
            .custom-bordered-table td, .custom-bordered-table th {
              border: 1px solid black !important;
            }
          `}</style>

          <Table
            hover
            responsive
            className="align-middle custom-bordered-table"
            style={{ minWidth: "800px" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#E7EAF3", color: "#3C3C3C" }}>
                <th
                  rowSpan="2"
                  style={{ textAlign: "left", background: "#e5e5e5" }}
                >
                  {t("Company Name")}
                </th>
                <th
                  colSpan="3"
                  style={{ textAlign: "center", background: "#e5e5e5" }}
                >
                  {t("Login")}
                </th>
                <th
                  colSpan="3"
                  style={{ textAlign: "center", background: "#e5e5e5" }}
                >
                  {t("Logout")}
                </th>
              </tr>
              <tr style={{ backgroundColor: "#E7EAF3", color: "#3C3C3C" }}>
                <th style={{ background: "#e5e5e5", textAlign: "center" }}>
                  {t("Daily")}
                </th>
                <th style={{ background: "#e5e5e5", textAlign: "center" }}>
                  {t("Weekly")}
                </th>
                <th style={{ background: "#e5e5e5", textAlign: "center" }}>
                  {t("Monthly")}
                </th>
                <th style={{ background: "#e5e5e5", textAlign: "center" }}>
                  {t("Daily")}
                </th>
                <th style={{ background: "#e5e5e5", textAlign: "center" }}>
                  {t("Weekly")}
                </th>
                <th style={{ background: "#e5e5e5", textAlign: "center" }}>
                  {t("Monthly")}
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
                currentItems.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "15px 10px", fontSize: "0.9rem" }}>
                      <strong className="text-capitalize">
                        {item.companyName}
                      </strong>
                    </td>
                    <td
                      style={{
                        padding: "15px 10px",
                        fontSize: "0.9rem",
                        textAlign: "center",
                      }}
                    >
                      {userType === "office_user"
                        ? item.office_user.login_per_day
                        : item.field_user.login_per_day}
                    </td>
                    <td
                      style={{
                        padding: "15px 10px",
                        fontSize: "0.9rem",
                        textAlign: "center",
                      }}
                    >
                      {userType === "office_user"
                        ? item.office_user.login_per_week
                        : item.field_user.login_per_week}
                    </td>
                    <td
                      style={{
                        padding: "15px 10px",
                        fontSize: "0.9rem",
                        textAlign: "center",
                      }}
                    >
                      {userType === "office_user"
                        ? item.office_user.login_per_month
                        : item.field_user.login_per_month}
                    </td>
                    <td
                      style={{
                        padding: "15px 10px",
                        fontSize: "0.9rem",
                        textAlign: "center",
                      }}
                    >
                      {userType === "office_user"
                        ? item.office_user.logout_per_day
                        : item.field_user.logout_per_day}
                    </td>
                    <td
                      style={{
                        padding: "15px 10px",
                        fontSize: "0.9rem",
                        textAlign: "center",
                      }}
                    >
                      {userType === "office_user"
                        ? item.office_user.logout_per_week
                        : item.field_user.logout_per_week}
                    </td>
                    <td
                      style={{
                        padding: "15px 10px",
                        fontSize: "0.9rem",
                        textAlign: "center",
                      }}
                    >
                      {userType === "office_user"
                        ? item.office_user.logout_per_month
                        : item.field_user.logout_per_month}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {/* Render PaginationComp if there are more records than itemsPerPage */}
          {filteredData.length > itemsPerPage && (
            <PaginationComp
              totalItems={filteredData.length}
              currentPage={currentPage}
              rowsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default LoginLogoutReport;
