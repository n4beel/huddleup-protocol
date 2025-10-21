"use client";

import React, { useState } from "react";
import AppLayout from "@/app/components/common/AppLayout";
import ImageUpload from "@/app/components/common/ImageUpload";
import Input from "@/app/components/common/Input";
import { Select } from "@/app/components/common/Select";
import Textarea from "@/app/components/common/Textarea";
import { Button } from "@/app/components/common/Button";

interface FormState {
  name: string;
  location: string;
  cause: string;
  date: string;
  reward: string;
  image: string;
  description: string;
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
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [step, setStep] = useState<number>(1);

  const causes = [
    { _id: "1", title: "Climate Action" },
    { _id: "2", title: "Zero Hunger" },
    { _id: "3", title: "Quality Education" },
    { _id: "4", title: "Clean Water" },
  ];

  const handleChange = (key: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));

    // clear error when user starts typing
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({ ...prev, image: reader.result as string }));
        setErrors((prev) => ({ ...prev, image: "" }));
      };
      reader.readAsDataURL(file);
    } else {
      setForm((prev) => ({ ...prev, image: "" }));
    }
  };

  // ✅ Validation function for each step
  const validateStep = (): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Event name is required.";
      if (!form.location.trim()) newErrors.location = "Location is required.";
      if (!form.cause.trim()) newErrors.cause = "Please select a cause.";
      if (!form.date.trim()) newErrors.date = "Event date is required.";
      if (!form.reward.trim()) newErrors.reward = "Reward amount is required.";
    }

    if (step === 2) {
      if (!form.description.trim())
        newErrors.description = "Description is required.";
    }

    if (step === 3) {
      if (!form.image) newErrors.image = "Please upload an image.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateStep()) {
      console.log("✅ Event Data Submitted:", form);
      alert("🎉 Event created successfully!");
    }
  };

  return (
    <AppLayout>
      <main className="w-full min-h-[calc(100vh-220px)] overflow-y-scroll relative overflow-hidden p-4">
        <form
          onSubmit={handleSubmit}
          className="w-full h-auto py-4 px-2 space-y-6 mt-4 lg:mt-10"
        >
          {/* 🧭 Step Indicator */}
          <div className="flex justify-center items-center gap-0 mb-8 w-full max-w-md mx-auto">
            {[1, 2, 3].map((num, index) => (
              <React.Fragment key={num}>
                <div
                  className={`w-9 h-9 flex items-center justify-center rounded-full border-2 font-medium transition-all duration-200
                    ${
                      num === step
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
                    className={`flex-1 h-[2px] transition-all duration-300 ${
                      num < step ? "bg-primary" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* 🧾 STEP 1 — Event Info */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Input
                  label="Event Name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e)}
                  placeholder="Enter Event Name"
                  error={errors.name}
                />

                <Input
                  label="Location"
                  value={form.location}
                  onChange={(e) => handleChange("location", e)}
                  placeholder="Enter Event Location"
                  error={errors.location}
                />

                <Select
                  label="Cause"
                  options={causes}
                  value={form.cause}
                  onChange={(value) => handleChange("cause", value)}
                  placeholder="Select a Cause"
                  error={errors.cause}
                />

                <Input
                  label="Event Date"
                  type="date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e)}
                  placeholder="Select Date"
                  error={errors.date}
                />

                <Input
                  label="Reward"
                  value={form.reward}
                  onChange={(e) => handleChange("reward", e)}
                  placeholder="e.g. 6 PYUSD"
                  type="number"
                  error={errors.reward}
                />
              </div>
            </div>
          )}

          {/* 📝 STEP 2 — Description */}
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

          {/* 🖼️ STEP 3 — Image Upload */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <ImageUpload className="h-72" onChange={handleImageChange} />
              {errors.image && (
                <p className="text-red-500 text-sm mt-1">{errors.image}</p>
              )}

              {form.image && (
                <img
                  src={form.image}
                  alt="Preview"
                  className="rounded-lg w-full h-60 object-cover border mt-4"
                />
              )}
            </div>
          )}

          {/* 🔘 Navigation Buttons */}
          <div className="flex items-center justify-end gap-4 pt-6">
            {step > 1 && (
              <Button
                size="md"
                variant="light"
                type="button"
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button size="md" variant="dark" type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button size="md" variant="dark" type="submit">
                Create Event
              </Button>
            )}
          </div>
        </form>
      </main>
    </AppLayout>
  );
};

export default CreateEvent;
