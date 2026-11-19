import Image from "next/image";
import Link from "next/link";
import { getUserAppointments } from "@/lib/actions/appointment.actions";
import { Doctors, StatusIcon } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";
import PaymentButton from "@/components/PaymentButton";
import { AppointmentModal } from "@/components/AppointmentModal";

const AppointmentsPage = async ({ params: { userId } }: { params: { userId: string } }) => {
  const appointmentsData = await getUserAppointments(userId);
  const appointments: Appointment[] = appointmentsData ? appointmentsData.documents : [];

  return (
    <div className="flex h-screen max-h-screen flex-col remove-scrollbar overflow-y-auto bg-dark-300">
      <header className="admin-header w-full">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>

        <p className="text-16-semibold text-white">My Appointments</p>
      </header>

      <main className="admin-main flex-1 flex-col">
        <section className="w-full space-y-4">
          <h1 className="header">Appointment Status</h1>
          <p className="text-dark-700">Track the real-time status of your scheduled appointments.</p>
        </section>

        <section className="mt-8 w-full">
          {appointments.length === 0 ? (
            <p className="text-dark-700">No appointments found.</p>
          ) : (
            <div className="flex flex-col gap-6">
              {appointments.map((appointment) => {
                const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician);
                
                let statusBadgeText = "";
                let statusBadgeColor = "";
                let statusIcon = "";

                if (appointment.status === "pending") {
                  statusBadgeText = "Waiting for approval";
                  statusBadgeColor = "bg-yellow-400/20 text-yellow-400";
                  statusIcon = StatusIcon.pending;
                } else if (appointment.status === "scheduled") {
                  statusBadgeText = "Your appointment is ready";
                  statusBadgeColor = "bg-green-400/20 text-green-400";
                  statusIcon = StatusIcon.scheduled;
                } else if (appointment.status === "cancelled") {
                  statusBadgeText = "Appointment rejected";
                  statusBadgeColor = "bg-red-400/20 text-red-400";
                  statusIcon = StatusIcon.cancelled;
                }

                return (
                  <div key={appointment.$id} className="flex flex-col gap-4 rounded-xl border border-dark-500 bg-dark-400 p-6 shadow-sm transition-all hover:bg-dark-400/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {doctor && (
                          <Image
                            src={doctor.image}
                            alt={doctor.name}
                            width={48}
                            height={48}
                            className="rounded-full border border-dark-500"
                          />
                        )}
                        <div>
                          <p className="text-16-semibold text-white">Dr. {appointment.primaryPhysician}</p>
                          <p className="text-14-regular text-dark-700">
                            {formatDateTime(appointment.schedule).dateTime}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${statusBadgeColor}`}>
                          <Image
                            src={statusIcon}
                            alt={appointment.status}
                            width={16}
                            height={16}
                            className="h-4 w-4"
                          />
                          <p className="text-12-semibold">{statusBadgeText}</p>
                        </div>

                        {appointment.status === "scheduled" && (
                          <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${
                            appointment.consultationStatus === "completed" 
                              ? "bg-green-400/20 text-green-400" 
                              : appointment.consultationStatus === "absent" 
                                ? "bg-red-400/20 text-red-400" 
                                : "bg-yellow-400/20 text-yellow-400"
                          }`}>
                            <span className="text-12-semibold">
                              {appointment.consultationStatus === "completed" && "Consultation Completed ✅"}
                              {appointment.consultationStatus === "absent" && "You missed the appointment ❌"}
                              {(appointment.consultationStatus === "pending" || !appointment.consultationStatus) && "Awaiting consultation ⏳"}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {appointment.reason && (
                      <div className="mt-2 border-t border-dark-500 pt-4">
                        <p className="text-14-regular text-dark-700">Reason: {appointment.reason}</p>
                      </div>
                    )}
                    <div className="mt-4 flex justify-end gap-3">
                      {appointment.status !== "cancelled" && appointment.consultationStatus !== "completed" && (
                        <AppointmentModal
                          patientId={appointment.patient.$id}
                          userId={userId}
                          appointment={appointment}
                          type="cancel"
                          title="Cancel Appointment"
                          description="Please provide a reason for cancelling your appointment."
                        />
                      )}
                      <PaymentButton 
                        appointmentId={appointment.$id} 
                        paymentStatus={appointment.paymentStatus} 
                        userId={userId} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AppointmentsPage;
