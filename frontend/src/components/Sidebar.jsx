import {
  Box,
  Typography,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  IconButton,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAddAltOutlined";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import AddBusinessIcon from "@mui/icons-material/AddBusinessOutlined";
import AnalyticsIcon from "@mui/icons-material/BarChartOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import svietLogo from "../assets/sviet-logo.jpg";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menus = [
    {
      title: "Dashboard",
      icon: <DashboardIcon fontSize="small" />,
      path: "/dashboard",
    },
    {
      title: "Students",
      icon: <PeopleIcon fontSize="small" />,
      path: "/students",
    },
    {
      title: "Add Student",
      icon: <PersonAddIcon fontSize="small" />,
      path: "/add-student",
    },
    {
      title: "Companies",
      icon: <BusinessIcon fontSize="small" />,
      path: "/company-list",
    },
    {
      title: "Add Company",
      icon: <AddBusinessIcon fontSize="small" />,
      path: "/companies",
    },
    {
      title: "Analytics",
      icon: <AnalyticsIcon fontSize="small" />,
      path: "/analytics",
    },
    {
      title: "Notifications",
      icon: <NotificationsIcon fontSize="small" />,
      path: "/notifications",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  return (
    <Box
      sx={{
        width: 264,
        minHeight: "100vh",
        bgcolor: "#0B2545",
        color: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        borderRight: "1px solid #E2E8F0",
      }}
    >
      {/* Brand Header */}
      <Box
        sx={{
          p: 2.5,
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        }}
      >
        <Box
          component="img"
          src={svietLogo}
          alt="SVIET Logo"
          sx={{
            width: 44,
            height: 44,
            borderRadius: "6px",
            objectFit: "contain",
            bgcolor: "#FFFFFF",
            p: 0.5,
            border: "1px solid rgba(255, 255, 255, 0.15)",
            flexShrink: 0,
          }}
        />
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 700,
                color: "#FFFFFF",
                lineHeight: 1.2,
                fontSize: "1rem",
                letterSpacing: "0.02em",
              }}
            >
              SVIET
            </Typography>
            <Chip
              label="ERP"
              size="small"
              sx={{
                height: 18,
                fontSize: "0.65rem",
                fontWeight: 700,
                bgcolor: "#C59B27",
                color: "#0B2545",
                borderRadius: "3px",
                px: 0.5,
              }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: "0.72rem",
              display: "block",
              lineHeight: 1.3,
              mt: 0.3,
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap",
            }}
          >
            Placement & Training Cell
          </Typography>
        </Box>
      </Box>

      {/* Navigation Links */}
      <Box sx={{ flex: 1, py: 2, px: 1.5, overflowY: "auto" }}>
        <Typography
          variant="caption"
          sx={{
            px: 1.5,
            py: 0.5,
            display: "block",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "rgba(255, 255, 255, 0.45)",
          }}
        >
          Navigation
        </Typography>

        <List sx={{ p: 0, mt: 0.5 }}>
          {menus.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: "6px",
                    px: 1.5,
                    py: 1,
                    bgcolor: isActive ? "rgba(255, 255, 255, 0.12)" : "transparent",
                    color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)",
                    borderLeft: isActive ? "3px solid #C59B27" : "3px solid transparent",
                    "&:hover": {
                      bgcolor: "rgba(255, 255, 255, 0.08)",
                      color: "#FFFFFF",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 32,
                      color: isActive ? "#C59B27" : "rgba(255, 255, 255, 0.65)",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontSize: "0.84rem",
                      fontWeight: isActive ? 600 : 500,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* User Footer / Logout */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          bgcolor: "rgba(0, 0, 0, 0.12)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.2, minWidth: 0 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: "#133E70",
                color: "#FFFFFF",
                fontSize: "0.8rem",
                fontWeight: 600,
                border: "1px solid rgba(255, 255, 255, 0.15)",
              }}
            >
              TP
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "#FFFFFF",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  lineHeight: 1.2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Placement Officer
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  color: "rgba(255, 255, 255, 0.55)",
                  fontSize: "0.7rem",
                  display: "block",
                }}
              >
                admin@sviet.ac.in
              </Typography>
            </Box>
          </Box>

          <Tooltip title="Sign Out">
            <IconButton
              onClick={handleLogout}
              size="small"
              sx={{
                color: "rgba(255, 255, 255, 0.65)",
                "&:hover": {
                  color: "#EF4444",
                  bgcolor: "rgba(239, 68, 68, 0.12)",
                },
              }}
            >
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Box>
  );
}

export default Sidebar;
