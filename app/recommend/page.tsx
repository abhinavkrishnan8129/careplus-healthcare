"use client";

import { useState } from "react";
import Image from "next/image";
import ReactDatePicker from "react-datepicker";
import { Textarea } from "@/components/ui/textarea";

import "react-datepicker/dist/react-datepicker.css";

type Doctor = {
  $id: string;
  name: string;
  specialization: string;
  rating: number;
};

export default function AppointmentPage() {
  const [disease, setDisease] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [schedule, setSchedule] = useState<Date>(new Date());
  const [reason, setReason] = useState("");
  const [note, setNote] = useState("");

  const searchDoctors = async (value: string) => {
    setDisease(value);

    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ disease: value }),
    });

    const data = await res.json();
    setDoctors(data.doctors || []);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "auto" }}>
      <h1 className="header mb-8">New Appointment</h1>

      {/* Disease Input */}
      <label className="shad-input-label mb-2 block mt-6">Enter Disease</label>
      <input
        type="text"
        placeholder="Type cardiac, dental..."
        value={disease}
        onChange={(e) => searchDoctors(e.target.value)}
        className="shad-input w-full rounded-md p-2 border outline-none"
        style={{
          backgroundColor: "#1a1d21",
          color: "white",
          borderColor: "#363a3d"
        }}
      />

      {/* Doctor Dropdown */}
      <label className="shad-input-label mb-2 block mt-6">Select Doctor</label>
      <select
        value={selectedDoctor}
        onChange={(e) => setSelectedDoctor(e.target.value)}
        className="shad-input w-full rounded-md p-2 border outline-none"
        style={{
          backgroundColor: "#1a1d21",
          color: "white",
          borderColor: "#363a3d"
        }}
      >
        <option value="">-- Select Doctor --</option>
        {doctors.map((doc) => (
          <option key={doc.$id} value={doc.name}>
            {doc.name} ⭐ {doc.rating} ({doc.specialization})
          </option>
        ))}
      </select>

      {/* Date Picker */}
      <label className="shad-input-label mb-2 block mt-6">Expected appointment date</label>
      <div className="flex rounded-md border border-dark-500 bg-dark-400 mb-6 w-full">
        <Image
          src="/assets/icons/calendar.svg"
          height={24}
          width={24}
          alt="calendar"
          className="ml-2"
        />
        <ReactDatePicker
          showTimeSelect
          selected={schedule}
          onChange={(date: Date | null) => date && setSchedule(date)}
          timeInputLabel="Time:"
          dateFormat="MM/dd/yyyy  -  h:mm aa"
          wrapperClassName="date-picker"
        />
      </div>

      <div className="flex flex-col gap-6 xl:flex-row mb-6 mt-6">
        {/* Reason */}
        <div className="flex-1">
          <label className="shad-input-label mb-2 block">Appointment reason</label>
          <Textarea
            placeholder="Annual montly check-up"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="shad-textArea"
          />
        </div>

        {/* Note */}
        <div className="flex-1">
          <label className="shad-input-label mb-2 block">Comments/notes</label>
          <Textarea
            placeholder="Prefer afternoon appointments, if possible"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="shad-textArea"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "12px",
          background: "#24ae7c",
          color: "white",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontWeight: "600",
          fontSize: "16px"
        }}
        className="transition-all hover:bg-[#1a8b61]"
      >
        Submit Appointment
      </button>
    </div>
  );
}