"use client";

import { X } from "lucide-react";
import { formatPrice } from "@/lib/services/products";

type Props = {
  open: boolean;
  onClose: () => void;
  sizes: string[];
  price: number;
  stockBySize?: Record<string, number>;
  customTailoringEnabled?: boolean;
  customTailoringPrice?: number;
  onSelectSize: (size: string) => void;
  onOpenCustomTailored?: () => void;
};

export function SizeSelectModal({
  open,
  onClose,
  sizes,
  price,
  stockBySize,
  customTailoringEnabled,
  customTailoringPrice,
  onSelectSize,
  onOpenCustomTailored,
}: Props) {
  if (!open) return null;

  const handleCustom = () => {
    onClose();
    onOpenCustomTailored?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 lg:items-center" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white lg:max-h-[80vh] lg:overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-light px-4 py-4">
          <h2 className="text-[14px] font-semibold uppercase tracking-[0.7px]">Select Size</h2>
          <button type="button" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <ul>
          {sizes.map((size) => {
            const stock = stockBySize?.[size];
            const outOfStock = stock !== undefined && stock <= 0;
            return (
              <li key={size} className="border-b border-gray-light">
                <button
                  type="button"
                  disabled={outOfStock}
                  onClick={() => { onSelectSize(size); onClose(); }}
                  className="flex w-full items-center justify-between px-4 py-4 text-[13px] tracking-[0.65px] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="font-medium">{size}</span>
                  <span className="text-gray">
                    {outOfStock ? "Out of stock" : formatPrice(price)}
                  </span>
                </button>
              </li>
            );
          })}
          {customTailoringEnabled ? (
            <li className="border-b border-gray-light">
              <button
                type="button"
                onClick={handleCustom}
                className="flex w-full items-center justify-between px-4 py-4 text-[13px] font-medium tracking-[0.65px]"
              >
                <span>Custom Tailored {customTailoringPrice ? `(+ ${formatPrice(customTailoringPrice)})` : ""}</span>
                <span className="text-gray">{formatPrice(price + (customTailoringPrice || 0))}</span>
              </button>
            </li>
          ) : null}
        </ul>

        <div className="py-4 text-center">
          <button type="button" className="text-[12px] tracking-[0.6px] text-action underline underline-offset-2">
            Size Guide
          </button>
        </div>
      </div>
    </div>
  );
}
