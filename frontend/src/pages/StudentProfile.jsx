import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Chip,
  Avatar,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import PrintIcon from "@mui/icons-material/PrintOutlined";
import PlacedIcon from "@mui/icons-material/CheckCircle";
import NotPlacedIcon from "@mui/icons-material/Cancel";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStudent = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/students");
      const students = Array.isArray(response.data)
        ? response.data
        : Object.values(response.data || {});

      const foundStudent = students.find(
        (s) => String(s.id) === String(id)
      );

      setStudent(foundStudent || null);
    } catch (error) {
      console.error("Fetch Student Error:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  if (loading) {
    return (
      <Layout title="Student Dossier" subtitle="Loading verified academic records...">
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 12 }}>
          <CircularProgress size={36} sx={{ color: "#0B2545" }} />
        </Box>
      </Layout>
    );
  }

  if (!student) {
    return (
      <Layout title="Student Dossier" subtitle="Candidate verification record">
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            bgcolor: "#FFFFFF",
            maxWidth: 600,
            mx: "auto",
            my: 4,
          }}
        >
          <Typography variant="h6" sx={{ color: "#0F172A", fontWeight: 600, mb: 1 }}>
            Student Record Not Found
          </Typography>
          <Typography variant="body2" sx={{ color: "#64748B", mb: 3 }}>
            The requested student identification does not match any record in the placement database.
          </Typography>
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/students")}
            sx={{ bgcolor: "#0B2545", "&:hover": { bgcolor: "#133E70" } }}
          >
            Return to Student Directory
          </Button>
        </Paper>
      </Layout>
    );
  }

  const isPlaced = student.status === "Placed";

  return (
    <Layout
      title="Candidate Placement Dossier"
      subtitle={`Official institutional placement profile for ${student.name}`}
    >
      <Box sx={{ maxWidth: 1100, mx: "auto" }}>
        {/* Navigation & Action Bar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Button
            variant="outlined"
            size="small"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/students")}
            sx={{ color: "#334155", borderColor: "#CBD5E1" }}
          >
            Back to Student Directory
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<PrintIcon />}
            onClick={() => window.print()}
            sx={{ color: "#334155", borderColor: "#CBD5E1" }}
          >
            Print Dossier
          </Button>
        </Box>

        {/* Candidate Profile Header Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5 },
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            bgcolor: "#FFFFFF",
            mb: 2.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              justifyContent: "space-between",
              gap: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 52,
                  height: 52,
                  bgcolor: "#0B2545",
                  color: "#FFFFFF",
                  fontSize: "1.4rem",
                  fontWeight: 700,
                  borderRadius: "6px",
                  border: "1px solid #E2E8F0",
                }}
              >
                {student.name ? student.name.charAt(0).toUpperCase() : "S"}
              </Avatar>

              <Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, flexWrap: "wrap" }}>
                  <Typography variant="h5" sx={{ fontWeight: 700, color: "#0F172A", lineHeight: 1.2 }}>
                    {student.name}
                  </Typography>
                  {isPlaced ? (
                    <Chip
                      icon={<PlacedIcon sx={{ fontSize: "13px !important", color: "#059669 !important" }} />}
                      label="Placed"
                      size="small"
                      sx={{
                        bgcolor: "#ECFDF5",
                        color: "#059669",
                        border: "1px solid #A7F3D0",
                        fontWeight: 600,
                        fontSize: "0.72rem",
                        height: 22,
                      }}
                    />
                  ) : (
                    <Chip
                      icon={<NotPlacedIcon sx={{ fontSize: "13px !important", color: "#64748B !important" }} />}
                      label="Not Placed"
                      size="small"
                      sx={{
                        bgcolor: "#F8FAFC",
                        color: "#64748B",
                        border: "1px solid #E2E8F0",
                        fontWeight: 500,
                        fontSize: "0.72rem",
                        height: 22,
                      }}
                    />
                  )}
                </Box>

                <Typography variant="body2" sx={{ color: "#64748B", mt: 0.3, fontSize: "0.82rem" }}>
                  Roll No: <b>{student.rollNo || "N/A"}</b> &nbsp;|&nbsp; Branch: <b>{student.branch || "General"}</b>
                </Typography>
              </Box>
            </Box>

            {/* Quick CTC Highlight */}
            {isPlaced && (
              <Box
                sx={{
                  px: 2,
                  py: 1,
                  bgcolor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "6px",
                  textAlign: { xs: "left", sm: "right" },
                }}
              >
                <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600, fontSize: "0.72rem" }}>
                  Secured Annual CTC
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "#0B2545", lineHeight: 1.2 }}>
                  ₹{student.package || 0} LPA
                </Typography>
                <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600, fontSize: "0.72rem" }}>
                  {student.companyName || "Recruiter Offer"}
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Detailed Breakdown Grid */}
        <Grid container spacing={2.5}>
          {/* Card 1: Academic & Contact Profile */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                bgcolor: "#FFFFFF",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <SchoolIcon sx={{ color: "#0B2545", fontSize: 18 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
                  Academic & Personal Credentials
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Candidate Full Name</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.82rem" }}>{student.name || "—"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>University Roll Number</Typography>
                  <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600, color: "#0F172A", fontSize: "0.82rem" }}>{student.rollNo || "—"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Department / Branch</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.82rem" }}>{student.branch || "—"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Cumulative CGPA</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: "#0B2545", fontSize: "0.82rem" }}>{student.cgpa || "—"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Institutional Email</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "#1D4ED8", fontSize: "0.82rem" }}>{student.email || "—"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Contact Phone</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "#0F172A", fontSize: "0.82rem" }}>{student.phone || "—"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8 }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Passout Year</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#0F172A", fontSize: "0.82rem" }}>{student.passoutYear || "—"}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Card 2: Corporate Placement Details */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 2.5,
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                bgcolor: "#FFFFFF",
                height: "100%",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <BusinessIcon sx={{ color: "#0B2545", fontSize: 18 }} />
                <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
                  Placement & Recruiter Record
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Placement Status</Typography>
                  <Chip
                    label={student.status || "Not Placed"}
                    size="small"
                    sx={{
                      bgcolor: isPlaced ? "#ECFDF5" : "#F8FAFC",
                      color: isPlaced ? "#059669" : "#64748B",
                      border: `1px solid ${isPlaced ? "#A7F3D0" : "#E2E8F0"}`,
                      fontWeight: 600,
                      fontSize: "0.72rem",
                      height: 20,
                    }}
                  />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Recruiter Company</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#0B2545", fontSize: "0.82rem" }}>{student.companyName || "N/A"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Annual Package (LPA)</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700, color: isPlaced ? "#059669" : "#64748B", fontSize: "0.82rem" }}>
                    {student.package ? `₹${student.package} LPA` : "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Designated Role</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "#0F172A", fontSize: "0.82rem" }}>{student.role || "N/A"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Company Category</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "#334155", fontSize: "0.82rem" }}>{student.companyCategory || "N/A"}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8, borderBottom: "1px solid #F1F5F9" }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Recruiter Tier Rating</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600, color: "#D97706", fontSize: "0.82rem" }}>
                    {student.companyRating ? `${student.companyRating} Stars` : "N/A"}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", py: 0.8 }}>
                  <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.82rem" }}>Offer / Placement Date</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "#0F172A", fontSize: "0.82rem" }}>{student.placementDate || "N/A"}</Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
}

export default StudentProfile;
