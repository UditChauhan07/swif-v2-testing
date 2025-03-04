import React, { useState } from "react";
import { Form, Row, Col, Card, Button } from "react-bootstrap";
import Select from "react-select";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import Header from "../../../../Components/Header/Header";
import { LanguageCompanyUpdateApi } from "../../../../lib/store";

const LanguageChange = () => {
  const { t, i18n } = useTranslation();

  const languageOptions = [
    { value: "en", label: "English" },
    { value: "es", label: "Spanish" },
  ];

  const defaultLang = localStorage.getItem("defaultLanguage") || "en";

  // Set selected language properly based on stored value
  const [selectedLanguage, setSelectedLanguage] = useState(
    languageOptions.find((opt) => opt.value === defaultLang) ||
      languageOptions[0]
  );

  const [isLoading, setIsLoading] = useState(false);
  const [companyId] = useState(localStorage.getItem("companyId"));
  const [token] = useState(localStorage.getItem("UserToken"));

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedLanguage) {
      Swal.fire({
        title: t("Error"),
        text: t("Please select a language"),
        icon: "error",
      });
      return;
    }

    setIsLoading(true);
    const languageSend = selectedLanguage.value;

    try {
      const response = await LanguageCompanyUpdateApi(
        companyId,
        token,
        languageSend
      );

      if (response.status) {
        i18n.changeLanguage(selectedLanguage.value);
        localStorage.setItem("defaultLanguage", selectedLanguage.value);

        Swal.fire({
          title: t("Success"),
          text: t("Language updated successfully"),
          icon: "success",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        Swal.fire({
          title: t("Error"),
          text: response.message || t("Failed to update language"),
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: t("Error"),
        text: t("An unexpected error occurred"),
        icon: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      <div className="main-header-box mt-4">
        <div className="pages-box">
          <div
            className="form-header mb-4"
            style={{
              backgroundColor: "#2e2e32",
              color: "white",
              padding: "10px 20px",
              borderRadius: "8px",
            }}
          >
            <h4 className="mb-0">{t("Change Language")}</h4>
          </div>

          <Form onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col md={6} className="mx-auto">
                <Card className="p-3">
                  <Form.Group controlId="languageSelect">
                    <Form.Label>{t("Select Language")}:</Form.Label>
                    <Select
                      options={languageOptions}
                      value={selectedLanguage}
                      onChange={(selectedOption) =>
                        setSelectedLanguage(selectedOption)
                      }
                      placeholder={t("Choose a language")}
                      isSearchable
                    />
                  </Form.Group>
                </Card>
              </Col>
            </Row>
            <div className="text-center">
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? t("Saving...") : t("Save Language")}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default LanguageChange;
