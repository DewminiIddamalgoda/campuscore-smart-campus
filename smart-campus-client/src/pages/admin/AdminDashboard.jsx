// import React, { useState, useEffect } from 'react';
// import { Container, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap';
// import { 
//   FaBoxOpen, 
//   FaChartLine, 
//   FaUsers, 
//   FaTools,
//   FaCheckCircle,
//   FaTimesCircle,
//   FaClock,
//   FaBuilding,
//   FaFlask,
//   FaHandshake,
//   FaLaptop
// } from 'react-icons/fa';
// import { Bar, Pie } from 'react-chartjs-2';
// import analyticsApi from '../../api/analyticsApi';
// import {
//   Chart as ChartJS,
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend,
// } from 'chart.js';

// ChartJS.register(
//   CategoryScale,
//   LinearScale,
//   BarElement,
//   ArcElement,
//   Title,
//   Tooltip,
//   Legend
// );

// const AdminDashboard = () => {
//   const [stats, setStats] = useState({
//     totalResources: 0,
//     activeResources: 0,
//     outOfServiceResources: 0,
//     averageCapacity: 0,
//     totalCapacity: 0
//   });

//   const [resourceData, setResourceData] = useState({
//     labels: [],
//     datasets: []
//   });

//   const [statusData, setStatusData] = useState({
//     labels: [],
//     datasets: []
//   });

//   const [capacityData, setCapacityData] = useState({
//     labels: [],
//     datasets: []
//   });

//   const [recentResources, setRecentResources] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchDashboardData();
//   }, []);

//   const fetchDashboardData = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       // Fetch overview statistics
//       const overviewStats = await analyticsApi.getOverviewStats();
//       setStats({
//         totalResources: overviewStats.totalResources || 0,
//         activeResources: overviewStats.activeResources || 0,
//         outOfServiceResources: overviewStats.outOfServiceResources || 0,
//         averageCapacity: overviewStats.averageCapacity || 0,
//         totalCapacity: overviewStats.totalCapacity || 0
//       });

//       // Fetch chart data
//       const chartData = await analyticsApi.getChartData();

//       // Resource type distribution
//       const typeData = chartData.typeDistribution || {};
//       setResourceData({
//         labels: Object.keys(typeData),
//         datasets: [
//           {
//             label: 'Resources by Type',
//             data: Object.values(typeData),
//             backgroundColor: [
//               'rgba(54, 162, 235, 0.8)',
//               'rgba(255, 99, 132, 0.8)',
//               'rgba(255, 206, 86, 0.8)',
//               'rgba(75, 192, 192, 0.8)',
//             ],
//             borderColor: [
//               'rgba(54, 162, 235, 1)',
//               'rgba(255, 99, 132, 1)',
//               'rgba(255, 206, 86, 1)',
//               'rgba(75, 192, 192, 1)',
//             ],
//             borderWidth: 1,
//           },
//         ],
//       });

//       // Status distribution
//       const statusData = chartData.statusDistribution || {};
//       setStatusData({
//         labels: Object.keys(statusData),
//         datasets: [
//           {
//             label: 'Resource Status',
//             data: Object.values(statusData),
//             backgroundColor: [
//               'rgba(75, 192, 192, 0.8)',
//               'rgba(255, 99, 132, 0.8)',
//             ],
//             borderColor: [
//               'rgba(75, 192, 192, 1)',
//               'rgba(255, 99, 132, 1)',
//             ],
//             borderWidth: 1,
//           },
//         ],
//       });

//       // Capacity distribution
//       const capacityDist = chartData.capacityDistribution || {};
//       setCapacityData({
//         labels: Object.keys(capacityDist),
//         datasets: [
//           {
//             label: 'Resources by Capacity',
//             data: Object.values(capacityDist),
//             backgroundColor: 'rgba(54, 162, 235, 0.8)',
//             borderColor: 'rgba(54, 162, 235, 1)',
//             borderWidth: 1,
//           },
//         ],
//       });

//       // Fetch recent resources
//       const recent = await analyticsApi.getRecentResources();
//       setRecentResources(recent);

//     } catch (err) {
//       setError('Failed to load dashboard data. Please try again.');
//       console.error('Error fetching dashboard data:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const chartOptions = {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: 'top',
//       },
//       title: {
//         display: true,
//         text: 'Resource Analytics',
//       },
//     },
//   };

