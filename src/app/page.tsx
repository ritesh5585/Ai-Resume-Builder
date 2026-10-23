import Link from "next/link";

export default function HomePage() {
  return (
    <div className="w-full bg-white text-[#171717] min-h-[calc(100vh-5rem)] flex flex-col justify-between">
      {/* Main Hero Container */}
      <main className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-10 sm:pt-16 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column: Headline, Copy & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Category tag with accent line */}
            <div className="flex items-center gap-3.5 mb-6 sm:mb-8">
              <span className="w-7 h-[1.5px] bg-[#c29b68] rounded-full inline-block" />
              <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.2em] text-[#6b7280] uppercase">
                Resume Builder
              </span>
            </div>

            {/* Headline in Editorial Serif */}
            <h1 className="font-serif-editorial text-[42px] sm:text-[56px] lg:text-[66px] leading-[1.08] font-normal tracking-[-0.015em] text-[#171717] mb-6">
              A resume that reads like you mean it.
            </h1>

            {/* Subcopy */}
            <p className="text-[15px] sm:text-[17px] text-[#4b5563] leading-[1.65] font-normal mb-8 sm:mb-10 max-w-lg">
              Pick a template, add your details, download a polished PDF. Nothing to design, nothing to fiddle with.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              <Link
                href="/pages/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-[#1c3933] hover:bg-[#152c27] text-white text-[14px] font-medium transition-all shadow-sm active:scale-[0.98]"
              >
                Create my resume
              </Link>
              <Link
                href="/pages/dashboard"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200/90 text-[#171717] text-[14px] font-medium transition-all shadow-sm active:scale-[0.98]"
              >
                View templates
              </Link>
            </div>
          </div>

          {/* Right Column: Floating Resume Document Preview */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative mt-6 lg:mt-0">
            <div className="relative w-full max-w-[360px] sm:max-w-[400px]">
              {/* Warm Ecru Background Offset Card */}
              <div
                className="absolute top-6 right-[-8px] sm:right-[-16px] w-[90%] sm:w-[94%] h-[92%] sm:h-[95%] bg-[#fbf9f4] border border-[#f0ebe0] rounded-xl -z-10"
                aria-hidden="true"
              />

              {/* Foreground Floating Resume Sheet */}
              <div className="bg-white rounded-lg border border-black/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.08)] p-7 sm:p-9 relative z-10 select-none transition-transform duration-300 hover:-translate-y-1">
                {/* Header Profile */}
                <div className="mb-5">
                  <h2 className="font-serif-editorial text-[22px] sm:text-[24px] font-medium text-[#1e293b] tracking-tight">
                    [Your Name]
                  </h2>
                  <p className="text-[10px] sm:text-[11px] text-[#64748b] tracking-wide mt-1 font-mono">
                    [Job title] · [City] · [Email]
                  </p>
                  <div className="w-full h-[1px] bg-[#c29b68] mt-3.5 opacity-80" />
                </div>

                {/* Section: Experience */}
                <div className="mb-4">
                  <span className="text-[9.5px] font-bold tracking-[0.18em] text-[#9a733e] uppercase block mb-2">
                    Experience
                  </span>
                  <div className="space-y-1.5">
                    <div className="h-2 w-full bg-[#ebe7df] rounded-full" />
                    <div className="h-2 w-[78%] bg-[#f2eee7] rounded-full" />
                    <div className="h-2 w-[65%] bg-[#f2eee7] rounded-full" />
                  </div>
                </div>

                {/* Section: Education */}
                <div className="mb-4">
                  <span className="text-[9.5px] font-bold tracking-[0.18em] text-[#9a733e] uppercase block mb-2">
                    Education
                  </span>
                  <div className="space-y-1.5">
                    <div className="h-2 w-full bg-[#ebe7df] rounded-full" />
                    <div className="h-2 w-[70%] bg-[#f2eee7] rounded-full" />
                  </div>
                </div>

                {/* Section: Skills */}
                <div>
                  <span className="text-[9.5px] font-bold tracking-[0.18em] text-[#9a733e] uppercase block mb-2">
                    Skills
                  </span>
                  <div className="space-y-1.5">
                    <div className="h-2 w-[82%] bg-[#ebe7df] rounded-full" />
                    <div className="h-2 w-[50%] bg-[#f2eee7] rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom 3-Step Flow: How it works */}
        <section
          id="how-it-works"
          className="mt-20 sm:mt-28 pt-12 sm:pt-16 border-t border-zinc-100/90"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">

            {/* Step 01 */}
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold text-[#c29b68] tracking-widest uppercase mb-2">
                01
              </span>
              <h3 className="text-[17px] font-semibold text-[#171717] tracking-tight mb-1.5">
                Choose a template
              </h3>
              <p className="text-[14px] text-[#555] leading-relaxed">
                Quiet, recruiter-friendly layouts.
              </p>
            </div>

            {/* Step 02 */}
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold text-[#c29b68] tracking-widest uppercase mb-2">
                02
              </span>
              <h3 className="text-[17px] font-semibold text-[#171717] tracking-tight mb-1.5">
                Add your details
              </h3>
              <p className="text-[14px] text-[#555] leading-relaxed">
                One step at a time, with a live preview.
              </p>
            </div>

            {/* Step 03 */}
            <div className="flex flex-col items-start">
              <span className="text-xs font-semibold text-[#c29b68] tracking-widest uppercase mb-2">
                03
              </span>
              <h3 className="text-[17px] font-semibold text-[#171717] tracking-tight mb-1.5">
                Download
              </h3>
              <p className="text-[14px] text-[#555] leading-relaxed">
                PDF or Word, ready to send.
              </p>
            </div>

          </div>
        </section>
      </main>

      {/* Subtle Minimal Footer */}
      <footer className="w-full border-t border-zinc-100 py-6 text-center text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-6">
          Vitae — Clean, ATS-ready resume builder
        </div>
      </footer>
    </div>
  );
}
