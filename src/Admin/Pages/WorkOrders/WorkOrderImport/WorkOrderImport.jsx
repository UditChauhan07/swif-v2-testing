import React, { useState } from "react";
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
  // Using a generic state variable for parsed data (works for both CSV and XLSX)
  const [parsedData, setParsedData] = useState([]);
  console.log("daataa", parsedData);
  const [token] = useState(localStorage.getItem("UserToken"));

  // Sample data for the sample file download.
  // These headers include extra format info that will be normalized on upload.
  const sampleData = [
    {
      "CustomerEmail": "aarti.verma@designersx.com",
      "CustomerId": "bElwxWThFgFgdqolJls3",
      "CustomerName": "aarti verma",
      "sendNotification": "Yes",
      // Basic Work Order Details
      "WorkerId": "mPR5Z7TufblyrBVeAHCW",
      "WorkerName": "test test",
      "expectedTime(HH:MM)": "01:00",
      "startDate(YYYY-MM-DD)": "2025-02-10",
      "startTime(HH:MM)": "09:00",
      // Work Order Details
      "workItem": "abc",
      "workDescription": "abc123",
    },
  ];

  // Download sample file as XLSX with custom column widths.
  const handleDownloadSample = () => {
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    // Set custom column widths (wch: width in characters)
    worksheet["!cols"] = [
      { wch: 30 }, // CustomerEmail
      { wch: 20 }, // CustomerId
      { wch: 20 }, // CustomerName
      { wch: 15 }, // sendNotification
      { wch: 25 }, // WorkerId
      { wch: 16 }, // WorkerName
      { wch: 20 }, // expectedTime(HH:MM)
      { wch: 20 }, // startDate(YYYY-MM-DD)
      { wch: 20 }, // startTime(HH:MM)
      { wch: 20 }, // workItem
      { wch: 25 }, // workDescription
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

  // Handle file upload (accepts both CSV and XLSX)
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith(".csv")) {
      // Parse CSV using PapaParse.
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

  // Helper function to normalize header keys.
  // For example, "startDate(YYYY-MM-DD)" becomes "startDate"
  const normalizeHeader = (header) => header.replace(/\(.*?\)/, "").trim();

  // Convert date from DD-MM-YYYY to ISO format if needed.
  const convertToISOFormatIfNeeded = (dateString) => {
    const regex = /^\d{2}-\d{2}-\d{4}$/;
    if (regex.test(dateString)) {
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

  // Reformat date string if needed (assumes input like MM/DD/YYYY)
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

  // Upload file data to the server.
  const handleUpload = async () => {
    if (parsedData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: t("Please upload a file first."),
      });
      return;
    }

    // Normalize headers: first row is assumed to be headers.
    const rawHeaders = parsedData[0];
    const headers = rawHeaders.map(normalizeHeader);
    const rows = parsedData.slice(1);

    const formattedData = rows.map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header] = row[index];
      });
      obj.status = "Pending";
      return obj;
    });

    // Group data by CustomerEmail and aggregate work order details.
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
        startDate: reformatDateString(row.startDate),
        startTime: row.startTime,
        expectedTime: row.expectedTime,
        WorkerId: row.WorkerId,
        WorkerName: row.WorkerName,
      },
      workorderDetails: row.workorderDetails,
    }));

    console.log("Final data to upload:", finalDataArray);

    Swal.fire({
      title: t("Are you sure?"),
      text: t("Do you want to upload this file?"),
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

          if (response.success) {
            Swal.fire({
              icon: "success",
              title: t("Upload Successful"),
              html: `
                <p>${response.message}</p>
                <p><strong>${t("Inserted Work Orders")}</strong>: ${response.insertedWorkOrders}</p>
                <p><strong>${t("Failed Work Orders")}</strong>: ${response.failedWorkOrders.length}</p>
              `,
            }).then(() => {
              navigate("/workorder/list");
            });
          } else {
            Swal.fire({
              icon: "error",
              title: t("Upload Failed"),
              text: t("An error occurred while uploading the file."),
            });
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
                <Button variant="primary" onClick={handleUpload}>
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
                  <tr style={{ backgroundColor: "#E7EAF3", color: "#3C3C3C" }}>
                    {parsedData[0].map((header, index) => (
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
                  {parsedData.slice(1).map((row, rowIndex) => (
                    <tr
                      key={rowIndex}
                      style={{
                        backgroundColor: "#fff",
                        borderRadius: "10px",
                        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                      }}
                    >
                      {row.map((cell, cellIndex) => (
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

          {/* Sample Data Table Section */}
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
        </div>
      </div>
    </>
  );
};

export default WorkOrderImport;
