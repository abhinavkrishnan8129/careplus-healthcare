"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { Appointment } from "@/types/appwrite.types";

import { AppointmentModal } from "../AppointmentModal";
import { StatusBadge } from "../StatusBadge";
import { ConsultationActions } from "../ConsultationActions";

export const columns: ColumnDef<Appointment>[] = [
  {
    header: "#",
    cell: ({ row }) => {
      return <p className="text-14-medium ">{row.index + 1}</p>;
    },
  },
  {
    accessorKey: "patient",
    header: "Patient",
    cell: ({ row }) => {
      const appointment = row.original;
      return <p className="text-14-medium ">{appointment.patient.name}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className="min-w-[115px]">
          <StatusBadge status={appointment.status} />
        </div>
      );
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Payment Status",
    cell: ({ row }) => {
      const appointment = row.original;
      const isPaid = appointment.paymentStatus === "paid";
      
      console.log(`[Admin Table] Appointment ${appointment.$id} payment status:`, appointment.paymentStatus);
      
      return (
        <div className="min-w-[115px]">
          {isPaid ? (
            <div className="flex w-fit items-center gap-2 rounded-full bg-green-400/20 px-4 py-2 text-green-400">
              <span className="text-12-semibold">Paid ✅</span>
            </div>
          ) : (
            <div className="flex w-fit items-center gap-2 rounded-full bg-yellow-400/20 px-4 py-2 text-yellow-400">
              <span className="text-12-semibold">Pending 💳</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "consultationStatus",
    header: "Consultation Status",
    cell: ({ row }) => {
      const appointment = row.original;
      const status = appointment.consultationStatus || "pending";

      return (
        <div className="min-w-[115px]">
          {status === "pending" && (
            <div className="flex w-fit items-center gap-2 rounded-full bg-blue-400/20 px-4 py-2 text-blue-400">
              <span className="text-12-semibold">Not Checked ⏳</span>
            </div>
          )}
          {status === "completed" && (
            <div className="flex w-fit items-center gap-2 rounded-full bg-green-400/20 px-4 py-2 text-green-400">
              <span className="text-12-semibold">Completed ✅</span>
            </div>
          )}
          {status === "absent" && (
            <div className="flex w-fit items-center gap-2 rounded-full bg-red-400/20 px-4 py-2 text-red-400">
              <span className="text-12-semibold">Absent ❌</span>
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "schedule",
    header: "Appointment",
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <p className="text-14-regular min-w-[100px]">
          {formatDateTime(appointment.schedule).dateTime}
        </p>
      );
    },
  },
  {
    accessorKey: "primaryPhysician",
    header: "Doctor",
    cell: ({ row }) => {
      const appointment = row.original;

      const doctor = Doctors.find(
        (doctor) => doctor.name === appointment.primaryPhysician
      );

      return (
        <div className="flex items-center gap-3">
          <Image
            src={doctor?.image!}
            alt="doctor"
            width={100}
            height={100}
            className="size-8"
          />
          <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    header: () => <div className="pl-4">Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;

      const isPaid = appointment.paymentStatus === "paid";
      const isScheduleDisabled = appointment.status !== "pending" || !isPaid;

      return (
        <div className="flex gap-2 items-center">
          <div title={!isPaid ? "Payment not completed" : ""}>
            <AppointmentModal
              patientId={appointment.patient.$id}
              userId={appointment.userId}
              appointment={appointment}
              type="schedule"
              title="Schedule Appointment"
              description="Please confirm the following details to schedule."
              disabled={isScheduleDisabled}
            />
          </div>
          {!isPaid && <span className="sr-only">Payment not completed</span>}
          <AppointmentModal
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            type="cancel"
            title="Cancel Appointment"
            description="Are you sure you want to cancel your appointment?"
            disabled={appointment.status === "cancelled"}
          />
          <ConsultationActions 
            appointmentId={appointment.$id} 
            status={appointment.status} 
            consultationStatus={appointment.consultationStatus} 
          />
        </div>
      );
    },
  },
];
