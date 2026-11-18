import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(currentDirectory, ".env");

if (existsSync(envPath) && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(envPath);
}

// Ensure Firebase is initialized before application begins handling requests
import "./config/firebase.js";
import app from "./app.js";

const port = Number(process.env.PORT || 8000);

app.listen(port, () => {
  console.log(`Student Management API listening at http://localhost:${port}`);
});
