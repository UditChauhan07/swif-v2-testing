import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Form,
  InputGroup,
  Button,
  Spinner,
} from "react-bootstrap";
import { FaSearch } from "react-icons/fa";
import Header from "../../../../Components/Header/Header";
import { getCompanyListApi } from "../../../../lib/store";

const CompanyAccess = () => {
  const [companyList, setCompanyList] = useState([]);
  console.log("dsadad", companyList);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("UserToken"));
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(9);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true before API hit
        const response = await getCompanyListApi(token);
        if (response.status === true) {
          setCompanyList(response?.data || []);
          setFilteredCompanies(response?.data || []);
        }
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchData();
  }, [token]);

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    const filtered = companyList.filter((company) =>
      company.company.company_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCompanies(filtered);
    setCurrentPage(1); // Reset to the first page when searching
  };

  // Get current companies based on page number
  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = filteredCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );

  // Pagination logic
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Total number of pages
  const pageNumbers = [];
  for (
    let i = 1;
    i <= Math.ceil(filteredCompanies.length / companiesPerPage);
    i++
  ) {
    pageNumbers.push(i);
  }

  // const handleClear = () => {
  //   setSearchQuery("");
  // };

  return (
    <>
      <Header />
      <div className="main-header-box">
        <div className="pages-box mt-4">
          <Row className="align-items-center mb-4">
            <Col>
              <h2 className="mb-0">Manage Companies</h2>
            </Col>
            <Col md="auto">
              <div className="d-flex gap-2">
                <Form.Control
                  type="text"
                  placeholder="Search..."
                  className=""
                  style={{ width: "200px" }}
                  value={searchQuery}
                  onChange={handleSearch}
                />
                <Button variant="secondary">Clear</Button>
              </div>
            </Col>
          </Row>

          {/* Pagination above items */}
          <div className="d-flex justify-content-end mt-4 mb-4">
            <Button
              variant="secondary"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {pageNumbers.map((number) => (
              <Button
                key={number}
                variant="light"
                className={`mx-1 ${currentPage === number ? "active" : ""}`}
                onClick={() => paginate(number)}
              >
                {number}
              </Button>
            ))}
            <Button
              variant="secondary"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
            >
              Next
            </Button>
          </div>

          {/* Show loading spinner while fetching data */}
          {isLoading ? (
            <div className="text-center mt-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <>
              {/* No Companies Found Message */}
              {filteredCompanies.length === 0 ? (
                <p className="text-center">No Companies Found</p>
              ) : (
                <Row style={{ textAlign: "center" }}>
                  {currentCompanies.map((company, index) => (
                    <Col className="mb-4" md={4} key={index}>
                      <Card
                        className="h-100 shadow-sm border-0"
                        style={{
                          transition:
                            "transform 0.3s ease, box-shadow 0.3s ease",
                          width: "90%",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "scale(1.05)";
                          e.currentTarget.style.boxShadow =
                            "0px 10px 20px rgba(0, 0, 0, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <Card.Img
                          variant="top"
                          src="https://swif.truet.net/public/swifCompany/uploads/logo/Kht22XRGSpqv.png"
                          style={{
                            height: "150px",
                            objectFit: "cover",
                            borderTopLeftRadius: "8px",
                            borderTopRightRadius: "8px",
                          }}
                        />
                        <Card.Body>
                          <Card.Title
                            className="text-uppercase fw-bold"
                            style={{ color: "#2e2e32" }}
                          >
                            {company.company.company_name}
                          </Card.Title>
                          <Card.Text className="text-muted">
                            {company.company.address_line_1} ,{" "}
                            {company.company.city} , {company.company.country} ,{" "}
                            {company.company.zip_postal_code}
                          </Card.Text>
                        </Card.Body>
                        <div
                          className="d-flex text-center"
                          style={{
                            backgroundColor: "#f8f9fa",
                            borderTop: "1px solid #ddd",
                          }}
                        >
                          <div className="flex-fill p-2 border-end">
                            <h5 className="mb-0 text-primary">1</h5>
                            <small>Total Users</small>
                          </div>
                          <div className="flex-fill p-2 border-end">
                            <h5 className="mb-0 text-success">0</h5>
                            <small>Quotations</small>
                          </div>
                          <div className="flex-fill p-2">
                            <h5 className="mb-0 text-danger">0</h5>
                            <small>Work Orders</small>
                          </div>
                        </div>
                        <Card.Footer className="bg-light">
                          <small className="text-muted">
                            Admin:{" "}
                            <span className="fw-bold">
                              {company.company.adminName}
                            </span>
                          </small>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </>
          )}

          {/* Pagination below items */}
          <div className="d-flex justify-content-end mt-4 mb-4">
            <Button
              variant="secondary"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {pageNumbers.map((number) => (
              <Button
                key={number}
                variant="light"
                className={`mx-1 ${currentPage === number ? "active" : ""}`}
                onClick={() => paginate(number)}
              >
                {number}
              </Button>
            ))}
            <Button
              variant="secondary"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === pageNumbers.length}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyAccess;
