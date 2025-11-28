import { Router } from "express";
import { getFormSchema } from "../controllers/form";
import { createSubmission, getSubmissions } from "../controllers/submission";
import { validate } from "../middleware/validate";
import { submissionSchema } from "../utils/schemas";

const router = Router();

router.get("/form-schema", getFormSchema);

router.post("/submissions", validate(submissionSchema), createSubmission);

router.get("/submissions", getSubmissions);

export default router;
