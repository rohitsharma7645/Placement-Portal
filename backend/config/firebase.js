import { applicationDefault, cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getDatabase } from "firebase-admin/database";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

// Load .env not loaded
const envPath = path.resolve(currentDirectory, "..", ".env");
if (existsSync(envPath) && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(envPath);
  } catch {
    // Ignore error if already loaded or cannot be read
  }
}

// Check if credentials path is supplied via environment or search standard locations
const defaultKeyPath = path.resolve(currentDirectory, "..", "firebase_key.json");
const localKeyPath = path.resolve(currentDirectory, "firebase_key.json");

const resolvedKeyPath = existsSync(defaultKeyPath)
  ? defaultKeyPath
  : existsSync(localKeyPath)
    ? localKeyPath
    : defaultKeyPath;

const serviceAccountPath = path.resolve(
  process.env.GOOGLE_APPLICATION_CREDENTIALS || resolvedKeyPath,
);

const databaseURL =
  process.env.FIREBASE_DATABASE_URL ||
  "https://student-management-syste-32f7f-default-rtdb.firebaseio.com/";

let database;

try {
  if (getApps().length === 0) {
    const credential = existsSync(serviceAccountPath)
      ? cert(JSON.parse(readFileSync(serviceAccountPath, "utf8")))
      : applicationDefault();

    initializeApp({ credential, databaseURL });
    console.log(`Firebase Admin initialized (${databaseURL})`);
  }

  database = getDatabase(getApp());
} catch (error) {
  console.error("Firebase Admin initialization failed:", error.message);
  process.exit(1);
}

export { database };
export default database;
