import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import Header from "../../../../Components/Header/Header";
import {
  delete_FieldUser,
  fetch_FieldUserOfCompany,
} from "../../../../lib/store";
import { FaInfoCircle, FaEdit, FaClipboardList } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { usePermissions } from "../../../../context/PermissionContext";

const FieldUserList = () => {
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("UserToken");
  const company_id = localStorage.getItem("companyId") || null;
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [userRole, setuserRole] = useState(localStorage.getItem("Role"));
  const itemsPerPage = 5;
  const { hasPermission } = usePermissions();
  // Fetch data from API
  const fetchData = () => {
    fetch_FieldUserOfCompany(company_id, token)
      .then((response) => {
        if (response.success === true) {
          setTableData(response.data);
        }
      })
      .catch((error) => {
        console.log("error", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Reset page to 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const tableHeaders = [
    "Agent Id",
    "Full Name & Location",
    "Email Address",
    "Username",
    "Status",
    "Country",
    "Created By",
    "Action",
  ];

  // Filter table data based on search query (by name or email)
  const filteredtable = tableData.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  console.log("dataa", filteredtable);

  // Calculate pagination indices and current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredtable.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredtable.length / itemsPerPage);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Navigation and action handlers
  const handleToPreview = (row) => {
    navigate("/users/field/list/view", { state: { row } });
  };

  const handleEdit = (row) => {
    navigate("/users/field/edit", { state: { row } });
  };

  const handleDelete = async (id) => {
    const confirmResult = await Swal.fire({
      title: t("Are you sure?"),
      text: t("You won't be able to revert this!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("Cancel"),
      reverseButtons: true,
    });

    if (confirmResult.isConfirmed) {
      try {
        // Show loading alert
        Swal.fire({
          title: t("Deleting..."),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const result = await delete_FieldUser(id, token, company_id);

        // Close the loading alert once the API call completes
        Swal.close();

        if (result.success === true) {
          await Swal.fire(
            t("Deleted!"),
            t("Your user has been deleted."),
            "success"
          );

          // Update state immediately by filtering out the deleted user
          setTableData((prevData) => prevData.filter((item) => item.id !== id));

          // Reset the current page to 1 in case the deletion causes the current page to be empty
          setCurrentPage(1);
        } else {
          await Swal.fire("Error", result.message, "error");
        }
      } catch (error) {
        // Close the loading alert if an error occurs
        Swal.close();
        await Swal.fire("Error", t("An unexpected error occurred."), "error");
      }
    }
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <div
            className="border p-4 rounded"
            style={{
              backgroundColor: "#f9f9f9",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">{t("Field Agent List")}</h4>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder={t("Search...")}
                  className="me-2"
                  style={{ width: "200px" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="secondary" onClick={handleClear}>
                  {t("Clear")}
                </Button>
              </div>
            </div>
            <Table hover responsive className="align-middle">
              <thead>
                <tr style={{ backgroundColor: "#E7EAF3", color: "#3C3C3C" }}>
                  {tableHeaders.map((header, index) => (
                    <th
                      key={index}
                      style={{
                        textAlign: "left",
                        padding: "15px",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                        color: "black",
                        background: "#e5e5e5",
                      }}
                    >
                      {t(header)}
                    </th>
                  ))}
                </tr>
              </thead>
              {isLoading ? (
                <tbody>
                  <tr>
                    <td
                      colSpan={tableHeaders.length}
                      className="text-center py-5"
                    >
                      <BeatLoader
                        size={12}
                        color={"#3C3C3C"}
                        style={{ display: "flex", justifyContent: "center" }}
                      />
                      <p className="mt-2">{t("Loading...")}</p>
                    </td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  {currentItems.length > 0 ? (
                    currentItems.map((row, index) => (
                      <tr
                        key={index}
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: "10px",
                          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <td
                          style={{
                            textAlign: "left",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          <div>{row.id}</div>
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          <div>
                            <strong>{row.name}</strong>
                            <br />
                            {row.address}
                          </div>
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          {row.email}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          {row.username}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          {row.isActive === "1" ? "Active" : "Unactive"}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          {row.country}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          {row.created_by}
                        </td>
                        <td style={{ textAlign: "center", padding: "15px" }}>
                          <div className="d-flex gap-2 justify-content-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              style={{
                                borderRadius: "50%",
                                width: "35px",
                                height: "35px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                              onClick={() => handleToPreview(row)}
                            >
                              <i className="bi bi-info-circle"></i>
                              <FaInfoCircle />
                            </Button>
                            {(userRole == "Admin" ||
                              hasPermission(
                                "Company Field User Module",
                                "Edit"
                              )) && (
                              <Button
                                variant="warning"
                                size="sm"
                                onClick={() => handleEdit(row)}
                                style={{
                                  borderRadius: "50%",
                                  width: "35px",
                                  height: "35px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <i className="bi bi-pencil"></i>
                                <FaEdit />
                              </Button>
                            )}

                            {(userRole == "Admin" ||
                              hasPermission(
                                "Company Field User Module",
                                "Edit"
                              )) && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(row.id)}
                                style={{
                                  borderRadius: "50%",
                                  width: "35px",
                                  height: "35px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <i className="bi bi-trash"></i>
                                <FaClipboardList />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={tableHeaders.length}
                        className="text-center py-5"
                      >
                        {t("No data found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </Table>
            {/* Pagination Controls */}
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>
                Showing {filteredtable.length === 0 ? 0 : indexOfFirstItem + 1}{" "}
                to{" "}
                {indexOfLastItem > filteredtable.length
                  ? filteredtable.length
                  : indexOfLastItem}{" "}
                of {filteredtable.length} items
              </span>
              <div className="d-flex align-items-center">
                <Button
                  variant="light"
                  className="me-1"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  &laquo;
                </Button>
                {Array.from({ length: totalPages }, (_, index) => (
                  <Button
                    key={index}
                    variant={currentPage === index + 1 ? "primary" : "light"}
                    className="me-1"
                    onClick={() => handlePageClick(index + 1)}
                  >
                    {index + 1}
                  </Button>
                ))}
                <Button
                  variant="light"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || totalPages === 0}
                >
                  &raquo;
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FieldUserList;
