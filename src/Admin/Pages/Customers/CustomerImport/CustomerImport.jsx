import React from "react";
import { Button, Form } from "react-bootstrap";
import Header from "../../../../Components/Header/Header";

const CustomerImport = () => {
  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <div className="border p-4 rounded" style={{ backgroundColor: "#f8fff8" }}>
            <h4 className="text-center mb-4">Import Customers</h4>
            <div
              className="border rounded p-4 mb-4"
              style={{ borderStyle: "dashed", textAlign: "center" }}
            >
              <p>Drag & drop any file here</p>
              <p>
                or <span className="text-primary">browse file</span> from device
              </p>
              <Form.Group controlId="formFile" className="mb-3">
                <Form.Control type="file" />
              </Form.Group>
            </div>
            <div className="text-center">
              <Button variant="primary" className="px-5">
                Upload
              </Button>
            </div>
          </div>
          <div className="border-top mt-4 pt-3">
            <h5 className="text-center">Sample Field Users - Excel</h5>
            <div className="mt-3">
              <img
                src="/path/to/sample-excel-image.png" // Replace with actual path to the sample image
                alt="Sample Field Users Excel"
                className="img-fluid border"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomerImport;
