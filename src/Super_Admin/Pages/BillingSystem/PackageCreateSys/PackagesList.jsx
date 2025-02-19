import React from 'react'
import { Card, Container, Row, Col, Badge, Table } from "react-bootstrap"
import { Check2Circle, XCircle } from "react-bootstrap-icons"
import "./PackageCreateSys.css" // External CSS file for custom styling
import Header from '../../../../Components/Header/Header'
const PackagesList = () => {
    const packages = [
        {
          package_id: "lite",
          name: "Lite",
          cost_per_month: 50,
          features: {
            add_customers: 100,
            add_office_users: 5,
            add_field_users: 20,
            work_order_creation: 100,
            work_order_execution: 100,
          },
          payg: true,
          payg_rates: {
            add_customers: 0.05,
            add_office_users: 3,
            add_field_users: 2,
            work_order_creation: 0.15,
            work_order_execution: 0.2,
          },
        },
        {
          package_id: "plus",
          name: "Plus",
          cost_per_month: 150,
          features: {
            add_customers: 500,
            add_office_users: 20,
            add_field_users: 100,
            work_order_creation: 500,
            work_order_execution: 500,
          },
          payg: true,
          payg_rates: {
            add_customers: 0.02,
            add_office_users: 2,
            add_field_users: 1,
            work_order_creation: 0.1,
            work_order_execution: 0.15,
          },
        },
        {
          package_id: "prime",
          name: "Prime",
          cost_per_month: 300,
          features: {
            add_customers: 1000,
            add_office_users: 50,
            add_field_users: 300,
            work_order_creation: 1000,
            work_order_execution: 1000,
          },
          payg: true,
          payg_rates: {
            add_customers: 0.01,
            add_office_users: 1.5,
            add_field_users: 0.75,
            work_order_creation: 0.05,
            work_order_execution: 0.1,
          },
        },
      ]
    
      return (
        <>
          <Header/>
          <div className="main-header-box">
            <div className="mt-4 pages-box">
              <Container fluid className="py-5 package-container">
                <div className="form-header">
                  <h4 className="text-center">Plans and Packages</h4>
                </div>
    
                <Row className="justify-content-center">
                  {packages.map((pkg) => (
                    <Col key={pkg.package_id} xs={12} md={6} lg={4} className="mb-4">
                      <Card className={`package-card package-${pkg.package_id}`}>
                        <Card.Header className="text-center">
                          <h3 className="package-title">{pkg.name}</h3>
                          <h2 className="package-price">
                            ${pkg.cost_per_month} <small>/month</small>
                          </h2>
                        </Card.Header>
                        <Card.Body>
                          <Table className="package-table" bordered hover size="sm">
                            <thead>
                              <tr className='text-center'>
                                <th>Feature</th>
                                <th>Limit</th>
                                <th>PAYG Rate</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(pkg.features).map(([feature, limit]) => (
                                <tr key={feature}>
                                  <td>{feature.replace(/_/g, " ")}</td>
                                  <td>{limit}</td>
                                  <td>${pkg.payg_rates[feature]}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Card.Body>
                        <Card.Footer className="text-center">
                          <Badge bg={pkg.payg ? "success" : "danger"} className="package-badge">
                            {pkg.payg ? (
                              <>
                                <Check2Circle /> PAYG Available
                              </>
                            ) : (
                              <>
                                <XCircle /> No PAYG
                              </>
                            )}
                          </Badge>
                        </Card.Footer>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Container>
            </div>
          </div>
        </>
      )
}

export default PackagesList
