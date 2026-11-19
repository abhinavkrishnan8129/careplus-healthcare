"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Search, UserRound } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { createAppointment } from "@/lib/actions/appointment.actions";
import { useRouter } from "next/navigation";
import { AppointmentModal } from "./AppointmentModal";
import { Appointment } from "@/types/appwrite.types";

interface Doctor {
  id: string;
  name: string;
  specialization: string;
  rating: number;
  reviews: number;
}

const DOCTORS: Doctor[] = [
  { id: "1", name: "John Green", specialization: "Cardiology", rating: 4.9, reviews: 128 },
  { id: "2", name: "Leila Cameron", specialization: "Dental", rating: 4.8, reviews: 93 },
  { id: "3", name: "David Livingston", specialization: "Dermatology", rating: 4.7, reviews: 204 },
  { id: "4", name: "Evan Peter", specialization: "Orthopedics", rating: 4.9, reviews: 312 },
  { id: "5", name: "Jane Powell", specialization: "Pediatrics", rating: 4.8, reviews: 156 },
  { id: "6", name: "Alex Ramirez", specialization: "Neurology", rating: 4.6, reviews: 88 },
];

export function DoctorRecommendation({ 
  userId, 
  patientId,
  latestAppointment
}: { 
  userId: string; 
  patientId: string;
  latestAppointment?: Appointment | null;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  
  const [schedule, setSchedule] = useState<Date | null>(null);
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<{ schedule?: string; reason?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBookClick = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
    setSchedule(null);
    setReason("");
    setNote("");
    setErrors({});
  };

  const handleSubmit = async () => {
    const newErrors: { schedule?: string; reason?: string } = {};
    if (!schedule) newErrors.schedule = "Expected appointment date is required";
    if (!reason.trim()) newErrors.reason = "Appointment reason is required";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const appointmentData = {
        userId,
        patient: patientId,
        primaryPhysician: selectedDoctor?.name || "",
        schedule: schedule as Date,
        reason,
        note,
        status: "pending" as const,
      };

      const newAppointment = await createAppointment(appointmentData);

      if (newAppointment) {
        setIsModalOpen(false);
        router.push(`/patients/${appointmentData.userId}/new-appointment/success?appointmentId=${newAppointment.$id}`);
      } else {
        alert("Failed to book appointment. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment", error);
      alert("An error occurred while booking the appointment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDoctors = DOCTORS.filter((doctor) => {
    const query = searchQuery.toLowerCase();
    return (
      doctor.specialization.toLowerCase().includes(query) ||
      doctor.name.toLowerCase().includes(query)
    );
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div className="flex flex-col space-y-4 flex-1">
          <h2 className="text-3xl font-bold tracking-tight text-white">Find your Doctor</h2>
          <p className="text-muted-foreground">
            Search by disease or specialization to find the right healthcare professional for you.
          </p>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for diseases or specializations (e.g., Cardiology, Dental, Dermatology...)"
              className="pl-10 h-12 text-base rounded-full border-2 focus-visible:ring-offset-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <Button 
            variant="outline" 
            className="shad-primary-btn bg-dark-400 border-dark-500 whitespace-nowrap" 
            onClick={() => router.push(`/patients/${userId}/appointments`)}
          >
            View My Appointments
          </Button>
          <Button 
            className="whitespace-nowrap bg-green-500 hover:bg-green-600 text-white" 
            onClick={() => router.push('/feedback')}
          >
            Leave Feedback
          </Button>
          {latestAppointment && latestAppointment.status !== "cancelled" && latestAppointment.consultationStatus !== "completed" && (
            <AppointmentModal
              patientId={patientId}
              userId={userId}
              appointment={latestAppointment}
              type="cancel"
              title="Cancel Appointment"
              description="Cancel your upcoming appointment."
            />
          )}
        </div>
      </div>

      {filteredDoctors.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No doctors found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <Card key={doctor.id} className="hover:shadow-lg transition-shadow duration-300 bg-dark-400 border-dark-500">
              <CardContent className="pt-6">
                <div className="flex items-start space-x-4">
                  <div className="h-16 w-16 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                    <UserRound className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <h3 className="font-semibold text-lg line-clamp-1 text-white">{doctor.name}</h3>
                    <p className="text-sm text-green-500 font-medium">{doctor.specialization}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-white">{doctor.rating}</span>
                      <span className="text-sm text-muted-foreground">({doctor.reviews} reviews)</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full rounded-full bg-green-500 hover:bg-green-600 text-white" 
                  size="lg"
                  onClick={() => handleBookClick(doctor)}
                >
                  Book Appointment
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Appointment Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-dark-400 border-dark-500 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold mb-4 text-white">
              Book Appointment with{" "}
              <span className="text-green-500">{selectedDoctor?.name}</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
                <Label htmlFor="date" className="text-sm font-medium text-gray-300">Expected Appointment Date *</Label>
                <div className="w-full rounded-md border border-dark-500 bg-dark-400 flex">
                  <ReactDatePicker
                    showTimeSelect
                    selected={schedule}
                    onChange={(date: Date | null) => {
                      setSchedule(date);
                      if (date) setErrors(prev => ({ ...prev, schedule: undefined }));
                    }}
                    timeInputLabel="Time:"
                    dateFormat="MM/dd/yyyy h:mm aa"
                    wrapperClassName="w-full"
                    className="w-full bg-transparent border-none text-white p-3 outline-none focus:ring-0"
                    placeholderText="Select date and time"
                  />
                </div>
                {errors.schedule && <p className="text-red-500 text-sm mt-1">{errors.schedule}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-sm font-medium text-gray-300">Appointment Reason *</Label>
                <Textarea
                  id="reason"
                  placeholder="E.g., Annual check-up, specific symptoms..."
                  value={reason}
                  onChange={(e) => {
                    setReason(e.target.value);
                    if (e.target.value) setErrors(prev => ({ ...prev, reason: undefined }));
                  }}
                  className="min-h-[100px] border-dark-500 bg-dark-400 text-white resize-none"
                />
                {errors.reason && <p className="text-red-500 text-sm mt-1">{errors.reason}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="note" className="text-sm font-medium text-gray-300">Comments/Notes</Label>
                <Textarea
                  id="note"
                  placeholder="Any additional information or specific requests"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="min-h-[100px] border-dark-500 bg-dark-400 text-white resize-none"
                />
              </div>

              <Button 
                onClick={handleSubmit} 
                disabled={isSubmitting}
                className="w-full bg-green-500 hover:bg-green-600 text-white rounded-md mt-4 py-6 text-base font-semibold transition-all"
              >
                {isSubmitting ? "Submitting..." : "Submit Appointment"}
              </Button>
            </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
