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

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const metricCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      subtitle: "Registered academic batch",
      badge: null,
      icon: <PeopleIcon sx={{ color: "#0B2545", fontSize: 20 }} />,
    },
    {
      title: "Placed Students",
      value: stats.placedStudents,
      subtitle: `${stats.totalStudents - stats.placedStudents} looking for offers`,
      badge: `${analytics.placementRate}% Rate`,
      badgeColor: "#059669",
      badgeBg: "#ECFDF5",
      icon: <PlacedIcon sx={{ color: "#059669", fontSize: 20 }} />,
    },
    {
      title: "Average CTC Package",
      value: `₹${analytics.averagePackage} LPA`,
      subtitle: "Mean accepted salary",
      badge: `${stats.companiesVisited} Recruiters`,
      badgeColor: "#1D4ED8",
      badgeBg: "#EFF6FF",
      icon: <BusinessIcon sx={{ color: "#1D4ED8", fontSize: 20 }} />,
    },
    {
      title: "Highest Annual CTC",
      value: `₹${stats.highestPackage} LPA`,
      subtitle: `Top: ${analytics.topCompany}`,
      badge: "Campus Benchmark",
      badgeColor: "#92400E",
      badgeBg: "#FEF3C7",
      icon: <TrophyIcon sx={{ color: "#C59B27", fontSize: 20 }} />,
    },
  ];

  return (
    <Layout
      title="Placement Dashboard"
      subtitle="Overview of institutional recruitment performance, drives, and student achievements"
    >
      {/* Top Header Controls: Tightly Arranged */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Button
            variant="contained"
            size="small"
            startIcon={<AddStudentIcon />}
            onClick={() => navigate("/add-student")}
            sx={{
              bgcolor: "#0B2545",
              "&:hover": { bgcolor: "#133E70" },
              px: 2,
            }}
          >
            Register Student
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<AddCompanyIcon />}
            onClick={() => navigate("/companies")}
            sx={{ px: 2 }}
          >
            Schedule Recruiter Drive
          </Button>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Chip
            label={`Leading Recruiter: ${analytics.topCompany}`}
            size="small"
            sx={{
              bgcolor: "#FFFFFF",
              border: "1px solid #E2E8F0",
              fontWeight: 600,
              color: "#0B2545",
              height: 28,
              fontSize: "0.75rem",
            }}
          />
        </Box>
      </Box>

      {/* 4 Unified KPI Metric Cards (Single Row, zero waste) */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {metricCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: "#FFFFFF",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 104,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, fontSize: "0.75rem" }}>
                  {card.title}
                </Typography>
                <Box
                  sx={{
                    width: 30,
                    height: 30,
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

              <Box sx={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: "#0F172A",
                    fontSize: "1.5rem",
                    lineHeight: 1.2,
                  }}
                >
                  {card.value}
                </Typography>
                {card.badge && (
                  <Chip
                    label={card.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.68rem",
                      fontWeight: 700,
                      bgcolor: card.badgeBg,
                      color: card.badgeColor,
                      borderRadius: "3px",
                      px: 0.5,
                    }}
                  />
                )}
              </Box>

              <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.72rem", mt: 0.3 }}>
                {card.subtitle}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Main Grid: Left (8 cols) & Right (4 cols) */}
      <Grid container spacing={2.5}>
        {/* Left Section (8 cols): Cohort Analytics + Recent Placements */}
        <Grid item xs={12} lg={8}>
          {/* Card 1: Visual Placement Cohort Summary */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
              mb: 2.5,
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
                  Placement Cohort Overview
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Candidate conversion ratio and key recruitment benchmarks
                </Typography>
              </Box>
              <Chip
                label={`${analytics.placementRate}% Placed`}
                size="small"
                sx={{
                  bgcolor: "#ECFDF5",
                  color: "#059669",
                  fontWeight: 700,
                  fontSize: "0.72rem",
                }}
              />
            </Box>

            <Grid container spacing={2} alignItems="center">
              {/* Left: Donut Chart */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ width: "100%", height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analytics.chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        innerRadius={45}
                        outerRadius={75}
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
                          fontSize: "0.75rem",
                          padding: "6px 10px",
                        }}
                      />
                      <Legend
                        verticalAlign="bottom"
                        align="center"
                        iconType="square"
                        wrapperStyle={{ fontSize: "0.75rem", paddingTop: 8 }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>

              {/* Right: Key Distribution Figures */}
              <Grid item xs={12} sm={6}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                  <Box
                    sx={{
                      p: 1.2,
                      bgcolor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                        Placed Candidates
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#0B2545" }}>
                        {stats.placedStudents} Students
                      </Typography>
                    </Box>
                    <Chip
                      label="Verified"
                      size="small"
                      sx={{ bgcolor: "#ECFDF5", color: "#059669", height: 20, fontSize: "0.68rem" }}
                    />
                  </Box>

                  <Box
                    sx={{
                      p: 1.2,
                      bgcolor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                        Pending Placement
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#64748B" }}>
                        {stats.totalStudents - stats.placedStudents} Students
                      </Typography>
                    </Box>
                    <Chip
                      label="In Progress"
                      size="small"
                      sx={{ bgcolor: "#F1F5F9", color: "#64748B", height: 20, fontSize: "0.68rem" }}
                    />
                  </Box>

                  <Box
                    sx={{
                      p: 1.2,
                      bgcolor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "6px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Box>
                      <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
                        Leading Employer
                      </Typography>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#1D4ED8" }}>
                        {analytics.topCompany}
                      </Typography>
                    </Box>
                    <Chip
                      label="Top Offers"
                      size="small"
                      sx={{ bgcolor: "#EFF6FF", color: "#1D4ED8", height: 20, fontSize: "0.68rem" }}
                    />
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          {/* Card 2: Recent Placements Table */}
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
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #E2E8F0",
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
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
                sx={{ color: "#0B2545", fontWeight: 600, fontSize: "0.78rem" }}
              >
                View All
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
                      <TableCell>Package</TableCell>
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
                                width: 26,
                                height: 26,
                                bgcolor: "#0B2545",
                                fontSize: "0.72rem",
                                fontWeight: 600,
                              }}
                            >
                              {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                            </Avatar>
                            <Typography
                              sx={{
                                fontWeight: 600,
                                fontSize: "0.82rem",
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
                          <Typography variant="body2" sx={{ fontSize: "0.78rem", color: "#334155" }}>
                            {student.rollNo || "N/A"}
                          </Typography>
                          <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.7rem" }}>
                            {student.branch || "General"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.82rem" }}>
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
                              fontSize: "0.72rem",
                              height: 22,
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
                              fontSize: "0.7rem",
                              height: 22,
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
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>
                  No student placement records recorded yet.
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Right Section (4 cols): Upcoming Drives & Placement Notice */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
              overflow: "hidden",
              mb: 2.5,
            }}
          >
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid #E2E8F0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
                  Upcoming Drives
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B" }}>
                  Scheduled campus recruitments
                </Typography>
              </Box>

              <Button
                size="small"
                onClick={() => navigate("/company-list")}
                sx={{ color: "#0B2545", fontWeight: 600, fontSize: "0.78rem" }}
              >
                All Drives
              </Button>
            </Box>

            <Box sx={{ p: 1.5 }}>
              {upcomingDrives.length > 0 ? (
                upcomingDrives.map((company, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1.5,
                      mb: 1.2,
                      bgcolor: "#F8FAFC",
                      border: "1px solid #E2E8F0",
                      borderRadius: "6px",
                      "&:last-child": { mb: 0 },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#0B2545", fontSize: "0.85rem" }}>
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
                          fontSize: "0.68rem",
                          height: 19,
                          borderRadius: "3px",
                        }}
                      />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.6, color: "#475569", mb: 0.3 }}>
                      <CalendarIcon sx={{ fontSize: 13, color: "#64748B" }} />
                      <Typography variant="caption" sx={{ fontWeight: 500, fontSize: "0.72rem" }}>
                        {company.driveDate ? company.driveDate : "Date TBA"}
                      </Typography>
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 0.8 }}>
                      <Typography variant="caption" sx={{ color: "#64748B", fontSize: "0.72rem" }}>
                        Role: <b>{company.role || "Graduate Trainee"}</b>
                      </Typography>
                      {company.location && (
                        <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "0.7rem" }}>
                          {company.location}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))
              ) : (
                <Box sx={{ p: 2.5, textAlign: "center" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>
                    No upcoming recruitment drives scheduled.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>

          {/* Placement Policy Note Card */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#0B2545", display: "block", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              Placement Cell Guidelines
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B", display: "block", mt: 0.8, lineHeight: 1.5, fontSize: "0.75rem" }}>
              Registered candidates must attend all scheduled recruitment rounds. Absence without prior TPO approval leads to de-registration from subsequent campus placement drives.
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="caption" sx={{ color: "#94A3B8", fontSize: "0.7rem" }}>
                TPO SVIET Helpdesk
              </Typography>
              <Typography variant="caption" sx={{ color: "#1D4ED8", fontWeight: 600, fontSize: "0.72rem" }}>
                placement@sviet.ac.in
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Dashboard;
