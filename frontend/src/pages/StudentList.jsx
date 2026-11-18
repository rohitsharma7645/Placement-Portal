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
  Avatar,
  DialogContentText,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FileDownloadIcon from "@mui/icons-material/FileDownloadOutlined";
import PdfIcon from "@mui/icons-material/PictureAsPdfOutlined";
import AddPersonIcon from "@mui/icons-material/PersonAddAltOutlined";
import PlacedIcon from "@mui/icons-material/CheckCircle";
import NotPlacedIcon from "@mui/icons-material/Cancel";
import CloseIcon from "@mui/icons-material/Close";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import Layout from "../components/Layout";

function StudentList() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const response = await api.get("/students");
      const data = Array.isArray(response.data)
        ? response.data
        : Object.values(response.data || {});
      setStudents(data);
    } catch (error) {
      console.error("Fetch Students Error:", error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteStudent = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      setDeleteConfirmOpen(false);
      setStudentToDelete(null);
      fetchStudents();
    } catch (error) {
      console.error("Delete Student Error:", error);
      alert("Failed to delete student record.");
    }
  };

  const handleEdit = (student) => {
    setSelectedStudent({ ...student });
    setOpen(true);
  };

  const updateStudent = async () => {
    try {
      await api.put(`/students/${selectedStudent.id}`, selectedStudent);
      setOpen(false);
      fetchStudents();
    } catch (error) {
      console.error("Update Student Error:", error);
      alert("Update Failed");
    }
  };

  const exportToExcel = () => {
    const excelData = filteredStudents.map((student) => ({
      Name: student.name,
      "Roll No": student.rollNo,
      Branch: student.branch,
      Mobile: student.phone || "N/A",
      Company: student.companyName || "N/A",
      Package: student.package ? `₹${student.package} LPA` : "N/A",
      Status: student.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
    XLSX.writeFile(workbook, "SVIET_Students_Placement_List.xlsx");
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("SVIET - Training & Placement Student Report", 14, 18);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()} | Total Records: ${filteredStudents.length}`, 14, 25);

    const tableColumn = [
      "Name",
      "Roll No",
      "Branch",
      "Mobile",
      "Company",
      "Package",
      "Status",
    ];

    const tableRows = filteredStudents.map((student) => [
      student.name,
      student.rollNo,
      student.branch,
      student.phone || "N/A",
      student.companyName || "N/A",
      student.package ? `Rs ${student.package} LPA` : "N/A",
      student.status,
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      headStyles: { fillColor: [11, 37, 69] },
      styles: { fontSize: 8 },
    });

    doc.save("SVIET_Students_Placement_Report.pdf");
  };

  const filteredStudents = students.filter(
    (student) =>
      student.name?.toLowerCase().includes(search.toLowerCase()) ||
      student.rollNo?.toLowerCase().includes(search.toLowerCase()) ||
      student.branch?.toLowerCase().includes(search.toLowerCase()) ||
      student.companyName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Layout
      title="Student Directory"
      subtitle="Comprehensive roster of registered candidates, placement status, and recruiter allocations"
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
        {/* Table Toolbar Header (All controls integrated tightly) */}
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
                Students
              </Typography>
              <Chip
                label={`${filteredStudents.length} Records`}
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
              placeholder="Search name, roll no, branch, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                width: { xs: "100%", sm: 320 },
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

          {/* Right: Actions (Export and Register) */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={<FileDownloadIcon fontSize="small" />}
              onClick={exportToExcel}
              sx={{
                borderColor: "#CBD5E1",
                color: "#334155",
                fontSize: "0.78rem",
                height: 34,
                "&:hover": { borderColor: "#059669", color: "#059669" },
              }}
            >
              Excel
            </Button>

            <Button
              variant="outlined"
              size="small"
              startIcon={<PdfIcon fontSize="small" />}
              onClick={exportToPDF}
              sx={{
                borderColor: "#CBD5E1",
                color: "#334155",
                fontSize: "0.78rem",
                height: 34,
                "&:hover": { borderColor: "#DC2626", color: "#DC2626" },
              }}
            >
              PDF
            </Button>

            <Button
              variant="contained"
              size="small"
              startIcon={<AddPersonIcon fontSize="small" />}
              onClick={() => navigate("/add-student")}
              sx={{
                bgcolor: "#0B2545",
                fontSize: "0.78rem",
                height: 34,
                "&:hover": { bgcolor: "#133E70" },
                px: 2,
              }}
            >
              Register Student
            </Button>
          </Box>
        </Box>

        <Divider />

        {/* Student Data Table */}
        <TableContainer sx={{ maxHeight: "calc(100vh - 270px)" }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>Candidate Name</TableCell>
                <TableCell>Roll Number</TableCell>
                <TableCell>Branch</TableCell>
                <TableCell>Contact Mobile</TableCell>
                <TableCell>Company</TableCell>
                <TableCell>Package (LPA)</TableCell>
                <TableCell>Placement Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                        <Avatar
                          sx={{
                            width: 28,
                            height: 28,
                            bgcolor: "#0B2545",
                            color: "#FFFFFF",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                          }}
                        >
                          {student.name ? student.name.charAt(0).toUpperCase() : "S"}
                        </Avatar>
                        <Box>
                          <Typography
                            sx={{
                              color: "#0B2545",
                              cursor: "pointer",
                              fontWeight: 600,
                              fontSize: "0.82rem",
                              lineHeight: 1.2,
                              "&:hover": { textDecoration: "underline" },
                            }}
                            onClick={() => navigate(`/student-profile/${student.id}`)}
                          >
                            {student.name}
                          </Typography>
                          {student.email && (
                            <Typography variant="caption" sx={{ color: "#64748B", display: "block", fontSize: "0.7rem" }}>
                              {student.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.78rem" }}>
                        {student.rollNo || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#334155", fontSize: "0.78rem" }}>
                        {student.branch || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#64748B", fontSize: "0.78rem" }}>
                        {student.phone || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.8rem" }}>
                        {student.companyName || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      {student.package ? (
                        <Chip
                          label={`₹${student.package} LPA`}
                          size="small"
                          sx={{
                            bgcolor: "#F1F5F9",
                            fontWeight: 600,
                            fontSize: "0.72rem",
                            height: 20,
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: "#94A3B8", fontSize: "0.75rem" }}>
                          —
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {student.status === "Placed" ? (
                        <Chip
                          icon={<PlacedIcon sx={{ fontSize: "13px !important", color: "#059669 !important" }} />}
                          label="Placed"
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
                          icon={<NotPlacedIcon sx={{ fontSize: "13px !important", color: "#64748B !important" }} />}
                          label="Not Placed"
                          size="small"
                          sx={{
                            bgcolor: "#F8FAFC",
                            color: "#64748B",
                            border: "1px solid #E2E8F0",
                            fontWeight: 500,
                            fontSize: "0.7rem",
                            height: 20,
                            borderRadius: "4px",
                          }}
                        />
                      )}
                    </TableCell>

                    <TableCell align="right">
                      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 0.5 }}>
                        <Tooltip title="Edit Student Record">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(student)}
                            sx={{
                              color: "#475569",
                              p: 0.5,
                              "&:hover": { color: "#0B2545", bgcolor: "#F1F5F9" },
                            }}
                          >
                            <EditIcon sx={{ fontSize: 18 }} />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete Student Record">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setStudentToDelete(student);
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
                  <TableCell colSpan={8} align="center" sx={{ py: 5 }}>
                    <Typography variant="body1" sx={{ color: "#64748B", fontWeight: 500, fontSize: "0.85rem" }}>
                      No student records found matching "{search}"
                    </Typography>
                    <Typography variant="caption" sx={{ color: "#94A3B8", display: "block", mt: 0.5 }}>
                      Try adjusting your search criteria or register a new student.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Edit Student Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#0F172A", fontSize: "1rem" }}>
            Edit Student Details
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            Modify placement status and recruiter assignment
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2 }}>
          {selectedStudent && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8, mt: 0.5 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.4 }}>
                  Candidate Full Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  value={selectedStudent.name || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      name: e.target.value,
                    })
                  }
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.4 }}>
                  Company Name
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="e.g. Infosys, TCS, Wipro"
                  value={selectedStudent.companyName || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
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
                  placeholder="e.g. 6.5"
                  value={selectedStudent.package || ""}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      package: e.target.value,
                    })
                  }
                />
              </Box>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.4 }}>
                  Placement Status
                </Typography>
                <TextField
                  select
                  fullWidth
                  size="small"
                  value={selectedStudent.status || "Not Placed"}
                  onChange={(e) =>
                    setSelectedStudent({
                      ...selectedStudent,
                      status: e.target.value,
                    })
                  }
                >
                  <MenuItem value="Placed">Placed</MenuItem>
                  <MenuItem value="Not Placed">Not Placed</MenuItem>
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
            onClick={updateStudent}
            sx={{
              bgcolor: "#0B2545",
              "&:hover": { bgcolor: "#133E70" },
              fontSize: "0.8rem",
            }}
          >
            Save Changes
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
        <DialogTitle sx={{ fontSize: "1rem" }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#475569", fontSize: "0.85rem" }}>
            Are you sure you want to permanently delete candidate record for{" "}
            <b>{studentToDelete?.name}</b> (Roll No: {studentToDelete?.rollNo})? This action cannot be undone.
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
            onClick={() => deleteStudent(studentToDelete?.id)}
            sx={{ fontSize: "0.8rem" }}
          >
            Delete Record
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default StudentList;
