interface ErrorProps {
    message?: string | null;
    children?: React.ReactNode;
    className?: string;
}

export default function Error({ message, children, className = "" }: ErrorProps) {
    const content = message || children;
    if (!content) return null;

    return (
        <div
            role="alert"
            className={`text-xs text-red-600 bg-red-50/70 border border-red-200/70 px-3.5 py-2.5 rounded-xl flex items-start gap-2 ${className}`}
        >
            <svg
                className="w-4 h-4 shrink-0 mt-0.5"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
            >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{content}</span>
        </div>
    );
}
