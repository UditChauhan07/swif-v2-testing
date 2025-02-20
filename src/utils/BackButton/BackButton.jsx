import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BackButton = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
  
    const handleBackClick = (e) => {
      e.preventDefault();
      navigate(-1); // Navigates to the previous page
    };
  
    return (
      <Button variant={"dark"} type="button" onClick={handleBackClick}>
        {t("Back")}
      </Button>
    );
  };



export default BackButton;
