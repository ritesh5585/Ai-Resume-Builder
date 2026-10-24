
import { isValidObjectId } from "mongoose";
import connectDB from "@/lib/database";
import getUser from "@/lib/getUser";
import resumenModel from "@/models/resume.model";
import type { ResumeDTO } from "@/services/resume.api";

export async function getResumeById(id: string): Promise<ResumeDTO | null | "unauthorized"> {
  let userId: string;
  try {
    userId = await getUser();
  } catch {
    return "unauthorized";
  }
  if (!isValidObjectId(id)) return null;

  await connectDB();
  const doc = await resumenModel.findOne({ _id: id, user_id: userId }).lean();
  // ObjectId/Date ko plain string bana do, tabhi client component ko pass ho sakta hai
  return doc ? (JSON.parse(JSON.stringify(doc)) as ResumeDTO) : null;
}