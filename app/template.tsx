"use client";

// Optionally we can use the Template wrapper to ensure component mounts and unmounts
// Currently, TopProgressBar and SplashScreen in layout.tsx handle initial loads.
// Template can wrap individual page unmounts if specific transitions are needed.

export default function Template({ children }: { children: React.ReactNode }) {
    return (
        <div className="animate-in fade-in duration-700">
            {children}
        </div>
    );
}
