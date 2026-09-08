"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { FormPageLayout } from "@/components/templates/page-shell";
import { PageHeader } from "@/components/page-chrome";
import { useAuth } from "@/components/providers/auth-provider";

export default function AccountPage() {
  const { user, loading, signOut, openAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (user) return;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (desktop) {
      openAuth("login");
      router.replace("/");
    } else {
      router.replace("/login");
    }
  }, [user, loading, openAuth, router]);

  if (!user) return null;

  return (
    <FormPageLayout>
      <PageHeader title="MY ACCOUNT" subtitle="Manage your profile and view order history." />
      <form className="mb-10 space-y-4" onSubmit={(e) => e.preventDefault()}>
        <label className="block text-[13px] font-semibold">Full Name<input defaultValue={user.fullName || ""} className="mt-2 h-11 w-full border border-gray-light px-3 text-[13px] outline-none focus:border-black" /></label>
        <label className="block text-[13px] font-semibold">Email<input type="email" defaultValue={user.email || ""} className="mt-2 h-11 w-full border border-gray-light px-3 text-[13px] outline-none focus:border-black" /></label>
        <label className="block text-[13px] font-semibold">Mobile<input type="tel" defaultValue={user.mobile || ""} className="mt-2 h-11 w-full border border-gray-light px-3 text-[13px] outline-none focus:border-black" /></label>
        <button type="submit" className="h-11 w-full border border-black bg-black text-[13px] font-semibold text-white">SAVE CHANGES</button>
        <button type="button" onClick={() => signOut()} className="h-11 w-full border border-black bg-white text-[13px] font-semibold">LOG OUT</button>
      </form>
    </FormPageLayout>
  );
}
