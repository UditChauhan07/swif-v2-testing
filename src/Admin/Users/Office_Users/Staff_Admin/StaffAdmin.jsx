import React, { useEffect,useState } from "react";
import Header from "../../../../Components/Header/Header";
import UsersTabelComp from "../../../Components/User_Table/UsersTabelComp";
import { useParams ,useLocation} from 'react-router-dom';
import { fetch_officeUsersByRoleId } from "../../../../lib/store";
import { useTranslation } from "react-i18next";
import { Table, Button, Form } from "react-bootstrap";

const StaffAdmin = () => {
  const [tableData, setTableData] = React.useState([]);
  console.log("tableDaataa",tableData)
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(1);
  

  const token = localStorage.getItem("UserToken");
  // const companyId = localStorage.getItem("UserToken");
  const { roleName } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  // console.log('staff admin',roleName, id);
  const tableHeaders = [
    "Full Name & Location",
    "Role",
    "Email Address",
    "Created At",
    "Status",
    "Action",
  ];

   const fetchData = () =>{
     console.log('staff admin hit');
     const response = fetch_officeUsersByRoleId(id,token)
    .then((response) => {
    if (response.status === true) {

      setTableData(response.users)
    }else{
      setTableData([]);
    }
    // console.log("dasda",response)
    })
    .catch((error) => {console.log('error', error)})
    .finally(() => {setIsLoading(false)});
   }

   const handleClear = () => {
    setSearchQuery("");
  };

   useEffect(() =>{
     setIsLoading(true);
     fetchData()
   },[location,id]);



  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
        {/* <div
              className="form-header mb-4"
              style={{
                backgroundColor: "#2e2e32",
                color: "white",
                padding: "10px 20px",
                borderRadius: "8px",
                textAlign:"center"
              }}
            >
              <h4 className="mb-0">{roleName}</h4>
        </div> */}
             {/* <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">{roleName} User's</h4>
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder={t("Search...")}
                  className="me-2"
                  style={{ width: "200px" }}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Button variant="secondary" onClick={handleClear}>
                  {t("Clear")}
                </Button>
              </div>
            </div> */}
          {/* Pass props to TableComponent */}
          <UsersTabelComp
          
            tableHeaders={tableHeaders}
            tableData={tableData}
            roleName={roleName}
            isLoading={isLoading}
            fetchData={fetchData}
          />
        </div>
      </div>
    </>
  );
};

export default StaffAdmin;
