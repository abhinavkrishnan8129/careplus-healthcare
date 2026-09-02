"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";

import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { createFeedback } from "@/lib/actions/feedback.actions";
import { SelectItem } from "@/components/ui/select";

// Validation schema
const FeedbackFormValidation = z.object({
  patientName: z.string().min(2, "Name must be at least 2 characters."),
  doctorName: z.string().min(2, "Doctor name must be at least 2 characters."),
  rating: z.number().min(1, "Please select a rating").max(5),
  experience: z.string().min(1, "Please select your experience."),
  feedbackMessage: z.string().optional(),
});

export const FeedbackForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof FeedbackFormValidation>>({
    resolver: zodResolver(FeedbackFormValidation),
    defaultValues: {
      patientName: "",
      doctorName: "",
      rating: 0,
      experience: "",
      feedbackMessage: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof FeedbackFormValidation>) => {
    setIsLoading(true);

    try {
      await createFeedback(values);
      setSuccess(true);
      form.reset();

      // Reset success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-6 text-center animate-in fade-in duration-500 bg-dark-400 rounded-xl border border-dark-500">
        <div className="bg-green-500/20 p-4 rounded-full">
          <Image
            src="/assets/icons/check-circle.svg"
            height={64}
            width={64}
            alt="Success"
            className="text-green-500"
          />
        </div>
        <h2 className="header">Thank you for your feedback!</h2>
        <p className="text-dark-700">Your insights help us improve our services.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-green-500 underline"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Patient Feedback</h1>
          <p className="text-dark-700">Please share your experience with us.</p>
        </section>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="patientName"
            label="Patient Name"
            placeholder="John Doe"
            iconSrc="/assets/icons/user.svg"
            iconAlt="user"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="doctorName"
            label="Doctor Name"
            placeholder="Dr. Smith"
            iconSrc="/assets/icons/user.svg"
            iconAlt="doctor"
          />
        </div>

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="rating"
          label="Overall Rating"
          renderSkeleton={(field) => (
            <FormControl>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => field.onChange(star)}
                    className="focus:outline-none transition-transform hover:scale-110 text-3xl"
                  >
                    {star <= (field.value || 0) ? "⭐" : "☆"}
                  </button>
                ))}
              </div>
            </FormControl>
          )}
        />

        <CustomFormField
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="experience"
          label="How was your appointment experience?"
          placeholder="Select experience"
        >
          {["Excellent", "Good", "Average", "Poor"].map((exp) => (
            <SelectItem key={exp} value={exp}>
              <div className="flex cursor-pointer items-center gap-2">
                <p>{exp}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField
          fieldType={FormFieldType.TEXTAREA}
          control={form.control}
          name="feedbackMessage"
          label="Feedback Message"
          placeholder="Share your experience..."
        />

        <SubmitButton isLoading={isLoading}>Submit Feedback</SubmitButton>
      </form>
    </Form>
  );
};

export default FeedbackForm;
