import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import Header from "../../../../Components/Header/Header";
import PaginationComp from "../../../../Components/PaginationComp/PaginationComp";
import { useTranslation } from "react-i18next";
import { FaInfoCircle, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
import { getInvoicePayment, updateInvoicePayment } from "../../../../lib/store";
import Swal from "sweetalert2";
import Select from "react-select";

const InvoiceReport = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState([]);
  const [token] = useState(localStorage.getItem("UserToken"));
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // State for Modal (for updating status, if needed)
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [remarks, setRemarks] = useState(null);


  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await getInvoicePayment(token);
      if (response.status === 200) {
        setInvoiceData(response.data.invoices);
        setFilteredData(response.data.invoices);
      } else {
        console.error("Error fetching invoices:", response);
      }
    } catch (error) {
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInvoices();
  }, [token]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(invoiceData);
    } else {
      const filtered = invoiceData.filter(
        (item) =>
          item.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.company_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1);
  }, [searchQuery, invoiceData]);

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  // console.log("dasdasda", currentData);

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleDetailsClick = (invoice) => {
    navigate("/billings/invoice-details", { state: { invoice } });
  };

  const handleUpdateStatus = (invoice) => {
    // console.log("invoice", invoice);
    setSelectedInvoice(invoice);
    // setNewStatus(
    //   invoice.payment_status
    //     ? invoice.payment_status.charAt(0).toUpperCase() +
    //         invoice.payment_status.slice(1)
    //     : ""
    // );
    setShowModal(true);
  };

  const handleSaveStatus = async () => {
    if (!selectedInvoice) return;
    if (!newStatus) {
      alert(t("Please select a status before updating."));
      return;
    }

    const paymentData = {
      invoiceNo: selectedInvoice.invoiceNo,
      status: newStatus,
      remarks,
    };
    // console.log("paymentData", paymentData);

    // Show confirmation dialog
    const confirmation = await Swal.fire({
      title: t("Are you sure?"),
      text: t("Do you want to update the invoice status?"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("Yes"),
      cancelButtonText: t("No"),
    });

    if (confirmation.isConfirmed) {
      // Show loading indicator
      Swal.fire({
        title: t("Updating..."),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      try {
        const response = await updateInvoicePayment(token, paymentData);
        if (response && response.status === 200) {
          Swal.close(); // Close loading alert
          Swal.fire({
            icon: "success",
            title: t("Status updated"),
            text: t("The invoice status has been updated successfully."),
            confirmButtonText: t("OK"),
          });
          setShowModal(false);
          fetchInvoices();
          setNewStatus("");
        } else {
          Swal.close();
          Swal.fire({
            icon: "error",
            title: t("Update failed"),
            text: t(
              "There was an error updating the invoice status. Please try again later."
            ),
            confirmButtonText: t("OK"),
          });
          console.error("Error updating invoice status:", response);
        }
      } catch (error) {
        Swal.close();
        Swal.fire({
          icon: "error",
          title: t("Update failed"),
          text: t(
            "There was an error updating the invoice status. Please try again later."
          ),
          confirmButtonText: t("OK"),
        });
        console.error("Error updating invoice status:", error);
      }finally{    setRemarks(null);
      }
    }
  };

  const handleDownloadPDF = (invoice) => {
    const linkSource = `data:application/pdf;base64,${invoice.pdf}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = `${invoice.invoiceNo}.pdf`;
    downloadLink.click();
  };

  const options = [
    { value: "Paid", label: t("Paid") },
    { value: "Failed", label: t("Failed") },
    { value: "Overdue", label: t("Overdue") },
    { value: "Pending", label: t("Pending") },
  ];
  const handleClose = () => {
    setShowModal(false);
    setNewStatus("");
    setRemarks(null);
  };
 
  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">{t("Invoice & Payments")}</h4>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder={t("Search by Invoice No or Company Name...")}
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

          <Table hover responsive className="align-middle">
            <thead>
              <tr style={{ backgroundColor: "#E7EAF3", color: "#3C3C3C" }}>
                <th>{t("Invoice No")}</th>
                <th>{t("Company Name")}</th>
                <th>{t("Issue Date")}</th>
                <th>{t("Due Date")}</th>
                <th>{t("Payment Status")}</th>
                <th>{t("Total Amount")}</th>
                <th>{t("Actions")}</th>
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
              ) : filteredData.length === 0 || filteredData === undefined ? (
                <tr>
                  <td colSpan="6" className="text-center py-5">
                    {t("No data found")}
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      <strong>{item.invoiceNo}</strong>
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      <strong className="text-capitalize">
                        {item.company_name}
                      </strong>
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.issueDate}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.dueDate}
                    </td>
                    {/* <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.payment_status}
                    </td> */}
               <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                {item.payment_status === "Paid" ? (
                  <span
                    className="badge bg-success"
                    style={{ width: "70px", textAlign: "center" }}
                  >
                    {t("Paid")}
                  </span>
                ) : item.payment_status === "Pending" ? (
                  <span
                    className="badge bg-warning text-dark"
                    style={{ width: "70px", textAlign: "center" }}
                  >
                    {t("Pending")}
                  </span>
                ) : item.payment_status === "Failed" ? (
                  <span
                    className="badge bg-danger"
                    style={{ width: "70px", textAlign: "center" }}
                  >
                  {t("Failed")} 
                  </span>
                ) : item.payment_status === "Overdue" ? (
                  <span
                    className="badge"
                    style={{
                      backgroundColor: "orangered",
                      width: "70px",
                      textAlign: "center",
                      color: "white"
                    }}
                  >
                     {t("Overdue")}
                  </span>
                ) : (
                  item.payment_status
                )}
              </td>
   
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item?.total} ({item?.currencyCode})
                    </td>

                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      <div className="d-flex gap-2">
                        {/* <Button
                          title="Details"
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
                          onClick={() => handleDetailsClick(item)}
                        >
                          <FaInfoCircle />
                        </Button> */}
                        <Button
                          title="Update"
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
                          onClick={() => handleUpdateStatus(item)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          title="Download PDF"
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
                          onClick={() => handleDownloadPDF(item)}
                        >
                          <IoMdDownload size={20} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
          {!isLoading && filteredData.length > 0 && (
            <PaginationComp
              totalItems={filteredData.length}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
      {/* Modal for updating invoice status */}
      {/* <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setNewStatus("");
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Update Invoice Status")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t("Select Status")}</Form.Label>
              <Select
                options={options}
                onChange={(selectedOption) =>
                  setNewStatus(selectedOption.value)
                }
                placeholder={t("Select a status")}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setNewStatus("");
            }}
          >
            {t("Close")}
          </Button>
          <Button
            style={{ background: "#2e2e32", color: "white", border: "none" }}
            onClick={handleSaveStatus}
            disabled={!newStatus} // Disable if newStatus is empty
          >
            {t("Update")}
          </Button>
        </Modal.Footer>
      </Modal> */}
      <Modal show={showModal} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t("Update Invoice Status")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>{t("Select Status")}</Form.Label>
            <Select
              options={options}
              onChange={(selectedOption) => setNewStatus(selectedOption.value)}
              placeholder={t("Select a status")}
            />
          </Form.Group>
          {newStatus === "Overdue" && (
            <Form.Group className="mt-3">
              <Form.Label>{t("Enter Remarks")}</Form.Label>
              <Form.Control
                as="textarea"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder={t("Please enter remarks here...")}
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          {t("Close")}
        </Button>
        <Button
          style={{ background: "#2e2e32", color: "white", border: "none" }}
          onClick={() => handleSaveStatus(newStatus === "Overdue" ? remarks : null)}
          disabled={
            !newStatus || (newStatus === "Overdue" && remarks?.trim() === "" || newStatus ==null)
          }
        >
          {t("Update")}
        </Button>
      </Modal.Footer>
    </Modal>
    </>
  );
};

export default InvoiceReport;
