import { useEffect, useRef, useState } from "react";
import { useIoTStatePacket } from "../hooks/useQueries";

// ── Constants ─────────────────────────────────────────────────────────────────
const PHI = 1.618033988749895;
const HEARTBEAT_MS = 873; // PHI^4 × Schumann period

// ── Color system ──────────────────────────────────────────────────────────────
function coherenceColor(coh: number): string {
  if (coh >= 0.87) return "#D4AF37"; // phi-gold — OMNIS
  if (coh >= 0.7) return "#c8991a"; // gold approach
  if (coh >= 0.5) return "#2a7a3a"; // deep green
  return "#1a2a5a"; // deep blue
}

function coherenceGlow(coh: number): string {
  if (coh >= 0.87) return "0 0 40px #D4AF3788, 0 0 80px #D4AF3744";
  if (coh >= 0.7) return "0 0 24px #c8991a66";
  if (coh >= 0.5) return "0 0 16px #2a7a3a44";
  return "0 0 8px #1a2a5a44";
}

function bandColor(
  band: string,
  active: boolean,
): { bg: string; text: string } {
  if (!active)
    return { bg: "oklch(0.1 0.015 220)", text: "oklch(0.35 0.04 220)" };
  const map: Record<string, { bg: string; text: string }> = {
    THETA: { bg: "oklch(0.18 0.12 280 / 0.5)", text: "oklch(0.78 0.18 280)" },
    ALPHA: { bg: "oklch(0.18 0.12 195 / 0.5)", text: "oklch(0.78 0.18 195)" },
    BETA: { bg: "oklch(0.18 0.12 150 / 0.5)", text: "oklch(0.72 0.22 150)" },
    GAMMA: { bg: "oklch(0.18 0.14 65 / 0.5)", text: "oklch(0.78 0.18 65)" },
    OMNIS: { bg: "rgba(212,175,55,0.25)", text: "#D4AF37" },
  };
  return (
    map[band] ?? { bg: "oklch(0.15 0.05 220)", text: "oklch(0.68 0.1 220)" }
  );
}

