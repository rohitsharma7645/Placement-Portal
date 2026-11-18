import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_request, response) => {
  response.json({ message: "Backend Running" });
});

app.use(authRoutes);
app.use("/students", studentRoutes);
app.use("/companies", companyRoutes);

app.use(errorHandler);

export default app;
