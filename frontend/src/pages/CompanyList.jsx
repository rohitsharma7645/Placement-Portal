import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  InputAdornment,
  Chip,
  Tooltip,
  DialogContentText,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddBusinessIcon from "@mui/icons-material/AddBusinessOutlined";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";
import LocationIcon from "@mui/icons-material/LocationOnOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";

function CompanyList() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchCompanies = async () => {
    try {
      const response = await api.get("/companies");
      const companyData = Array.isArray(response.data)
        ? response.data
        : Object.values(response.data || {});
      setCompanies(companyData);
    } catch (error) {
      console.error("Fetch Companies Error:", error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const deleteCompany = async (id) => {
    try {
      await api.delete(`/companies/${id}`);
      setDeleteConfirmOpen(false);
      setCompanyToDelete(null);
      fetchCompanies();
    } catch (error) {
      console.error("Delete Company Error:", error);
      alert("Failed to delete company record.");
    }
  };

  const handleEdit = (company) => {
    setSelectedCompany({ ...company });
    setOpen(true);
  };

  const updateCompany = async () => {
    try {
      await api.put(`/companies/${selectedCompany.id}`, selectedCompany);
      setOpen(false);
      fetchCompanies();
    } catch (error) {
      console.error("Update Company Error:", error);
      alert("Update Failed");
    }
  };

  const filteredCompanies = companies.filter(
    (company) =>
      company.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      company.role?.toLowerCase().includes(search.toLowerCase()) ||
      company.category?.toLowerCase().includes(search.toLowerCase()) ||
      company.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout
      title="Corporate Recruiter Directory"
      subtitle="Recruiting partner companies, campus drive schedules, criteria, and hiring formats"
    >
      {/* Unified Enterprise Table Card */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        {/* Table Toolbar Header */}
        <Box
          sx={{
            p: 2,
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "stretch", md: "center" },
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          {/* Left: Title, Counter & Search */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flex: 1, flexWrap: "wrap" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#0F172A", lineHeight: 1.2 }}>
                Recruiters
              </Typography>
              <Chip
                label={`${filteredCompanies.length} Registered`}
                size="small"
                sx={{
                  bgcolor: "#0B2545",
                  color: "#FFFFFF",
                  fontWeight: 600,
                  fontSize: "0.72rem",
                  height: 22,
                  borderRadius: "4px",
                }}
              />
            </Box>

            <TextField
              size="small"
              placeholder="Search company, role, category, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                width: { xs: "100%", sm: 340 },
                "& .MuiOutlinedInput-root": {
                  height: 36,
                  fontSize: "0.82rem",
                  bgcolor: "#F8FAFC",
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#94A3B8", fontSize: 18 }} />
                  </InputAdornment>
                ),
                endAdornment: search ? (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => setSearch("")}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ) : null,
              }}
            />
          </Box>

          {/* Right: Action */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              variant="contained"
              size="small"
              startIcon={<AddBusinessIcon fontSize="small" />}
              onClick={() => navigate("/companies")}
              sx={{
                bgcolor: "#0B2545",
                fontSize: "0.78rem",
                height: 34,
                "&:hover": { bgcolor: "#133E70" },
                px: 2,
              }}
            >
              Add New Recruiter
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* Recruiter Table */}
        <TableContainer sx={{ maxHeight: "calc(100vh - 270px)", overflowX: "auto" }}>
          <Table stickyHeader size="small" sx={{ minWidth: 960 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ minWidth: 160 }}>Company Name</TableCell>
                <TableCell sx={{ minWidth: 110 }}>Category</TableCell>
                <TableCell sx={{ minWidth: 120 }}>CTC Package</TableCell>
                <TableCell sx={{ minWidth: 140 }}>Designated Role</TableCell>
                <TableCell sx={{ minWidth: 100 }}>Min CGPA</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Drive Date</TableCell>
                <TableCell sx={{ minWidth: 120 }}>Location</TableCell>
                <TableCell sx={{ minWidth: 130 }}>Allowed Branches</TableCell>
                <TableCell sx={{ minWidth: 150 }}>Selection Format</TableCell>
                <TableCell sx={{ minWidth: 110 }}>Drive Status</TableCell>
                <TableCell align="right" sx={{ minWidth: 90 }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredCompanies.length > 0 ? (
                filteredCompanies.map((company) => (
                  <TableRow key={company.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "#0B2545", fontSize: "0.85rem" }}>
                        {company.companyName}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={company.category || "General"}
                        size="small"
                        sx={{
                          bgcolor: "#F1F5F9",
                          color: "#334155",
                          fontWeight: 500,
                          fontSize: "0.7rem",
                          height: 20,
                          borderRadius: "4px",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={company.package ? `₹${company.package} LPA` : "TBA"}
                        size="small"
                        sx={{
                          bgcolor: "#FEF3C7",
                          color: "#92400E",
                          border: "1px solid #FDE68A",
                          fontWeight: 700,
                          fontSize: "0.72rem",
                          height: 20,
                          borderRadius: "4px",
                        }}
                      />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: "#0F172A", fontSize: "0.8rem" }}>
                        {company.role || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569", fontSize: "0.78rem" }}>
                        {company.minimumCGPA ? `${company.minimumCGPA} CGPA` : "None"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.6 }}>
                        <CalendarIcon sx={{ fontSize: 13, color: "#64748B" }} />
                        <Typography variant="body2" sx={{ fontSize: "0.78rem", color: "#334155" }}>
                          {company.driveDate || "TBA"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <LocationIcon sx={{ fontSize: 13, color: "#94A3B8" }} />
                        <Typography variant="body2" sx={{ color: "#475569", fontSize: "0.78rem" }}>
                          {company.location || "On Campus"}
                        </Typography>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption" sx={{ color: "#475569", fontWeight: 500, fontSize: "0.72rem" }}>
                        {company.allowedBranches || "All Branches"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="caption" sx={{ color: "#334155", fontSize: "0.72rem" }}>
                        {company.selectionProcess || "Direct Interview"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {company.status === "Completed" ? (
                        <Chip
                          label="Completed"
                          size="small"
                          sx={{
                            bgcolor: "#ECFDF5",
                            color: "#059669",
                            border: "1px solid #A7F3D0",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 20,
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <Chip
                          label="Upcoming"
                          size="small"
                          sx={{
                            bgcolor: "#EFF6FF",
                            color: "#1D4ED8",
                            border: "1px solid #BFDBFE",
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            height: 20,
                            borderRadius: "4px",
                          }}
                        />
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                        <Tooltip title="Edit Recruiter Information">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(company)}
                            sx={{
                              color: "#475569",
                              p: 0.5,
                              "&:hover": { color: "#0B2545", bgcolor: "#F1F5F9" },
                            }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Recruiter">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setCompanyToDelete(company);
                              setDeleteConfirmOpen(true);
                            }}
                            sx={{
                              color: "#94A3B8",
                              p: 0.5,
                              "&:hover": { color: "#DC2626", bgcolor: "#FEF2F2" },
                            }}
                          >
                            <DeleteIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" sx={{ color: "#64748B", fontWeight: 500, fontSize: "0.85rem" }}>
                      No recruiter records found matching "{search}"
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mt: 0.5 }}>
                      Schedule a new campus placement drive or adjust search terms.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Company Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#0F172A", fontSize: "1rem" }}>
            Edit Corporate Recruiter Details
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            Update drive information, eligibility criteria, and hiring dates
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {selectedCompany && (
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.8, mt: 0.5 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.4 }}>
                  Company Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={selectedCompany.companyName || ""}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      companyName: e.target.value,
                    })
                  }
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.4 }}>
                  Annual Package (LPA)
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={selectedCompany.package || ""}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      package: e.target.value,
                    })
                  }
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.4 }}>
                  Designated Job Role
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={selectedCompany.role || ""}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      role: e.target.value,
                    })
                  }
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.4 }}>
                  Minimum Cutoff CGPA
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={selectedCompany.minimumCGPA || ""}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      minimumCGPA: e.target.value,
                    })
                  }
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.4 }}>
                  Job / Drive Location
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={selectedCompany.location || ""}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      location: e.target.value,
                    })
                  }
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.4 }}>
                  Allowed Branches
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={selectedCompany.allowedBranches || ""}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      allowedBranches: e.target.value,
                    })
                  }
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.4 }}>
                  Selection Process
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={selectedCompany.selectionProcess || "Aptitude + Interview"}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      selectionProcess: e.target.value,
                    })
                  }
                >
                  <MenuItem value="Aptitude + Interview">Aptitude + Interview</MenuItem>
                  <MenuItem value="Technical + HR">Technical + HR</MenuItem>
                  <MenuItem value="Coding + Interview">Coding + Interview</MenuItem>
                  <MenuItem value="Direct Interview">Direct Interview</MenuItem>
                </TextField>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.4 }}>
                  Drive Status
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={selectedCompany.status || "Upcoming"}
                  onChange={(e) =>
                    setSelectedCompany({
                      ...selectedCompany,
                      status: e.target.value,
                    })
                  }
                >
                  <MenuItem value="Upcoming">Upcoming</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </TextField>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 1.5 }}>
          <Button onClick={() => setOpen(false)} sx={{ color: "#64748B", fontSize: "0.8rem" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={updateCompany}
            sx={{
              bgcolor: "#0B2545",
              "&:hover": { bgcolor: "#133E70" },
              fontSize: "0.8rem",
            }}
          >
            Update Recruiter
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontSize: "1rem" }}>Confirm Recruiter Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#475569", fontSize: "0.85rem" }}>
            Are you sure you want to permanently delete recruiter record for{" "}
            <b>{companyToDelete?.companyName}</b>? This will remove associated drive listings.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 1.5 }}>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: "#64748B", fontSize: "0.8rem" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            color="error"
            onClick={() => deleteCompany(companyToDelete?.id)}
            sx={{ fontSize: "0.8rem" }}
          >
            Delete Recruiter
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default CompanyList;
