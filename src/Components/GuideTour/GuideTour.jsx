import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import "./GuideTour.css";
import { useTranslation } from "react-i18next";

const GuideTour = ({ onClose }) => {
  const [companyName] = useState(localStorage.getItem("companyName"));
  const { t } = useTranslation();

  const steps = [
    {
      title: t("Basic Guidelines to use {{companyName}}", {
        companyName: companyName || t("this Website"),
      }),
      description: t("Follow these guidelines to get started."),
    },
    {
      slides: [
        {
          image: "/images/Guidelines/Work-Order-1.png",
          title: t("Step 1: Create Work Order Time - Part 1"),
          description: t(
            "In the Settings → Work Order Time page, you can define default time parameters for work orders, ensuring consistency in time tracking and scheduling. This allows for automated time allocation, accurate logging, and efficient work order management"
          ),
        },
        {
          image: "/images/Guidelines/Work-Order-2.png",
          title: t("Step 1: Create Work Order Time - Part 2"),
          description: t(
            `In the Work Order Time page, you can configure the following settings:
Interval Time: Set the gap between work order entries.
Default Work Order Hours: Define the expected duration for field agents.
Buffer Time: Add extra time for flexibility in scheduling.`
          ),
        },
      ],
    },
    {
      slides: [
        {
          image: "/images/Guidelines/Create-Field-agent.png",
          title: t("Step 2: Create Work Order - Field Agent"),
          description: t(
            "To select a field agent, first ensure they are created in the system. Navigate to Users → Field Agent → Create to add a new field agent by filling in the necessary details. Field agents are responsible for handling customer work orders."
          ),
        },
        {
          image: "/images/Guidelines/Create-Customer.png",
          title: t("Step 2: Create Work Order - Customer Details"),
          description: t(
            "To enter customer information, navigate to Customers → Create and fill in the necessary details to add a new customer to the system."
          ),
        },
        {
          image: "/images/Guidelines/Create-Work-Order.png",
          title: t("Step 2: Create Work Order - Confirmation"),
          description: t(
            "Before finalizing the work order, ensure all details are accurate. Navigate to Work Orders → Create to create a new work order by selecting a customer, assigning a field agent, and filling in the required details."
          ),
        },
      ],
    },
    {
      title: t("Great, Now You are Ready to use"),
      description: t(
        "You've successfully completed the guided tour. Enjoy using the website!"
      ),
    },
  ];

  const [currentStep, setCurrentStep] = useState(0);
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    if (steps[currentStep].slides) {
      setSlideIndex(0);
    }
  }, [currentStep]);

  const currentStepHasSlides = steps[currentStep].slides;

  const title = currentStepHasSlides
    ? steps[currentStep].slides[slideIndex].title
    : steps[currentStep].title;
  const description = currentStepHasSlides
    ? steps[currentStep].slides[slideIndex].description
    : steps[currentStep].description;

  const renderDescription = (text) => {
    return text.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };

  const handleNext = () => {
    if (
      currentStepHasSlides &&
      slideIndex < steps[currentStep].slides.length - 1
    ) {
      setSlideIndex(slideIndex + 1);
    } else {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onClose();
      }
    }
  };

  const handlePrev = () => {
    if (currentStepHasSlides && slideIndex > 0) {
      setSlideIndex(slideIndex - 1);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Use a key so that when currentStep or slideIndex changes, the content re-mounts
  const contentKey = currentStepHasSlides
    ? `${currentStep}-${slideIndex}`
    : currentStep;

  return (
    <div className="guide-overlay">
      <div className="guide-box" style={{ position: "relative" }}>
        {/* Skip Tutorial Button */}
        <Button
          variant="link"
          onClick={onClose}
          style={{
            position: "absolute",
            bottom: "22px",
            right: 10,
            background: "grey",
            color: "white",
            textDecoration: "none",
          }}
        >
          {t("Skip Tutorial")}
        </Button>

        {/* Dynamic content with animation triggered by a key */}
        <div key={contentKey} className="fade-in">
          <h3 className="mb-3">{title}</h3>
          {currentStepHasSlides && (
            <div className="d-flex align-items-center justify-content-center image-slider">
              <Button
              variant="secondary"
                className="slider-button left"
                onClick={handlePrev}
                disabled={slideIndex === 0}
              >
                &lt;
              </Button>
              <img
                src={steps[currentStep].slides[slideIndex].image}
                alt={`Slide ${slideIndex + 1}`}
                className="slider-image"
                style={{ width: "80%", margin: "0 10px" }}
              />
              <Button
              variant="secondary"
                className="slider-button right"
                onClick={handleNext}
                disabled={slideIndex === steps[currentStep].slides.length - 1}
              >
                &gt;
              </Button>
            </div>
          )}
          <p className="mt-3">{renderDescription(description)}</p>
        </div>

        <div className="guide-buttons">
          {(currentStep > 0 || (currentStepHasSlides && slideIndex > 0)) && (
            <Button variant="secondary" onClick={handlePrev}>
              {t("Previous")}
            </Button>
          )}
          <Button
            style={{ background: "#2e2e32", border: "none" }}
            onClick={handleNext}
          >
            {currentStep === steps.length - 1 &&
            (!currentStepHasSlides ||
              slideIndex === steps[currentStep].slides.length - 1)
              ? t("Okay, Got It")
              : t("Next")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GuideTour;