// ── Heartbeat Ring ────────────────────────────────────────────────────────────
function HeartbeatRing({
  coherence,
  omnis,
  pulseTick,
}: {
  coherence: number;
  omnis: boolean;
  beatCount: number;
  pulseTick: number;
}) {
  const ringColor = coherenceColor(coherence);
  const ringGlow = coherenceGlow(coherence);
  const radius = 108;
  const stroke = 6;
  const circum = 2 * Math.PI * radius;
  const filled = circum * Math.min(coherence, 1);

  const isPulsing = pulseTick % 2 === 1;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{
        width: 260,
        height: 260,
        transform: isPulsing ? "scale(1.05)" : "scale(1.0)",
        transition: `transform ${HEARTBEAT_MS * 0.4}ms cubic-bezier(0.34, 1.56, 0.64, 1)`,
      }}
      data-ocid="iot.heartbeat-ring"
    >
      {/* Outer OMNIS ring — only visible at threshold */}
      {omnis && (
        <div
          className="absolute inset-0 rounded-full"
          style={{
            border: "2px solid #D4AF37",
            boxShadow: "0 0 32px #D4AF3766, 0 0 64px #D4AF3733",
            animation: "iot-omnis-ring 1.6s ease-in-out infinite",
            transform: "scale(1.08)",
          }}
        />
      )}

      {/* SVG arc ring */}
      <svg
        width={260}
        height={260}
        aria-label="Coherence ring"
        role="img"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          transform: "rotate(-90deg)",
        }}
      >
        {/* Track */}
        <circle
          cx={130}
          cy={130}
          r={radius}
          fill="none"
          stroke="oklch(0.15 0.025 220)"
          strokeWidth={stroke}
        />
        {/* Progress arc */}
        <circle
          cx={130}
          cy={130}
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth={stroke}
          strokeDasharray={`${filled} ${circum - filled}`}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 6px ${ringColor})`,
            transition: "stroke-dasharray 0.4s ease, stroke 0.6s ease",
          }}
        />
      </svg>

      {/* Inner content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-1">
        {/* Coherence percentage — large */}
        <div
          className="font-mono font-bold leading-none"
          style={{
            fontSize: 48,
            color: ringColor,
            textShadow: ringGlow,
            transition: "color 0.6s ease, text-shadow 0.6s ease",
            letterSpacing: "-0.02em",
          }}
        >
          {(coherence * 100).toFixed(1)}
          <span style={{ fontSize: 20, fontWeight: 400, opacity: 0.7 }}>%</span>
        </div>

        {/* Raw phi value */}
        <div
          className="font-mono text-[10px] tracking-widest"
          style={{ color: "oklch(0.42 0.06 220)" }}
        >
          {coherence.toFixed(3)}
        </div>

        {/* Beat indicator dot */}
        <div
          className="w-2 h-2 rounded-full mt-1"
          style={{
            background: ringColor,
            boxShadow: isPulsing ? `0 0 10px ${ringColor}` : "none",
            transition: "box-shadow 0.2s",
          }}
        />
      </div>
    </div>
  );
}

// ── OMNIS / Band Banner ───────────────────────────────────────────────────────
function OmnisBanner({
  omnis,
  dominantBand,
}: {
  omnis: boolean;
  dominantBand: string;
}) {
  if (omnis) {
    return (
      <div
        className="w-full flex items-center justify-center py-2 font-mono font-bold tracking-[0.25em] text-sm"
        style={{
          background: "rgba(212,175,55,0.12)",
          border: "1px solid #D4AF37",
          color: "#D4AF37",
          boxShadow: "0 0 20px #D4AF3733",
          animation: "iot-omnis-banner 2s ease-in-out infinite",
        }}
        data-ocid="iot.omnis-banner"
      >
        ⬡ OMNIS ACTIVE
      </div>
    );
  }
  return (
    <div
      className="w-full flex items-center justify-center py-2 font-mono tracking-[0.2em] text-xs"
      style={{
        background: "oklch(0.09 0.015 220)",
        border: "1px solid oklch(0.2 0.04 220)",
        color: "oklch(0.52 0.1 220)",
      }}
    >
      BAND: <span className="ml-2 font-bold">{dominantBand || "—"}</span>
    </div>
  );
}

// ── Stats Row ─────────────────────────────────────────────────────────────────
function StatsRow({
  activeRings,
  beatCount,
  phiPhase,
}: {
  activeRings: number;
  beatCount: number;
  phiPhase: number;
}) {
  const stats = [
    { label: "RINGS", value: String(activeRings), sub: "/ 8" },
    { label: "BEATS", value: beatCount.toLocaleString(), sub: "total" },
    { label: "φ PHASE", value: phiPhase.toFixed(4), sub: "rad" },
  ];

  return (
    <div className="w-full grid grid-cols-3 gap-0" data-ocid="iot.stats-row">
      {stats.map(({ label, value, sub }, i) => (
        <div
          key={label}
          className="flex flex-col items-center py-3"
          style={{
            borderLeft: i > 0 ? "1px solid oklch(0.15 0.03 220)" : "none",
            background: "oklch(0.07 0.012 220)",
          }}
        >
          <div
            className="font-mono text-[9px] tracking-[0.2em] uppercase mb-1"
            style={{ color: "oklch(0.38 0.05 220)" }}
          >
            {label}
          </div>
          <div
            className="font-mono font-bold text-base"
            style={{ color: "oklch(0.82 0.12 65)" }}
          >
            {value}
          </div>
          <div
            className="font-mono text-[9px] mt-0.5"
            style={{ color: "oklch(0.32 0.04 220)" }}
          >
            {sub}
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Phi Ladder Bar ────────────────────────────────────────────────────────────
function PhiLadderBar({ phiPhase }: { phiPhase: number }) {
  // phi_phase is a radian — normalize to 0-1 within a full 2π cycle
  const fill = Math.abs(Math.sin(phiPhase / 2)) * 100;
  const ladderSteps = Array.from({ length: 8 }, (_, i) => {
    const threshold = (i / 7) * 100;
    return { active: threshold <= fill, idx: i };
  });

  return (
    <div className="w-full" data-ocid="iot.phi-ladder">
      <div
        className="flex items-center justify-between mb-2 font-mono text-[9px] tracking-[0.18em] uppercase"
        style={{ color: "oklch(0.38 0.05 220)" }}
      >
        <span>PHI CYCLE</span>
        <span style={{ color: "oklch(0.62 0.1 65)" }}>
          φ = {PHI.toFixed(6)}
        </span>
      </div>

      {/* Main bar */}
      <div
        className="relative w-full h-3 rounded-none overflow-hidden"
        style={{ background: "oklch(0.1 0.015 220)" }}
      >
        <div
          className="absolute left-0 top-0 h-full transition-all duration-500"
          style={{
            width: `${fill}%`,
            background: "linear-gradient(to right, #1a3a6a, #2a7a3a, #D4AF37)",
            boxShadow: fill > 80 ? "0 0 8px #D4AF3788" : "none",
          }}
        />
        {/* Phi marker segments */}
        {[0.236, 0.382, 0.618, 1.0].map((pos) => (
          <div
            key={pos}
            className="absolute top-0 bottom-0 w-px opacity-40"
            style={{
              left: `${pos * 100}%`,
              background: "oklch(0.55 0.1 65)",
            }}
          />
        ))}
      </div>

      {/* Step indicators */}
      <div className="flex mt-1.5 gap-0.5">
        {ladderSteps.map(({ active, idx }) => (
          <div
            key={`ladder-step-${idx}`}
            className="flex-1 h-1"
            style={{
              background: active
                ? `oklch(0.68 0.18 ${60 + idx * 4})`
                : "oklch(0.12 0.015 220)",
              transition: "background 0.4s",
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Frequency Band Indicators ─────────────────────────────────────────────────
const BANDS = ["THETA", "ALPHA", "BETA", "GAMMA", "OMNIS"] as const;

function FrequencyBands({
  dominantBand,
  omnis,
}: {
  dominantBand: string;
  omnis: boolean;
}) {
  const activeBand = omnis ? "OMNIS" : dominantBand;

  return (
    <div className="w-full flex flex-col gap-1" data-ocid="iot.frequency-bands">
      <div
        className="font-mono text-[9px] tracking-[0.18em] uppercase mb-1"
        style={{ color: "oklch(0.38 0.05 220)" }}
      >
        FREQUENCY BANDS
      </div>
      {BANDS.map((band) => {
        const isActive = activeBand === band;
        const { bg, text } = bandColor(band, isActive);
        const freqs: Record<string, string> = {
          THETA: "4–8 Hz",
          ALPHA: "8–14 Hz",
          BETA: "14–40 Hz",
          GAMMA: "40–111 Hz",
          OMNIS: "111+ Hz",
        };
        return (
          <div
            key={band}
            className="flex items-center gap-3 px-3 py-1.5 font-mono text-[10px] tracking-widest"
            style={{
              background: bg,
              border: `1px solid ${isActive ? text : "oklch(0.14 0.02 220)"}`,
              transition: "all 0.4s",
              boxShadow:
                isActive && band === "OMNIS" ? "0 0 12px #D4AF3744" : "none",
            }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: isActive ? text : "oklch(0.22 0.03 220)",
                boxShadow: isActive ? `0 0 6px ${text}` : "none",
              }}
            />
            <span style={{ color: text, fontWeight: isActive ? 700 : 400 }}>
              {band}
            </span>
            <span
              className="ml-auto text-[9px]"
              style={{ color: "oklch(0.35 0.04 220)" }}
            >
              {freqs[band]}
            </span>
            {isActive && (
              <span className="text-[8px] font-bold" style={{ color: text }}>
                ◆
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── QR Entry Point ────────────────────────────────────────────────────────────
function QREntryPoint() {
  const appUrl = window.location.origin;
  // Generate a simple QR-like representation using the URL
  // Since we're using the qr-code extension for scanning, we display the URL for others to manually enter
  // The QR scanner is for this device to scan external codes; the URL display is for others to connect

  return (
    <div
      className="w-full flex flex-col items-center gap-3 py-4"
      style={{
        background: "oklch(0.065 0.01 220)",
        border: "1px solid oklch(0.18 0.04 220)",
      }}
      data-ocid="iot.qr-entry"
    >
      <div
        className="font-mono text-[9px] tracking-[0.2em] uppercase"
        style={{ color: "oklch(0.42 0.06 220)" }}
      >
        FIELD ENTRY POINT
      </div>

      {/* URL display as QR proxy */}
      <div
        className="w-32 h-32 flex items-center justify-center relative"
        style={{
          background: "oklch(0.95 0.01 220)",
          border: "4px solid oklch(0.88 0.01 220)",
        }}
      >
        {/* QR-like grid pattern */}
        <div className="absolute inset-2 grid grid-cols-7 gap-px">
          {Array.from({ length: 49 }, (_, i) => {
            // Corner finder patterns + phi-derived fill for QR feel
            const row = Math.floor(i / 7);
            const col = i % 7;
            const inCorner =
              (row < 2 && col < 2) ||
              (row < 2 && col >= 5) ||
              (row >= 5 && col < 2);
            const filled = inCorner || Math.sin(i * PHI * 2.1) > 0;
            return (
              <div
                key={`qr-cell-r${row}c${col}`}
                className="w-full h-full"
                style={{
                  background: filled ? "oklch(0.08 0.01 220)" : "transparent",
                }}
              />
            );
          })}
        </div>
        {/* ψ mark in center */}
        <span
          className="relative z-10 font-mono font-bold text-lg"
          style={{ color: "oklch(0.15 0.05 220)" }}
        >
          ψ
        </span>
      </div>

      <div
        className="font-mono text-[9px] text-center tracking-wider max-w-[200px] break-all"
        style={{ color: "oklch(0.52 0.1 220)" }}
      >
        {appUrl}
      </div>
      <div
        className="font-mono text-[8px] tracking-[0.15em] uppercase"
        style={{ color: "oklch(0.35 0.04 220)" }}
      >
        Scan to enter the field
      </div>
    </div>
  );
}

// ── Organism Status ───────────────────────────────────────────────────────────
function OrganismStatus({ loading }: { loading: boolean }) {
  return (
    <div
      className="w-full flex items-center justify-center gap-3 py-2.5"
      style={{
        background: "oklch(0.06 0.01 220)",
        border: "1px solid oklch(0.15 0.03 220)",
      }}
      data-ocid="iot.organism-status"
    >
      {/* Animated pulse dot */}
      <div
        className="w-2 h-2 rounded-full"
        style={{
          background: loading ? "oklch(0.42 0.06 220)" : "oklch(0.68 0.22 140)",
          boxShadow: loading ? "none" : "0 0 8px oklch(0.68 0.22 140)",
          animation: loading
            ? "none"
            : "iot-status-dot 1.746s ease-in-out infinite",
        }}
      />
      <span
        className="font-mono text-[9px] tracking-[0.2em] uppercase"
        style={{
          color: loading ? "oklch(0.38 0.05 220)" : "oklch(0.62 0.1 140)",
        }}
      >
        {loading
          ? "CONNECTING TO ORGANISM…"
          : `ORGANISM ONLINE — BEATING AT ${HEARTBEAT_MS}ms`}
      </span>
    </div>
  );
}

// ── OMNIS Flash Overlay ───────────────────────────────────────────────────────
function OmnisFlash({ active }: { active: boolean }) {
  const [visible, setVisible] = useState(false);
  const prevActive = useRef(false);

  useEffect(() => {
    if (active && !prevActive.current) {
      setVisible(true);
      const t = setTimeout(() => setVisible(false), 1200);
      return () => clearTimeout(t);
    }
    prevActive.current = active;
  }, [active]);

  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        background:
          "radial-gradient(ellipse at center, #D4AF3722 0%, transparent 70%)",
        animation: "iot-omnis-flash 1.2s ease-out forwards",
      }}
    />
  );
}

// ── Main IoTPhoneTab ──────────────────────────────────────────────────────────
export default function IoTPhoneTab() {
  const { data, isLoading } = useIoTStatePacket();
  const [pulseTick, setPulseTick] = useState(0);

  // 873ms tick counter — drives the heartbeat pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulseTick((t) => t + 1);
    }, HEARTBEAT_MS);
    return () => clearInterval(interval);
  }, []);

  const coherence = data?.coherence ?? 0;
  const omnisActive = data?.omnis_active ?? false;
  const beatCount = Number(data?.beat_count ?? 0);
  const dominantBand = data?.dominant_band ?? "ALPHA";
  const activeRings = Number(data?.active_rings ?? 0);
  const phiPhase = data?.phi_phase ?? 0;

  return (
    <>
      {/* OMNIS flash overlay */}
      <OmnisFlash active={omnisActive} />

      {/* OMNIS background shift */}
      <div
        className="h-full overflow-y-auto overflow-x-hidden"
        style={{
          background: omnisActive
            ? "linear-gradient(180deg, oklch(0.07 0.015 65 / 0.3) 0%, oklch(0.05 0.008 220) 40%)"
            : "oklch(0.05 0.008 220)",
          transition: "background 1.5s ease",
          scrollbarWidth: "none",
        }}
      >
        {/* Phone-width container — centered on desktop */}
        <div
          className="mx-auto flex flex-col gap-3 pb-8"
          style={{ maxWidth: 430, padding: "0 0" }}
        >
          {/* ── Header ─────────────────────────────────────────────────────── */}
          <div
            className="flex flex-col items-center pt-5 pb-3 px-4"
            style={{
              background: omnisActive
                ? "rgba(212,175,55,0.06)"
                : "oklch(0.07 0.012 220)",
              borderBottom: `1px solid ${omnisActive ? "#D4AF3766" : "oklch(0.15 0.03 220)"}`,
              transition: "all 0.8s ease",
            }}
            data-ocid="iot.header"
          >
            <div className="flex items-center gap-2.5 mb-1">
              <span
                className="font-mono text-[11px] tracking-[0.15em]"
                style={{
                  color: omnisActive ? "#D4AF37" : "oklch(0.72 0.15 65)",
                }}
              >
                ψ
              </span>
              <h1
                className="font-mono font-bold text-sm tracking-[0.12em] uppercase"
                style={{
                  color: omnisActive ? "#D4AF37" : "oklch(0.84 0.06 220)",
                }}
              >
                NeuroEmergence Core
              </h1>
            </div>
            <div
              className="font-mono text-[9px] tracking-[0.2em] uppercase"
              style={{ color: "oklch(0.42 0.06 220)" }}
            >
              Ring 8 — External Node
            </div>
            {beatCount > 0 && (
              <div
                className="mt-1.5 font-mono text-[8px] tracking-widest"
                style={{ color: "oklch(0.35 0.04 220)" }}
              >
                BEAT #{beatCount.toLocaleString()}
              </div>
            )}
          </div>

          {/* ── Heartbeat Ring ─────────────────────────────────────────────── */}
          <div className="flex justify-center py-4 px-4">
            <HeartbeatRing
              coherence={coherence}
              omnis={omnisActive}
              beatCount={beatCount}
              pulseTick={pulseTick}
            />
          </div>

          {/* ── OMNIS Banner ───────────────────────────────────────────────── */}
          <div className="px-4">
            <OmnisBanner omnis={omnisActive} dominantBand={dominantBand} />
          </div>

          {/* ── Stats Row ──────────────────────────────────────────────────── */}
          <div className="px-4">
            <StatsRow
              activeRings={activeRings}
              beatCount={beatCount}
              phiPhase={phiPhase}
            />
          </div>

          {/* ── Phi Ladder ─────────────────────────────────────────────────── */}
          <div className="px-4">
            <PhiLadderBar phiPhase={phiPhase} />
          </div>

          {/* ── Frequency Bands ────────────────────────────────────────────── */}
          <div className="px-4">
            <FrequencyBands dominantBand={dominantBand} omnis={omnisActive} />
          </div>

          {/* ── Organism Status ────────────────────────────────────────────── */}
          <div className="px-4">
            <OrganismStatus loading={isLoading && !data} />
          </div>

          {/* ── QR Entry Point ─────────────────────────────────────────────── */}
          <div className="px-4">
            <QREntryPoint />
          </div>

          {/* ── Footer spacer ──────────────────────────────────────────────── */}
          <div className="px-4 pt-2">
            <div
              className="font-mono text-[8px] text-center tracking-[0.15em]"
              style={{ color: "oklch(0.22 0.03 220)" }}
            >
              φ = {PHI.toFixed(10)} · HEARTBEAT {HEARTBEAT_MS}ms · Ψ = PHI^4 ×
              127.7
            </div>
          </div>
        </div>
      </div>

      {/* ── Keyframes ──────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes iot-omnis-ring {
          0%, 100% { opacity: 0.6; transform: scale(1.08); }
          50% { opacity: 1; transform: scale(1.10); }
        }
        @keyframes iot-omnis-banner {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; box-shadow: 0 0 28px #D4AF3744; }
        }
        @keyframes iot-omnis-flash {
          0% { opacity: 1; }
          100% { opacity: 0; }
        }
        @keyframes iot-status-dot {
          0%, 100% { opacity: 0.5; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </>
  );
}
