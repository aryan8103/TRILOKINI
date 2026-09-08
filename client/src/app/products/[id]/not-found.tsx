import { ResponsiveShell } from "@/components/layout";
import { Footer } from "@/components/layout";

export default function ProductNotFound() {
  return (
    <ResponsiveShell>
      <main className="flex min-h-[50vh] flex-col items-center justify-center px-4 pb-20 text-center">
        <h1 className="text-[20px] font-semibold uppercase tracking-[0.8px]">Product Not Found</h1>
        <p className="mt-3 text-[14px] text-gray">This product may have been removed or is no longer available.</p>
        <a href="/products" className="mt-6 border border-black px-6 py-3 text-[12px] font-semibold uppercase tracking-[0.56px]">
          Browse Products
        </a>
      </main>
      <Footer />
    </ResponsiveShell>
  );
}
