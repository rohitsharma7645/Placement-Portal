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
      {/* Top Action Bar */}
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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Chip
            label={`${filteredStudents.length} Students Total`}
            sx={{
              bgcolor: "#0B2545",
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "0.78rem",
              borderRadius: "4px",
            }}
          />
        </Box>

        {/* Toolbar Buttons */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
          <Button
            variant="outlined"
            size="small"
            startIcon={<FileDownloadIcon />}
            onClick={exportToExcel}
            sx={{
              borderColor: "#CBD5E1",
              color: "#334155",
              "&:hover": { borderColor: "#059669", color: "#059669" },
            }}
          >
            Export Excel
          </Button>

          <Button
            variant="outlined"
            size="small"
            startIcon={<PdfIcon />}
            onClick={exportToPDF}
            sx={{
              borderColor: "#CBD5E1",
              color: "#334155",
              "&:hover": { borderColor: "#DC2626", color: "#DC2626" },
            }}
          >
            Export PDF
          </Button>

          <Button
            variant="contained"
            size="small"
            startIcon={<AddPersonIcon />}
            onClick={() => navigate("/add-student")}
            sx={{
              bgcolor: "#0B2545",
              "&:hover": { bgcolor: "#133E70" },
            }}
          >
            Register Student
          </Button>
        </Box>
      </Box>

      {/* Filter and Search Bar */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          bgcolor: "#FFFFFF",
        }}
      >
        <TextField
          fullWidth
          size="small"
          placeholder="Filter students by Name, Roll No, Branch, or Company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#94A3B8", fontSize: 20 }} />
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
      </Paper>

      {/* Student Data Table */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #E2E8F0",
          borderRadius: "8px",
          bgcolor: "#FFFFFF",
          overflow: "hidden",
        }}
      >
        <TableContainer sx={{ maxHeight: "calc(100vh - 340px)" }}>
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
                            width: 30,
                            height: 30,
                            bgcolor: "#0B2545",
                            color: "#FFFFFF",
                            fontSize: "0.75rem",
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
                              fontSize: "0.875rem",
                              "&:hover": { textDecoration: "underline" },
                            }}
                            onClick={() => navigate(`/student-profile/${student.id}`)}
                          >
                            {student.name}
                          </Typography>
                          {student.email && (
                            <Typography variant="caption" sx={{ color: "#64748B", display: "block" }}>
                              {student.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600 }}>
                        {student.rollNo || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#334155" }}>
                        {student.branch || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ color: "#64748B" }}>
                        {student.phone || "—"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
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
                            fontSize: "0.75rem",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: "#94A3B8" }}>
                          —
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell>
                      {student.status === "Placed" ? (
                        <Chip
                          icon={<PlacedIcon sx={{ fontSize: "14px !important", color: "#059669 !important" }} />}
                          label="Placed"
                          size="small"
                          sx={{
                            bgcolor: "#ECFDF5",
                            color: "#059669",
                            border: "1px solid #A7F3D0",
                            fontWeight: 600,
                            fontSize: "0.75rem",
                            borderRadius: "4px",
                          }}
                        />
                      ) : (
                        <Chip
                          icon={<NotPlacedIcon sx={{ fontSize: "14px !important", color: "#64748B !important" }} />}
                          label="Not Placed"
                          size="small"
                          sx={{
                            bgcolor: "#F8FAFC",
                            color: "#64748B",
                            border: "1px solid #E2E8F0",
                            fontWeight: 500,
                            fontSize: "0.75rem",
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
                              "&:hover": { color: "#0B2545", bgcolor: "#F1F5F9" },
                            }}
                          >
                            <EditIcon fontSize="small" />
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
                              "&:hover": { color: "#DC2626", bgcolor: "#FEF2F2" },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                    <Typography variant="body1" sx={{ color: "#64748B", fontWeight: 500 }}>
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
          <Typography variant="h6" sx={{ fontWeight: 600, color: "#0F172A" }}>
            Edit Student Details
          </Typography>
          <Typography variant="caption" sx={{ color: "#64748B" }}>
            Modify placement status and recruiter assignment
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ pt: 2.5 }}>
          {selectedStudent && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.5 }}>
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
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.5 }}>
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
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.5 }}>
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
                <Typography variant="caption" sx={{ fontWeight: 600, color: "#334155", display: "block", mb: 0.5 }}>
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

        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ color: "#64748B" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={updateStudent}
            sx={{
              bgcolor: "#0B2545",
              "&:hover": { bgcolor: "#133E70" },
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
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#475569", fontSize: "0.875rem" }}>
            Are you sure you want to permanently delete candidate record for{" "}
            <b>{studentToDelete?.name}</b> (Roll No: {studentToDelete?.rollNo})? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} sx={{ color: "#64748B" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => deleteStudent(studentToDelete?.id)}
          >
            Delete Record
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}

export default StudentList;
