import { useState } from "react";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Badge,
  Tooltip,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Chip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/DashboardOutlined";
import PeopleIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonAddIcon from "@mui/icons-material/PersonAddAltOutlined";
import BusinessIcon from "@mui/icons-material/BusinessOutlined";
import AddBusinessIcon from "@mui/icons-material/AddBusinessOutlined";
import AnalyticsIcon from "@mui/icons-material/BarChartOutlined";
import NotificationsIcon from "@mui/icons-material/NotificationsNoneOutlined";
import LogoutIcon from "@mui/icons-material/LogoutOutlined";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/SchoolOutlined";
import { useNavigate, useLocation } from "react-router-dom";
import svietLogo from "../assets/sviet-logo.jpg";

const DRAWER_WIDTH = 264;

export default function Layout({ children, title, subtitle }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    navigate("/");
  };

  const menuItems = [
    {
      title: "Dashboard",
      icon: <DashboardIcon fontSize="small" />,
      path: "/dashboard",
    },
    {
      title: "Student Directory",
      icon: <PeopleIcon fontSize="small" />,
      path: "/students",
    },
    {
      title: "Register Student",
      icon: <PersonAddIcon fontSize="small" />,
      path: "/add-student",
    },
    {
      title: "Company Directory",
      icon: <BusinessIcon fontSize="small" />,
      path: "/company-list",
    },
    {
      title: "Add Recruiter",
      icon: <AddBusinessIcon fontSize="small" />,
      path: "/companies",
    },
    {
      title: "Placement Analytics",
      icon: <AnalyticsIcon fontSize="small" />,
      path: "/analytics",
    },
    {
      title: "Alerts & Drives",
      icon: <NotificationsIcon fontSize="small" />,
      path: "/notifications",
    },
  ];

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#0B2545",
        color: "#F8FAFC",
      }}
    >
      {/* Institutional Brand Header */}
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
              label="TPO"
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

      {/* Navigation List */}
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
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.title} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  onClick={() => {
                    navigate(item.path);
                    if (isMobile) setMobileOpen(false);
                  }}
                  sx={{
                    borderRadius: "6px",
                    px: 1.5,
                    py: 1,
                    bgcolor: isActive ? "rgba(255, 255, 255, 0.12)" : "transparent",
                    color: isActive ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)",
                    borderLeft: isActive ? "3px solid #C59B27" : "3px solid transparent",
                    transition: "background-color 0.15s ease, color 0.15s ease",
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

      {/* Institutional Footer & User Profile */}
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

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#F8FAFC" }}>
      {/* Sidebar - Desktop */}
      <Box
        component="nav"
        sx={{ width: { md: DRAWER_WIDTH }, flexShrink: { md: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                border: "none",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", md: "block" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: DRAWER_WIDTH,
                borderRight: "1px solid #E2E8F0",
              },
            }}
            open
          >
            {drawerContent}
          </Drawer>
        )}
      </Box>

      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
          bgcolor: "#F8FAFC",
        }}
      >
        {/* Top Navbar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: "#FFFFFF",
            borderBottom: "1px solid #E2E8F0",
            color: "#0F172A",
            zIndex: (theme) => theme.zIndex.drawer - 1,
          }}
        >
          <Toolbar
            sx={{
              minHeight: "64px !important",
              px: { xs: 2, sm: 3, md: 4 },
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 1, color: "#0B2545" }}
                >
                  <MenuIcon />
                </IconButton>
              )}

              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    color: "#0B2545",
                    fontSize: { xs: "1.1rem", sm: "1.25rem" },
                    lineHeight: 1.2,
                  }}
                >
                  {title || "SVIET Placement Portal"}
                </Typography>
                {subtitle && (
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748B", display: "block", mt: 0.3 }}
                  >
                    {subtitle}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Top Right Utilities */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  display: { xs: "none", sm: "flex" },
                  alignItems: "center",
                  gap: 1,
                  px: 1.5,
                  py: 0.5,
                  bgcolor: "#F1F5F9",
                  borderRadius: "6px",
                  border: "1px solid #E2E8F0",
                }}
              >
                <SchoolIcon sx={{ fontSize: 16, color: "#0B2545" }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    color: "#334155",
                    fontSize: "0.75rem",
                  }}
                >
                  Session 2026–2027
                </Typography>
              </Box>

              <Tooltip title="View Notifications">
                <IconButton
                  onClick={() => navigate("/notifications")}
                  sx={{
                    color: "#475569",
                    border: "1px solid #E2E8F0",
                    borderRadius: "6px",
                    p: 0.8,
                    "&:hover": {
                      bgcolor: "#F1F5F9",
                      color: "#0B2545",
                    },
                  }}
                >
                  <Badge color="error" variant="dot">
                    <NotificationsIcon fontSize="small" />
                  </Badge>
                </IconButton>
              </Tooltip>

              <Divider orientation="vertical" flexItem sx={{ height: 24, my: "auto" }} />

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "#0B2545",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                  }}
                >
                  SV
                </Avatar>
                <Box sx={{ display: { xs: "none", lg: "block" } }}>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}
                  >
                    TPO Admin
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#64748B" }}>
                    SVIET Banur
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3, md: 4 },
            maxWidth: "1600px",
            width: "100%",
            mx: "auto",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
