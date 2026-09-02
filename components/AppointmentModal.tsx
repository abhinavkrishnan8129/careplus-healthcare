"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Appointment } from "@/types/appwrite.types";

import { AppointmentForm } from "./forms/AppointmentForm";

import "react-datepicker/dist/react-datepicker.css";

export const AppointmentModal = ({
  patientId,
  userId,
  appointment,
  type,
  title,
  description,
  disabled,
}: {
  patientId: string;
  userId: string;
  appointment?: Appointment;
  type: "schedule" | "cancel";
  title: string;
  description: string;
  disabled?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={cn("capitalize font-medium transition-all duration-200", {
            "text-green-500": type === "schedule",
            "border border-dark-500 bg-transparent text-gray-300 px-4 py-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]": type === "cancel",
          })}
          disabled={disabled}
        >
          {type}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle className="capitalize">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <AppointmentForm
          userId={userId}
          patientId={patientId}
          type={type}
          appointment={appointment}
          setOpen={setOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
