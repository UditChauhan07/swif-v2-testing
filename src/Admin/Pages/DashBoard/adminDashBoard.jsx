import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Dropdown } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import Header from "../../../Components/Header/Header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { useTranslation } from "react-i18next";
import { usePermissions } from "../../../context/PermissionContext";
import { getAdminDashboardDetails } from "../../../lib/store";
import GuideTour from "./../../../Components/GuideTour/GuideTour"; // adjust the path as needed

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const { getRoles, permissions } = usePermissions();
  const { t } = useTranslation();
  const token = localStorage.getItem("UserToken");
  const userid = localStorage.getItem("userId");
  const companyId = localStorage.getItem("companyId");
  const [showTour, setShowTour] = useState(false);
  

  useEffect(() => {
    const skipTour=localStorage.getItem("guidlines");
    if(skipTour=='active') {
      setShowTour(true);
    }
  //   const handleStorageChange = () => {
  //     setShowTour(localStorage.getItem("guidlines") === "active");
  //   };

  //   window.addEventListener("storage", handleStorageChange);
  //   return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // State for dashboard data
  const [dashboardData, setDashboardData] = useState({
    scheduled: { today: 0, thisWeek: 0, thisMonth: 0 },
    completed: { today: 0, thisWeek: 0, thisMonth: 0 },
    cancelled: { today: 0, thisWeek: 0, thisMonth: 0 },
  });

  // Current selection for the chart (default: Scheduled)
  const [selectedCategory, setSelectedCategory] = useState("scheduled");

  useEffect(() => {
    if (companyId) {
      getRoles(companyId);
    }
  }, [companyId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAdminDashboardDetails(companyId, token);
        if (response.success === true && response.data) {
          setDashboardData({
            scheduled: response.data.scheduled,
            completed: response.data.completed,
            cancelled: response.data.cancelled,
          });
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchData();
  }, [token]);

  // Chart data dynamically updates based on selectedCategory
  const chartData = {
    labels: [t("Today"), t("This Week"), t("This Month")],
    datasets: [
      {
        label: t(
          selectedCategory === "scheduled"
            ? "Work Orders Scheduled"
            : selectedCategory === "completed"
            ? "Work Orders Completed"
            : "Work Orders Cancelled"
        ),
        data: [
          dashboardData[selectedCategory].today,
          dashboardData[selectedCategory].thisWeek,
          dashboardData[selectedCategory].thisMonth,
        ],
        // Always use black (or your desired color)
        borderColor: "#2e2e32",
        backgroundColor: "#2e2e32",
        fill: true,
        tension: 0.4, // Smooth curve
      },
    ],
  };

  const dataValues = chartData.datasets[0].data;
  const computedMax = Math.ceil(Math.max(...dataValues));
  const maxY = computedMax < 5 ? 5 : computedMax;

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        beginAtZero: true,
        min: 0,
        max: maxY, // use computed max ensuring a minimum of 5
        ticks: {
          stepSize: 1,
          precision: 0, // force whole numbers
          callback: function (value) {
            return Number(value).toFixed(0);
          },
        },
      },
    },
  };

  return (
    <>
      <Header />
      {showTour && (
        <GuideTour
          onClose={() => {
            setShowTour(false);
            localStorage.setItem("guidlines", "unactive");
          }}
        />
      )}

      <div className="main-header-box">
        <div className="mt-4 pages-box">
          <Container fluid>
            {/* Stats Row */}
            <Row className="mb-4">
              <Col md={4}>
                <Card
                  className="dashboard-card"
                  onClick={() => setSelectedCategory("scheduled")}
                  style={{
                    backgroundColor:
                      selectedCategory === "scheduled" ? "#2e2e32" : "grey",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <Card.Body>
                    <h5>{t("Work Orders Scheduled")}</h5>
                    <hr style={{ borderColor: "white" }} />
                    <p>
                      {t("Today")}: {dashboardData.scheduled.today}
                    </p>
                    <p>
                      {t("This Week")}: {dashboardData.scheduled.thisWeek}
                    </p>
                    <p>
                      {t("This Month")}: {dashboardData.scheduled.thisMonth}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card
                  className="dashboard-card"
                  onClick={() => setSelectedCategory("completed")}
                  style={{
                    backgroundColor:
                      selectedCategory === "completed" ? "#2e2e32" : "grey",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <Card.Body>
                    <h5>{t("Work Orders Completed")}</h5>
                    <hr style={{ borderColor: "white" }} />
                    <p>
                      {t("Today")}: {dashboardData.completed.today}
                    </p>
                    <p>
                      {t("This Week")}: {dashboardData.completed.thisWeek}
                    </p>
                    <p>
                      {t("This Month")}: {dashboardData.completed.thisMonth}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4}>
                <Card
                  className="dashboard-card"
                  onClick={() => setSelectedCategory("cancelled")}
                  style={{
                    backgroundColor:
                      selectedCategory === "cancelled" ? "#2e2e32" : "grey",
                    color: "white",
                    cursor: "pointer",
                  }}
                >
                  <Card.Body>
                    <h5>{t("Work Orders Cancelled")}</h5>
                    <hr style={{ borderColor: "white" }} />
                    <p>
                      {t("Today")}: {dashboardData.cancelled.today}
                    </p>
                    <p>
                      {t("This Week")}: {dashboardData.cancelled.thisWeek}
                    </p>
                    <p>
                      {t("This Month")}: {dashboardData.cancelled.thisMonth}
                    </p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Chart */}
            <Row>
              <Col md={12}>
                <Card>
                  <Card.Body>
                    <h5>{t("Work Order Statistics")}</h5>
                    <Line data={chartData} options={chartOptions} />
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
