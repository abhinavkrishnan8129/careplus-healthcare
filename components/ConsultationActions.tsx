"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { updateConsultationStatus } from "@/lib/actions/appointment.actions";
import { CheckCircle, XCircle } from "lucide-react";

interface ConsultationActionsProps {
  appointmentId: string;
  status: string;
  consultationStatus?: string;
}

export const ConsultationActions = ({
  appointmentId,
  status,
  consultationStatus,
}: ConsultationActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async (newStatus: "completed" | "absent") => {
    const confirmed = confirm(`Are you sure you want to mark this as ${newStatus}?`);
    if (!confirmed) return;

    setIsLoading(true);
    try {
      await updateConsultationStatus(appointmentId, newStatus);
      alert(`Marked as ${newStatus}`);
    } catch (error) {
      console.error(error);
      alert("Failed to update status");
    } finally {
      setIsLoading(false);
    }
  };

  const showButtons = status === "scheduled" && (consultationStatus === "pending" || !consultationStatus);

  if (!showButtons) return null;

  return (
    <div className="flex gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleUpdate("completed")}
        disabled={isLoading}
        className="text-green-500 hover:text-green-600 hover:bg-green-500/10 flex items-center gap-1"
      >
        <CheckCircle size={16} />
        Completed
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleUpdate("absent")}
        disabled={isLoading}
        className="text-red-500 hover:text-red-600 hover:bg-red-500/10 flex items-center gap-1"
      >
        <XCircle size={16} />
        Absent
      </Button>
    </div>
  );
};
