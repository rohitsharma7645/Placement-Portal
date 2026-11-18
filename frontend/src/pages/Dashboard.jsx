import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";
import PlacedIcon from "@mui/icons-material/CheckCircle";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import TrophyIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import AddStudentIcon from "@mui/icons-material/PersonAddOutlined";
import AddCompanyIcon from "@mui/icons-material/AddBusinessOutlined";
import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";
import TrendingIcon from "@mui/icons-material/TrendingUpOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import api from "../api/api";
import Layout from "../components/Layout";

const CHART_COLORS = {
  Placed: "#0B2545", // Institutional Navy
  "Not Placed": "#CBD5E1", // Subtle Slate
};

function Dashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    placedStudents: 0,
    companiesVisited: 0,
    highestPackage: "0",
  });

  const [upcomingDrives, setUpcomingDrives] = useState([]);
  const [recentPlacements, setRecentPlacements] = useState([]);

  const [analytics, setAnalytics] = useState({
    placementRate: 0,
    averagePackage: 0,
    topCompany: "N/A",
    chartData: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Students API
      const response = await api.get("/students");
      const students = Array.isArray(response.data)
        ? response.data
        : Object.values(response.data || {});

      // Companies API
      const companyResponse = await api.get("/companies");
      const companyData = Array.isArray(companyResponse.data)
        ? companyResponse.data
        : Object.values(companyResponse.data || {});

      // Calculate Stats
      const totalStudents = students.length;
      const placedStudents = students.filter(
        (student) => student.status === "Placed"
      ).length;

      const uniqueCompanies = [
        ...new Set(
          students
            .map((student) => student.companyName)
            .filter(Boolean)
        ),
      ];

      const highestPackage = students.length > 0
        ? Math.max(
            ...students.map((student) => Number(student.package) || 0)
          )
        : 0;

      setStats({
        totalStudents,
        placedStudents,
        companiesVisited: uniqueCompanies.length || companyData.length,
        highestPackage: highestPackage > 0 ? highestPackage : 0,
      });

      // Upcoming Drives
      const upcoming = companyData
        .filter((company) => company.status === "Upcoming")
        .sort((a, b) => new Date(a.driveDate) - new Date(b.driveDate))
        .slice(0, 5);

      setUpcomingDrives(upcoming);

      // Recent Placements
      const recentPlaced = students
        .filter((student) => student.status === "Placed")
        .slice(-5)
        .reverse();

      setRecentPlacements(recentPlaced);

      // Placement Rate
      const placementRate = totalStudents > 0
        ? ((placedStudents / totalStudents) * 100).toFixed(1)
        : 0;

      // Average Package
      const packageStudents = students.filter(
        (student) => Number(student.package) > 0
      );
      const averagePackage = packageStudents.length > 0
        ? (
            packageStudents.reduce(
              (sum, student) => sum + Number(student.package || 0),
              0
            ) / packageStudents.length
          ).toFixed(1)
        : 0;

      // Top Recruiter
      const companyCount = {};
      students.forEach((student) => {
        if (student.companyName && student.status === "Placed") {
          companyCount[student.companyName] =
            (companyCount[student.companyName] || 0) + 1;
        }
      });

      const topCompany = Object.keys(companyCount).length > 0
        ? Object.keys(companyCount).reduce((a, b) =>
            companyCount[a] > companyCount[b] ? a : b
          )
        : "N/A";

      setAnalytics({
        placementRate,
        averagePackage,
        topCompany,
        chartData: [
          { name: "Placed", value: placedStudents },
          { name: "Not Placed", value: totalStudents - placedStudents },
        ],
      });
    } catch (error) {
      console.error("Dashboard Data Fetch Failed:", error);
    }
  };

  const metricCards = [
    {
      title: "Total Students Registered",
      value: stats.totalStudents,
      subtitle: "Eligible academic batch",
      icon: <PeopleIcon sx={{ color: "#0B2545" }} />,
      accent: "#0B2545",
    },
    {
      title: "Placed Students",
      value: stats.placedStudents,
      subtitle: `${analytics.placementRate}% overall placement rate`,
      icon: <PlacedIcon sx={{ color: "#059669" }} />,
      accent: "#059669",
    },
    {
      title: "Recruiting Partners",
      value: stats.companiesVisited,
      subtitle: "Participating corporations",
      icon: <BusinessIcon sx={{ color: "#1D4ED8" }} />,
      accent: "#1D4ED8",
    },
    {
      title: "Highest Annual Package",
      value: `₹${stats.highestPackage} LPA`,
      subtitle: "Institutional benchmark",
      icon: <TrophyIcon sx={{ color: "#C59B27" }} />,
      accent: "#C59B27",
    },
  ];

  return (
    <Layout
      title="Placement Dashboard"
      subtitle="Overview of institutional recruitment performance, drives, and student achievements"
    >
      {/* Quick Action Toolbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 3.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="contained"
            startIcon={<AddStudentIcon />}
            onClick={() => navigate("/add-student")}
            sx={{
              bgcolor: "#0B2545",
              "&:hover": { bgcolor: "#133E70" },
            }}
          >
            Register Student
          </Button>

          <Button
            variant="outlined"
            startIcon={<AddCompanyIcon />}
            onClick={() => navigate("/companies")}
          >
            Schedule Recruiter Drive
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            icon={<TrendingIcon sx={{ fontSize: 16 }} />}
            label={`Placement Success Rate: ${analytics.placementRate}%`}
            sx={{
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              fontWeight: 600,
              color: "#0F172A",
              height: 32,
              px: 1,
            }}
          />
        </Box>
      </Box>

      {/* 4 Primary KPI Metric Cards */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 124,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, letterSpacing: "0.02em" }}>
                  {card.title}
                </Typography>
                <Box
                  sx={{
                    p: 0.8,
                    borderRadius: "6px",
                    bgcolor: "#F8FAFC",
                    border: "1px solid #F1F5F9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {card.icon}
                </Box>
              </Box>

              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    color: "#0F172A",
                    fontSize: "1.65rem",
                    lineHeight: 1.15,
                  }}
                >
                  {card.value}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B", display: "block", mt: 0.5 }}>
                  {card.subtitle}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Secondary Metrics Row */}
      <Grid container spacing={2.5} sx={{ mb: 3.5 }}>
        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.2,
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
              Average CTC Package
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A", mt: 0.5 }}>
              ₹{analytics.averagePackage} LPA
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
              Across all placed students
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.2,
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
              Leading Corporate Recruiter
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0B2545", mt: 0.5 }}>
              {analytics.topCompany}
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
              Highest number of student selections
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2.2,
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
              Active Drives Scheduled
            </Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#1D4ED8", mt: 0.5 }}>
              {upcomingDrives.length} Upcoming
            </Typography>
            <Typography variant="caption" sx={{ color: "#94A3B8" }}>
              Scheduled for current academic cycle
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Main Content Grid: Analytics & Tables */}
      <Grid container spacing={3}>
        {/* Left Section (8 cols on desktop): Recent Placements & Analytics Chart */}
        <Grid item xs={12} lg={8}>
          {/* Recent Placements Table */}
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
              overflow: "hidden",
              mb: 3,
            }}
          >
            <Box
              sx={{
                p: 2.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#0F172A" }}>
                  Recent Student Placements
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Latest verified corporate offers accepted
                </Typography>
              </Box>

              <Button
                size="small"
                endIcon={<ArrowForwardIcon fontSize="small" />}
                onClick={() => navigate("/students")}
                sx={{ color: "#0B2545", fontWeight: 600, fontSize: "0.8rem" }}
              >
                View Directory
              </Button>
            </Box>

            {recentPlacements.length > 0 ? (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Candidate Name</TableCell>
                      <TableCell>Roll No / Branch</TableCell>
                      <TableCell>Company</TableCell>
                      <TableCell>Package (LPA)</TableCell>
                      <TableCell align="right">Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentPlacements.map((student, index) => (
                      <TableRow key={index} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                            <Avatar
                              sx={{
                                width: 28,
                                height: 28,
                                bgcolor: "#0B2545",
                                fontSize: "0.75rem",
                                fontWeight: 600,
                              }}
                            >
                              {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                            </Avatar>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.85rem",
                                color: "#0B2545",
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" },
                              }}
                              onClick={() => navigate(`/student-profile/${student.id}`)}
                            >
                              {student.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontSize: "0.8rem", color: "#334155" }}>
                            {student.rollNo || "N/A"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748B" }}>
                            {student.branch || "General"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {student.companyName || "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`₹${student.package || 0} LPA`}
                            size="small"
                            sx={{
                              bgcolor: "#F1F5F9",
                              fontWeight: 600,
                              color: "#0F172A",
                              fontSize: "0.75rem",
                              borderRadius: "4px",
                            }}
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Chip
                            label="Placed"
                            size="small"
                            sx={{
                              bgcolor: "#ECFDF5",
                              color: "#059669",
                              border: "1px solid #A7F3D0",
                              fontWeight: 600,
                              fontSize: "0.72rem",
                              borderRadius: "4px",
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#64748B" }}>
                  No student placement records recorded yet.
                </Typography>
              </Box>
            )}
          </Paper>

          {/* Placement Distribution Donut Chart */}
          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: "#0F172A" }}>
                Cohort Placement Ratio
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Proportion of placed versus unplaced registered students
              </Typography>
            </Box>

            <Box sx={{ width: "100%", height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.chartData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={3}
                  >
                    {analytics.chartData.map((entry, idx) => (
                      <Cell
                        key={`cell-${idx}`}
                        fill={CHART_COLORS[entry.name] || "#CBD5E1"}
                        stroke="#FFFFFF"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0F172A",
                      color: "#FFFFFF",
                      borderRadius: 4,
                      border: "none",
                      fontSize: "0.8rem",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    align="center"
                    iconType="square"
                    wrapperStyle={{ paddingTop: "12px", fontSize: "0.8rem" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Right Section (4 cols on desktop): Upcoming Recruitment Drives */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                p: 2.5,
                borderBottom: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#0F172A" }}>
                  Upcoming Drives
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Scheduled campus recruitments
                </Typography>
              </Box>

              <Button
                size="small"
                onClick={() => navigate("/company-list")}
                sx={{ color: "#0B2545", fontWeight: 600, fontSize: "0.8rem" }}
              >
                All Drives
              </Button>
            </Box>

            <Box sx={{ p: 2 }}>
              {upcomingDrives.length > 0 ? (
                upcomingDrives.map((company, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      bgcolor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "6px",
                      "&:last-child": { mb: 0 },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.8 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#0B2545" }}>
                        {company.companyName}
                      </Typography>
                      <Chip
                        label={`₹${company.package || "N/A"} LPA`}
                        size="small"
                        sx={{
                          bgcolor: "#FEF3C7",
                          color: "#92400E",
                          border: "1px solid #FDE68A",
                          fontWeight: 700,
                          fontSize: "0.7rem",
                          height: 20,
                          borderRadius: "3px",
                        }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8, color: "#475569", mb: 0.5 }}>
                      <CalendarIcon sx={{ fontSize: 14, color: "#64748B" }} />
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {company.driveDate ? company.driveDate : "Date TBA"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
                      <Typography variant="caption" sx={{ color: "#64748B" }}>
                        Role: <b>{company.role || "Graduate Trainee"}</b>
                      </Typography>
                      {company.location && (
                        <Typography variant="caption" sx={{ color: "#94A3B8" }}>
                          {company.location}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 3, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#64748B" }}>
                    No upcoming recruitment drives scheduled.
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 0 }} />

            {/* Placement Policy Note */}
            <Box sx={{ p: 2, bgcolor: "#F8FAFC" }}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block" }}>
                Placement Cell Advisory:
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B", display: "block", mt: 0.5, lineHeight: 1.4 }}>
                Students must maintain minimum 75% attendance and required CGPA criteria to be eligible for on-campus pool drives.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Dashboard;
