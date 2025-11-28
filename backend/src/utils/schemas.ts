import { generateZodSchema } from "./validator";
import { formSchema } from "../controllers/form";

export const submissionSchema = generateZodSchema(formSchema);
