"use server";

import { ID } from "node-appwrite";
import { parseStringify } from "../utils";
import { databases, DATABASE_ID, FEEDBACK_COLLECTION_ID } from "../appwrite.config";

export const createFeedback = async (feedback: CreateFeedbackParams) => {
  try {
    const newFeedback = await databases.createDocument(
      DATABASE_ID!,
      FEEDBACK_COLLECTION_ID || "feedback",
      ID.unique(),
      feedback
    );

    return parseStringify(newFeedback);
  } catch (error) {
    console.error("An error occurred while submitting feedback:", error);
    throw error;
  }
};