//   const StatCard = ({ title, value, icon, color, trend }) => (
//     <Card className="h-100 shadow-sm border-0">
//       <Card.Body className="d-flex align-items-center">
//         <div className={`rounded-circle p-3 me-3 bg-${color} bg-opacity-10`}>
//           <div className={`text-${color}`}>{icon}</div>
//         </div>
//         <div className="flex-grow-1">
//           <h6 className="text-muted mb-1">{title}</h6>
//           <h4 className="mb-0 fw-bold">{value}</h4>
//           {trend && (
//             <Badge bg={trend > 0 ? 'success' : 'danger'} className="mt-1">
//               {trend > 0 ? '+' : ''}{trend}%
//             </Badge>
//           )}
//         </div>
//       </Card.Body>
//     </Card>
//   );

//   return (
//     <div className="admin-dashboard">
//       <Container fluid className="py-4">
//         <div className="d-flex justify-content-between align-items-center mb-4">
//           <h2 className="mb-0">Dashboard Overview</h2>
//           <div className="text-muted">
//             Last updated: {new Date().toLocaleString()}
//           </div>
//         </div>

//         {/* Stats Cards */}
//         <Row className="mb-4">
//           <Col xl={3} lg={6} md={6} className="mb-3">
//             <StatCard
//               title="Total Resources"
//               value={stats.totalResources}
//               icon={<FaBoxOpen size={24} />}
//               color="primary"
//               trend={5.2}
//             />
//           </Col>
//           <Col xl={3} lg={6} md={6} className="mb-3">
//             <StatCard
//               title="Active Resources"
//               value={stats.activeResources}
//               icon={<FaCheckCircle size={24} />}
//               color="success"
//               trend={2.1}
//             />
//           </Col>
//           <Col xl={3} lg={6} md={6} className="mb-3">
//             <StatCard
//               title="Total Bookings"
//               value={stats.totalBookings}
//               icon={<FaChartLine size={24} />}
//               color="info"
//               trend={8.7}
//             />
//           </Col>
//           <Col xl={3} lg={6} md={6} className="mb-3">
//             <StatCard
//               title="Pending Requests"
//               value={stats.pendingRequests}
//               icon={<FaClock size={24} />}
//               color="warning"
//               trend={-3.2}
//             />
//           </Col>
//         </Row>

//         {/* Charts Row */}
//         <Row className="mb-4">
//           <Col lg={8} className="mb-3">
//             <Card className="shadow-sm border-0 h-100">
//               <Card.Header className="bg-white border-0 pt-3">
//                 <h5 className="mb-0">Resources by Type</h5>
//               </Card.Header>
//               <Card.Body>
//                 <Bar data={resourceData} options={chartOptions} />
//               </Card.Body>
//             </Card>
//           </Col>
//           <Col lg={4} className="mb-3">
//             <Card className="shadow-sm border-0 h-100">
//               <Card.Header className="bg-white border-0 pt-3">
//                 <h5 className="mb-0">Resources by Status</h5>
//               </Card.Header>
//               <Card.Body>
//                 <Pie data={statusData} options={chartOptions} />
//               </Card.Body>
//             </Card>
//           </Col>
//         </Row>

//           {/* Additional Stats */}
//           <Row>
//             <Col lg={6} className="mb-3">
//               <Card className="shadow-sm border-0">
//                 <Card.Header className="bg-white border-0 pt-3">
//                   <h5 className="mb-0">Maintenance Overview</h5>
//                 </Card.Header>
//                 <Card.Body>
//                   <Row>
//                     <Col md={6}>
//                       <div className="text-center mb-3">
//                         <FaTools className="text-warning mb-2" size={32} />
//                         <h4>{stats.maintenanceTickets}</h4>
//                         <p className="text-muted mb-0">Open Tickets</p>
//                       </div>
//                     </Col>
//                     <Col md={6}>
//                       <div className="text-center mb-3">
//                         <FaCheckCircle className="text-success mb-2" size={32} />
//                         <h4>{stats.resolvedTickets}</h4>
//                         <p className="text-muted mb-0">Resolved This Month</p>
//                       </div>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col lg={6} className="mb-3">
//               <Card className="shadow-sm border-0">
//                 <Card.Header className="bg-white border-0 pt-3">
//                   <h5 className="mb-0">Quick Actions</h5>
//                 </Card.Header>
//                 <Card.Body>
//                   <div className="d-grid gap-2">
//                     <button className="btn btn-primary">
//                       <FaBoxOpen className="me-2" />
//                       Add New Resource
//                     </button>
//                     <button className="btn btn-info">
//                       <FaChartLine className="me-2" />
//                       View Full Report
//                     </button>
//                     <button className="btn btn-warning">
//                       <FaTools className="me-2" />
//                       Review Maintenance Requests
//                     </button>
//                   </div>
//                 </Card.Body>
//               </Card>
//             </Col>
//           </Row>
//       </Container>
//     </div>
//   );
// };

