import React, { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import { BeatLoader } from "react-spinners";
import Header from "../../../../Components/Header/Header";
import { Link, useNavigate } from "react-router-dom";
import { getRoles } from "../../../../lib/store";

const Roles = () => {
  const navigate = useNavigate();
  const [rolesList, setRolesList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setuserId] = useState(localStorage.getItem("userId"));
  const rowsPerPage = 4;

  useEffect(() => {
    const fetchRoles = async () => {
      setIsLoading(true);
      try {
        const response = await getRoles(userId);
        // console.log("dasda", response);
        setRolesList(response?.data);
      } catch (error) {
        console.error("Error fetching roles data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoles();
  }, []);

  // Handle pagination
  const handlePageChange = (direction) => {
    if (direction === "next" && currentPage * rowsPerPage < rolesList.length) {
      setCurrentPage(currentPage + 1);
    } else if (direction === "previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Pagination logic
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = rolesList?.slice(indexOfFirstRow, indexOfLastRow);
  console.log("rolesss", currentRows);

  const handleEditRoles = (role) => {
    navigate("/settings/roles/edit", { state: { role } });
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <div className="mb-2">
            <Link to={"/settings/roles/create"}>
              <Button>Create</Button>
            </Link>
          </div>
          <h2 className="mb-4">SAAS Roles</h2>
          <div className="">
            <Table
              hover
              responsive
              className="align-middle"
              style={{ minWidth: "1000px" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#E7EAF3", color: "#3C3C3C" }}>
                  <th
                    style={{
                      width: "26%",
                      textAlign: "left",
                      background: "#e5e5e5",
                    }}
                  >
                    Role Name
                  </th>
                  <th
                    style={{
                      width: "20%",
                      textAlign: "left",
                      background: "#e5e5e5",
                    }}
                  >
                    Role Level
                  </th>
                  <th
                    style={{
                      width: "30%",
                      textAlign: "left",
                      background: "#e5e5e5",
                    }}
                  >
                    Role Description
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "10%", background: "#e5e5e5" }}
                  >
                    # of Users
                  </th>
                  <th
                    className="text-center"
                    style={{ width: "10%", background: "#e5e5e5" }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5">
                      <BeatLoader
                        size={12}
                        color={"#3C3C3C"}
                        style={{ display: "flex", justifyContent: "center" }}
                      />
                      <p className="mt-2">Loading...</p>
                    </td>
                  </tr>
                ) : currentRows === undefined ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No Roles Found
                    </td>
                  </tr>
                ) : (
                  currentRows?.map((role, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          textAlign: "left",
                          padding: "15px",
                          fontSize: "0.9rem",
                          color: "#4B5563",
                        }}
                      >
                        {role.roleName}
                      </td>
                      <td
                        style={{
                          textAlign: "left",
                          padding: "15px",
                          fontSize: "0.9rem",
                          color: "#4B5563",
                        }}
                      >
                        {role.roleLevel}
                      </td>
                      <td
                        style={{
                          textAlign: "left",
                          padding: "15px",
                          fontSize: "0.9rem",
                          color: "#4B5563",
                        }}
                      >
                        {role.roleDescription}
                      </td>
                      <td className="text-center">0</td>
                      <td className="text-center">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          style={{
                            borderRadius: "50%",
                            width: "35px",
                            height: "35px",
                          }}
                          onClick={() => handleEditRoles(role)}
                        >
                          <FaEdit />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {rolesList?.length > 0 && (
              <div className="d-flex justify-content-end mt-3">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => handlePageChange("previous")}
                  disabled={currentPage === 1}
                >
                  &laquo; Previous
                </Button>
                <Button variant="outline-secondary" size="sm" className="me-2">
                  {currentPage}
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage * rowsPerPage >= rolesList?.length}
                >
                  Next &raquo;
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Roles;
