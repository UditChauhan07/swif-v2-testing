import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import Header from "../../../../Components/Header/Header";
import { fetchWorkOrderList, workOrderDeleteApi } from "../../../../lib/store";
import { FaInfoCircle, FaEdit, FaClipboardList } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import { usePermissions } from "../../../../context/PermissionContext";
import PaginationComp from "../../../../Components/PaginationComp/PaginationComp"; // Adjust the path as needed

const WorkOrderList = () => {
  const { hasPermission } = usePermissions();
  const userRole = localStorage.getItem("Role");
  const { t } = useTranslation();

  const [isLoading, setLoading] = useState(true);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const token = localStorage.getItem("UserToken");
  const company_id = localStorage.getItem("companyId") || null;
  const navigate = useNavigate();

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = () => {
    fetchWorkOrderList(company_id, token)
      .then((response) => {
        if (response.success === true) {
          setTableData(response?.workOrders);
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

  // Filter table data based on search query
  const filteredtable = tableData.filter((row) => {
    const idMatch = row.id
      .toString()
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const customerMatch =
      row.customerDetailSection?.CustomerName?.toLowerCase().includes(
        searchQuery.toLowerCase()
      );
    const statusMatch = row.status
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());
    const workerMatch =
      row.basicWorkorderDetails?.WorkerName?.toLowerCase().includes(
        searchQuery.toLowerCase()
      );
    const workItemMatch = row.workorderDetails
      .map((item) => item.workItem)
      .join(", ")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return (
      idMatch || customerMatch || statusMatch || workerMatch || workItemMatch
    );
  });

  // Reset to page 1 on search query change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate current items for display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredtable.slice(indexOfFirstItem, indexOfLastItem);
  console.log("dasddad", currentItems);
  const totalPages = Math.ceil(filteredtable.length / itemsPerPage);

  const handleToPreview = async (workOrder) => {
    navigate("/workorder/list/details", { state: { workOrder } });
  };

  const handleDelete = async (row) => {
    if (row.status === "In Progress") {
      Swal.fire({
        title: t("Error"),
        text: t("You cannot delete a work order once it has started."),
        icon: "error",
        confirmButtonText: t("OK"),
      });
      return;
    }

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
        Swal.fire({
          title: t("Deleting..."),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        const apiResult = await workOrderDeleteApi(row.id, token, company_id);
        Swal.close();

        if (apiResult.status === true) {
          await Swal.fire(
            t("Deleted!"),
            t("Your work order has been deleted."),
            "success"
          );
          setTableData((prevList) =>
            prevList.filter((order) => order.id !== row.id)
          );
        } else {
          await Swal.fire("Error", apiResult.message, "error");
        }
      } catch (error) {
        Swal.close();
        await Swal.fire("Error", t("An unexpected error occurred."), "error");
      }
    }
  };

  const handleEdit = (row) => {
    navigate("/workorder/list/edit", { state: { row } });
  };

  const handleClear = () => {
    setSearchQuery("");
  };

  // Utility function to convert date format if needed
  const convertToISOFormatIfNeeded = (dateString) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (regex.test(dateString)) {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

  const tableHeaders = [
    "Work Order Num",
    "Date & Time",
    "Customer Name",
    "Work Item Name",
    "Status",
    "Worker Name",
    "Action",
  ];

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
              <h4 className="mb-0">{t("Work Order List")}</h4>
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
                    <td colSpan="7" className="text-center py-5">
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
                  {currentItems?.length > 0 ? (
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
                          {row.id}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          {convertToISOFormatIfNeeded(
                            row?.basicWorkorderDetails?.startDate
                          )}{" "}
                          & {row?.basicWorkorderDetails?.startTime}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          {row?.customerDetailSection?.CustomerName}
                        </td>
                        <td
                          style={{
                            textAlign: "center",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                          title={row?.workorderDetails
                            .map((item) => item.workItem)
                            .join(", ")}
                        >
                          {row?.workorderDetails
                            ?.slice(0, 2)
                            .map((item, index, arr) => {
                              const truncatedText =
                                item.workItem.length > 20
                                  ? item.workItem.slice(0, 20) + "..."
                                  : item.workItem;

                              return (
                                <span key={index}>
                                  {truncatedText}
                                  {index < arr.length - 1 && ", "}
                                </span>
                              );
                            })}
                        </td>

                        <td
                          style={{
                            textAlign: "left",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          {row.status}
                        </td>
                        <td
                          style={{
                            textAlign: "left",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          {row?.basicWorkorderDetails?.WorkerName}
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
                              <FaInfoCircle />
                            </Button>
                            {(userRole === "Admin" ||
                              hasPermission(
                                "Company Work Order Module",
                                "Delete"
                              )) && (
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(row)}
                                style={{
                                  borderRadius: "50%",
                                  width: "35px",
                                  height: "35px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <FaClipboardList />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        {t("No data found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </Table>
            {/* Reusable Pagination Component */}
            <PaginationComp
              totalItems={filteredtable.length}
              currentPage={currentPage}
              rowsPerPage={itemsPerPage}
              onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default WorkOrderList;
