import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  CircularProgress,
  Chip,
  Divider,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/EmailOutlined";
import LockIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ApartmentIcon from "@mui/icons-material/Apartment";
import GroupsIcon from "@mui/icons-material/Groups";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import logo from "../assets/sviet-logo.jpg";
import campusImage from "../assets/sviet-campus.png";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!email || !password) {
      setErrorMessage("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await api.post("/login", {
        email: email.trim(),
        password,
      });

      if (response.data?.success) {
        localStorage.setItem("isLoggedIn", "true");
        navigate("/dashboard");
      } else {
        setErrorMessage(response.data?.message || "Invalid credentials. Please verify your email and password.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage(
        error.response?.data?.message || "Unable to connect to placement server. Please check backend connection."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        bgcolor: "#0B2545",
      }}
    >
      {/* Left Institutional Showcase (Desktop) */}
      <Box
        sx={{
          display: { xs: "none", lg: "flex" },
          flex: 1.15,
          position: "relative",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 6,
          color: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Background Image with Deep Institutional Navy Tint */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${campusImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(11, 37, 69, 0.88)",
          }}
        />

        {/* Top Header */}
        <Box sx={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            component="img"
            src={logo}
            alt="SVIET Logo"
            sx={{
              width: 52,
              height: 52,
              borderRadius: "6px",
              bgcolor: "#FFFFFF",
              p: 0.5,
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          />
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "#FFFFFF", lineHeight: 1.2 }}>
              Swami Vivekanand Institute of Engineering & Technology
            </Typography>
            <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.75)", letterSpacing: "0.02em" }}>
              Affiliated to IKGPTU Jalandhar | Approved by AICTE, New Delhi
            </Typography>
          </Box>
        </Box>

        {/* Center Institutional Mission */}
        <Box sx={{ position: "relative", zIndex: 2, maxWidth: 560, my: "auto", py: 4 }}>
          <Chip
            label="Training & Placement Cell"
            sx={{
              bgcolor: "#C59B27",
              color: "#0B2545",
              fontWeight: 700,
              fontSize: "0.75rem",
              mb: 2.5,
              borderRadius: "4px",
            }}
          />
          <Typography
            variant="h2"
            sx={{
              fontWeight: 700,
              fontSize: "2.35rem",
              lineHeight: 1.25,
              color: "#FFFFFF",
              mb: 2,
              letterSpacing: "-0.02em",
            }}
          >
            Central Placement & Career Advancement Portal
          </Typography>
          <Typography
            sx={{
              fontSize: "0.95rem",
              color: "rgba(255, 255, 255, 0.82)",
              lineHeight: 1.6,
              mb: 4,
            }}
          >
            A unified institutional platform managing student recruitment, campus drives, recruiter partnerships, and corporate placements with verified academic transparency.
          </Typography>

          {/* Quick Institutional Pillars */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2.5 }}>
            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <ApartmentIcon sx={{ color: "#C59B27", fontSize: 24, mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                  250+ Recruiter Network
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.65)" }}>
                  Top Tier MNCs and product enterprises
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
              <GroupsIcon sx={{ color: "#C59B27", fontSize: 24, mt: 0.3 }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: "#FFFFFF", fontWeight: 600 }}>
                  Student Tracking
                </Typography>
                <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.65)" }}>
                  End-to-end recruitment lifecycle
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Footer Note */}
        <Box sx={{ position: "relative", zIndex: 2, pt: 2, borderTop: "1px solid rgba(255, 255, 255, 0.12)" }}>
          <Typography variant="caption" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
            © {new Date().getFullYear()} SVIET. Ram Nagar, Banur, Near Rajpura, Punjab 140401. All rights reserved.
          </Typography>
        </Box>
      </Box>

      {/* Right Form Card Side */}
      <Box
        sx={{
          flex: { xs: 1, lg: 0.85 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: { xs: 2.5, sm: 4, md: 6 },
          bgcolor: "#F8FAFC",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 440,
            p: { xs: 3, sm: 4.5 },
            bgcolor: "#FFFFFF",
            border: "1px solid #E2E8F0",
            borderRadius: "8px",
            boxShadow: "0 4px 6px -1px rgba(15, 23, 42, 0.05), 0 2px 4px -2px rgba(15, 23, 42, 0.05)",
          }}
        >
          {/* Mobile Institute Header */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
            <Box
              component="img"
              src={logo}
              alt="SVIET Logo"
              sx={{
                width: 42,
                height: 42,
                borderRadius: "4px",
                objectFit: "contain",
                border: "1px solid #E2E8F0",
                p: 0.3,
              }}
            />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#0B2545", lineHeight: 1.2 }}>
                SVIET Portal
              </Typography>
              <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                Placement & Training Management
              </Typography>
            </Box>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "#0F172A", mb: 0.8 }}>
              Account Sign In
            </Typography>
            <Typography variant="body2" sx={{ color: "#64748B" }}>
              Enter your credentials to access the placement administration panel.
            </Typography>
          </Box>

          {errorMessage && (
            <Alert
              severity="error"
              sx={{
                mb: 2.5,
                borderRadius: "6px",
                fontSize: "0.82rem",
                "& .MuiAlert-message": { py: 0 },
              }}
              onClose={() => setErrorMessage("")}
            >
              {errorMessage}
            </Alert>
          )}

          <Box component="form" onSubmit={handleLogin} noValidate>
            <Box sx={{ mb: 2 }}>
              <Typography
                component="label"
                sx={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "#334155",
                  mb: 0.7,
                }}
              >
                Institutional Email Address
              </Typography>
              <TextField
                fullWidth
                placeholder="name@sviet.ac.in"
                type="email"
                autoComplete="email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Box sx={{ mb: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.7 }}>
                <Typography
                  component="label"
                  sx={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "#334155",
                  }}
                >
                  Password
                </Typography>
              </Box>
              <TextField
                fullWidth
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                        sx={{ color: "#94A3B8" }}
                      >
                        {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{
                py: 1.25,
                bgcolor: "#0B2545",
                color: "#FFFFFF",
                fontSize: "0.9rem",
                fontWeight: 600,
                borderRadius: "6px",
                "&:hover": {
                  bgcolor: "#133E70",
                },
              }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                "Sign In to Portal"
              )}
            </Button>
          </Box>

          <Box sx={{ mt: 3, pt: 2.5, borderTop: "1px solid #F1F5F9", textAlign: "center" }}>
            <Typography variant="caption" sx={{ color: "#94A3B8", display: "block" }}>
              Authorized campus personnel access only.
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748B", display: "block", mt: 0.5 }}>
              For access recovery, contact SVIET IT Cell or TPO Desk.
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default Login;
