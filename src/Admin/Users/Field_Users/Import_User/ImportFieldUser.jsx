import React, { useState } from "react";
import { Table, Button, Form } from "react-bootstrap";
import Header from "../../../../Components/Header/Header";
import { useTranslation } from "react-i18next";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import { importFieldAgent } from "../../../../lib/store";
import { useNavigate } from "react-router-dom";
import BackButton from "./../../../../utils/BackButton/BackButton";
const ImportFieldUser = () => {
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState({});
  const { t } = useTranslation();
  // We now use 'xlsxData' to hold the parsed data from the XLSX file.
  const [xlsxData, setXlsxData] = useState([]);
  const [token] = useState(localStorage.getItem("UserToken"));

  // Sample data that will be shown in its own table.
  const sampleData = [
    {
      name: "Shorya Verma",
      username: "shorya8699",
      contact_number: "8699777777",
      email: "shoryaverma.dx@gmail.com",
      password: "123456789",
      country: "India",
      address: "Gillco Valley",
    },
  ];

  const headerMapping = {
    name: "Name",
    username: "Username",
    contact_number: "Contact Number",
    email: "Email",
    password: "Password",
    country: "Country",
    address: "Address",
  };

  // Reverse mapping to convert back to original keys during upload
  const reverseHeaderMapping = Object.fromEntries(
    Object.entries(headerMapping).map(([key, value]) => [value, key])
  );

  const handleDownloadSample = () => {
    // const worksheet = XLSX.utils.json_to_sheet(sampleData, {
    //   header: Object.keys(sampleData[0]),
    // });
    const worksheetData = [Object.values(headerMapping)];
    sampleData.forEach((item) => {
      worksheetData.push(Object.keys(headerMapping).map((key) => item[key]));
    });
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set custom column widths (wch: width in characters)
    worksheet["!cols"] = [
      { wch: 20 }, // name
      { wch: 15 }, // username
      { wch: 15 }, // contact_number
      { wch: 30 }, // email
      { wch: 15 }, // password
      { wch: 15 }, // country
      { wch: 40 }, // address
    ];

    // Create a new workbook and append the worksheet.
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write the workbook as a binary array.
    const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([wbout], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Sample_Field_Users.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Handle XLSX file upload and parsing.
  // We use a FileReader to read the file as a binary string and then parse it
  // using XLSX.read. The data is converted into an array-of-arrays (with header row).
  // const handleFile = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     if (!file.name.endsWith(".xlsx")) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "Invalid File Type",
  //         text: "Please upload a valid .xlsx file.",
  //       });
  //       return;
  //     }
  //     const reader = new FileReader();
  //     reader.onload = (evt) => {
  //       const data = evt.target.result;
  //       // Read the XLSX file data
  //       const workbook = XLSX.read(data, { type: "binary" });
  //       // Use the first sheet in the workbook
  //       const firstSheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[firstSheetName];
  //       // Convert the worksheet into a JSON array (array of arrays)
  //       const jsonData = XLSX.utils.sheet_to_json(worksheet, {
  //         header: 1,
  //         defval: "",
  //       });
  //       setXlsxData(jsonData);
  //     };
  //     reader.readAsBinaryString(file);
  //   }
  // };
  // const handleFile = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     // ✅ Check if the file is of type .xlsx
  //     if (!file.name.endsWith(".xlsx")) {
  //       Swal.fire({
  //         icon: "error",
  //         title: t("Invalid File Type"),
  //         text: t("Please upload a valid .xlsx file."),
  //       });
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onload = (evt) => {
  //       const data = evt.target.result;
  //       const workbook = XLSX.read(data, { type: "binary" });
  //       const firstSheetName = workbook.SheetNames[0];
  //       const worksheet = workbook.Sheets[firstSheetName];

  //       const jsonData = XLSX.utils.sheet_to_json(worksheet, {
  //         header: 1,
  //         defval: "",
  //       });

  //       if (jsonData.length > 0) {
  //         const uploadedHeaders = jsonData[0].map((header) =>
  //           String(header).trim()
  //         );

  //         const missingHeaders = expectedHeaders.filter(
  //           (header) => !uploadedHeaders.includes(header)
  //         );
  //         const extraHeaders = uploadedHeaders.filter(
  //           (header) => !expectedHeaders.includes(header)
  //         );

  //         if (missingHeaders.length > 0 || extraHeaders.length > 0) {
  //           Swal.fire({
  //             icon: "error",
  //             title: t("Invalid File Headers"),
  //             html: `
  //               <p><strong>${t("Missing Headers")}:</strong> ${missingHeaders
  //                 .map((h) => `<span style="color:red;">${h}</span>`)
  //                 .join(", ")}</p>
  //               <p><strong>${t(
  //                 "Unexpected Headers"
  //               )}:</strong> ${extraHeaders
  //                 .map((h) => `<span style="color:orange;">${h}</span>`)
  //                 .join(", ")}</p>
  //             `,
  //           });
  //           return;
  //         }

  //         setXlsxData(jsonData);

  //       } else {
  //         Swal.fire({
  //           icon: "error",
  //           title: t("Empty File"),
  //           text: t("The uploaded file is empty or invalid."),
  //         });
  //       }
  //     };
  //     reader.readAsBinaryString(file);
  //   }
  // };

  const requiredFields = [
    "name",
    "username",
    "contact_number",
    "email",
    "country",
    "address",
  ];
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10,16}$/;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.name.endsWith(".xlsx")) {
        Swal.fire({
          icon: "error",
          title: "Invalid File Type",
          text: "Please upload a valid .xlsx file.",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (evt) => {
        const data = evt.target.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });

        if (jsonData.length > 0) {
          const uploadedHeaders = jsonData[0].map((header) =>
            String(header).trim()
          );
          const missingHeaders = expectedHeaders.filter(
            (header) => !uploadedHeaders.includes(header)
          );
          const extraHeaders = uploadedHeaders.filter(
            (header) => !expectedHeaders.includes(header)
          );

          if (missingHeaders.length > 0 || extraHeaders.length > 0) {
            Swal.fire({
              icon: "error",
              title: "Invalid File Headers",
              html: `
                <p><strong>Missing Headers:</strong> ${missingHeaders
                  .map((h) => `<span style="color:red;">${h}</span>`)
                  .join(", ")}</p>
                <p><strong>Unexpected Headers:</strong> ${extraHeaders
                  .map((h) => `<span style="color:orange;">${h}</span>`)
                  .join(", ")}</p>
              `,
            });
            return;
          }

          setXlsxData(jsonData);
          validateExcelData(jsonData);
        } else {
          Swal.fire({
            icon: "error",
            title: "Empty File",
            text: "The uploaded file is empty or invalid.",
          });
        }
      };
      reader.readAsBinaryString(file);
    }
  };

  // Validation function
  const validateExcelData = (data) => {
    const errors = {};
    data.slice(1).forEach((row, rowIndex) => {
      row.forEach((cell, cellIndex) => {
        const header = expectedHeaders[cellIndex];
        const value = String(cell).trim();

        // Required field check
        if (requiredFields.includes(reverseHeaderMapping[header]) && !value) {
          errors[`row-${rowIndex + 1}-col-${cellIndex}`] =
            "Required field missing";
        }

        // Email validation
        if (header === "Email" && value && !emailRegex.test(value)) {
          errors[`row-${rowIndex + 1}-col-${cellIndex}`] =
            "Invalid email format";
        }

        // Phone number validation
        if (header === "Contact Number" && value && !phoneRegex.test(value)) {
          errors[`row-${rowIndex + 1}-col-${cellIndex}`] =
            "Invalid phone number";
        }
      });
    });
    setValidationErrors(errors);
  };

  const expectedHeaders = Object.values(headerMapping);
  // Format the XLSX data and upload it to the API.
  // This code assumes the first row contains the headers.
  const handleUpload = async () => {
    if (xlsxData.length === 0) {
      Swal.fire({
        icon: "warning",
        title: t("No File Uploaded"),
        text: t("Please upload a file first."),
      });
      return;
    }

    const confirmResult = await Swal.fire({
      title: t("Confirm Upload"),
      text: t("Are you sure you want to upload the file?"),
      icon: "question",
      showCancelButton: true,
      confirmButtonText: t("Yes, Upload"),
      cancelButtonText: t("Cancel"),
    });

    if (!confirmResult.isConfirmed) {
      return;
    }

    // Use the first row as headers and then format the remaining rows.
    const headers = xlsxData[0];
    const validData = [];
    const invalidData = [];
    const formattedData = xlsxData.slice(1).map((row, rowIndex) => {
      const obj = {};
      const errors = [];

      headers.forEach((header, index) => {
        const originalKey = reverseHeaderMapping[header] || header;
        const value =
          row[index] !== undefined && row[index] !== null
            ? String(row[index]).trim()
            : "";
        obj[originalKey] = value;
        // obj[originalKey] =
        //   row[index] !== undefined && row[index] !== null
        //     ? String(row[index])
        //     : "";
        
        
        if (originalKey === "name" && !value) {
          errors.push(`Row ${rowIndex + 2}: Name is required.`);
        }
        if (originalKey === "country" && !value) {
          errors.push(`Row ${rowIndex + 2}: Country Name is required.`);
        }
        if (originalKey === "address" && !value) {
          errors.push(`Row ${rowIndex + 2}: Address is required.`);
        }
        if (
          originalKey === "email" &&
          !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value)
        ) {
          errors.push(`Row ${rowIndex + 2}: Invalid Email - ${value}`);
        }
        if (originalKey === "contact_number" && !/^[0-9]{10,16}$/.test(value)) {
          errors.push(`Row ${rowIndex + 2}: Invalid Contact Number - ${value}`);
        }
        if (originalKey === "password" && value.length < 6) {
          errors.push(
            `Row ${rowIndex + 2}: Password must be at least 6 characters.`
          );
        }
      });

      // Add additional properties.
      obj.profilePicture = null;
      obj.company_id = localStorage.getItem("companyId");
      obj.created_by = localStorage.getItem("name");
      obj.created_by_id = localStorage.getItem("userId");
      // return obj;
      if (errors.length > 0) {
        invalidData.push({ row: rowIndex + 2, errors });
      } else {
        validData.push(obj);
      }
    });

    if (invalidData.length > 0) {
      Swal.close();
      const errorList = invalidData
        .map((item) => `<li> ${item.errors.join(", ")}</li>`)
        .join("");
      console.log("Invalid insider data", errorList);
      const result= await Swal.fire({
        icon: "warning",
        title: t("Invalid Data Found"),
        html: `
    <p><strong>${t("The following rows contain errors:")}</strong></p>
    <ul>${errorList}</ul>
  `,
        width: 600,
        heightAuto: true,
        showConfirmButton: true,
        showCancelButton:true,
        confirmButtonText: t("Proceed"),
         cancelButtonText: t("Cancel"),
      });
      if (result.isDismissed) {
        console.log("User clicked Cancel");
        // Perform any cleanup or simply return to avoid further actions.
        return;
      }
    }

   

    if (validData.length === 0) {
      Swal.fire({
        icon: "error",
        title: t("No Valid Data"),
        text: t("Please fix the errors and re-upload the file."),
      });
      return;
    }

    console.log("Formatted Data:", validData, invalidData);

    Swal.fire({
      title: t("Uploading..."),
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const response = await importFieldAgent(validData, token);
      console.log("Response:", response);
      if (response.success === true) {
        let message = response.message || t("File uploaded successfully!");
        const successData = validData .map(
          (item) => `<li>Username  ${item.name}, email ${item.email}</li>`
        )
        .join("");

        if (validData && validData.length > 0 && invalidData.length > 0) {
 
           
          Swal.close();
          await Swal.fire({
            icon: "warning",
            title: t("Partial Success"),
            html: `
            <p><strong>${t("The following Field User Registered Succesfully")}</strong></p>
            <ul>${successData}</ul>`,
          }).then(() => {
            navigate("/users/field/list");
          });
        } else {
          Swal.close();
         await Swal.fire({
            icon: "success",
            title: t("Success"),
            html:  `
            <p><strong>${t("The following Field User Registered Succesfully")}</strong></p>
            <ul>${successData}</ul>`,
          }).then(() => {
            navigate("/users/field/list");
          });
        }
      } else {
        Swal.fire({
          icon: "error",
          title: t("Error"),
          text: response.message || t("Error uploading file."),
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      Swal.fire({
        icon: "error",
        title: t("Upload Error"),
        text: t("An error occurred while uploading the file."),
      });
    }
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
              <h4 className="mb-0">{t("Import Field Agent")}</h4>
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
              <p>
                {t("Browse file")} {t("from device")}
              </p>
              {/* <p>{t("Drag & drop any file here")}</p> */}
              {/* <p>
                {t("or")}{" "}
                <span className="text-primary">{t("browse file")}</span>{" "}
                {t("from device")}
              </p> */}

              {/* Accept only XLSX files */}
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control
                  type="file"
                  accept=".xlsx,.csv"
                  onChange={handleFile}
                />
              </Form.Group>
            </div>
          </div>

          {/* Uploaded XLSX Data Preview Table Section */}
          {xlsxData?.length > 0 && (
            <div
              className="border p-4 rounded mb-4"
              style={{
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{t("Uploaded XLSX Data")}</h4>
              </div>
              {xlsxData?.length > 0 ? (
                <Table hover responsive className="align-middle">
                  <thead>
                    <tr
                      style={{ backgroundColor: "#E7EAF3", color: "#3C3C3C" }}
                    >
                      {xlsxData[0]?.map((header, index) => (
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
                    {xlsxData?.slice(1)?.map((row, rowIndex) => (
                      <tr
                        key={rowIndex}
                        style={{
                          backgroundColor: "#fff",
                          borderRadius: "10px",
                          boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        {row?.map((cell, cellIndex) => {
                          const errorKey = `row-${
                            rowIndex + 1
                          }-col-${cellIndex}`;
                          const isError = validationErrors[errorKey];

                          return (
                            <td
                              key={cellIndex}
                              style={{
                                backgroundColor: isError ? "#ffcccc" : "white",
                                color: isError ? "red" : "black",
                              }}
                              title={isError ? validationErrors[errorKey] : ""}
                              // style={{
                              //   textAlign: "left",
                              //   padding: "15px",
                              //   fontSize: "0.9rem",
                              //   color: "#4B5563",
                              // }}
                            >
                              {cell}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-5">
                  {t("No XLSX data to display")}
                </div>
              )}
            </div>
          )}

          {/* Sample Data Table Section */}

          {xlsxData?.length <= 0 && (
            <div
              className="border p-4 rounded mb-4"
              style={{
                backgroundColor: "#f9f9f9",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="mb-0">{t("Sample Data")}</h4>
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
                        <span className="text-capitalize">{header}</span>
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
          <BackButton/>
        </div>
      </div>
    </>
  );
};

export default ImportFieldUser;
