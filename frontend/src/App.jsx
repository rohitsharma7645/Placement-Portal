import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import StudentProfile
from "./pages/StudentProfile";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddStudent
from "./pages/AddStudent";
import StudentList from "./pages/StudentList";
import AddCompany
from "./pages/AddCompany";
import CompanyList
from "./pages/CompanyList";

import Analytics
from "./pages/Analytics";
import ProtectedRoute
from "./components/ProtectedRoute";
import Notifications
from "./pages/Notifications";
function App() {

  return (

 <BrowserRouter>

  <Routes>
    <Route
  path="/notifications"
  element={
    <ProtectedRoute>
      <Notifications />
    </ProtectedRoute>
  }
/>
<Route
  path="/student-profile/:id"
  element={
    <StudentProfile />
  }
/>
    <Route
      path="/"
      element={<Login />}
    />

    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />

    <Route
      path="/students"
      element={
        <ProtectedRoute>
          <StudentList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/add-student"
      element={
        <ProtectedRoute>
          <AddStudent />
        </ProtectedRoute>
      }
    />

    <Route
      path="/companies"
      element={
        <ProtectedRoute>
          <AddCompany />
        </ProtectedRoute>
      }
    />

    <Route
      path="/company-list"
      element={
        <ProtectedRoute>
          <CompanyList />
        </ProtectedRoute>
      }
    />

    <Route
      path="/analytics"
      element={
        <ProtectedRoute>
          <Analytics />
        </ProtectedRoute>
      }
    />

  </Routes>

</BrowserRouter>
  );
}

export default App;