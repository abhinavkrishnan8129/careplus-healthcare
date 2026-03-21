"use client";

import { useState } from "react";

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
    setDoctors(data.doctors);
  };

  return (
    <div style={{ padding: "40px", maxWidth: "600px", margin: "auto" }}>
      <h1>New Appointment</h1>

      {/* Disease Input */}
      <label>Enter Disease</label>
      <input
        type="text"
        placeholder="Type cardiac, dental..."
        value={disease}
        onChange={(e) => searchDoctors(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "10px",
          marginBottom: "20px",
        }}
      />

      {/* Doctor Dropdown */}
      <label>Select Doctor</label>
      <select
        value={selectedDoctor}
        onChange={(e) => setSelectedDoctor(e.target.value)}
        style={{ width: "100%", padding: "10px", marginTop: "10px" }}
      >
        <option value="">-- Select Doctor --</option>

        {doctors.map((doc) => (
          <option key={doc.$id} value={doc.name}>
            {doc.name} ⭐ {doc.rating} ({doc.specialization})
          </option>
        ))}
      </select>

      {/* Submit Button */}
      <button
        style={{
          marginTop: "30px",
          width: "100%",
          padding: "12px",
          background: "green",
          color: "white",
          border: "none",
        }}
      >
        Submit Appointment
      </button>
    </div>
  );
}