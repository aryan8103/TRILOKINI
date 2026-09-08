import { ResponsiveShell } from "@/components/layout";
import { Footer } from "@/components/layout";

export function PageShell({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <ResponsiveShell>
      <main className={`pb-20 pt-0 lg:pb-0 ${className}`}>{children}</main>
      <Footer />
    </ResponsiveShell>
  );
}

export function ContentContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mx-auto max-w-[1440px] px-[5px] lg:px-6 ${className}`}>{children}</div>;
}

export function FormPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <PageShell>
      <ContentContainer className="py-8 lg:py-12">
        <div className="mx-auto max-w-md">{children}</div>
      </ContentContainer>
    </PageShell>
  );
}

export function TextPageLayout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <PageShell>
      <ContentContainer className="py-8 lg:py-12">
        <h1 className="mb-6 text-center text-[18px] font-semibold uppercase tracking-[0.9px] lg:text-[24px]">{title}</h1>
        <div className="prose prose-sm mx-auto max-w-3xl text-[14px] leading-7 text-gray">{children}</div>
      </ContentContainer>
    </PageShell>
  );
}
