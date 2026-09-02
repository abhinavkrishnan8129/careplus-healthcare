"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { encryptKey } from "@/lib/utils";

export const PasskeyModal = () => {
  const router = useRouter();

  const [open, setOpen] = useState(true);
  const [passkey, setPasskey] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  // ✅ Only for hydration safety (NO auto login)
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // ✅ Close modal and go back home
  const closeModal = () => {
    setOpen(false);
    router.push("/");
  };

  // ✅ Validate passkey
  const validatePasskey = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();

    if (passkey === process.env.NEXT_PUBLIC_ADMIN_PASSKEY) {
      const encryptedKey = encryptKey(passkey);

      localStorage.setItem("accessKey", encryptedKey);

      setOpen(false);

      // ✅ Navigate ONLY after correct passkey
      router.push("/admin");
    } else {
      setError("Invalid passkey. Please try again.");
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(val) => {
        if (!val) closeModal();
      }}
    >
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-start justify-between">
            Admin Access Verification
            <Image
              src="/assets/icons/close.svg"
              alt="close"
              width={20}
              height={20}
              onClick={closeModal}
              className="cursor-pointer"
            />
          </AlertDialogTitle>

          <AlertDialogDescription>
            To access the admin page, please enter the passkey.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div>
          <InputOTP
            maxLength={6}
            value={passkey}
            onChange={(value) => {
              setPasskey(value);
              if (error) setError("");
            }}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="shad-error text-14-regular mt-4 text-center">
              {error}
            </p>
          )}
        </div>

        <AlertDialogFooter>
          <button
            onClick={validatePasskey}
            className="shad-primary-btn w-full"
          >
            Enter Admin Passkey
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};