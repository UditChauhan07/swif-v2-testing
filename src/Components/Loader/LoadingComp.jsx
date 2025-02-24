import React from "react";
import { Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const LoadingComp = ({ item }) => {
  const { t } = useTranslation();
  return (
    <div className="text-center my-5">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">{t("Loading")}...</span>
      </Spinner>
      <p>
        {t("Loading")} {item ? t(item) : ""}...
      </p>
    </div>
  );
};

export default LoadingComp;
