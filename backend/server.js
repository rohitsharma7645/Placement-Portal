import cors from "cors";
import express from "express";
import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const serviceAccountPath = path.resolve(
  process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    path.join(currentDirectory, "firebase_key.json"),
);
const databaseURL =
  process.env.FIREBASE_DATABASE_URL ||
  "https://student-management-syste-32f7f-default-rtdb.firebaseio.com/";

let database;
try {
  const credential = existsSync(serviceAccountPath)
    ? cert(JSON.parse(readFileSync(serviceAccountPath, "utf8")))
    : applicationDefault();

  initializeApp({ credential, databaseURL });
  database = getDatabase();
  console.log(`Firebase Admin initialized (${databaseURL})`);
} catch (error) {
  console.error("Firebase Admin initialization failed:", error.message);
  process.exit(1);
}

const app = express();
const port = Number(process.env.PORT || 8000);

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_request, response) => {
  response.json({ message: "Backend Running" });
});

app.post("/register", async (request, response, next) => {
  try {
    await database.ref("users").push(request.body);
    response.json({ success: true, message: "User Registered" });
  } catch (error) {
    next(error);
  }
});

app.post("/login", async (request, response, next) => {
  try {
    const users = await database.ref("users").get();
    if (!users.exists()) {
      return response.json({ success: false, message: "No user found" });
    }

    const { email, password } = request.body || {};
    const matchedUser = Object.values(users.val()).find(
      (user) => user?.email === email && user?.password === password,
    );

    if (matchedUser) {
      return response.json({
        success: true,
        message: "Login Successful",
        user: matchedUser,
      });
    }

    return response.json({ success: false, message: "Invalid Credentials" });
  } catch (error) {
    return next(error);
  }
});

app.post("/students", async (request, response, next) => {
  try {
    const student = await database.ref("students").push(request.body);
    response.json({
      success: true,
      message: "Student Added Successfully",
      id: student.key,
    });
  } catch (error) {
    next(error);
  }
});

app.get("/students", async (_request, response, next) => {
  try {
    const snapshot = await database.ref("students").get();
    const students = snapshot.val();
    response.json(
      students
        ? Object.entries(students).map(([id, student]) => ({ ...student, id }))
        : [],
    );
  } catch (error) {
    next(error);
  }
});

app.delete("/students/:studentId", async (request, response, next) => {
  try {
    await database.ref(`students/${request.params.studentId}`).remove();
    response.json({ success: true, message: "Student Deleted" });
  } catch (error) {
    next(error);
  }
});

app.put("/students/:studentId", async (request, response, next) => {
  try {
    await database.ref(`students/${request.params.studentId}`).update(request.body);
    response.json({ success: true, message: "Student Updated" });
  } catch (error) {
    next(error);
  }
});

app.post("/companies", async (request, response, next) => {
  try {
    await database.ref("companies").push(request.body);
    response.json({ success: true, message: "Company Added" });
  } catch (error) {
    next(error);
  }
});

app.get("/companies", async (_request, response, next) => {
  try {
    const snapshot = await database.ref("companies").get();
    const companies = snapshot.val();
    response.json(
      companies
        ? Object.entries(companies).map(([id, company]) => ({ ...company, id }))
        : [],
    );
  } catch (error) {
    next(error);
  }
});

app.delete("/companies/:companyId", async (request, response, next) => {
  try {
    await database.ref(`companies/${request.params.companyId}`).remove();
    response.json({ success: true, message: "Company Deleted" });
  } catch (error) {
    next(error);
  }
});

app.put("/companies/:companyId", async (request, response, next) => {
  try {
    await database.ref(`companies/${request.params.companyId}`).update(request.body);
    response.json({ success: true, message: "Company Updated" });
  } catch (error) {
    next(error);
  }
});

app.use((error, _request, response, _next) => {
  console.error("Request failed:", error.message);
  response.status(500).json({ success: false, message: "Internal Server Error" });
});

app.listen(port, () => {
  console.log(`Student Management API listening at http://localhost:${port}`);
});