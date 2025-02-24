import React from "react";
import Header from "../../../../Components/Header/Header";
import UsersTabelComp from "../../../Components/User_Table/UsersTabelComp";
import { useTranslation } from "react-i18next";


const OtherUsers = () => {
      const { t } = useTranslation(); 
  const tableHeaders = [
    t("Full Name & Location"),
    t("Role"),
    t("Email Address"),
    t("Created At"),
    t("Status"),
    t("Action"),
  ];

  const tableData = [
    // {
    //   fullName: (
    //     <div>
    //       <strong>new user</strong>
    //       <br />
    //       haryana zirakpur
    //     </div>
    //   ),
    //   role: "Company Super Admin",
    //   email: "hghg@gmail.com",
    //   createdAt: "24 January, 2025",
    //   status: "Activated",
    // },
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
              <h4 className="mb-0">Other Users</h4>
            </div>
          {/* Pass props to TableComponent */}
          <UsersTabelComp tableHeaders={tableHeaders} tableData={tableData} />
        </div>
      </div>
    </>
  );
};

export default OtherUsers;
