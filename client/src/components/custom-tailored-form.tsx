"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { X } from "lucide-react";
import { createCustomOrder } from "@/lib/api";
import { CUSTOM_TAILORED_GUIDE_IMAGE } from "@/lib/custom-tailored";
import type { MeasurementFields } from "@/lib/types";

const LEFT_FIELDS: { key: keyof MeasurementFields; label: string }[] = [
  { key: "shoulder", label: "Shoulder" },
  { key: "bust", label: "Bust" },
  { key: "underBust", label: "Under Bust" },
  { key: "armHole", label: "Arm Hole" },
  { key: "sleeveLength", label: "Sleeve Length" },
  { key: "bicep", label: "Bicep" },
  { key: "elbow", label: "Elbow" },
  { key: "wrist", label: "Wrist" },
  { key: "waist", label: "Waist" },
  { key: "lowerWaist", label: "Lower Waist" },
  { key: "hip", label: "Hip" },
];

const RIGHT_FIELDS: { key: keyof MeasurementFields; label: string }[] = [
  { key: "topLength", label: "Top Length" },
  { key: "bottomLength", label: "Bottom Length" },
  { key: "kurtaLength", label: "Kurta Length" },
  { key: "frontNeckDepth", label: "Front Neck Depth" },
  { key: "backNeckDepth", label: "Back Neck Depth" },
  { key: "crotchLength", label: "Crotch Length" },
  { key: "thighCircumference", label: "Thigh Circumference" },
  { key: "kneeCircumference", label: "Knee Circumference" },
  { key: "calfCircumference", label: "Calf Circumference" },
  { key: "ankleCircumference", label: "Ankle Circumference" },
];

type Props = {
  productId: string;
  productTitle: string;
  color?: string;
  colorIndex?: number;
  onClose?: () => void;
  embedded?: boolean;
};

export function CustomTailoredForm({ productId, productTitle, color, colorIndex = 0, onClose, embedded }: Props) {
  const router = useRouter();
  const [unit, setUnit] = useState<"inches" | "cms">("inches");
  const [measurements, setMeasurements] = useState<MeasurementFields>({});
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleField = (key: keyof MeasurementFields, value: string) => {
    setMeasurements((prev) => ({
      ...prev,
      [key]: value === "" ? undefined : Number(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) {
      setError("Please confirm that all details are correct.");
      return;
    }
    if (!email || !mobile) {
      setError("Email and mobile number are required.");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      const order = await createCustomOrder({
        productId,
        color,
        colorIndex,
        unit,
        measurements,
        customerEmail: email,
        customerMobile: mobile,
      });
      setSuccess(true);
      setTimeout(() => {
        onClose?.();
        router.push(`/custom-orders?order=${order.orderNumber}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit custom order.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (onClose) onClose();
    else router.back();
  };

  if (success) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center">
        <p className="text-[16px] font-semibold uppercase tracking-[0.8px]">Order Submitted</p>
        <p className="mt-2 text-[13px] text-gray">Your custom tailoring request for {productTitle} has been received.</p>
      </div>
    );
  }

  return (
    <div className={embedded ? "px-4 py-5 sm:px-6 sm:py-6" : "mx-auto max-w-[1440px] px-4 py-6 lg:px-6"}>
      <div className="mb-5 flex items-center gap-3">
        <button type="button" onClick={handleClose} aria-label="Close" className="flex size-8 items-center justify-center">
          <X size={18} />
        </button>
        <p className="text-[12px] font-normal uppercase tracking-[0.6px] lg:text-[14px]">Custom Tailored</p>
      </div>

      <p className="mb-4 text-[9px] font-medium tracking-[0.45px] text-black lg:text-[12px]">
        Tell us your body measurements
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row lg:gap-16">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-x-3 gap-y-4 lg:gap-x-6 lg:gap-y-5">
            <div className="space-y-4 lg:space-y-5">
              {LEFT_FIELDS.map(({ key, label }) => (
                <input
                  key={key}
                  type="number"
                  step="0.1"
                  placeholder={label}
                  value={measurements[key] ?? ""}
                  onChange={(e) => handleField(key, e.target.value)}
                  className="h-[36px] w-full border border-[rgba(117,117,117,0.4)] bg-transparent px-3 text-[12px] placeholder:text-black/40 outline-none focus:border-black lg:h-[44px] lg:text-[13px]"
                />
              ))}
            </div>
            <div className="space-y-4 lg:space-y-5">
              {RIGHT_FIELDS.map(({ key, label }) => (
                <input
                  key={key}
                  type="number"
                  step="0.1"
                  placeholder={label}
                  value={measurements[key] ?? ""}
                  onChange={(e) => handleField(key, e.target.value)}
                  className="h-[36px] w-full border border-[rgba(117,117,117,0.4)] bg-transparent px-3 text-[12px] placeholder:text-black/40 outline-none focus:border-black lg:h-[44px] lg:text-[13px]"
                />
              ))}
            </div>
          </div>

          <div className="mt-10 lg:mt-12">
            <p className="mb-4 text-[9px] font-medium tracking-[0.45px] text-black/70 lg:text-[12px]">Your Contact Details</p>
            <div className="grid grid-cols-2 gap-x-3 lg:gap-x-6">
              <input
                type="email"
                required
                placeholder="Email ID"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-[36px] w-full border border-[rgba(117,117,117,0.4)] bg-transparent px-3 text-[12px] placeholder:text-black/40 outline-none focus:border-black lg:h-[44px] lg:text-[13px]"
              />
              <input
                type="tel"
                required
                placeholder="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="h-[36px] w-full border border-[rgba(117,117,117,0.4)] bg-transparent px-3 text-[12px] placeholder:text-black/40 outline-none focus:border-black lg:h-[44px] lg:text-[13px]"
              />
            </div>
          </div>

          <label className="mt-8 flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="size-[13px] border border-black accent-black"
            />
            <span className="text-[11px] text-black lg:text-[13px]">All the above details are correct</span>
          </label>

          {error ? <p className="mt-4 text-[13px] text-sale">{error}</p> : null}

          <button
            type="submit"
            disabled={submitting}
            className="mt-8 h-[40px] w-full bg-black text-[13px] font-semibold tracking-[0.65px] text-white disabled:opacity-50 sm:max-w-md lg:h-[48px] lg:text-[14px]"
          >
            {submitting ? "SUBMITTING..." : "SUBMIT"}
          </button>
        </div>

        <div className="mt-8 flex justify-center lg:mt-0 lg:w-[45%] lg:shrink-0 lg:justify-end">
          <div className="relative h-[400px] w-full max-w-[300px] sm:h-[500px] lg:h-[800px] lg:max-w-[500px]">
            <Image
              src={CUSTOM_TAILORED_GUIDE_IMAGE}
              alt="Women custom tailored measurement guide"
              fill
              className="object-contain object-top"
              sizes="(min-width: 1024px) 500px, 300px"
              priority
            />
          </div>
        </div>
      </form>
    </div>
  );
}
