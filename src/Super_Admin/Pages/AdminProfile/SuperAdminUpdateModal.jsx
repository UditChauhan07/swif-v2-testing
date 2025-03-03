import React from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import Select from "react-select";
import { getNames } from "country-list";
import imageCompression from "browser-image-compression";
import { useTranslation } from "react-i18next";

const SuperAdminUpdateModal = ({
  show,
  handleClose,
  formData,
  handleChange,
  handleSubmit,
}) => {
  const { t } = useTranslation();

  const countryOptions = getNames().map((country) => ({
    value: country,
    label: country,
  }));

  const handleImageChangeLocal = async (field, file) => {
    if (file && file.type.startsWith("image/")) {
      const options = {
        maxSizeMB: 0.6,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      try {
        const compressedFile = await imageCompression(file, options);
        handleChange(field, compressedFile);
        // console.log("dasdsasa",field,compressedFile)
      } catch (error) {
        console.error("Error compressing image", error);
        handleChange(field, file);
      }
    } else {
      handleChange(field, file);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t("Update Super Admin Details")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {/* Row 1: Company Name & Company Logo */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t("Company Name")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Enter Company Name")}
                  name="company_name"
                  value={formData.company_name || ""}
                  onChange={(e) => handleChange("company_name", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t("Company Logo")}</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChangeLocal("company_logo", e.target.files[0])
                  }
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 2: City & Address Line 1 */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t("City")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Enter City")}
                  name="city"
                  value={formData.city || ""}
                  onChange={(e) => handleChange("city", e.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t("Address Line 1")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Enter Address")}
                  name="address_line_1"
                  value={formData.address_line_1 || ""}
                  onChange={(e) =>
                    handleChange("address_line_1", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 3: Country & ZIP/Postal Code */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t("Country")}</Form.Label>
                <Select
                  options={countryOptions}
                  value={countryOptions.find(
                    (option) => option.value === formData.country
                  )}
                  onChange={(selectedOption) =>
                    handleChange("country", selectedOption.value)
                  }
                  styles={{
                    menuList: (provided) => ({
                      ...provided,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }),
                  }}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t("ZIP/Postal Code")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Enter ZIP/Postal Code")}
                  name="zip_postal_code"
                  value={formData.zip_postal_code || ""}
                  onChange={(e) =>
                    handleChange("zip_postal_code", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 4: Contact Person Name & Contact Phone */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t("Contact Person Name")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Enter Contact Person Name")}
                  name="company_contact_person_name"
                  value={formData.company_contact_person_name || ""}
                  onChange={(e) =>
                    handleChange("company_contact_person_name", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t("Contact Phone")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Enter Contact Phone")}
                  name="contact_person_phone"
                  value={formData.contact_person_phone || ""}
                  onChange={(e) =>
                    handleChange("contact_person_phone", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
          </Row>

          {/* Row 5: Office Email & State */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t("Office Email")}</Form.Label>
                <Form.Control
                  type="email"
                  placeholder={t("Enter Office Email")}
                  name="company_office_email"
                  value={formData.company_office_email || ""}
                  onChange={(e) =>
                    handleChange("company_office_email", e.target.value)
                  }
                  required
                />
              </Form.Group>
            </Col>
            {/* <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>{t("State")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("Enter State")}
                  name="companyState"
                  value={formData.companyState || ""}
                  onChange={(e) => handleChange("companyState", e.target.value)}
                  required
                />
              </Form.Group>
            </Col> */}
          </Row>

          {/* Modal Action Buttons */}
          <div className="d-flex justify-content-end">
            <Button variant="secondary" className="me-2" onClick={handleClose}>
              {t("Cancel")}
            </Button>
            <Button variant="primary" type="submit">
              {t("Save Changes")}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default SuperAdminUpdateModal;
