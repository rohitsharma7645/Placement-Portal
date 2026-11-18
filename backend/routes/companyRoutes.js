import { Router } from "express";
import {
  addCompany,
  getCompanies,
  deleteCompany,
  updateCompany,
} from "../controllers/companyController.js";

const router = Router();

router.post("/", addCompany);
router.get("/", getCompanies);
router.delete("/:companyId", deleteCompany);
router.put("/:companyId", updateCompany);

export default router;
