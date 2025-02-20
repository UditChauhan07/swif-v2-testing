import React, { useEffect, useState } from "react";
import { Table, Button, Row, Form } from "react-bootstrap";
import { FaUserEdit } from "react-icons/fa";
import { formatTimestamp } from "../../../utils/TimeStampConverter";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { FaInfoCircle, FaEdit, FaClipboardList } from "react-icons/fa";
import { delete_OfficeUser } from "../../../lib/store";
import { useTranslation } from "react-i18next";
import { usePermissions } from "../../../context/PermissionContext";

const UsersTabelComp = ({
  tableData,
  tableHeaders,
  roleName,
  isLoading,
  fetchData,
}) => {
  const token = localStorage.getItem("UserToken");
  const company_id = localStorage.getItem("companyId") || null;
  const navigate = useNavigate();
  const { t } = useTranslation();
  const itemsPerPage = 1;
  const [currentPage, setCurrentPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState("");

  const [userRole, setuserRole] = useState(localStorage.getItem("Role"));
console.log('tableData:', tableData);

  const handleToPreview = async (row) => {
    navigate("/users/office/list/view", { state: { row } });
  };
  const { hasPermission } = usePermissions();

  const handleDelete = (id) => {
    Swal.fire({
      title: t("Are you sure?"),
      text: t("You won't be able to revert this!"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, delete it!"),
      cancelButtonText: t("Cancel"),
      reverseButtons: true, // Reverse the order of the buttons (Cancel left, Confirm right)
    }).then((result) => {
      if (result.isConfirmed) {
        delete_OfficeUser(id, token, company_id).then((result) => {
          console.log("tableData", result);
          if (result.status === true) {
            fetchData();
          } else {
            Swal.fire("Error", result.message, "error");
          }
        });

        Swal.fire({
          title: t("Deleted!"),
          text: t("Office user has been deleted."),
          icon: "success",
          timer: 1400, // Time in milliseconds (1500 ms = 1.5 seconds)
          showConfirmButton: false, // Optional: Hide the confirm button
        });
      }
    });
  };

  const handleEdit = (row) => {
    navigate("/users/office/edit", { state: { row } });
  };


    const filteredtable = tableData?.filter(
     (item) =>
       item?.first_name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
       item?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase())
   );

   console.log('filteredtable',searchQuery,filteredtable);
   
  // Calculate pagination indices and current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tableData?.length / itemsPerPage);
  console.log(totalPages, indexOfLastItem, indexOfFirstItem, currentItems);

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

  const handleClear = () => {
    setSearchQuery("");
  };

  return (
    <>
      <div className="">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="mb-0">{roleName} User's</h4>
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
            <tr>
              <td colSpan="5" className="text-center py-5">
                <BeatLoader
                  size={12}
                  color={"#3C3C3C"}
                  style={{ display: "flex", justifyContent: "center" }}
                />
                <p className="mt-2">{t("Loading...")}</p>
              </td>
            </tr>
          ) : (
            <>
              <tbody>
                {filteredtable.length > 0 ? (
                  filteredtable?.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      <td>
                        {" "}
                        <div>
                          <strong>
                            {row?.first_name} {row?.last_name}
                          </strong>
                          <br />
                          {row?.city}
                        </div>
                      </td>
                      <td>{roleName}</td>
                      <td>{row?.email}</td>
                      <td>
                        {row.created_at ? formatTimestamp(row.created_at) : "-"}
                      </td>
                      <td>{row.isActive == 1 ? "Active" : "UnActive"}</td>
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
                              "Company Office User Module",
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
                              "Company Office User Module",
                              "Delete"
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
                  <td colSpan={6} align="center">
                    No Record Found
                  </td>
                )}
              </tbody>
            </>
          )}
        </Table>
        {/* Pagination Controls */}
        <div className="d-flex justify-content-between align-items-center mt-3">
          <span>
            Showing {filteredtable?.length === 0 ? 0 : indexOfFirstItem + 1} to{" "}
            {indexOfLastItem > filteredtable?.length
              ? tableData?.length
              : indexOfLastItem}{" "}
            of {tableData?.length} items
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
    </>
  );
};

export default UsersTabelComp;
