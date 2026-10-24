import { STEPS } from "@/lib/step";

export default function StepsFlow() {
    return (
        <ol className="grid gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-7">
            {STEPS.map((s, i) => {
                const last = i === STEPS.length - 1;
                return (
                    <li key={s.key} className="pr-4">
                        <div className="flex items-center">
                            <span
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border font-serif text-[15px] ${last
                                        ? "border-[#24473B] bg-[#24473B] text-white"
                                        : "border-[#D5D2C9] bg-white text-[#24473B]"
                                    }`}
                            >
                                {i + 1}
                            </span>
                            {!last && <span className="ml-3 hidden h-px flex-1 bg-[#E6E3DC] lg:block" />}
                        </div>
                        <h3 className="mt-4 text-[15px] font-medium text-[#1B2F28]">{s.label}</h3>
                        <p className="mt-1 text-[13px] leading-relaxed text-[#5B6A63]">{s.desc}</p>
                        {s.ai && (
                            <span className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-[#24473B]">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#A88A3D]" />
                                AI assist
                            </span>
                        )}
                    </li>
                );
            })}
        </ol>
    );
}