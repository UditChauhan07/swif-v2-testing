import React from "react";
import { Table, Button, Form } from "react-bootstrap";
import Header from "../../../../Components/Header/Header";
import { FaUserEdit } from "react-icons/fa";

const ProspectsCustomer = () => {
  const tableHeaders = [
    "Name",
    "Type",
    "Email Address",
    "Customer Type",
    "Created By",
    "Action",
  ];

  const tableData = [
    {
      name: "surbhi 1",
      type: "Individual",
      email: "surbhikumar.dx@gmail.com",
      customerType: "Lead",
      createdBy: "new user",
    },
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
              <h4 className="mb-0">Prospects Customer</h4>
              <div className="d-flex gap-2 align-items-center">
                <span>Search:</span>
                <Form.Control
                  type="text"
                  placeholder="Search"
                  style={{ width: "200px" }}
                />
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
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, index) => (
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
                      {row.name}
                    </td>
                    <td
                      style={{
                        textAlign: "left",
                        padding: "15px",
                        fontSize: "0.9rem",
                        color: "#4B5563",
                      }}
                    >
                      {row.type}
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
                      {row.customerType}
                    </td>
                    <td
                      style={{
                        textAlign: "left",
                        padding: "15px",
                        fontSize: "0.9rem",
                        color: "#4B5563",
                      }}
                    >
                      {row.createdBy}
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
                        >
                          <FaUserEdit size={20} />
                        </Button>
                        <Button
                          variant="warning"
                          size="sm"
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
                        </Button>
                        <Button
                          variant="danger"
                          size="sm"
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
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <span>
                Showing 1 to {tableData.length} of {tableData.length} items
              </span>
              <div>
                <Button variant="light" className="me-1" disabled>
                  &laquo;
                </Button>
                <Button variant="light" disabled>
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

export default ProspectsCustomer;
