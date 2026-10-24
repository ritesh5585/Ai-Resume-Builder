import { notFound, redirect } from "next/navigation";
import { getResumeById } from "@/lib/resume-db";
import { ResumeProvider } from "@/context/ResumeContext";

export default async function ResumeLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ resumeId: string }>;
}) {
  const { resumeId } = await params;
  const resume = await getResumeById(resumeId);
  if (resume === "unauthorized") redirect("/dashboard");
  if (!resume) notFound();
  return <ResumeProvider initial={resume}>{children}</ResumeProvider>;
}
