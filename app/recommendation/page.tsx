import { DoctorRecommendation } from "@/components/DoctorRecommendation";
import { getPatient } from "@/lib/actions/patient.actions";
import { getUserAppointments } from "@/lib/actions/appointment.actions";
import { redirect } from "next/navigation";

export default async function RecommendationPage({ searchParams }: SearchParamProps) {
  const userId = (searchParams?.userId as string) || "";

  if (!userId) {
    redirect("/");
  }

  const patient = await getPatient(userId);

  if (!patient) {
    redirect(`/patients/${userId}/register`);
  }

  const appointmentsData = await getUserAppointments(userId);
  const latestAppointment = appointmentsData?.documents?.[0] || null;

  return (
    <main className="min-h-screen bg-dark-300 py-10">
      <DoctorRecommendation 
        userId={userId} 
        patientId={patient.$id} 
        latestAppointment={latestAppointment}
      />
    </main>
  );
}
