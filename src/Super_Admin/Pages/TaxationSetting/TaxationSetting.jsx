import React, { useState } from "react";
import Header from "../../../Components/Header/Header";
import { Table, Button, Form, Modal } from "react-bootstrap";
import { FaEdit } from "react-icons/fa";
import PaginationComp from "../../../Components/PaginationComp/PaginationComp";
import { useTranslation } from "react-i18next";

// 
const initialTaxData = [
  { id: 1, country: "USA", taxName: "Federal Tax", taxPrice: "$10.00" },
  { id: 2, country: "Spain", taxName: "VAT", taxPrice: "21%" },
  { id: 3, country: "India", taxName: "GST", taxPrice: "18%" },
  { id: 4, country: "Germany", taxName: "VAT", taxPrice: "19%" },
  { id: 5, country: "UK", taxName: "VAT", taxPrice: "20%" },
  { id: 6, country: "Canada", taxName: "GST/HST", taxPrice: "13%" },
  // Add more sample rows as needed...
];

const TaxationSetting = () => {
  const { t } = useTranslation();
  const [taxData, setTaxData] = useState(initialTaxData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTax, setSelectedTax] = useState(null);

  const filteredData = taxData.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.country.toLowerCase().includes(query) ||
      item.taxName.toLowerCase().includes(query) ||
      item.taxPrice.toLowerCase().includes(query)
    );
  });

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const handleEditClick = (item) => {
    setSelectedTax(item);
    setShowEditModal(true);
  };

  const handleModalSave = () => {
    setTaxData((prevData) =>
      prevData.map((item) =>
        item.id === selectedTax.id
          ? { ...item, taxPrice: selectedTax.taxPrice }
          : item
      )
    );
    setShowEditModal(false);
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="mt-4 pages-box">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">{t("Taxation Settings")}</h4>
            <div className="d-flex gap-2">
              <Form.Control
                type="text"
                placeholder={t("Search taxation settings...")}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                style={{ width: "200px" }}
              />
              <Button variant="secondary" onClick={handleClearSearch}>
                {t("Clear")}
              </Button>
            </div>
          </div>
          <Table
            hover
            responsive
            className="align-middle"
            style={{ minWidth: "600px" }}
          >
            <thead>
              <tr style={{ backgroundColor: "#E7EAF3", color: "#3C3C3C" }}>
                <th
                  style={{
                    textAlign: "left",
                    padding: "15px",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Country")}
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "15px",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Tax Name")}
                </th>
                <th
                  style={{
                    textAlign: "left",
                    padding: "15px",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Tax Rate")}
                </th>
                <th
                  style={{
                    textAlign: "center",
                    padding: "15px",
                    background: "#e5e5e5",
                  }}
                >
                  {t("Action")}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      backgroundColor: "#fff",
                      borderRadius: "10px",
                      boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <td style={{ padding: "15px" }}>{item.country}</td>
                    <td style={{ padding: "15px" }}>{item.taxName}</td>
                    <td style={{ padding: "15px" }}>{item.taxPrice}</td>
                    <td style={{ textAlign: "center", padding: "15px" }}>
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        style={{
                          borderRadius: "50%",
                          width: "35px",
                          height: "35px",
                        }}
                        onClick={() => handleEditClick(item)}
                      >
                        <FaEdit />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    {t("No records found")}.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          <PaginationComp
            totalItems={filteredData.length}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            onPageChange={(pageNumber) => setCurrentPage(pageNumber)}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("Edit Taxation")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTax && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>{t("Country")}</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedTax.country}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("Tax Name")}</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedTax.taxName}
                  disabled
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>{t("Tax Rate")}</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedTax.taxPrice}
                  onChange={(e) =>
                    setSelectedTax({ ...selectedTax, taxPrice: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            {t("Cancel")}
          </Button>
          <Button variant="primary" onClick={handleModalSave}>
            {t("Save")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TaxationSetting;
