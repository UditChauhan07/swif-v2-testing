import React, { useEffect, useState } from "react";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import { useTranslation } from "react-i18next";
import { FaInfoCircle, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { IoMdDownload } from "react-icons/io";
import Swal from "sweetalert2";
import Select from "react-select";
import {
  getInvoicePaymentSingleCompany,
  updateInvoicePayment,
} from "../../../lib/store";
import Header from "../../../Components/Header/Header";
import PaginationComp from "../../../Components/PaginationComp/PaginationComp";

const CompanyInvoices = () => {
  const { t } = useTranslation();
  const [invoiceData, setInvoiceData] = useState([]);
  const [token] = useState(localStorage.getItem("UserToken"));
  const [companyId, setcompanyId] = useState(localStorage.getItem("companyId"));
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const fetchInvoices = async () => {
    setIsLoading(true);
    try {
      const response = await getInvoicePaymentSingleCompany(companyId);
      if (response.status === 200) {
        setInvoiceData(response.data.invoiceData);
        setFilteredData(response.data.invoiceData);
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
  const currentData = filteredData?.slice(indexOfFirstItem, indexOfLastItem);

  const handleClear = () => {
    setSearchQuery("");
  };

  const handleDownloadPDF = (invoice) => {
    const linkSource = `data:application/pdf;base64,${invoice.pdf}`;
    const downloadLink = document.createElement("a");
    downloadLink.href = linkSource;
    downloadLink.download = `${invoice.invoiceNo}.pdf`;
    downloadLink.click();
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
              ) : filteredData?.length === 0 || filteredData === undefined ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
                    {t("No data found")}
                  </td>
                </tr>
              ) : (
                currentData?.map((item, index) => (
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
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item.payment_status}
                    </td>
                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      {item?.total} ({item?.currencyCode})
                    </td>

                    <td style={{ padding: "15px", fontSize: "0.9rem" }}>
                      <div className="d-flex gap-2">
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
          {!isLoading && filteredData?.length > 0 && (
            <PaginationComp
              totalItems={filteredData?.length}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default CompanyInvoices;
