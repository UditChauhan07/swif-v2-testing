import React from "react";
import Header from "../../Components/Header/Header";
import UsersTabelComp from "../../Admin/Components/User_Table/UsersTabelComp";

const Accountant = () => {
  const tableHeaders = [
    "Full Name & Location",
    "Role",
    "Email Address",
    "Created At",
    "Status",
    "Action",
  ];

  const tableData = [
    {
      fullName: (
        <div>
          <strong>new user</strong>
          <br />
          haryana zirakpur
        </div>
      ),
      role: "Company Super Admin",
      email: "hghg@gmail.com",
      createdAt: "24 January, 2025",
      status: "Activated",
    },
  ];

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
        <div
              className="form-header mb-4"
              style={{
                backgroundColor: "#8d28dd",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                textAlign:"center"
              }}
            >
              <h4 className="mb-0">Accountant</h4>
            </div>
          {/* Pass props to TableComponent */}
          <UsersTabelComp tableHeaders={tableHeaders} tableData={tableData} />
        </div>
      </div>
    </>
  );
};

export default Accountant;
