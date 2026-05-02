"use client";

export const CyberGridBg = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(34,197,94,0.10),transparent_25%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.08),transparent_30%)]" />
      <div
        className="absolute inset-0 opacity-[0.20]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(16,185,129,0.25) 1px, transparent 1px),
            linear-gradient(90deg, rgba(16,185,129,0.25) 1px, transparent 1px)
          `,
          backgroundSize: "36px 36px",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(255,255,255,0.08) 1px, transparent 1px)",
          backgroundSize: "100% 6px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_45%,rgba(0,0,0,0.45)_100%)]" />
    </div>
  );
};
