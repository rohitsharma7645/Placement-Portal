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
import SaveIcon from "@mui/icons-material/AddBusinessOutlined";
import ResetIcon from "@mui/icons-material/RestartAlt";
import CompanyIcon from "@mui/icons-material/BusinessOutlined";
import DriveIcon from "@mui/icons-material/EventAvailableOutlined";
import api from "../api/api";
import Layout from "../components/Layout";

const initialCompanyState = {
  companyName: "",
  category: "",
  package: "",
  role: "",
  minimumCGPA: "",
  driveDate: "",
  rating: "",
  location: "",
  allowedBranches: "",
  selectionProcess: "",
  status: "Upcoming",
};

function AddCompany() {
  const [company, setCompany] = useState(initialCompanyState);
  const [notification, setNotification] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCompany({
      ...company,
      [e.target.name]: e.target.value,
    });
  };

  const handleReset = () => {
    setCompany(initialCompanyState);
    setNotification({ type: "", message: "" });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!company.companyName) {
      setNotification({
        type: "error",
        message: "Recruiting Company Name is required.",
      });
      return;
    }

    setLoading(true);
    setNotification({ type: "", message: "" });

    try {
      const response = await api.post("/companies", company);

      if (response.data?.success) {
        setNotification({
          type: "success",
          message: `Recruiter "${company.companyName}" successfully scheduled and registered into placement portal.`,
        });
        setCompany(initialCompanyState);
      } else {
        setNotification({
          type: "error",
          message: response.data?.message || "Failed to add company record.",
        });
      }
    } catch (error) {
      console.error("Add Company Error:", error);
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
      title="Register Recruiter & Campus Drive"
      subtitle="Register corporate hiring partners, recruitment criteria, and campus drive schedules"
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
          {/* Section 1: Enterprise Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
            <CompanyIcon sx={{ color: "#0B2545", fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#0B2545" }}>
              1. Corporate Partner & Position Details
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 3 }}>
            Identification and employment offering for on-campus recruitment
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Company Name *
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. Microsoft, Infosys, Deloitte"
                name="companyName"
                value={company.companyName}
                onChange={handleChange}
                required
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
                name="category"
                value={company.category}
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
                Annual CTC Package (in LPA)
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. 8.5"
                name="package"
                value={company.package}
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
                placeholder="e.g. Graduate Software Engineer"
                name="role"
                value={company.role}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Corporate Rating
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="rating"
                value={company.rating}
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
                Drive Status
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="status"
                value={company.status}
                onChange={handleChange}
              >
                <MenuItem value="Upcoming">Upcoming (Active Schedule)</MenuItem>
                <MenuItem value="Completed">Completed (Drive Concluded)</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <Divider sx={{ my: 4 }} />

          {/* Section 2: Drive Logistics & Criteria */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, mb: 2 }}>
            <DriveIcon sx={{ color: "#0B2545", fontSize: 22 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: "#0B2545" }}>
              2. Drive Schedule, Logistics & Eligibility Criteria
            </Typography>
          </Box>
          <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 3 }}>
            Requirements and parameters configured for participating students
          </Typography>

          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Minimum Eligibility CGPA
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. 7.0 or 60%"
                name="minimumCGPA"
                value={company.minimumCGPA}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Drive Scheduled Date
              </Typography>
              <TextField
                fullWidth
                size="small"
                type="date"
                name="driveDate"
                InputLabelProps={{ shrink: true }}
                value={company.driveDate}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Work / Interview Location
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. SVIET Campus / Gurugram / Remote"
                name="location"
                value={company.location}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Eligible Engineering Branches
              </Typography>
              <TextField
                fullWidth
                size="small"
                placeholder="e.g. CSE, IT, ECE, ME"
                name="allowedBranches"
                value={company.allowedBranches}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.6 }}>
                Selection Process Format
              </Typography>
              <TextField
                select
                fullWidth
                size="small"
                name="selectionProcess"
                value={company.selectionProcess || "Aptitude + Interview"}
                onChange={handleChange}
              >
                <MenuItem value="Aptitude + Interview">Aptitude + Technical + HR Interview</MenuItem>
                <MenuItem value="Technical + HR">Technical Round + Management Interview</MenuItem>
                <MenuItem value="Coding + Interview">Coding Assessment + Technical Interview</MenuItem>
                <MenuItem value="Direct Interview">Direct On-Campus Interview</MenuItem>
              </TextField>
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
              {loading ? "Scheduling..." : "Schedule Campus Drive"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Layout>
  );
}

export default AddCompany;
