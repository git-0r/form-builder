import { Request, Response } from "express";
import fs from "node:fs";
import path from "node:path";

const schemaPath = path.join(process.cwd(), "form-schema.json");
export const formSchema = JSON.parse(fs.readFileSync(schemaPath, "utf-8"));

export const getFormSchema = (req: Request, res: Response) => {
  res.json(formSchema);
};
