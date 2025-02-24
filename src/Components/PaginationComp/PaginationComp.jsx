import React from "react";
import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const PaginationComp = ({
  totalItems,
  currentPage,
  rowsPerPage,
  onPageChange,
}) => {
    const { t } = useTranslation();
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const handlePrevPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <span>
        {t("Showing {{start}} to {{end}} of {{total}} items", {
          start: totalItems === 0 ? 0 : indexOfFirstRow + 1,
          end: indexOfLastRow > totalItems ? totalItems : indexOfLastRow,
          total: totalItems,
        })}
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
            variant={currentPage === index + 1 ? "secondary" : "light"}
            className="me-1"
            onClick={() => onPageChange(index + 1)}
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
  );
};

export default PaginationComp;
