import {
  Box,
  Typography,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";

import {
  useEffect,
  useState
} from "react";

import api
from "../api/api";

import Sidebar
from "../components/Sidebar";

import BusinessIcon
from "@mui/icons-material/Business";

import WorkIcon
from "@mui/icons-material/Work";

import SearchIcon
from "@mui/icons-material/Search";

import AddIcon
from "@mui/icons-material/Add";

function Dashboard() {

  const [stats,
    setStats] =
    useState([
      {
        title:
          "Total Students",
        value: "0",
      },
      {
        title:
          "Placed Students",
        value: "0",
      },
      {
        title:
          "Companies Visited",
        value: "0",
      },
      {
        title:
          "Highest Package",
        value:
          "₹0 LPA",
      },
    ]);

  // NEW: Upcoming Drives State
  const [upcomingDrives,
    setUpcomingDrives] =
    useState([]);

  useEffect(() => {

    fetchDashboardData();

  }, []);

  const fetchDashboardData =
    async () => {

      try {

        // Students API
        const response =
          await api.get(
            "/students"
          );

        const students =
          response.data;

        // Companies API
        const companyResponse =
          await api.get(
            "/companies"
          );

        const companyData =
          companyResponse.data;

        // Dashboard Stats
        const totalStudents =
          students.length;

        const placedStudents =
          students.filter(
            (
              student
            ) =>
              student.status ===
              "Placed"
          ).length;

        const companies =
          [
            ...new Set(
              students
                .map(
                  (
                    student
                  ) =>
                    student.companyName
                )
                .filter(
                  Boolean
                )
            ),
          ];

        const highestPackage =
          Math.max(
            ...students.map(
              (
                student
              ) =>
                Number(
                  student.package
                ) || 0
            )
          );

        setStats([
          {
            title:
              "Total Students",
            value:
              totalStudents,
          },
          {
            title:
              "Placed Students",
            value:
              placedStudents,
          },
          {
            title:
              "Companies Visited",
            value:
              companies.length,
          },
          {
            title:
              "Highest Package",
            value:
              `₹${highestPackage} LPA`,
          },
        ]);

        // NEW: Live Upcoming Drives
        const upcoming =
          companyData
            .filter(
              (
                company
              ) =>
                company.status ===
                "Upcoming"
            )
            .sort(
              (
                a,
                b
              ) =>
                new Date(
                  a.driveDate
                ) -
                new Date(
                  b.driveDate
                )
            )
            .slice(0, 4);

        setUpcomingDrives(
          upcoming
        );

      } catch (
        error
      ) {

        console.log(
          error
        );
      }
    };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight:
          "100vh",
        bgcolor:
          "#f4f7fc",
      }}
    >

      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: 4,
        }}
      >

        {/* Top Bar */}
        <Box
          sx={{
            display:
              "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              fontWeight="bold"
            >
              Placement Dashboard
            </Typography>

            <Typography
              color="gray"
            >
              Welcome to SVIET Placement Management Portal
            </Typography>
          </Box>

          <Box
            sx={{
              display:
                "flex",
              gap: 2,
            }}
          >
            <TextField
              placeholder="Search..."
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Avatar>
              A
            </Avatar>
          </Box>
        </Box>

        {/* Quick Buttons */}
        <Box
          sx={{
            display:
              "flex",
            gap: 2,
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            startIcon={
              <AddIcon />
            }
          >
            Add Student
          </Button>

          <Button
            variant="outlined"
            startIcon={
              <BusinessIcon />
            }
          >
            Add Company
          </Button>

          <Button
            variant="outlined"
            startIcon={
              <WorkIcon />
            }
          >
            Create Drive
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid
          container
          spacing={3}
        >
          {stats.map(
            (
              item,
              index
            ) => (
              <Grid
                item
                xs={12}
                md={3}
                key={index}
              >
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 4,
                  }}
                >
                  <Typography
                    color="gray"
                  >
                    {
                      item.title
                    }
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    mt={1}
                  >
                    {
                      item.value
                    }
                  </Typography>
                </Paper>
              </Grid>
            )
          )}
        </Grid>

        {/* Bottom Section */}
        <Grid
          container
          spacing={3}
          mt={2}
        >

          {/* Recent Placements */}
          <Grid
            item
            xs={12}
            md={8}
            sx={{ mt: 2 }}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                Recent Placements
              </Typography>

              <Box
                sx={{
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  p: 2,
                  borderBottom:
                    "1px solid #ddd",
                }}
              >
                <Typography>
                  Gurmeet Singh
                </Typography>

                <Typography>
                  TCS
                </Typography>

                <Typography>
                  ₹7 LPA
                </Typography>

                <Typography
                  color="green"
                >
                  Selected
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Upcoming Drives */}
          <Grid
            item
            xs={12}
            md={4}
          >
            <Paper
              sx={{
                p: 3,
                borderRadius: 4,
              }}
            >
              <Typography
                variant="h6"
                fontWeight="bold"
                mb={2}
              >
                Upcoming Drives
              </Typography>

              {upcomingDrives.length > 0 ? (

                upcomingDrives.map(
                  (
                    company,
                    index
                  ) => (

                    <Box
                      key={index}
                      sx={{
                        bgcolor:
                          "#eef5ff",
                        p: 2,
                        borderRadius: 3,
                        mb: 2,
                      }}
                    >
                      <Typography
                        fontWeight="bold"
                      >
                        {
                          company.companyName
                        }
                      </Typography>

                      <Typography>
                        {
                          company.driveDate
                        }
                      </Typography>

                      <Typography>
                        ₹{
                          company.package
                        } LPA
                      </Typography>
                    </Box>
                  )
                )

              ) : (

                <Typography
                  color="gray"
                >
                  No Upcoming Drives
                </Typography>

              )}

            </Paper>
          </Grid>

        </Grid>
      </Box>
    </Box>
  );
}

export default Dashboard;