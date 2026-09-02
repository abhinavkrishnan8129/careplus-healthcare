"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { updateAppointment } from "@/lib/actions/appointment.actions";

interface PaymentButtonProps {
  appointmentId: string;
  paymentStatus?: string;
  userId: string;
}

const PaymentButton = ({ appointmentId, paymentStatus, userId }: PaymentButtonProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState(paymentStatus || "pending");
  const [message, setMessage] = useState("");

  const handlePayment = async () => {
    console.log(`[Payment] Starting payment for appointment ${appointmentId}`);
    setIsProcessing(true);
    
    // Simulate payment delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    console.log(`[Payment] Payment successful. Updating database...`);

    try {
      const updatedAppointment = await updateAppointment({
        appointmentId,
        userId,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        appointment: {
          paymentStatus: "paid",
        },
        type: "payment",
      });

      if (updatedAppointment) {
        console.log(`[Payment] Database updated successfully`);
        setStatus("paid");
        setMessage("Payment completed successfully");
        // Show alert as requested by user
        alert("Payment completed successfully");
      }
    } catch (error) {
      console.error("[Payment] Error updating payment status:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "paid") {
    return (
      <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-green-400/20 text-green-400 w-fit">
        <p className="text-12-semibold">Payment Completed ✅</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Button 
        onClick={handlePayment} 
        disabled={isProcessing}
        className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Image
              src="/assets/icons/loader.svg"
              alt="loader"
              width={24}
              height={24}
              className="animate-spin"
            />
            Processing Payment...
          </>
        ) : (
          "Pay Now"
        )}
      </Button>
      {message && <p className="text-12-regular text-green-400">{message}</p>}
    </div>
  );
};

export default PaymentButton;
