"use client";

import { CustomTailoredForm } from "@/components/custom-tailored-form";

type Props = {
  open: boolean;
  onClose: () => void;
  productId: string;
  productTitle: string;
  color?: string;
  colorIndex?: number;
};

export function CustomTailoredModal({
  open,
  onClose,
  productId,
  productTitle,
  color,
  colorIndex = 0,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden bg-white sm:max-h-[90vh] sm:rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto">
          <CustomTailoredForm
            embedded
            productId={productId}
            productTitle={productTitle}
            color={color}
            colorIndex={colorIndex}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
}
