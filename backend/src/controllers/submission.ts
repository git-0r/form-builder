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
    const search = (req.query.q as string) || undefined;
    const sortOrder =
      (req.query.sortOrder as string)?.toUpperCase() === "DESC"
        ? "DESC"
        : "ASC";

    const offset = (page - 1) * limit;

    const submissions = SubmissionModel.findAll(
      limit,
      offset,
      sortOrder,
      search
    );
    const total = SubmissionModel.count(search);

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

export const getSubmissionById = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const submission = SubmissionModel.findById(id);

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    res.json({ success: true, data: submission });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch submission" });
  }
};

export const deleteSubmission = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const success = SubmissionModel.delete(id);
    if (!success)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Delete failed" });
  }
};

export const updateSubmission = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // req.body is already validated by middleware
    const success = SubmissionModel.update(id, req.body);
    if (!success)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};
