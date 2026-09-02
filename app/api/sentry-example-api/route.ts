import { Query } from "node-appwrite";

import { databases } from "@/lib/appwrite.config";
import { parseStringify } from "@/lib/utils";

const map: Record<string, string> = {
  cardiac: "cardiology",
  heart: "cardiology",
  dental: "dental",
};

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const disease = body.disease?.toLowerCase() as string;

    const specialization = map[disease];

    if (!specialization) {
      return Response.json({ doctors: [] });
    }

    const res = await databases.listDocuments(
      "69a6aa0d001f0c578a11",
      "doctors",
      [
        Query.equal("specialization", specialization),
        Query.orderDesc("rating"),
      ]
    );

    return Response.json({ doctors: parseStringify(res.documents) });

  } catch (error: any) {
    console.log(error);
    return Response.json({ error: error.message || error.toString() }, { status: 500 });
  }
}