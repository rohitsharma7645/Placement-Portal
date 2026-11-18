import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  MenuItem,
  Alert,
  Divider,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/PersonAddAltOutlined";
import ResetIcon from "@mui/icons-material/RestartAlt";
import AcademicIcon from "@mui/icons-material/SchoolOutlined";
import PlacementIcon from "@mui/icons-material/Work";
import api from "../api/api";
import Layout from "../components/Layout";

const initialStudentState = {
  name: "",
  rollNo: "",
  branch: "",
  cgpa: "",
  email: "",
  phone: "",
  passoutYear: "",
  status: "Not Placed",
  companyName: "",
  package: "",
  role: "",
  companyCategory: "",
  companyRating: "",
  placementDate: "",
};

function AddStudent() {
  const [student, setStudent] = useState(initialStudentState);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setStudent(initialStudentState);
    setNotification({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!student.name || !student.rollNo) {
      setNotification({
        type: "error",
        message: "Student Full Name and University Roll Number are required.",
      });
      return;
    }

    setLoading(true);
    setNotification({ type: "", message: "" });

    try {
      const response = await api.post("/students", student);

      if (response.data?.success) {
        setNotification({
          type: "success",
          message: `Candidate ${student.name} (Roll No: ${student.rollNo}) successfully registered into placement database.`,
        });
        setStudent(initialStudentState);
      } else {
        setNotification({
          type: "error",
          message: response.data?.message || "Failed to register student record.",
        });
      }
    } catch (error) {
      console.error("Add Student Error:", error);
      setNotification({
        type: "error",
        message: "Failed to connect to placement server. Please verify backend service.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="Register Student Record"
      subtitle="Input verified academic credentials, contact information, and initial placement status"
    >
      <Box sx={{ maxWidth: 1040, mx: "auto" }}>
        {notification.message && (
          <Alert
            severity={notification.type || "info"}
            onClose={() => setNotification({ type: "", message: "" })}
            sx={{ mb: 3, borderRadius: "6px", fontSize: "0.85rem" }}
          >
            {notification.message}
          </Alert>
        )}

        <Paper
          elevation={0}
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: { xs: 2.5, sm: 4 },
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            bgcolor: "#FFFFFF",
          }}
        >
          {/* Section 1: Academic & Personal Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
            <AcademicIcon sx={{ color: "#0B2545", fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#0B2545" }}>
              1. Candidate Academic & Personal Details
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 3 }}>
            Official student records as registered in the institute administration system
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Full Name *
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Arshdeep Singh"
                name="name"
                value={student.name}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                University Roll Number *
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. 2104501"
                name="rollNo"
                value={student.rollNo}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Engineering Branch / Department
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Computer Science & Engineering"
                name="branch"
                value={student.branch}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Cumulative CGPA
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. 8.4"
                name="cgpa"
                value={student.cgpa}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Email Address
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="email"
                placeholder="candidate@sviet.ac.in"
                name="email"
                value={student.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Contact Mobile Number
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="+91 98765 43210"
                name="phone"
                value={student.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Graduation / Passout Year
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. 2026"
                name="passoutYear"
                value={student.passoutYear}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Placement Status
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="status"
                value={student.status}
                onChange={handleChange}
              >
                <MenuItem value="Not Placed">Not Placed (Active Job Seeker)</MenuItem>
                <MenuItem value="Placed">Placed (Offer Received & Accepted)</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Section 2: Placement Details */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
            <PlacementIcon sx={{ color: "#0B2545", fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#0B2545" }}>
              2. Corporate Placement & Offer Details
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 3 }}>
            Applicable if student has received an offer through on-campus or off-campus recruitment drive
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Recruiting Company Name
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Cognizant, Infosys, Amazon"
                name="companyName"
                value={student.companyName}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Annual CTC Package (in LPA)
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. 7.5"
                name="package"
                value={student.package}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Designated Job Role
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Associate Software Engineer"
                name="role"
                value={student.role}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Company Classification
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="companyCategory"
                value={student.companyCategory || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="MNC">MNC (Multinational Corporation)</MenuItem>
                <MenuItem value="Product">Product Based</MenuItem>
                <MenuItem value="Service">IT Services & Consulting</MenuItem>
                <MenuItem value="Startup">High-Growth Startup</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Recruiter Tier Rating
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="companyRating"
                value={student.companyRating || ""}
                onChange={handleChange}
              >
                <MenuItem value="">Select Rating</MenuItem>
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num} Star{num > 1 ? "s" : ""}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Offer / Placement Date
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                name="placementDate"
                InputLabelProps={{ shrink: true }}
                value={student.placementDate || ""}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          {/* Form Actions */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 2,
              mt: 4,
              pt: 3,
              borderTop: "1px solid #E2E8F0",
            }}
          >
            <Button
              variant="outlined"
              startIcon={<ResetIcon />}
              onClick={handleReset}
              disabled={loading}
              sx={{ color: "#64748B", borderColor: "#CBD5E1" }}
            >
              Reset Fields
            </Button>

            <Button
              type="submit"
              variant="contained"
              startIcon={<SaveIcon />}
              disabled={loading}
              sx={{
                bgcolor: "#0B2545",
                "&:hover": { bgcolor: "#133E70" },
                px: 3,
              }}
            >
              {loading ? "Saving..." : "Save Student Record"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}

export default AddStudent;
