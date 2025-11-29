import { Router } from "express";
import { getFormSchema } from "../controllers/form";
import {
  createSubmission,
  deleteSubmission,
  getSubmissionById,
  getSubmissions,
  updateSubmission,
} from "../controllers/submission";
import { validate } from "../middleware/validate";
import { submissionSchema } from "../utils/schemas";

const router = Router();

router.get("/form-schema", getFormSchema);

router.post("/submissions", validate(submissionSchema), createSubmission);

router.get("/submissions", getSubmissions);

router.get("/submissions/:id", getSubmissionById);

router.delete("/submissions/:id", deleteSubmission);

router.put("/submissions/:id", validate(submissionSchema), updateSubmission);

export default router;
