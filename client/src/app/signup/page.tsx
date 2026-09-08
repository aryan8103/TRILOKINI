"use client";

import { SignupForm } from "@/components/auth/auth-forms";
import { PageShell } from "@/components/templates/page-shell";
import { useAuth } from "@/components/providers/auth-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const { openAuth, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (window.matchMedia("(min-width: 1024px)").matches) {
      openAuth("signup");
      router.replace("/");
    }
  }, [openAuth, router]);

  useEffect(() => {
    if (user) router.replace("/account");
  }, [user, router]);

  return (
    <PageShell>
      <div className="px-[19px] pt-2 pb-24 lg:hidden">
        <SignupForm variant="mobile" />
      </div>
    </PageShell>
  );
}
