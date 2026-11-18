import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
} from "@mui/material";
import DriveIcon from "@mui/icons-material/EventAvailableOutlined";
import InternshipIcon from "@mui/icons-material/WorkHistoryOutlined";
import TimerIcon from "@mui/icons-material/HourglassEmptyOutlined";
import CompletedIcon from "@mui/icons-material/CheckCircle";
import Layout from "../components/Layout";
import api from "../api/api";

function Notifications() {
  const [students, setStudents] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState("ALL");

  const generateNotifications = useCallback(() => {
    const today = new Date();
    const generated = [];

    // 1. Student Internship Milestone Alerts
    students.forEach((student) => {
      if (student.placementDate) {
        const placementDate = new Date(student.placementDate);
        if (!isNaN(placementDate.getTime())) {
          const sixMonthsLater = new Date(placementDate);
          sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

          const diffDays = Math.ceil(
            (sixMonthsLater - today) / (1000 * 60 * 60 * 24)
          );

          if (diffDays <= 0) {
            generated.push({
              category: "INTERNSHIP",
              type: "Internship Completed",
              title: student.name,
              entity: student.companyName || "Partner Corporation",
              message: `${student.name} has completed the 6-month corporate internship period. TPO desk should follow up regarding conversion to full-time package disbursement.`,
              daysLeft: diffDays,
              badgeColor: "#D97706",
              icon: <InternshipIcon sx={{ color: "#D97706", fontSize: 20 }} />,
            });
          } else if (diffDays <= 15) {
            generated.push({
              category: "FOLLOWUP",
              type: "Upcoming Follow-up",
              title: student.name,
              entity: student.companyName || "Partner Corporation",
              message: `${student.name}'s 6-month internship completion milestone is approaching (${diffDays} day${diffDays === 1 ? "" : "s"} remaining). Prepare performance appraisal documentation.`,
              daysLeft: diffDays,
              badgeColor: "#0B2545",
              icon: <TimerIcon sx={{ color: "#0B2545", fontSize: 20 }} />,
            });
          }
        }
      }
    });

    // 2. Company Upcoming Campus Drive Alerts
    companies.forEach((company) => {
      if (company.driveDate) {
        const driveDate = new Date(company.driveDate);
        if (!isNaN(driveDate.getTime())) {
          const diffDays = Math.ceil(
            (driveDate - today) / (1000 * 60 * 60 * 24)
          );

          if (diffDays >= 0 && diffDays <= 7) {
            generated.push({
              category: "DRIVE",
              type: "Upcoming Drive",
              title: company.companyName,
              entity: company.companyName,
              message: `${company.companyName} on-campus placement drive is scheduled on ${company.driveDate} (${diffDays === 0 ? "Today" : `in ${diffDays} day${diffDays === 1 ? "" : "s"}`}). Verify student seating and lab arrangements.`,
              daysLeft: diffDays,
              badgeColor: "#1D4ED8",
              icon: <DriveIcon sx={{ color: "#1D4ED8", fontSize: 20 }} />,
            });
          }
        }
      }
    });

    setNotifications(generated);
  }, [students, companies]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentsRes, companiesRes] = await Promise.all([
          api.get("/students"),
          api.get("/companies"),
        ]);
        setStudents(
          Array.isArray(studentsRes.data)
            ? studentsRes.data
            : Object.values(studentsRes.data || {})
        );
        setCompanies(
          Array.isArray(companiesRes.data)
            ? companiesRes.data
            : Object.values(companiesRes.data || {})
        );
      } catch (error) {
        console.error("Fetch Data Error:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    generateNotifications();
  }, [generateNotifications]);

  const filteredNotifications = notifications.filter((item) => {
    if (filterType === "ALL") return true;
    return item.category === filterType;
  });

  return (
    <Layout
      title="Alerts & Placement Notifications"
      subtitle="Automated alerts for approaching campus recruitment drives, student internship completions, and follow-up milestones"
    >
      <Box sx={{ maxWidth: 1040, mx: "auto" }}>
        {/* Filter Tabs */}
        <Paper
          elevation={0}
          sx={{
            mb: 3,
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            bgcolor: "#FFFFFF",
            px: 2,
          }}
        >
          <Tabs
            value={filterType}
            onChange={(_, val) => setFilterType(val)}
            indicatorColor="primary"
            textColor="primary"
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "0.85rem",
                fontWeight: 600,
                minHeight: 48,
              },
            }}
          >
            <Tab label={`All Alerts (${notifications.length})`} value="ALL" />
            <Tab
              label={`Recruitment Drives (${notifications.filter((n) => n.category === "DRIVE").length})`}
              value="DRIVE"
            />
            <Tab
              label={`Internship Milestones (${notifications.filter((n) => n.category === "INTERNSHIP").length})`}
              value="INTERNSHIP"
            />
            <Tab
              label={`Follow-ups (${notifications.filter((n) => n.category === "FOLLOWUP").length})`}
              value="FOLLOWUP"
            />
          </Tabs>
        </Paper>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              bgcolor: "#FFFFFF",
            }}
          >
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                bgcolor: "#F8FAFC",
                border: "1px solid #E2E8F0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <CompletedIcon sx={{ color: "#059669", fontSize: 28 }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#0F172A", mb: 0.5 }}>
              No Pending Placement Alerts
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              All campus drives and student internship milestones are currently up to date.
            </Typography>
          </Paper>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {filteredNotifications.map((notif, index) => (
              <Card
                key={index}
                elevation={0}
                sx={{
                  border: "1px solid #E2E8F0",
                  borderLeft: `4px solid ${notif.badgeColor}`,
                  borderRadius: "8px",
                  bgcolor: "#FFFFFF",
                }}
              >
                <CardContent sx={{ p: "20px !important" }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      flexWrap: "wrap",
                      gap: 1.5,
                      mb: 1.5,
                    }}
                  >
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
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
                        {notif.icon}
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
                          {notif.title}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "#64748B" }}>
                          Recruiter / Organization: <b>{notif.entity}</b>
                        </Typography>
                      </Box>
                    </Box>

                    <Chip
                      label={notif.type}
                      size="small"
                      sx={{
                        bgcolor:
                          notif.type === "Internship Completed"
                            ? "#FEF3C7"
                            : notif.type === "Upcoming Drive"
                            ? "#EFF6FF"
                            : "#F1F5F9",
                        color:
                          notif.type === "Internship Completed"
                            ? "#92400E"
                            : notif.type === "Upcoming Drive"
                            ? "#1D4ED8"
                            : "#0B2545",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        borderRadius: "4px",
                      }}
                    />
                  </Box>

                  <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.6 }}>
                    {notif.message}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Layout>
  );
}

export default Notifications;
