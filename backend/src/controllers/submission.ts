import { Request, Response } from "express";
import { SubmissionModel } from "../models/submission";

export const createSubmission = (req: Request, res: Response) => {
  try {
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    SubmissionModel.create(id, req.body, createdAt);

    res.status(201).json({ success: true, id, createdAt });
  } catch (error) {
    console.error("Submission error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getSubmissions = (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;
    const sortOrder =
      (req.query.sortOrder as string)?.toUpperCase() === "DESC"
        ? "DESC"
        : "ASC";

    const submissions = SubmissionModel.findAll(limit, offset, sortOrder);
    const total = SubmissionModel.count();

    res.json({
      success: true,
      data: submissions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch submissions" });
  }
};
