import { Router } from "express";
import {
  addStudent,
  getStudents,
  deleteStudent,
  updateStudent,
} from "../controllers/studentController.js";

const router = Router();

router.post("/", addStudent);
router.get("/", getStudents);
router.delete("/:studentId", deleteStudent);
router.put("/:studentId", updateStudent);

export default router;
