"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/common/AppLayout";
import ImageUpload from "@/app/components/common/ImageUpload";
import Input from "@/app/components/common/Input";
import { Select } from "@/app/components/common/Select";
import Textarea from "@/app/components/common/Textarea";
import { Button } from "@/app/components/common/Button";
import Image from "next/image";
import toast from "react-hot-toast";
import { createEvent, uploadImage } from "@/app/services/event.service";

interface FormState {
  name: string;
  location: string;
  cause: string;
  date: string;
  reward: string;
  image: string;
  description: string;
  funding: string;
}

interface FormErrors {
  [key: string]: string;
}

const CreateEvent = () => {
  const [form, setForm] = useState<FormState>({
    name: "",
    location: "",
    cause: "",
    date: "",
    reward: "",
    image: "",
    description: "",
    funding: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<number>(3);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const causes = [
    { _id: "1", title: "Climate Action" },
    { _id: "2", title: "Zero Hunger" },
    { _id: "3", title: "Quality Education" },
    { _id: "4", title: "Clean Water" },
  ];

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleImageChange = async (file: File | null) => {
    if (!file) {
      setForm((prev) => ({ ...prev, image: "" }));
      return;
    }
    try {
      setUploading(true);
      const toastId = toast.loading("Uploading image...");
      const data = await uploadImage(file);
      setForm((prev) => ({ ...prev, image: data.urls[0] }));
      setErrors((prev) => ({ ...prev, image: "" }));
      toast.success("Image uploaded successfully!", { id: toastId });
    } catch (error) {
      console.error("Image upload failed:", error);
      toast.error("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  /**
   * ✅ Only validates current step.
   * Image validation runs ONLY when submitting.
   */
  const validateStep = (isSubmit = false): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Event name is required.";
      if (!form.location.trim()) newErrors.location = "Location is required.";
      if (!form.cause.trim()) newErrors.cause = "Please select a cause.";
      if (!form.date.trim()) newErrors.date = "Event date is required.";
      if (!form.reward.trim()) newErrors.reward = "Reward amount is required.";
      if (!form.funding.trim()) newErrors.funding = "Funding amount is required.";
    }

    if (step === 2) {
      if (!form.description.trim())
        newErrors.description = "Description is required.";
    }

    // ✅ Only validate image on submit
    if (isSubmit && !form.image) {
      newErrors.image = "Please upload an image.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    setErrors({});
    if (validateStep()) setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setErrors({});
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(true)) return;

    setLoading(true);
    try {
      const payload = {
        title: form.name,
        description: form.description,
        eventDate: new Date(form.date).toISOString(),
        location: form.location,
        eventType: form.cause,
        fundingRequired: Number(form.funding),
        airdropAmount: Number(form.reward),
        bannerImage: form.image,
      };

      await createEvent(payload);
      toast.success("🎉 Event created successfully!");

      setForm({
        name: "",
        location: "",
        cause: "",
        date: "",
        reward: "",
        image: "",
        description: "",
        funding: "",
      });
      setStep(1);
    } catch (error: any) {
      toast.error(error.message || "❌ Failed to create event");
    } finally {
      setLoading(false);
    }
  };


  return (
    <AppLayout>
      <main className="w-full min-h-[calc(100vh-220px)] overflow-y-scroll relative overflow-hidden p-4">
        <div
          className="w-full h-auto py-4 px-2 space-y-6 mt-4 lg:mt-10"
        >
          {/* 🧭 Step Indicator */}
          <div className="flex justify-center items-center gap-0 mb-8 w-full max-w-md mx-auto">
            {[1, 2, 3].map((num, index) => (
              <React.Fragment key={num}>
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-full border-2 font-medium transition-all duration-200
                    ${num === step
                      ? "bg-primary text-white border-primary"
                      : num < step
                      ? "bg-primary/20 border-primary text-primary"
                      : "border-gray-300 text-gray-500"
                    }`}
                >
                  {num}
                </div>
                {index < 2 && (
                  <div
                    className={`flex-1 h-[2px] transition-all duration-300 ${num < step ? "bg-primary" : "bg-gray-300"
                      }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* 🧾 STEP 1 */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input label="Event Name" value={form.name} onChange={(e) => handleChange("name", e)} placeholder="Enter Event Name" error={errors.name} />
                <Input label="Location" value={form.location} onChange={(e) => handleChange("location", e)} placeholder="Enter Event Location" error={errors.location} />
                <Select label="Cause" options={causes} value={form.cause} onChange={(value) => handleChange("cause", value)} placeholder="Select a Cause" error={errors.cause} />
                <Input label="Event Date" type="date" value={form.date} onChange={(e) => handleChange("date", e)} placeholder="Select Date" error={errors.date} />
                <Input label="Reward" value={form.reward} onChange={(e) => handleChange("reward", e)} placeholder="e.g. 6 PYUSD" type="number" error={errors.reward} />
                <Input label="Funding Required" value={form.funding} onChange={(e) => handleChange("funding", e)} placeholder="e.g. 500 PYUSD" type="number" error={errors.funding} />
              </div>
            </div>
          )}

          {/* 📝 STEP 2 */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <Textarea
                label="Event Description"
                value={form.description}
                onChange={(value) => handleChange("description", value)}
                placeholder="Write a short description about your event..."
                rows={7}
                error={errors.description}
              />
            </div>
          )}

          {/* 🖼️ STEP 3 */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
                <ImageUpload className="h-72" onChange={handleImageChange} image={form.image} />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}
            </div>
          )}

          {/* 🔘 Navigation Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            {step > 1 && (
              <Button
                size="md"
                variant="light"
                type="button" // ✅ prevents form submit
                onClick={handleBack}
                disabled={loading || uploading}
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button
                size="md"
                variant="dark"
                type="button" // ✅ prevents submit on Next
                onClick={handleNext}
                disabled={loading || uploading}
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                size="md"
                variant="dark"
                type="submit"
                disabled={loading || uploading}
              >
                {loading ? "Creating..." : "Create Event"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </AppLayout>
  );
};

export default CreateEvent;