// export default AdminDashboard;




import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Alert,
  Spinner,
  ListGroup
} from 'react-bootstrap';
import {
  FaBoxOpen,
  FaChartLine,
  FaCheckCircle,
  FaClock
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
    totalCapacity: 0,
    totalBookings: 0,
    pendingRequests: 0,
    // Specific resource type counts
    labs: 0,
    meetingRooms: 0,
    equipment: 0,
    lectureHalls: 0,
  });

  const [resourceData, setResourceData] = useState({
    labels: [],
    datasets: [],
  });

  const [statusData, setStatusData] = useState({
    labels: [],
    datasets: [],
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

      const overviewStats = await analyticsApi.getOverviewStats();
      const pdfAnalytics = await analyticsApi.importPDFAnalytics();

      setStats({
        totalResources: overviewStats.totalResources || 0,
        activeResources: overviewStats.activeResources || 0,
        outOfServiceResources: overviewStats.outOfServiceResources || 0,
        averageCapacity: overviewStats.averageCapacity || 0,
        totalCapacity: overviewStats.totalCapacity || 0,
        totalBookings: overviewStats.totalBookings || 0,
        pendingRequests: overviewStats.pendingRequests || 0,
        // Use real-time data from PDF analytics endpoint
        labs: pdfAnalytics?.analytics?.labs || 0,
        meetingRooms: pdfAnalytics?.analytics?.meetingRooms || 0,
        equipment: pdfAnalytics?.analytics?.equipment || 0,
        lectureHalls: pdfAnalytics?.analytics?.lectureHalls || 0,
      });

      const chartData = await analyticsApi.getChartData();

      const typeData = chartData.typeDistribution || {};
      setResourceData({
        labels: Object.keys(typeData),
        datasets: [
          {
            label: 'Resources by Type',
            data: Object.values(typeData),
            backgroundColor: [
              'rgba(37, 99, 235, 0.85)',
              'rgba(14, 165, 233, 0.85)',
              'rgba(99, 102, 241, 0.85)',
              'rgba(16, 185, 129, 0.85)',
              'rgba(245, 158, 11, 0.85)',
            ],
            borderRadius: 8,
            borderSkipped: false,
          },
        ],
      });

      const statusDist = chartData.statusDistribution || {};
      setStatusData({
        labels: Object.keys(statusDist),
        datasets: [
          {
            label: 'Resource Status',
            data: Object.values(statusDist),
            backgroundColor: [
              'rgba(16, 185, 129, 0.9)',
              'rgba(239, 68, 68, 0.85)',
              'rgba(245, 158, 11, 0.85)',
            ],
            borderWidth: 0,
          },
        ],
      });

      const recent = await analyticsApi.getRecentResources();
      setRecentResources(recent || []);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
        },
      },
      title: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.15)',
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 18,
        },
      },
      title: {
        display: false,
      },
    },
  };

  const StatCard = ({ title, value, icon, colorClass }) => {
    return (
      <Card
        className="border-0 shadow-sm h-100 stat-card"
        style={{
          borderRadius: '20px',
          transition: 'all 0.25s ease',
          background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
        }}
      >
        <Card.Body className="p-4">
          <div className="d-flex justify-content-between align-items-start mb-3">
            <div
              className={`d-flex align-items-center justify-content-center ${colorClass}`}
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '16px',
                fontSize: '22px',
                color: '#fff',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
              }}
            >
              {icon}
            </div>
          </div>

          <div>
            <div className="text-muted mb-2" style={{ fontSize: '0.92rem', fontWeight: 500 }}>
              {title}
            </div>
            <h3 className="mb-0 fw-bold text-dark">{value}</h3>
          </div>
        </Card.Body>
      </Card>
    );
  };

  if (loading) {
    return (
      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{ minHeight: '70vh', background: '#f8fafc' }}
      >
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h5 className="text-dark mb-1">Loading dashboard...</h5>
        <p className="text-muted">Please wait while we fetch the latest analytics.</p>
      </div>
    );
  }

  return (
    <div
      className="admin-dashboard"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)',
      }}
    >
      <Container fluid className="py-4 px-3 px-md-4">
        {error && (
          <Alert variant="danger" className="border-0 shadow-sm rounded-4">
            {error}
          </Alert>
        )}

        <Card
          className="border-0 shadow-sm mb-4"
          style={{
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#fff',
          }}
        >
          <Card.Body className="p-4 p-md-5">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <Badge bg="light" text="dark" className="px-3 py-2 rounded-pill">
                    Admin Panel
                  </Badge>
                  <Badge bg="success" className="px-3 py-2 rounded-pill">
                    Live Data
                  </Badge>
                </div>
                <h2 className="fw-bold mb-2">Dashboard Overview</h2>
                <p className="mb-0 text-light opacity-75">
                  Monitor resources, bookings, requests, and status analytics in one place.
                </p>
              </div>

              <div className="text-md-end">
                <div className="small opacity-75">
                  Connected to backend analytics
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        <Row className="g-4 mb-4">
          <Col xl={3} lg={6} md={6}>
            <StatCard
              title="Total Resources"
              value={stats.totalResources}
              icon={<FaBoxOpen />}
              colorClass="bg-primary"
            />
          </Col>

          <Col xl={3} lg={6} md={6}>
            <StatCard
              title="Active Resources"
              value={stats.activeResources}
              icon={<FaCheckCircle />}
              colorClass="bg-success"
            />
          </Col>

          {/* <Col xl={3} lg={6} md={6}>
            <StatCard
              title="Total Bookings"
              value={stats.totalBookings}
              icon={<FaChartLine />}
              colorClass="bg-info"
            />
          </Col> */}

          {/* <Col xl={3} lg={6} md={6}>
            <StatCard
              title="Pending Requests"
              value={stats.pendingRequests}
              icon={<FaClock />}
              colorClass="bg-warning"
            />
          </Col> */}
        </Row>

        {/* Specific Resource Type Stats */}
        <Row className="g-4 mb-4">
          <Col xl={3} lg={6} md={6}>
            <StatCard
              title="Labs"
              value={stats.labs}
              icon={<FaBoxOpen />}
              colorClass="bg-danger"
            />
          </Col>

          <Col xl={3} lg={6} md={6}>
            <StatCard
              title="Meeting Rooms"
              value={stats.meetingRooms}
              icon={<FaBoxOpen />}
              colorClass="bg-warning"
            />
          </Col>

          <Col xl={3} lg={6} md={6}>
            <StatCard
              title="Equipment"
              value={stats.equipment}
              icon={<FaBoxOpen />}
              colorClass="bg-info"
            />
          </Col>

          <Col xl={3} lg={6} md={6}>
            <StatCard
              title="Lecture Halls"
              value={stats.lectureHalls}
              icon={<FaBoxOpen />}
              colorClass="bg-secondary"
            />
          </Col>
        </Row>

        <Row className="g-4 mb-4">
          <Col lg={8}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: '20px' }}
            >
              <Card.Body className="p-4">
                <div className="mb-3">
                  <h5 className="fw-bold mb-1">Resources by Type</h5>
                  <p className="text-muted mb-0">Overview of all resource categories</p>
                </div>
                <div style={{ height: '340px' }}>
                  <Bar data={resourceData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card
              className="border-0 shadow-sm h-100"
              style={{ borderRadius: '20px' }}
            >
              <Card.Body className="p-4">
                <div className="mb-3">
                  <h5 className="fw-bold mb-1">Resources by Status</h5>
                  <p className="text-muted mb-0">Current operational condition</p>
                </div>
                <div style={{ height: '340px' }}>
                  <Pie data={statusData} options={pieOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          <Col lg={12}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: '20px' }}>
              <Card.Body className="p-4">
                <div className="mb-4">
                  <h5 className="fw-bold mb-1">Recent Resources</h5>
                  <p className="text-muted mb-0">Latest resources returned by the backend</p>
                </div>

                {recentResources.length > 0 ? (
                  <ListGroup variant="flush">
                    {recentResources.slice(0, 5).map((resource, index) => (
                      <ListGroup.Item
                        key={resource._id || index}
                        className="px-0 py-3 border-bottom"
                        style={{ background: 'transparent' }}
                      >
                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                          <div>
                            <h6 className="mb-1 fw-semibold">
                              {resource.name || `Resource ${index + 1}`}
                            </h6>
                            <small className="text-muted">
                              {resource.type || 'Unknown Type'}
                            </small>
                          </div>
                          <Badge bg="light" text="dark" className="rounded-pill px-3 py-2">
                            {resource.status || 'Active'}
                          </Badge>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                ) : (
                  <div
                    className="text-center py-5"
                    style={{
                      background: '#f8fafc',
                      borderRadius: '18px',
                    }}
                  >
                    <FaBoxOpen size={32} className="text-muted mb-3" />
                    <p className="text-muted mb-0">No recent resources found</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <style>{`
        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 18px 35px rgba(15, 23, 42, 0.08) !important;
        }

        .admin-dashboard .card {
          overflow: hidden;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;