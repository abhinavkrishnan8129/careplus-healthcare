import { Client, Databases, Query } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("69a6a95a002e06d28a6b");

const databases = new Databases(client);

// Disease → Specialization mapping
const map = {
  cardiac: "cardiology",
  heart: "cardiology",
  dental: "dental",
  tooth: "dental",
  skin: "dermatology"
};

export async function POST(req) {
  const { disease } = await req.json();

  // convert disease → specialization
  const specialization = map[disease.toLowerCase()];

  if (!specialization) {
    return Response.json({ doctors: [] });
  }

  // get doctors from database
const res = await databases.listDocuments(
  "69a6aa0d001f0c578a11",  // Database ID
  "doctors",               // ✅ Collection ID
  [
    Query.equal("specialization", specialization),
    Query.orderDesc("rating"),
  ]
);
  return Response.json({ doctors: res.documents });
}