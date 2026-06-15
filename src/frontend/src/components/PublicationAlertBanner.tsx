import { useState } from "react";
import type { PublicationAlert } from "../hooks/useNeuralSimulation";

interface PublicationAlertBannerProps {
  alerts: PublicationAlert[];
  onDismiss: (id: string) => void;
}

const TYPE_LABELS: Record<PublicationAlert["type"], string> = {
  habituation: "HABITUATION",
  associative_learning: "ASSOC. LEARNING",
  goal_directed_nav: "GOAL-DIRECTED NAV",
  stdp_milestone: "STDP MILESTONE",
  emergent_pattern: "EMERGENT PATTERN",
};

const TYPE_COLORS: Record<PublicationAlert["type"], string> = {
  habituation: "oklch(0.72 0.22 140)",
  associative_learning: "oklch(0.82 0.26 80)",
  goal_directed_nav: "oklch(0.72 0.22 195)",
  stdp_milestone: "oklch(0.78 0.22 310)",
  emergent_pattern: "oklch(0.82 0.26 55)",
};

export function PublicationAlertBanner({
  alerts,
  onDismiss,
}: PublicationAlertBannerProps) {
  const [expanded, setExpanded] = useState(false);
  const undismissed = alerts.filter((a) => !a.dismissed);

  if (undismissed.length === 0) return null;

  const current = undismissed[0];
  const accentColor = "oklch(0.82 0.26 80)";

  return (
    <div
      data-ocid="publication_alert.toast"
      className="fixed top-3 left-1/2 z-[100] flex flex-col"
      style={{
        transform: "translateX(-50%)",
        width: "min(92vw, 640px)",
        background: "oklch(0.08 0.015 265)",
        border: `1px solid ${accentColor}`,
        boxShadow: `0 0 30px ${accentColor.replace(")", " / 0.25)")}, 0 4px 20px oklch(0 0 0 / 0.6)`,
        animation: "pubAlertPulse 2s ease-in-out infinite",
      }}
    >
      <style>{`
        @keyframes pubAlertPulse {
          0%, 100% { box-shadow: 0 0 20px oklch(0.82 0.26 80 / 0.2), 0 4px 20px oklch(0 0 0 / 0.6); }
          50% { box-shadow: 0 0 40px oklch(0.82 0.26 80 / 0.45), 0 4px 20px oklch(0 0 0 / 0.6); }
        }
      `}</style>

      {/* Top accent line */}
      <div
        className="h-[2px] w-full shrink-0"
        style={{ background: accentColor }}
      />

      {/* Main header row */}
      <div className="flex items-center gap-3 px-4 py-2">
        {/* Icon + label */}
        <div className="flex items-center gap-2 shrink-0">
          <span
            className="font-mono text-base"
            style={{ color: accentColor, lineHeight: 1 }}
          >
            ◈
          </span>
          <div className="flex flex-col">
            <span
              className="font-mono text-[8px] tracking-widest uppercase"
              style={{ color: "oklch(0.55 0.1 80)" }}
            >
              SCIENTIFIC FINDING DETECTED
            </span>
            <span
              className="font-mono text-[10px] font-bold tracking-wider uppercase"
              style={{ color: accentColor }}
            >
              {current.title}
            </span>
          </div>
        </div>

        {/* Badge count */}
        {undismissed.length > 1 && (
          <div
            className="ml-auto shrink-0 font-mono text-[8px] font-bold px-2 py-[2px]"
            style={{
              background: `${accentColor.replace(")", " / 0.15)")}`,
              border: `1px solid ${accentColor}`,
              color: accentColor,
            }}
          >
            +{undismissed.length - 1} MORE
          </div>
        )}

        {/* Type badge */}
        <div
          className="ml-auto shrink-0 font-mono text-[7px] px-2 py-[2px] tracking-widest"
          style={{
            background: `${TYPE_COLORS[current.type].replace(")", " / 0.12)")}`,
            border: `1px solid ${TYPE_COLORS[current.type]}`,
            color: TYPE_COLORS[current.type],
          }}
        >
          {TYPE_LABELS[current.type]}
        </div>
      </div>

      {/* Significance line */}
      <div
        className="px-4 pb-2 font-mono text-[8px] leading-relaxed"
        style={{ color: "oklch(0.65 0.08 200)" }}
      >
        <span style={{ color: "oklch(0.78 0.22 80)" }}>T{current.tick}</span> ·{" "}
        {current.significance}
      </div>

      {/* Expanded details */}
      {expanded && (
        <div
          className="px-4 pb-3 font-mono text-[8px] leading-relaxed border-t"
          style={{
            color: "oklch(0.55 0.07 220)",
            borderColor: "oklch(0.18 0.05 255)",
          }}
        >
          <div className="mt-2">{current.description}</div>

          {/* All queued alerts */}
          {undismissed.length > 1 && (
            <div
              className="mt-3 border-t pt-2 flex flex-col gap-2"
              style={{ borderColor: "oklch(0.18 0.05 255)" }}
            >
              <div
                className="text-[7px] tracking-widest uppercase"
                style={{ color: "oklch(0.38 0.05 220)" }}
              >
                All Pending Findings ({undismissed.length})
              </div>
              {undismissed.slice(1).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-2"
                  style={{
                    borderLeft: `2px solid ${TYPE_COLORS[alert.type]}`,
                    paddingLeft: "6px",
                  }}
                >
                  <span
                    className="font-mono text-[7px] uppercase"
                    style={{ color: TYPE_COLORS[alert.type] }}
                  >
                    {TYPE_LABELS[alert.type]}
                  </span>
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: "oklch(0.55 0.07 220)" }}
                  >
                    T{alert.tick} · {alert.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action row */}
      <div
        className="flex items-center justify-between px-4 py-2 border-t"
        style={{ borderColor: "oklch(0.18 0.05 255)" }}
      >
        <button
          type="button"
          data-ocid="publication_alert.close_button"
          onClick={() => onDismiss(current.id)}
          className="font-mono text-[7px] tracking-widest uppercase px-3 py-1 transition-all"
          style={{
            border: "1px solid oklch(0.35 0.06 220)",
            color: "oklch(0.45 0.06 220)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(0.65 0.1 220)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color =
              "oklch(0.45 0.06 220)";
          }}
        >
          DISMISS
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            data-ocid="publication_alert.toggle_button"
            onClick={() => setExpanded((v) => !v)}
            className="font-mono text-[7px] tracking-widest uppercase px-3 py-1 transition-all"
            style={{
              border: "1px solid oklch(0.4 0.1 255)",
              color: "oklch(0.55 0.12 255)",
              background: "transparent",
            }}
          >
            {expanded ? "▲ COLLAPSE" : "▼ DETAILS"}
          </button>

          <div
            className="font-mono text-[7px] tracking-widest uppercase px-2 py-1"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            ◈ IN SESSION REPORT
          </div>
        </div>
      </div>
    </div>
  );
}
