import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
} from "@mui/material";
import RateIcon from "@mui/icons-material/TrendingUpOutlined";
import PackageIcon from "@mui/icons-material/AttachMoneyOutlined";
import TopIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import RecruiterIcon from "@mui/icons-material/BusinessOutlined";
import BranchIcon from "@mui/icons-material/SchoolOutlined";
import api from "../api/api";
import Layout from "../components/Layout";

function Analytics() {
  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    placedStudents: 0,
    placementRate: 0,
    averagePackage: 0,
    highestPackage: 0,
    topCompany: "N/A",
    branchStats: [],
    recruiterRankings: [],
    salaryTiers: {
      high: 0, // >= 10 LPA
      mid: 0,  // 5 - 10 LPA
      entry: 0 // < 5 LPA
    },
  });

  const fetchAnalytics = async () => {
    try {
      const response = await api.get("/students");
      const students = Array.isArray(response.data)
        ? response.data
        : Object.values(response.data || {});

      const totalStudents = students.length;
      const placedStudentsList = students.filter(
        (student) => student.status === "Placed"
      );
      const placedStudentsCount = placedStudentsList.length;

      // Placement Rate
      const placementRate = totalStudents > 0
        ? ((placedStudentsCount / totalStudents) * 100).toFixed(1)
        : 0;

      // Packages
      const packageStudents = students.filter((s) => Number(s.package) > 0);
      const totalPackage = packageStudents.reduce(
        (sum, s) => sum + Number(s.package || 0),
        0
      );
      const averagePackage = packageStudents.length > 0
        ? (totalPackage / packageStudents.length).toFixed(1)
        : 0;

      const highestPackage = students.length > 0
        ? Math.max(...students.map((s) => Number(s.package) || 0))
        : 0;

      // Top Recruiter Rankings
      const companyCount = {};
      placedStudentsList.forEach((s) => {
        if (s.companyName) {
          companyCount[s.companyName] = (companyCount[s.companyName] || 0) + 1;
        }
      });

      const recruiterRankings = Object.entries(companyCount)
        .map(([name, hires]) => ({ name, hires }))
        .sort((a, b) => b.hires - a.hires);

      const topCompany = recruiterRankings.length > 0 ? recruiterRankings[0].name : "N/A";

      // Branch-wise Breakdown
      const branchMap = {};
      students.forEach((s) => {
        const branch = s.branch?.trim() || "Unspecified";
        if (!branchMap[branch]) {
          branchMap[branch] = { total: 0, placed: 0 };
        }
        branchMap[branch].total += 1;
        if (s.status === "Placed") {
          branchMap[branch].placed += 1;
        }
      });

      const branchStats = Object.entries(branchMap).map(([branch, stats]) => ({
        branch,
        total: stats.total,
        placed: stats.placed,
        rate: stats.total > 0 ? ((stats.placed / stats.total) * 100).toFixed(1) : 0,
      }));

      // Salary Tiers
      let high = 0;
      let mid = 0;
      let entry = 0;
      packageStudents.forEach((s) => {
        const pkg = Number(s.package);
        if (pkg >= 10) high++;
        else if (pkg >= 5) mid++;
        else entry++;
      });

      setAnalytics({
        totalStudents,
        placedStudents: placedStudentsCount,
        placementRate,
        averagePackage,
        highestPackage: highestPackage > 0 ? highestPackage : 0,
        topCompany,
        branchStats,
        recruiterRankings,
        salaryTiers: { high, mid, entry },
      });
    } catch (error) {
      console.error("Fetch Analytics Error:", error);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const statCards = [
    {
      title: "Placement Rate",
      value: `${analytics.placementRate}%`,
      subtitle: `${analytics.placedStudents} of ${analytics.totalStudents} placed`,
      icon: <RateIcon sx={{ color: "#059669", fontSize: 20 }} />,
    },
    {
      title: "Average Annual Package",
      value: `₹${analytics.averagePackage} LPA`,
      subtitle: "Across placed cohort",
      icon: <PackageIcon sx={{ color: "#0B2545", fontSize: 20 }} />,
    },
    {
      title: "Highest Annual CTC",
      value: `₹${analytics.highestPackage} LPA`,
      subtitle: "Campus record benchmark",
      icon: <TopIcon sx={{ color: "#C59B27", fontSize: 20 }} />,
    },
    {
      title: "Primary Recruiter",
      value: analytics.topCompany,
      subtitle: "Leading offer contributor",
      icon: <RecruiterIcon sx={{ color: "#1D4ED8", fontSize: 20 }} />,
    },
  ];

  return (
    <Layout
      title="Placement Analytics"
      subtitle="Statistical intelligence, departmental outcomes, package benchmarks, and corporate recruiter shares"
    >
      {/* 4 Top KPI Cards: Tightly Arranged */}
      <Grid container spacing={2} sx={{ mb: 2.5 }}>
        {statCards.map((card, index) => (
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

              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "#0F172A", fontSize: "1.5rem", lineHeight: 1.2 }}>
                  {card.value}
                </Typography>
                <Typography variant="caption" sx={{ color: "#64748B", display: "block", mt: 0.3, fontSize: "0.72rem" }}>
                  {card.subtitle}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Analytics Main Breakdown */}
      <Grid container spacing={2.5}>
        {/* Branch-wise Performance Table */}
        <Grid item xs={12} lg={7}>
          <Paper
            elevation={0}
            sx={{
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2, borderBottom: "1px solid #E2E8F0" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <BranchIcon sx={{ color: "#0B2545", fontSize: 18 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
                  Departmental Placement Distribution
                </Typography>
              </Box>
              <Typography variant="caption" sx={{ color: "#64748B" }}>
                Recruitment conversion rates segmented by engineering discipline
              </Typography>
            </Box>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Engineering Department</TableCell>
                    <TableCell align="center">Enrolled</TableCell>
                    <TableCell align="center">Placed</TableCell>
                    <TableCell sx={{ minWidth: 150 }}>Placement Rate</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {analytics.branchStats.length > 0 ? (
                    analytics.branchStats.map((b, idx) => (
                      <TableRow key={idx} hover>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: "#0B2545", fontSize: "0.82rem" }}>
                            {b.branch}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="body2" sx={{ color: "#475569", fontSize: "0.82rem" }}>
                            {b.total}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={b.placed}
                            size="small"
                            sx={{
                              bgcolor: "#ECFDF5",
                              color: "#059669",
                              fontWeight: 600,
                              height: 20,
                              fontSize: "0.72rem",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                            <Box sx={{ width: "100%", mr: 0.5 }}>
                              <LinearProgress
                                variant="determinate"
                                value={Number(b.rate)}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: "#E2E8F0",
                                  "& .MuiLinearProgress-bar": {
                                    bgcolor: Number(b.rate) >= 60 ? "#0B2545" : "#D97706",
                                    borderRadius: 3,
                                  },
                                }}
                              />
                            </Box>
                            <Typography variant="caption" sx={{ fontWeight: 600, minWidth: 36, fontSize: "0.72rem" }}>
                              {b.rate}%
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>
                          No departmental student data available.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>

        {/* Right Section: Recruiter Share & CTC Tiers */}
        <Grid item xs={12} lg={5}>
          {/* Top Recruiters Ranking */}
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
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
              Corporate Hiring Share
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 1.5 }}>
              Employers sorted by accepted student offers
            </Typography>

            {analytics.recruiterRankings.length > 0 ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {analytics.recruiterRankings.slice(0, 5).map((r, i) => (
                  <Box
                    key={i}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      p: 1,
                      bgcolor: "#F8FAFC",
                      border: "1px solid #F1F5F9",
                      borderRadius: "6px",
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Chip
                        label={`#${i + 1}`}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          bgcolor: i === 0 ? "#C59B27" : "#E2E8F0",
                          color: i === 0 ? "#0B2545" : "#475569",
                          borderRadius: "3px",
                        }}
                      />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.82rem" }}>
                        {r.name}
                      </Typography>
                    </Box>

                    <Chip
                      label={`${r.hires} Hires`}
                      size="small"
                      sx={{
                        bgcolor: "#EFF6FF",
                        color: "#1D4ED8",
                        fontWeight: 600,
                        fontSize: "0.72rem",
                        height: 20,
                      }}
                    />
                  </Box>
                ))}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: "#64748B", py: 2, textAlign: "center", fontSize: "0.82rem" }}>
                No corporate placements recorded yet.
              </Typography>
            )}
          </Paper>

          {/* Salary Package Tiers */}
          <Paper
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
              CTC Package Distribution
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 1.5 }}>
              Salary tier segmentation of placed candidates
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.75rem" }}>
                    Marquee & Super Dream (&ge; 10 LPA)
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#0B2545", fontSize: "0.75rem" }}>
                    {analytics.salaryTiers.high} Students
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    analytics.placedStudents > 0
                      ? (analytics.salaryTiers.high / analytics.placedStudents) * 100
                      : 0
                  }
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    bgcolor: "#E2E8F0",
                    "& .MuiLinearProgress-bar": { bgcolor: "#C59B27", borderRadius: 3 },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.75rem" }}>
                    Dream Tier (5 - 9.9 LPA)
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#0B2545", fontSize: "0.75rem" }}>
                    {analytics.salaryTiers.mid} Students
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    analytics.placedStudents > 0
                      ? (analytics.salaryTiers.mid / analytics.placedStudents) * 100
                      : 0
                  }
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    bgcolor: "#E2E8F0",
                    "& .MuiLinearProgress-bar": { bgcolor: "#0B2545", borderRadius: 3 },
                  }}
                />
              </Box>

              <Box>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.4 }}>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.75rem" }}>
                    Core Industry Tier (&lt; 5 LPA)
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#0B2545", fontSize: "0.75rem" }}>
                    {analytics.salaryTiers.entry} Students
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={
                    analytics.placedStudents > 0
                      ? (analytics.salaryTiers.entry / analytics.placedStudents) * 100
                      : 0
                  }
                  sx={{
                    height: 5,
                    borderRadius: 3,
                    bgcolor: "#E2E8F0",
                    "& .MuiLinearProgress-bar": { bgcolor: "#94A3B8", borderRadius: 3 },
                  }}
                />
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Layout>
  );
}

export default Analytics;
