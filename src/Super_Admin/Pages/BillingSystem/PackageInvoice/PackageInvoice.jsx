import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import Header from "../../../../Components/Header/Header";
import PaginationComp from "../../../../Components/PaginationComp/PaginationComp";
import { useTranslation } from "react-i18next";
import { FaInfoCircle, FaEdit, FaClipboardList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";

const InvoiceReport = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [invoiceData, setInvoiceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // State for Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    setIsLoading(true);
    const sampleInvoices = [
      {
        invoiceId: "INV001",
        companyName: "Acme Corp",
        billingType: "Subscription",
        invoiceDate: "2023-01-01",
        dueDate: "2023-01-15",
        totalAmount: 1500,
        currency: "USD",
        status: "Paid",
        paymentMethod: "Stripe",
      },
      {
        invoiceId: "INV002",
        companyName: "Beta LLC",
        billingType: "PAYG",
        invoiceDate: "2023-02-05",
        dueDate: "2023-02-20",
        totalAmount: 750,
        currency: "EUR",
        status: "Pending",
        paymentMethod: "PayPal",
      },
      {
        invoiceId: "INV003",
        companyName: "Gamma Industries",
        billingType: "Subscription",
        invoiceDate: "2023-03-10",
        dueDate: "2023-03-25",
        totalAmount: 2200,
        currency: "USD",
        status: "Overdue",
        paymentMethod: "Manual",
      },
      {
        invoiceId: "INV004",
        companyName: "Delta Co.",
        billingType: "PAYG",
        invoiceDate: "2023-04-15",
        dueDate: "2023-04-30",
        totalAmount: 980,
        currency: "GBP",
        status: "Failed",
        paymentMethod: "Stripe",
      },
      {
        invoiceId: "INV005",
        companyName: "Epsilon Ltd.",
        billingType: "Subscription",
        invoiceDate: "2023-05-01",
        dueDate: "2023-05-15",
        totalAmount: 1800,
        currency: "USD",
        status: "Paid",
        paymentMethod: "PayPal",
      },
      {
        invoiceId: "INV006",
        companyName: "Zeta Enterprises",
        billingType: "PAYG",
        invoiceDate: "2023-06-20",
        dueDate: "2023-07-05",
        totalAmount: 650,
        currency: "EUR",
        status: "Pending",
        paymentMethod: "Manual",
      },
      {
        invoiceId: "INV007",
        companyName: "Eta Incorporated",
        billingType: "Subscription",
        invoiceDate: "2023-07-10",
        dueDate: "2023-07-25",
        totalAmount: 2050,
        currency: "USD",
        status: "Paid",
        paymentMethod: "Stripe",
      },
      {
        invoiceId: "INV008",
        companyName: "Theta Solutions",
        billingType: "PAYG",
        invoiceDate: "2023-08-05",
        dueDate: "2023-08-20",
        totalAmount: 890,
        currency: "GBP",
        status: "Overdue",
        paymentMethod: "PayPal",
      },
      {
        invoiceId: "INV009",
        companyName: "Iota Systems",
        billingType: "Subscription",
        invoiceDate: "2023-09-12",
        dueDate: "2023-09-27",
        totalAmount: 1750,
        currency: "USD",
        status: "Pending",
        paymentMethod: "Manual",
      },
      {
        invoiceId: "INV010",
        companyName: "Kappa Dynamics",
        billingType: "PAYG",
        invoiceDate: "2023-10-01",
        dueDate: "2023-10-16",
        totalAmount: 930,
        currency: "EUR",
        status: "Paid",
        paymentMethod: "Stripe",
      },
    ];
    setInvoiceData(sampleInvoices);
    setFilteredData(sampleInvoices);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredData(invoiceData);
    } else {
      const filtered = invoiceData.filter(
        (item) =>
          item.invoiceId.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.companyName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredData(filtered);
    }
    setCurrentPage(1); // Reset page on search change
  }, [searchQuery, invoiceData]);

  const indexOfLastItem = currentPage * rowsPerPage;
  const indexOfFirstItem = indexOfLastItem - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleDetailsClick = (invoice) => {
    navigate("/billings/invoice-details", { state: { invoice } });
  };

  const handleUpdateStatus = (invoice) => {
    setSelectedInvoice(invoice);
    setNewStatus(invoice.status); 
    setShowModal(true);
  };

  const handleSaveStatus = () => {
    if (selectedInvoice) {
      const updatedInvoices = invoiceData.map((item) =>
        item.invoiceId === selectedInvoice.invoiceId
          ? { ...item, status: newStatus }
          : item
      );
      setInvoiceData(updatedInvoices);
      setFilteredData(updatedInvoices);
      setShowModal(false); // Close the modal after saving the new status
    }
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          {/* Header & Search */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">{t("Invoice & Payments")}</h4>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder={t("Search by Invoice ID or Company Name...")}
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
                    width: "10%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Invoice ID")}
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
                    width: "10%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Billing Type")}
                </th>
                <th
                  style={{
                    width: "10%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Invoice Date")}
                </th>
                <th
                  style={{
                    width: "10%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Due Date")}
                </th>
                <th
                  style={{
                    width: "10%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Total Amount")}
                </th>
                <th
                  style={{
                    width: "8%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Currency")}
                </th>
                <th
                  style={{
                    width: "10%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Status")}
                </th>
                <th
                  style={{
                    width: "10%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Payment Method")}
                </th>
                <th
                  style={{
                    width: "12%",
                    textAlign: "left",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Actions")}
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="10" className="text-center py-5">
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
                  <td colSpan="10" className="text-center py-5">
                    {t("No data found")}
                  </td>
                </tr>
              ) : (
                currentData.map((item, index) => (
                  <tr key={index}>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      <strong>{item.invoiceId}</strong>
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      <strong className="text-capitalize">
                        {item.companyName}
                      </strong>
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.billingType}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.invoiceDate}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.dueDate}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.totalAmount}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.currency}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.status}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.paymentMethod}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      <div className="d-flex gap-2">
                        <Button
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
                        </Button>
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
                          title="Delete"
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
      {/* Modal for Updating Status */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered >
        <Modal.Header closeButton >
          <Modal.Title>{t("Update Invoice Status")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>{t("Select Status")}</Form.Label>
              <Form.Control
                as="select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
              >
                <option value="Paid">{t("Paid")}</option>
                <option value="Pending">{t("Pending")}</option>
                <option value="Failed">{t("Failed")}</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {t("Close")}
          </Button>
          <Button
            style={{ background: "#2e2e32", color: "white", border: "none" }}
            onClick={handleSaveStatus}
          >
            {t("Update")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InvoiceReport;
