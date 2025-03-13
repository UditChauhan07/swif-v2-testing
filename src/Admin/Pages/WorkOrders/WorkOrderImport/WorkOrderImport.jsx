import React, { useState, useEffect } from "react";
import { Table, Button, Form } from "react-bootstrap";
import Header from "../../../../Components/Header/Header";
import { useTranslation } from "react-i18next";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { importWorkOrder } from "../../../../lib/store";
import { useNavigate } from "react-router-dom";

const WorkOrderImport = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [parsedData, setParsedData] = useState([]);
  const [validationErrors, setValidationErrors] = useState({});
  const [headerError, setHeaderError] = useState("");
  console.log("parsedData", parsedData);
  const [token] = useState(localStorage.getItem("UserToken"));

  const sampleData = [
    {
      CustomerEmail: "aarti.verma@designersx.com",
      CustomerId: "bElwxWThFgFgdqolJls3",
      CustomerName: "aarti verma",
      sendNotification: "Yes",
      WorkerId: "mPR5Z7TufblyrBVeAHCW",
      WorkerName: "test test",
      "expectedTime(HH:MM)": "01:00",
      "startDate(YYYY-MM-DD)": "2025-02-10",
      "startTime(HH:MM)": "09:00",
      workItem: "abc",
      workDescription: "abc123",
    },
  ];

  const expectedHeaders = [
    "CustomerEmail",
    "CustomerId",
    "CustomerName",
    "sendNotification",
    "WorkerId",
    "WorkerName",
    "expectedTime(HH:MM)",
    "startDate(YYYY-MM-DD)",
    "startTime(HH:MM)",
    "workItem",
    "workDescription",
  ];

  // Helper function to pad time so that hour always has two digits.
  const reformatTime = (timeStr) => {
    const parts = timeStr.split(":");
    if (parts.length === 2) {
      let [hour, minute] = parts;
      hour = hour.padStart(2, "0");
      return `${hour}:${minute}`;
    }
    return timeStr;
  };

  // Validation rules: note that for time fields we now allow one or two digit hour.
  const validationRules = {
    CustomerEmail: (value) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || "Invalid email format",
    CustomerId: (value) =>
      value.trim() !== "" ? true : "CustomerId is required",
    CustomerName: (value) =>
      value.trim() !== "" ? true : "CustomerName is required",
    sendNotification: (value) =>
      ["Yes", "No", "true", "false"].includes(value) ||
      "sendNotification must be Yes/No or true/false",
    WorkerId: (value) => (value.trim() !== "" ? true : "WorkerId is required"),
    WorkerName: (value) =>
      value.trim() !== "" ? true : "WorkerName is required",
    "expectedTime(HH:MM)": (value) =>
      /^(\d{1,2}):\d{2}$/.test(value) ||
      "Expected Time must be in HH:MM format",
    "startDate(YYYY-MM-DD)": (value) => {
      // If the value contains "/" assume it's in MM/DD/YY format and reformat it.
      const formatted = value.includes("/") ? reformatDateString(value) : value;
      return (
        /^\d{4}-\d{2}-\d{2}$/.test(formatted) ||
        "Start Date must be in YYYY-MM-DD format"
      );
    },
    "startTime(HH:MM)": (value) =>
      /^(\d{1,2}):\d{2}$/.test(value) || "Start Time must be in HH:MM format",
    workItem: (value) => (value.trim() !== "" ? true : "Work Item is required"),
    workDescription: (value) =>
      value.trim() !== "" ? true : "Work Description is required",
  };

  // Validate header row.
  const validateHeaderRow = (headerRow) => {
    if (headerRow.length !== expectedHeaders.length) {
      return `Invalid header count. Expected ${expectedHeaders.length}, but found ${headerRow.length}.`;
    }
    for (let i = 0; i < expectedHeaders.length; i++) {
      if (String(headerRow[i]).trim() !== expectedHeaders[i]) {
        return `Header mismatch at column ${i + 1}: expected "${
          expectedHeaders[i]
        }", but found "${headerRow[i]}".`;
      }
    }
    return true;
  };

  // Validate each data row cell-by-cell.
  const validateExcelData = (data) => {
    const errors = {};
    data.slice(1).forEach((row, rowIndex) => {
      expectedHeaders.forEach((header, colIndex) => {
        const value = String(row[colIndex] || "").trim();
        const rule = validationRules[header];
        const result = rule(value);
        if (result !== true) {
          errors[`row-${rowIndex + 1}-col-${colIndex}`] = result;
        }
      });
    });
    setValidationErrors(errors);
  };

  useEffect(() => {
    if (parsedData.length > 0) {
      const headerResult = validateHeaderRow(parsedData[0]);
      if (headerResult !== true) {
        setHeaderError(headerResult);
        Swal.fire({
          icon: "error",
          title: t("Invalid Header Row"),
          text: headerResult,
        });
      } else {
        setHeaderError("");
        validateExcelData(parsedData);
      }
    } else {
      setValidationErrors({});
      setHeaderError("");
    }
  }, [parsedData, t]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".csv")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const csvText = evt.target.result;
        const result = Papa.parse(csvText, {
          skipEmptyLines: true,
          header: false,
          defval: "",
        });
        setParsedData(result.data);
      };
      reader.readAsText(file);
    } else if (fileName.endsWith(".xlsx")) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
          cellDates: true,
          raw: false,
        });
        setParsedData(jsonData);
      };
      reader.readAsBinaryString(file);
    } else {
      Swal.fire({
        icon: "error",
        title: t("Invalid File Type"),
        text: t("Only XLSX and CSV files are allowed."),
      });
    }
  };

  const convertToISOFormatIfNeeded = (dateString) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (regex.test(dateString)) {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

  const reformatDateString = (dateStr) => {
    if (typeof dateStr !== "string") {
      console.error("Expected a string for dateStr, but got:", dateStr);
      return dateStr;
    }
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      let [month, day, year] = parts;
      month = month.padStart(2, "0");
      day = day.padStart(2, "0");
      if (year.length === 2) {
        year = "20" + year;
      }
      return `${year}-${month}-${day}`;
    }
    return dateStr;
  };

  const handleDownloadSample = () => {
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    worksheet["!cols"] = [
      { wch: 30 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
      { wch: 16 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 25 },
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sample_Work_Orders.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleUpload = async () => {
    if (parsedData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: t("Please upload a file first."),
      });
      return;
    }

    if (headerError) {
      Swal.fire({
        icon: "error",
        title: t("Invalid Header Row"),
        text: headerError,
      });
      return;
    }

    // Extract data rows.
    const rows = parsedData.slice(1);
    // Filter rows with no validation errors.
    const validRows = rows.filter((row, rowIndex) => {
      return expectedHeaders.every((_, colIndex) => {
        return !validationErrors[`row-${rowIndex + 1}-col-${colIndex}`];
      });
    });

    if (validRows.length === 0) {
      Swal.fire({
        icon: "error",
        title: t("No Valid Data"),
        text: t(
          "No rows passed validation. Please correct the errors and try again."
        ),
      });
      return;
    }

    if (validRows.length < rows.length) {
      const invalidCount = rows.length - validRows.length;
      const confirmResult = await Swal.fire({
        icon: "warning",
        title: t("Partial Data"),
        text: t(
          `Only ${validRows.length} out of ${rows.length} rows are valid. ${invalidCount} row(s) will be skipped. Do you want to continue?`
        ),
        showCancelButton: true,
        confirmButtonText: t("Yes, upload valid rows"),
        cancelButtonText: t("Cancel"),
      });
      if (!confirmResult.isConfirmed) {
        return;
      }
    } else {
      const confirmResult = await Swal.fire({
        icon: "question",
        title: t("Confirm Upload"),
        text: t("All rows are valid. Do you want to upload this file?"),
        showCancelButton: true,
        confirmButtonText: t("Yes, upload it!"),
        cancelButtonText: t("No, cancel"),
      });
      if (!confirmResult.isConfirmed) {
        return;
      }
    }

    // Build formatted data from valid rows.
    const rawHeaders = parsedData[0];
    const formattedData = validRows.map((row) => {
      const obj = {};
      rawHeaders.forEach((header, index) => {
        let value = row[index];
        // For time fields, reformat to ensure two-digit hours.
        if (header === "expectedTime(HH:MM)" || header === "startTime(HH:MM)") {
          value = reformatTime(String(value));
        }
        // For date fields, if necessary, reformat using our date function.
        if (header === "startDate(YYYY-MM-DD)") {
          value = value.includes("/")
            ? reformatDateString(String(value))
            : value;
        }
        obj[header] = value;
      });
      obj.status = "Pending";
      return obj;
    });

    // Group data by CustomerEmail.
    const groupedData = {};
    formattedData.forEach((row) => {
      const email = row.CustomerEmail;
      if (!groupedData[email]) {
        groupedData[email] = { ...row, workorderDetails: [] };
      }
      groupedData[email].workorderDetails.push({
        workItem: row.workItem,
        workDescription: row.workDescription,
      });
    });
    console.log("ggrrrr", groupedData);

    const finalDataArray = Object.values(groupedData).map((row) => ({
      companyId: localStorage.getItem("companyId"),
      customerDetailSection: {
        CustomerId: row.CustomerId,
        CustomerName: row.CustomerName,
        CustomerEmail: row.CustomerEmail,
        sendNotification:
          row.sendNotification === "Yes" || row.sendNotification === "true",
      },
      basicWorkorderDetails: {
        startDate: reformatDateString(row["startDate(YYYY-MM-DD)"]),
        startTime: row["startTime(HH:MM)"],
        expectedTime: row["expectedTime(HH:MM)"],
        WorkerId: row.WorkerId,
        WorkerName: row.WorkerName,
      },
      workorderDetails: row.workorderDetails,
    }));

    console.log("Final data to upload:", finalDataArray);

    const failedCount = rows.length - validRows.length;

    Swal.fire({
      title: t("Are you sure?"),
      text: t("Do you want to upload the valid rows?"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: t("Yes, upload it!"),
      cancelButtonText: t("No, cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: t("Uploading..."),
          text: t("Please wait while we upload the file."),
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        try {
          const response = await importWorkOrder(finalDataArray, token);
          Swal.close();
          console.log("Response:", response);

          if (response.success && response.insertedWorkOrders>0 && response.failedWorkOrders.length ==0) {
            Swal.fire({
              icon: "success",
              title: t("Upload Successful"),
              html: `
                <p>${t("Work orders imported successfully")}</p>
                <p><strong>${t("Inserted Work Orders")}</strong>: ${
                response.insertedWorkOrders
              }</p>
                <p><strong>${t(
                  "Failed Work Orders"
                )}</strong>: ${response.failedWorkOrders.length}</p>
              `,
            }).then(() => {
              navigate("/workorder/list");
            });
          } else {
            if(response.insertedWorkOrders>0 && response.failedWorkOrders.length >0){
              let failedWorkOrdersErrors = '';
  
              // Loop through the failed work orders and append each error message to the string
              response.failedWorkOrders.forEach((item, index) => {
                failedWorkOrdersErrors += `<p><strong>${t("Error")} ${index + 1}:</strong> ${item.error}</p>`;
              });
              Swal.fire({
                icon: "success",
                title: t("Partial Successful"),
                html: `
                <p>${response.message}</p>
                <p><strong>${t("Inserted Work Orders")}</strong>: ${response.insertedWorkOrders}</p>
                <p><strong>${t("Failed Work Orders")}</strong>: ${response.failedWorkOrders.length}</p>
                ${failedWorkOrdersErrors}
              `,
              });
            }else{
              Swal.fire({
                icon: "error",
                title: t("Upload Failed"),
                html:response.message
              });
            }
           
          }
        } catch (error) {
          console.error("Upload error:", error);
          Swal.fire({
            icon: "error",
            title: t("Upload Failed"),
            text: t("An error occurred while uploading the file."),
          });
        }
      }
    });
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          {/* Import Section */}
          <div
            className="border p-4 rounded mb-4"
            style={{
              backgroundColor: "#f9f9f9",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
            }}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">{t("Import Work Orders")}</h4>
              <div className="d-flex gap-2">
                <Button variant="secondary" onClick={handleUpload}>
                  {t("Upload")}
                </Button>
              </div>
            </div>
            <div
              className="border rounded p-4 mb-3"
              style={{ borderStyle: "dashed", textAlign: "center" }}
            >
              <p>{t("Drag & drop any file here")}</p>
              <p>
                {t("or")}{" "}
                <span className="text-primary">{t("browse file")}</span>{" "}
                {t("from device")}
              </p>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFile}
                />
              </Form.Group>
            </div>
          </div>

          {/* Uploaded Data Preview Table Section */}
          {parsedData.length > 0 && (
            <div
              className="border p-4 rounded"
              style={{
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{t("Uploaded Data")}</h4>
              </div>
              <Table hover responsive className="align-middle">
                <thead>
                  <tr
                    style={{
                      backgroundColor: headerError ? "#ffcccc" : "#E7EAF3",
                      color: "#3C3C3C",
                    }}
                  >
                    {parsedData[0].map((header, index) => (
                      <th
                        key={index}
                        style={{
                          textAlign: "left",
                          padding: "15px",
                          fontWeight: "600",
                          fontSize: "0.9rem",
                          color: "black",
                          background: headerError ? "#ffcccc" : "#e5e5e5",
                        }}
                        title={headerError && index === 0 ? headerError : ""}
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.slice(1).map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {row.map((cell, cellIndex) => {
                        const errorKey = `row-${rowIndex + 1}-col-${cellIndex}`;
                        const cellError = validationErrors[errorKey];
                        return (
                          <td
                            key={cellIndex}
                            style={{
                              backgroundColor: cellError ? "#ffcccc" : "white",
                              color: cellError ? "red" : "#4B5563",
                              textAlign: "left",
                              padding: "15px",
                              fontSize: "0.9rem",
                            }}
                            title={cellError || ""}
                          >
                            {cell}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Sample Data Table Section */}
          {parsedData.length > 0 ? (
            ""
          ) : (
            <div
              className="border p-4 rounded mb-4"
              style={{
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{t("Sample Work Orders - XLSX")}</h4>
                <Button variant="success" onClick={handleDownloadSample}>
                  {t("Download Sample")}
                </Button>
              </div>
              <Table hover responsive className="align-middle">
                <thead>
                  <tr style={{ backgroundColor: "#E7EAF3", color: "#3C3C3C" }}>
                    {Object.keys(sampleData[0]).map((header, index) => (
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
                  {sampleData.map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {Object.values(row).map((cell, cellIndex) => (
                        <td
                          key={cellIndex}
                          style={{
                            textAlign: "left",
                            padding: "15px",
                            fontSize: "0.9rem",
                            color: "#4B5563",
                          }}
                        >
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WorkOrderImport;
