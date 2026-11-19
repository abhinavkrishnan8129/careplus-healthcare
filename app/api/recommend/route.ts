import { Query } from "node-appwrite";

import { databases } from "@/lib/appwrite.config";
import { parseStringify } from "@/lib/utils";

// Disease → Specialization mapping
const map: Record<string, string> = {
  cardiac: "cardiology",
  heart: "cardiology",
  dental: "dental",
  tooth: "dental",
  skin: "dermatology"
};

export async function POST(req: Request) {
  try {
    const { disease } = await req.json();

    const specialization = map[disease.toLowerCase()];

    if (!specialization) {
      return Response.json({ doctors: [] });
    }

    const res = await databases.listDocuments(
      "69a6aa0d001f0c578a11",  // Database ID
      "doctors",               // Collection ID
      [
        Query.equal("specialization", specialization),
        Query.orderDesc("rating"),
      ]
    );

    return Response.json({ doctors: parseStringify(res.documents) });
  } catch (error: any) {
    console.error(error);
    return Response.json({ error: error.message || error.toString() }, { status: 500 });
  }
}