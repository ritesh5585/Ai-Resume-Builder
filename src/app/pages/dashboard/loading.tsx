"use client";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 backdrop-blur-md bg-black/30">
      <div className="h-12 w-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      <p className="text-sm font-medium tracking-wide text-white/80">Loading...</p>
    </div>
  );
}