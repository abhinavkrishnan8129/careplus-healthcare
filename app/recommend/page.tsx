"use client";

import { useState } from "react";

type Doctor = {
  $id: string;
  name: string;
  specialization: string;
  rating: number;
};

export default function Page() {
  const [disease, setDisease] = useState("");
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const searchDoctors = async () => {
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ disease }),
    });

    const data = await res.json();
    setDoctors(data.doctors);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Doctor</h2>

      <input
        type="text"
        placeholder="Type cardiac, dental..."
        value={disease}
        onChange={(e) => setDisease(e.target.value)}
        style={{ padding: "10px", marginRight: "10px" }}
      />

      <button onClick={searchDoctors}>Search</button>

      <div style={{ marginTop: "20px" }}>
        {doctors.length === 0 && <p>No doctors found</p>}

        {doctors.map((doc) => (
          <div
            key={doc.$id}
            style={{
              border: "1px solid gray",
              padding: "10px",
              margin: "10px",
            }}
          >
            <h3>{doc.name}</h3>
            <p>Specialization: {doc.specialization}</p>
            <p>Rating: ⭐ {doc.rating}</p>
          </div>
        ))}
      </div>
    </div>
  );
}