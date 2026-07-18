import type { CSSProperties } from "react";

export default function Loader() {
  const containerStyle: CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    gap: "12px",
    backgroundColor: "var(--color-surface-base, #ffffff)",
    transition: "background-color 0.3s ease",
  };

  const boxBaseStyle: CSSProperties = {
    width: "16px",
    height: "16px",
    backgroundColor: "var(--color-accent, #1cc994)",
    borderRadius: "4px",
    animation: "bounce 1.4s infinite ease-in-out both",
  };

  return (
    <div style={containerStyle}>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% {
            transform: scale(0.6);
            opacity: 0.4;
          }
          40% {
            transform: scale(1.1);
            opacity: 1;
          }
        }
      `}</style>
      <div style={{ ...boxBaseStyle, animationDelay: "-0.32s" }} />
      <div style={{ ...boxBaseStyle, animationDelay: "-0.16s" }} />
      <div style={{ ...boxBaseStyle }} />
    </div>
  );
}
