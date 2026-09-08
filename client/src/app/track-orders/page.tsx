import { Suspense } from "react";
import TrackOrdersContent from "./track-orders-content";

export default function TrackOrdersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[13px]">Loading...</div>}>
      <TrackOrdersContent />
    </Suspense>
  );
}
