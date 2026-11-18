import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0B2545", // SVIET Deep Institutional Blue
      light: "#133E70",
      dark: "#06172B",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#1D4ED8", // SVIET Royal Blue
      light: "#3B82F6",
      dark: "#1E40AF",
      contrastText: "#FFFFFF",
    },
    accent: {
      main: "#C59B27", // SVIET Institutional Gold
      light: "#E5B842",
      dark: "#9A7718",
      contrastText: "#0F172A",
    },
    success: {
      main: "#059669",
      light: "#10B981",
      dark: "#047857",
      contrastText: "#FFFFFF",
    },
    warning: {
      main: "#D97706",
      light: "#F59E0B",
      dark: "#B45309",
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#DC2626",
      light: "#EF4444",
      dark: "#B91C1C",
      contrastText: "#FFFFFF",
    },
    info: {
      main: "#2563EB",
      light: "#60A5FA",
      dark: "#1D4ED8",
      contrastText: "#FFFFFF",
    },
    background: {
      default: "#F8FAFC",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#0F172A",
      secondary: "#475569",
      disabled: "#94A3B8",
    },
    divider: "#E2E8F0",
  },
  typography: {
    fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
      letterSpacing: "-0.025em",
      color: "#0F172A",
    },
    h2: {
      fontSize: "1.75rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
      color: "#0F172A",
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 600,
      letterSpacing: "-0.02em",
      color: "#0F172A",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
      letterSpacing: "-0.015em",
      color: "#0F172A",
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
      color: "#0F172A",
    },
    h6: {
      fontSize: "0.9375rem",
      fontWeight: 600,
      color: "#0F172A",
    },
    subtitle1: {
      fontSize: "0.875rem",
      fontWeight: 500,
      color: "#475569",
    },
    subtitle2: {
      fontSize: "0.8125rem",
      fontWeight: 500,
      color: "#64748B",
    },
    body1: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
      color: "#0F172A",
    },
    body2: {
      fontSize: "0.8125rem",
      lineHeight: 1.45,
      color: "#475569",
    },
    button: {
      textTransform: "none",
      fontWeight: 500,
      fontSize: "0.875rem",
    },
    caption: {
      fontSize: "0.75rem",
      color: "#64748B",
    },
  },
  shape: {
    borderRadius: 6,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          borderRadius: "6px",
          boxShadow: "none",
          padding: "7px 16px",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#0B2545",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#133E70",
          },
        },
        containedSecondary: {
          backgroundColor: "#1D4ED8",
          color: "#FFFFFF",
          "&:hover": {
            backgroundColor: "#1E40AF",
          },
        },
        outlined: {
          borderColor: "#CBD5E1",
          color: "#1E293B",
          "&:hover": {
            borderColor: "#94A3B8",
            backgroundColor: "#F8FAFC",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
        elevation0: {
          border: "1px solid #E2E8F0",
          boxShadow: "none",
        },
        elevation1: {
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          boxShadow: "0 1px 3px 0 rgba(15, 23, 42, 0.04)",
          backgroundImage: "none",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#F1F5F9",
          color: "#334155",
          fontWeight: 600,
          fontSize: "0.75rem",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          borderBottom: "1px solid #E2E8F0",
          padding: "10px 16px",
          whiteSpace: "nowrap",
        },
        body: {
          color: "#1E293B",
          fontSize: "0.875rem",
          borderBottom: "1px solid #F1F5F9",
          padding: "12px 16px",
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: "#F8FAFC",
          },
          "&:last-child td": {
            borderBottom: "none",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "6px",
          fontSize: "0.875rem",
          backgroundColor: "#FFFFFF",
          "& fieldset": {
            borderColor: "#CBD5E1",
          },
          "&:hover fieldset": {
            borderColor: "#94A3B8",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#0B2545",
            borderWidth: "1.5px",
          },
        },
        input: {
          padding: "9.5px 14px",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.875rem",
          color: "#64748B",
          "&.Mui-focused": {
            color: "#0B2545",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "4px",
          fontWeight: 500,
          fontSize: "0.75rem",
          height: "24px",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "8px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 10px 25px -5px rgba(15, 23, 42, 0.15)",
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: "1.125rem",
          fontWeight: 600,
          padding: "16px 20px",
          borderBottom: "1px solid #E2E8F0",
          color: "#0F172A",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "20px !important",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 20px",
          borderTop: "1px solid #E2E8F0",
          backgroundColor: "#F8FAFC",
        },
      },
    },
  },
});
