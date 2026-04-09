import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { 
  FaBoxOpen, 
  FaChartLine, 
  FaUsers, 
  FaTools,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaBuilding,
  FaFlask,
  FaHandshake,
  FaLaptop
} from 'react-icons/fa';
import { Bar, Pie } from 'react-chartjs-2';
import analyticsApi from '../../api/analyticsApi';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalResources: 0,
    activeResources: 0,
    outOfServiceResources: 0,
    averageCapacity: 0,
    totalCapacity: 0
  });

  const [resourceData, setResourceData] = useState({
    labels: [],
    datasets: []
  });

  const [statusData, setStatusData] = useState({
    labels: [],
    datasets: []
  });

  const [capacityData, setCapacityData] = useState({
    labels: [],
    datasets: []
  });

  const [recentResources, setRecentResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch overview statistics
      const overviewStats = await analyticsApi.getOverviewStats();
      setStats({
        totalResources: overviewStats.totalResources || 0,
        activeResources: overviewStats.activeResources || 0,
        outOfServiceResources: overviewStats.outOfServiceResources || 0,
        averageCapacity: overviewStats.averageCapacity || 0,
        totalCapacity: overviewStats.totalCapacity || 0
      });

      // Fetch chart data
      const chartData = await analyticsApi.getChartData();

      // Resource type distribution
      const typeData = chartData.typeDistribution || {};
      setResourceData({
        labels: Object.keys(typeData),
        datasets: [
          {
            label: 'Resources by Type',
            data: Object.values(typeData),
            backgroundColor: [
              'rgba(54, 162, 235, 0.8)',
              'rgba(255, 99, 132, 0.8)',
              'rgba(255, 206, 86, 0.8)',
              'rgba(75, 192, 192, 0.8)',
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });

      // Status distribution
      const statusData = chartData.statusDistribution || {};
      setStatusData({
        labels: Object.keys(statusData),
        datasets: [
          {
            label: 'Resource Status',
            data: Object.values(statusData),
            backgroundColor: [
              'rgba(75, 192, 192, 0.8)',
              'rgba(255, 99, 132, 0.8)',
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 99, 132, 1)',
            ],
            borderWidth: 1,
          },
        ],
      });

      // Capacity distribution
      const capacityDist = chartData.capacityDistribution || {};
      setCapacityData({
        labels: Object.keys(capacityDist),
        datasets: [
          {
            label: 'Resources by Capacity',
            data: Object.values(capacityDist),
            backgroundColor: 'rgba(54, 162, 235, 0.8)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      });

      // Fetch recent resources
      const recent = await analyticsApi.getRecentResources();
      setRecentResources(recent);

    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Resource Analytics',
      },
    },
  };

  const StatCard = ({ title, value, icon, color, trend }) => (
    <Card className="h-100 shadow-sm border-0">
      <Card.Body className="d-flex align-items-center">
        <div className={`rounded-circle p-3 me-3 bg-${color} bg-opacity-10`}>
          <div className={`text-${color}`}>{icon}</div>
        </div>
        <div className="flex-grow-1">
          <h6 className="text-muted mb-1">{title}</h6>
          <h4 className="mb-0 fw-bold">{value}</h4>
          {trend && (
            <Badge bg={trend > 0 ? 'success' : 'danger'} className="mt-1">
              {trend > 0 ? '+' : ''}{trend}%
            </Badge>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div className="admin-dashboard">
      <Container fluid className="py-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Dashboard Overview</h2>
          <div className="text-muted">
            Last updated: {new Date().toLocaleString()}
          </div>
        </div>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col xl={3} lg={6} md={6} className="mb-3">
            <StatCard
              title="Total Resources"
              value={stats.totalResources}
              icon={<FaBoxOpen size={24} />}
              color="primary"
              trend={5.2}
            />
          </Col>
          <Col xl={3} lg={6} md={6} className="mb-3">
            <StatCard
              title="Active Resources"
              value={stats.activeResources}
              icon={<FaCheckCircle size={24} />}
              color="success"
              trend={2.1}
            />
          </Col>
          <Col xl={3} lg={6} md={6} className="mb-3">
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={<FaChartLine size={24} />}
              color="info"
              trend={8.7}
            />
          </Col>
          <Col xl={3} lg={6} md={6} className="mb-3">
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={<FaClock size={24} />}
              color="warning"
              trend={-3.2}
            />
          </Col>
        </Row>

        {/* Charts Row */}
        <Row className="mb-4">
          <Col lg={8} className="mb-3">
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-white border-0 pt-3">
                <h5 className="mb-0">Resources by Type</h5>
              </Card.Header>
              <Card.Body>
                <Bar data={resourceData} options={chartOptions} />
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-3">
            <Card className="shadow-sm border-0 h-100">
              <Card.Header className="bg-white border-0 pt-3">
                <h5 className="mb-0">Resources by Status</h5>
              </Card.Header>
              <Card.Body>
                <Pie data={statusData} options={chartOptions} />
              </Card.Body>
            </Card>
          </Col>
        </Row>

          {/* Additional Stats */}
          <Row>
            <Col lg={6} className="mb-3">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-0 pt-3">
                  <h5 className="mb-0">Maintenance Overview</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <div className="text-center mb-3">
                        <FaTools className="text-warning mb-2" size={32} />
                        <h4>{stats.maintenanceTickets}</h4>
                        <p className="text-muted mb-0">Open Tickets</p>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="text-center mb-3">
                        <FaCheckCircle className="text-success mb-2" size={32} />
                        <h4>{stats.resolvedTickets}</h4>
                        <p className="text-muted mb-0">Resolved This Month</p>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-3">
              <Card className="shadow-sm border-0">
                <Card.Header className="bg-white border-0 pt-3">
                  <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary">
                      <FaBoxOpen className="me-2" />
                      Add New Resource
                    </button>
                    <button className="btn btn-info">
                      <FaChartLine className="me-2" />
                      View Full Report
                    </button>
                    <button className="btn btn-warning">
                      <FaTools className="me-2" />
                      Review Maintenance Requests
                    </button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
      </Container>
    </div>
  );
};

export default AdminDashboard;
