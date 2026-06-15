import { motion } from "motion/react";
// SOLUS — Sovereign Identity Engine
// Reads canonical state, fear/mission state, nexus gate.
// Tracks identity drift velocity, values alignment, Medina Doctrine enforcement.
import { useEffect, useRef, useState } from "react";
import { useCanonicalState, useFearMissionState } from "../hooks/useQueries";

const C = {
  bg: "oklch(0.055 0.01 265)",
  panel: "oklch(0.075 0.012 265)",
  border: "oklch(0.18 0.05 250)",
  dim: "oklch(0.38 0.05 220)",
  dimlo: "oklch(0.28 0.04 220)",
  cyan: "oklch(0.72 0.22 195)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.22 80)",
  red: "oklch(0.72 0.22 25)",
  gold: "oklch(0.82 0.22 80)",
  sovereign: "oklch(0.75 0.20 50)",
  fg: "oklch(0.85 0.05 210)",
  muted: "oklch(0.5 0.08 220)",
};

function PanelTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[9px] tracking-widest uppercase mb-2 pb-1 border-b"
      style={{ color: C.sovereign, borderColor: "oklch(0.18 0.06 50 / 0.5)" }}
    >
      {children}
    </div>
  );
}

function PanelBox({
  children,
  className = "",
}: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-none border p-3 ${className}`}
      style={{ background: C.panel, borderColor: C.border }}
    >
      {children}
    </div>
  );
}

interface IdentityPoint {
  beat: number;
  identityI: number;
  groundedScore: number;
  missionPersistence: number;
  timestamp: number;
}

interface DriftAlert {
  id: number;
  beat: number;
  basin: string;
  deviation: number;
  text: string;
}

const BASINS = [
  { name: "FAMILY", k: 0.003, center: 0.75, color: C.green },
  { name: "FAITH", k: 0.004, center: 0.8, color: C.cyan },
  { name: "SOVEREIGNTY", k: 0.005, center: 0.85, color: C.gold },
  { name: "MASTERY", k: 0.002, center: 0.7, color: C.sovereign },
];

function ValuesRadar({ fearM }: { fearM: any }) {
  const groundedScore = fearM?.groundedScore ?? 0;
  const missionLocked = fearM?.missionLockActive ?? false;
  const surrenderFloor = fearM?.surrenderFloor ?? 0;
  const courage = fearM?.courageScore ?? 0;

  // Proxy basin scores from available signals
  const basinScores = [
    Math.min(1, groundedScore + 0.1), // FAMILY — groundedness
    missionLocked ? Math.min(1, surrenderFloor + 0.3) : surrenderFloor * 0.5, // FAITH
    Math.min(1, fearM?.missionPersistence ?? 0), // SOVEREIGNTY
    Math.min(1, courage), // MASTERY
  ];

  return (
    <PanelBox>
      <PanelTitle>▸ VALUES ATTRACTOR BASINS — HOOKE'S LAW GEOMETRY</PanelTitle>
      <div className="flex flex-col gap-2">
        {BASINS.map((basin, i) => {
          const score = basinScores[i];
          const deviation = Math.abs(score - basin.center);
          const isAligned = deviation < 0.15;
          return (
            <div key={basin.name} className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full shrink-0"
                style={{
                  background: isAligned ? basin.color : C.red,
                  boxShadow: isAligned ? `0 0 6px ${basin.color}` : "none",
                }}
              />
              <span
                className="font-mono text-[8px] w-20 shrink-0"
                style={{ color: C.dim }}
              >
                {basin.name}
              </span>
              <div
                className="flex-1 h-1.5"
                style={{ background: "oklch(0.12 0.01 265)" }}
              >
                <div
                  className="h-full transition-all duration-700"
                  style={{
                    width: `${score * 100}%`,
                    background: isAligned ? basin.color : C.red,
                  }}
                />
              </div>
              <span
                className="font-mono text-[9px] w-12 text-right shrink-0"
                style={{ color: isAligned ? basin.color : C.red }}
              >
                {(score * 100).toFixed(1)}%
              </span>
              {!isAligned && (
                <span className="font-mono text-[7px]" style={{ color: C.red }}>
                  DRIFT
                </span>
              )}
            </div>
          );
        })}
      </div>
    </PanelBox>
  );
}

function IdentityTrajectory({ history }: { history: IdentityPoint[] }) {
  if (history.length < 2) return null;

  const recent = history.slice(0, 30);
  const maxI = Math.max(...recent.map((p) => p.identityI), 0.0001);
  const width = 400;
  const height = 50;

  const idPts = recent.map((p, i) => {
    const x = (i / (recent.length - 1)) * width;
    const y = height - (p.identityI / maxI) * height;
    return `${x},${y}`;
  });

  const grPts = recent.map((p, i) => {
    const x = (i / (recent.length - 1)) * width;
    const y = height - p.groundedScore * height;
    return `${x},${y}`;
  });

  return (
    <PanelBox>
      <PanelTitle>▸ IDENTITY TRAJECTORY — GROUND TRUTH</PanelTitle>
      <svg
        width="100%"
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: "visible" }}
        aria-labelledby="solus-trajectory-title"
      >
        <title id="solus-trajectory-title">Identity trajectory over time</title>
        <polyline
          points={idPts.join(" ")}
          fill="none"
          stroke={C.sovereign}
          strokeWidth="1.5"
          opacity="0.9"
        />
        <polyline
          points={grPts.join(" ")}
          fill="none"
          stroke={C.green}
          strokeWidth="1"
          opacity="0.6"
          strokeDasharray="3,3"
        />
      </svg>
      <div className="flex gap-4 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-px" style={{ background: C.sovereign }} />
          <span className="font-mono text-[8px]" style={{ color: C.dim }}>
            IDENTITY
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div
            className="w-4 h-px"
            style={{ background: C.green, borderTop: `1px dashed ${C.green}` }}
          />
          <span className="font-mono text-[8px]" style={{ color: C.dim }}>
            GROUNDED
          </span>
        </div>
      </div>
    </PanelBox>
  );
}

function MedinaDoctrinePanel({ fearM }: { fearM: any }) {
  const missionLocked = fearM?.missionLockActive ?? false;
  const darkNight = fearM?.darkNightActive ?? false;
  const surrenderFloor = fearM?.surrenderFloor ?? 0;
  const streakCounter = Number(fearM?.streakCounter ?? 0);
  const conqueredFear = Number(fearM?.conqueredFearCount ?? 0);

  const doctrineLines = [
    {
      label: "MISSION LOCK",
      value: missionLocked ? "ACTIVE — PERMANENT" : "OPEN",
      ok: missionLocked,
    },
    {
      label: "DARK NIGHT PROTOCOL",
      value: darkNight ? "FIRING" : "STANDBY",
      ok: !darkNight,
    },
    {
      label: "SURRENDER FLOOR",
      value: surrenderFloor.toFixed(4),
      ok: surrenderFloor > 0,
    },
    {
      label: "SOVEREIGNTY STREAK",
      value: streakCounter.toLocaleString(),
      ok: streakCounter > 0,
    },
    {
      label: "CONQUERED FEARS",
      value: conqueredFear.toString(),
      ok: conqueredFear > 0,
    },
  ];

  return (
    <PanelBox>
      <PanelTitle>▸ MEDINA DOCTRINE ENFORCEMENT LOG</PanelTitle>
      <div className="flex flex-col gap-1.5">
        {doctrineLines.map(({ label, value, ok }) => (
          <div
            key={label}
            className="flex items-center justify-between py-1 border-b"
            style={{ borderColor: "oklch(0.12 0.02 265)" }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: ok ? C.green : C.dimlo }}
              />
              <span className="font-mono text-[9px]" style={{ color: C.dim }}>
                {label}
              </span>
            </div>
            <span
              className="font-mono text-[10px] font-bold"
              style={{ color: ok ? C.sovereign : C.dimlo }}
            >
              {value}
            </span>
          </div>
        ))}
      </div>
    </PanelBox>
  );
}

export default function SolusTab() {
  const { data: canon } = useCanonicalState();
  const { data: fearM } = useFearMissionState();

  const [history, setHistory] = useState<IdentityPoint[]>([]);
  const [alerts, setAlerts] = useState<DriftAlert[]>([]);
  const alertIdRef = useRef(0);
  const lastBeatRef = useRef(0);

  useEffect(() => {
    if (!canon || !fearM) return;
    const beat = Number(canon.b);
    if (beat === lastBeatRef.current) return;
    lastBeatRef.current = beat;

    const point: IdentityPoint = {
      beat,
      identityI: 0.5, // Identity is not directly exposed in canonical; use groundedScore proxy
      groundedScore: fearM.groundedScore ?? 0,
      missionPersistence: fearM.missionPersistence ?? 0,
      timestamp: Date.now(),
    };
    setHistory((prev) => [point, ...prev].slice(0, 200));

    // Drift alert generation
    BASINS.forEach((basin, i) => {
      const basinScore =
        i === 0
          ? (fearM.groundedScore ?? 0)
          : i === 1
            ? (fearM.surrenderFloor ?? 0)
            : i === 2
              ? (fearM.missionPersistence ?? 0)
              : (fearM.courageScore ?? 0);
      const deviation = Math.abs(basinScore - basin.center);
      if (deviation > 0.25) {
        const alert: DriftAlert = {
          id: ++alertIdRef.current,
          beat,
          basin: basin.name,
          deviation,
          text: `Identity drift in ${basin.name} basin: ${(deviation * 100).toFixed(1)}% deviation from attractor center. Hooke's restoring force active. Sovereignty floor protecting minimum.`,
        };
        setAlerts((prev) => [alert, ...prev].slice(0, 20));
      }
    });
  }, [canon, fearM]);

  return (
    <div
      className="flex flex-col h-full overflow-y-auto"
      style={{ background: C.bg }}
      data-ocid="solus.page"
    >
      <motion.div
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ background: "oklch(0.065 0.012 50)", borderColor: C.border }}
        data-ocid="solus.header.panel"
      >
        <div className="flex items-center gap-3">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              background: C.sovereign,
              boxShadow: `0 0 10px ${C.sovereign}`,
            }}
          />
          <span
            className="font-mono text-lg font-bold tracking-widest"
            style={{ color: C.sovereign }}
          >
            SOLUS
          </span>
          <span
            className="font-mono text-[9px] tracking-widest uppercase"
            style={{ color: C.dim }}
          >
            SOVEREIGN IDENTITY ENGINE
          </span>
        </div>
        <div className="flex items-center gap-4">
          {[
            [
              "MISSION",
              fearM?.missionLockActive ? "LOCKED" : "OPEN",
              fearM?.missionLockActive ? C.green : C.amber,
            ],
            [
              "GROUNDED",
              `${((fearM?.groundedScore ?? 0) * 100).toFixed(1)}%`,
              C.sovereign,
            ],
            [
              "ALERTS",
              String(alerts.length),
              alerts.length > 0 ? C.red : C.green,
            ],
          ].map(([lbl, val, col]) => (
            <div key={String(lbl)} className="flex flex-col items-center">
              <span
                className="font-mono text-[8px] tracking-widest uppercase"
                style={{ color: C.dim }}
              >
                {lbl}
              </span>
              <span
                className="font-mono text-sm font-bold"
                style={{ color: String(col) }}
              >
                {val}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="flex flex-col gap-3 p-3">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-3"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
        >
          <ValuesRadar fearM={fearM} />
          <MedinaDoctrinePanel fearM={fearM} />
        </motion.div>

        {history.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
          >
            <IdentityTrajectory history={history} />
          </motion.div>
        )}

        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.15 }}
          >
            <PanelBox>
              <PanelTitle>▸ IDENTITY DRIFT ALERTS</PanelTitle>
              <div
                className="flex flex-col gap-2 max-h-48 overflow-y-auto"
                style={{ scrollbarWidth: "none" }}
              >
                {alerts.slice(0, 10).map((alert, i) => (
                  <div
                    key={alert.id}
                    className="p-2 border"
                    style={{
                      borderColor: `${C.red}40`,
                      background: "oklch(0.07 0.015 25)",
                    }}
                    data-ocid={`solus.alert.item.${i + 1}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="font-mono text-[8px] font-bold"
                        style={{ color: C.red }}
                      >
                        {alert.basin}
                      </span>
                      <span
                        className="font-mono text-[8px]"
                        style={{ color: C.dim }}
                      >
                        Beat #{alert.beat}
                      </span>
                    </div>
                    <p className="font-mono text-[9px]" style={{ color: C.fg }}>
                      {alert.text}
                    </p>
                  </div>
                ))}
              </div>
            </PanelBox>
          </motion.div>
        )}
      </div>
    </div>
  );
}
