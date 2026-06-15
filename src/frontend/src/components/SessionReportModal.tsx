import { useCallback } from "react";
import type {
  PublicationAlert,
  SessionReport,
} from "../hooks/useNeuralSimulation";

interface SessionReportModalProps {
  report: SessionReport;
  onClose: () => void;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="font-mono text-[10px] tracking-widest uppercase mb-2 pb-1 border-b"
      style={{
        color: "oklch(0.72 0.22 195)",
        borderColor: "oklch(0.22 0.06 255)",
        letterSpacing: "0.12em",
      }}
    >
      {children}
    </div>
  );
}

function MiniSparkline({
  data,
  color = "oklch(0.72 0.22 195)",
}: { data: number[]; color?: string }) {
  if (data.length < 2) return null;
  const width = 180;
  const height = 28;
  const max = Math.max(...data, 0.01);
  const min = Math.min(...data);
  const range = max - min || 0.01;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="sparkline"
      style={{ overflow: "visible" }}
    >
      <rect
        x={0}
        y={0}
        width={width}
        height={height}
        fill="oklch(0.07 0.01 260)"
        rx={1}
      />
      <polyline
        points={points.join(" ")}
        fill="none"
        stroke={color}
        strokeWidth={1.2}
        strokeOpacity={0.85}
        strokeLinejoin="round"
      />
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
        r={2.5}
        fill={color}
      />
    </svg>
  );
}

const TYPE_COLORS: Record<PublicationAlert["type"], string> = {
  habituation: "oklch(0.72 0.22 140)",
  associative_learning: "oklch(0.82 0.26 80)",
  goal_directed_nav: "oklch(0.72 0.22 195)",
  stdp_milestone: "oklch(0.78 0.22 310)",
  emergent_pattern: "oklch(0.82 0.26 55)",
};

const TYPE_LABELS: Record<PublicationAlert["type"], string> = {
  habituation: "HABITUATION",
  associative_learning: "ASSOC. LEARNING",
  goal_directed_nav: "GOAL-DIRECTED NAV",
  stdp_milestone: "STDP MILESTONE",
  emergent_pattern: "EMERGENT PATTERN",
};

export function SessionReportModal({
  report,
  onClose,
}: SessionReportModalProps) {
  const durationSec = ((report.endTime - report.startTime) / 1000).toFixed(1);
  const avgBpm =
    report.heartRateArc.length > 0
      ? Math.round(
          report.heartRateArc.reduce((s, h) => s + h.bpm, 0) /
            report.heartRateArc.length,
        )
      : 0;

  const handleGeneratePaper = useCallback(() => {
    const qm = report.quantitativeMetrics;
    const durationSecVal = ((report.endTime - report.startTime) / 1000).toFixed(
      1,
    );
    const tickDurationMs =
      report.durationTicks > 0
        ? ((report.endTime - report.startTime) / report.durationTicks).toFixed(
            1,
          )
        : "N/A";

    const topRegions = report.topActivatedRegions.slice(0, 15);
    const maxAct = Math.max(...topRegions.map((r) => r.avgActivation), 0.01);
    const barMaxW = 200;
    const barH = 16;
    const barGap = 4;
    const svgH = topRegions.length * (barH + barGap) + 10;
    const regionSvg = `<svg width="380" height="${svgH}" xmlns="http://www.w3.org/2000/svg">
      ${topRegions
        .map((r, i) => {
          const w = Math.round((r.avgActivation / maxAct) * barMaxW);
          const y = i * (barH + barGap);
          const pct = Math.round(r.avgActivation * 100);
          const color = pct > 80 ? "#ff5c33" : pct > 50 ? "#f5c518" : "#33aaff";
          return `<rect x="170" y="${y}" width="${w}" height="${barH}" fill="${color}" opacity="0.85"/>
                <text x="165" y="${y + barH - 4}" text-anchor="end" font-size="9" fill="#8899aa" font-family="monospace">${r.region.slice(0, 22)}</text>
                <text x="${170 + w + 4}" y="${y + barH - 4}" font-size="9" fill="${color}" font-family="monospace">${pct}%</text>`;
        })
        .join("")}
    </svg>`;

    const stdpDeltas = report.stdpChanges.slice(0, 20).map((c) => c.delta);
    const stdpMaxAbs = Math.max(...stdpDeltas.map(Math.abs), 0.001);
    const stdpSvg = `<svg width="380" height="70" xmlns="http://www.w3.org/2000/svg">
      ${stdpDeltas
        .map((d, i) => {
          const barW = 14;
          const x = i * 18;
          const isPos = d >= 0;
          const h = Math.max(2, Math.round((Math.abs(d) / stdpMaxAbs) * 55));
          return `<rect x="${x}" y="${65 - h}" width="${barW}" height="${h}" fill="${isPos ? "#33dd88" : "#ff5533"}" opacity="0.8"/>`;
        })
        .join("")}
      <line x1="0" y1="65" x2="380" y2="65" stroke="#334455" stroke-width="1"/>
      <text x="0" y="70" font-size="8" fill="#778899" font-family="monospace">LTP (green) / LTD (red)</text>
    </svg>`;

    const saturatedWarning = report.topActivatedRegions.filter(
      (r) => r.avgActivation > 0.9,
    );

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Human Connectome Session Report · ${report.sessionId}</title>
  <style>
    @media print { .no-print { display: none !important; } body { padding: 16px; } }
    body { font-family: 'Courier New', monospace; background: #fff; color: #111; padding: 32px; max-width: 900px; margin: 0 auto; font-size: 10px; line-height: 1.5; }
    h1 { font-size: 16px; border-bottom: 2px solid #001; padding-bottom: 8px; margin-bottom: 6px; letter-spacing: 0.1em; text-transform: uppercase; }
    h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #ccc; margin-top: 20px; margin-bottom: 8px; padding-bottom: 4px; color: #334; }
    .meta { color: #556; margin-bottom: 20px; font-size: 9px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 16px; }
    .metric-box { border: 1px solid #ccd; padding: 8px; }
    .metric-label { font-size: 8px; text-transform: uppercase; color: #778; letter-spacing: 0.06em; }
    .metric-value { font-size: 14px; font-weight: bold; color: #224; margin-top: 2px; }
    .metric-unit { font-size: 7px; color: #889; }
    .thought-row { border-left: 3px solid #33aaff; padding: 4px 8px; margin-bottom: 4px; background: #f8faff; }
    .thought-conf { font-size: 8px; color: #558; }
    .disclaimer { background: #fffde7; border: 1px solid #f5c518; padding: 10px; margin: 12px 0; font-size: 9px; }
    .saturation-warn { background: #fff3e0; border: 1px solid #ff9800; padding: 6px 10px; margin: 8px 0; font-size: 9px; color: #7b3a00; }
    .print-btn { background: #224; color: #fff; border: none; padding: 10px 24px; cursor: pointer; font-family: monospace; font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 9px; margin-bottom: 12px; }
    th { background: #f0f2f5; padding: 4px 8px; text-align: left; border: 1px solid #dde; text-transform: uppercase; font-size: 8px; color: #556; }
    td { padding: 3px 8px; border: 1px solid #eef; }
    tr:nth-child(even) { background: #fafbfc; }
    svg { display: block; margin: 8px 0; }
    footer { margin-top: 32px; border-top: 1px solid #ccc; padding-top: 12px; font-size: 8px; color: #778; }
  </style>
</head>
<body>
  <button class="no-print print-btn" onclick="window.print()">&#8595; PRINT / SAVE AS PDF</button>

  <h1>Human Connectome · Session Analysis Report</h1>
  <div class="meta">
    Session ID: ${report.sessionId}<br/>
    Period: ${new Date(report.startTime).toISOString()} → ${new Date(report.endTime).toISOString()}<br/>
    Wall-clock duration: ${durationSecVal}s | Ticks: ${report.durationTicks.toLocaleString()} | Estimated tick interval: ~${tickDurationMs}ms<br/>
    High-confidence thoughts (≥75%): ${report.totalThoughts}
  </div>

  <div class="disclaimer">
    <strong>Scientific Validity Notice:</strong> Claim language used throughout: "emergent behavior in a brain-inspired embodied simulation." 
    Shannon entropy is normalized as H/log(N_regions); max=1.0. Session duration uses wall-clock time. 
    Pearson r is correlation only — NOT transfer entropy. r=±1.000 flagged as possible computation artifact. 
    STDP = STDP-inspired population plasticity (Wilson-Cowan rate model). 
    Platform biologically constrained by HCP-MMP1.0, Allen Brain Atlas, and Brainnetome Atlas data.
  </div>

  ${
    saturatedWarning.length > 0
      ? `<div class="saturation-warn"><strong>⚠ Saturation Warning:</strong> ${saturatedWarning.length} region(s) averaged >90% activation: ${saturatedWarning.map((r) => r.region).join(", ")}. Verify homeostatic scaling before publishing emergence claims.</div>`
      : '<p style="color:#2a7a2a;font-size:9px;margin:8px 0;">✓ No saturated regions detected (all regions averaged below 90% threshold).</p>'
  }

  <h2>Session Metrics</h2>
  <div class="metrics-grid">
    <div class="metric-box">
      <div class="metric-label">Duration</div>
      <div class="metric-value">${durationSecVal}</div>
      <div class="metric-unit">seconds (wall-clock)</div>
    </div>
    <div class="metric-box">
      <div class="metric-label">Ticks</div>
      <div class="metric-value">${report.durationTicks.toLocaleString()}</div>
      <div class="metric-unit">simulation steps</div>
    </div>
    <div class="metric-box">
      <div class="metric-label">Shannon Entropy</div>
      <div class="metric-value">${qm.shannonEntropy.toFixed(3)}</div>
      <div class="metric-unit">H/log(N) · max=1.0</div>
    </div>
    <div class="metric-box">
      <div class="metric-label">Plasticity Index</div>
      <div class="metric-value">${qm.plasticityIndex.toFixed(3)}</div>
      <div class="metric-unit">STDP-inspired · pop. rate</div>
    </div>
  </div>

  <h2>Neural Activity · Top 15 Regions by Avg Activation</h2>
  ${regionSvg}
  <table>
    <thead><tr><th>#</th><th>Region</th><th>Avg Activation</th><th>Saturation Flag</th></tr></thead>
    <tbody>
      ${report.topActivatedRegions
        .slice(0, 15)
        .map(
          (r, i) =>
            `<tr><td>${i + 1}</td><td>${r.region}</td><td>${Math.round(r.avgActivation * 100)}%</td><td>${r.avgActivation > 0.9 ? "⚠ SATURATED — verify" : r.avgActivation > 0.7 ? "HIGH" : "—"}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <h2>STDP-Inspired Population Plasticity · Weight Changes</h2>
  <p style="font-size:9px;color:#556;margin-bottom:4px;">Wilson-Cowan rate model. Eligibility-trace approximation. NOT literal spike-timing plasticity.</p>
  ${stdpSvg}
  <table>
    <thead><tr><th>Connection</th><th>Delta</th><th>Type</th></tr></thead>
    <tbody>
      ${report.stdpChanges
        .slice(0, 15)
        .map(
          (c) =>
            `<tr><td>${c.connection}</td><td>${c.delta >= 0 ? "+" : ""}${c.delta.toFixed(4)}</td><td>${c.delta > 0 ? "LTP" : "LTD"}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <h2>Emergent Thought Log (≥75% Confidence Multi-Region Co-Activation)</h2>
  <p style="font-size:9px;color:#556;margin-bottom:6px;">Thoughts require ≥3 regions simultaneously co-active above threshold. Silence periods are valid scientific data.</p>
  ${report.thoughtLog
    .slice(0, 20)
    .map(
      (t) =>
        `<div class="thought-row">
      <div class="thought-conf">T${t.tick} · ${t.circuitType ?? "Unknown"} · ${t.confidence ?? 0}% confidence · ${(
        t.neuralSources ?? []
      )
        .slice(0, 3)
        .map((s) => s.region)
        .join(", ")}</div>
      <div style="margin-top:2px;">"${t.thought}"</div>
    </div>`,
    )
    .join("")}

  <h2>Correlation Analysis (Pearson r · NOT Transfer Entropy)</h2>
  <p style="font-size:9px;color:#556;margin-bottom:4px;">Pearson r (lag-1) = symmetric linear association. Transfer entropy = directional information-theoretic measure. These are NOT interchangeable.</p>
  <table>
    <thead><tr><th>Region Pair</th><th>Pearson r</th><th>Validity</th></tr></thead>
    <tbody>
      ${(qm.topPearsonCorrelations ?? [])
        .slice(0, 10)
        .map(
          (c) =>
            `<tr><td>${c.pair}</td><td>${c.value.toFixed(4)}</td><td>${Math.abs(c.value) >= 0.9999 ? "⚠ Possible artifact" : "OK"}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <h2>Executive Summary</h2>
  ${report.aiInterpretation.map((p, i) => `<p><strong>[${i + 1}]</strong> ${p}</p>`).join("")}

  <h2>Behavioral Events</h2>
  <table>
    <thead><tr><th>Tick</th><th>Type</th><th>Description</th></tr></thead>
    <tbody>
      ${report.behavioralEvents
        .slice(0, 25)
        .map(
          (e) =>
            `<tr><td>T${e.tick}</td><td>${e.type.toUpperCase()}</td><td>${e.description}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>

  <footer>
    Generated by Human Connectome · caffeine.ai · ${new Date().toISOString()}<br/>
    Claims: emergent behavior in brain-inspired embodied simulation · biologically constrained by HCP-MMP1.0, Allen Brain Atlas, Brainnetome Atlas
  </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank");
    if (!win) {
      const a = document.createElement("a");
      a.href = url;
      a.download = `connectome-report-${report.sessionId}.html`;
      a.click();
    }
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  }, [report]);

  const handleDownload = useCallback(() => {
    const lines: string[] = [
      "═══════════════════════════════════════════════════════════",
      "  HUMAN CONNECTOME · SESSION ANALYSIS REPORT",
      "═══════════════════════════════════════════════════════════",
      `  Session ID:     ${report.sessionId}`,
      `  Start Time:     ${new Date(report.startTime).toISOString()}`,
      `  End Time:       ${new Date(report.endTime).toISOString()}`,
      `  Duration:       ${durationSec}s (${report.durationTicks} ticks)`,
      `  Total Thoughts: ${report.totalThoughts}`,
      "",
      "─── EXECUTIVE SUMMARY ─────────────────────────────────────",
      ...report.aiInterpretation.map((p, i) => `\n[${i + 1}] ${p}`),
      "",
      "─── NEURAL ACTIVITY ───────────────────────────────────────",
      "Top Activated Regions:",
      ...report.topActivatedRegions.map(
        (r) =>
          `  ${r.region.padEnd(28)} ${Math.round(r.avgActivation * 100)}% avg activation`,
      ),
      "",
      "─── SYNAPTIC PLASTICITY (STDP) ────────────────────────────",
      "Top Changed Connections:",
      ...report.stdpChanges
        .slice(0, 10)
        .map(
          (c) =>
            `  ${c.connection.padEnd(40)} Δ ${c.delta >= 0 ? "+" : ""}${c.delta.toFixed(4)}`,
        ),
      "",
      "─── CARDIAC SUMMARY ───────────────────────────────────────",
      `  Peak Arousal:   ${Math.round(report.peakArousal * 100)}%`,
      `  Avg BPM:        ${avgBpm}`,
      `  Dominant States: ${report.dominantBrainStates.join(", ")}`,
      "",
      "─── THOUGHT LOG ────────────────────────────────────────────",
      ...report.thoughtLog.map(
        (t) =>
          `  T${String(t.tick).padEnd(6)} [${t.dominantRegion.slice(0, 20).padEnd(20)}] "${t.thought}"`,
      ),
      "",
      "─── BEHAVIORAL EVENTS ──────────────────────────────────────",
      ...report.behavioralEvents
        .slice(0, 50)
        .map(
          (e) =>
            `  T${String(e.tick).padEnd(6)} [${e.type.toUpperCase().padEnd(8)}] ${e.description}`,
        ),
      "",
      "═══════════════════════════════════════════════════════════",
      "  Generated by Human Connectome · caffeine.ai",
      "═══════════════════════════════════════════════════════════",
    ];

    const content = lines.join("\n");
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `connectome-session-${report.sessionId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [report, durationSec, avgBpm]);

  return (
    <div
      data-ocid="session_report.modal"
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "oklch(0.04 0.008 265 / 0.92)" }}
    >
      <div
        className="flex flex-col overflow-hidden"
        style={{
          width: "min(92vw, 900px)",
          maxHeight: "90vh",
          background: "oklch(0.07 0.012 265)",
          border: "1px solid oklch(0.25 0.07 255)",
          boxShadow:
            "0 0 80px oklch(0.72 0.22 195 / 0.12), 0 0 200px oklch(0.5 0.15 195 / 0.06)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-3 shrink-0 border-b"
          style={{
            background: "oklch(0.065 0.01 265)",
            borderColor: "oklch(0.22 0.06 255)",
          }}
        >
          <div className="flex flex-col">
            <h2
              id="session-report-title"
              className="font-mono font-bold tracking-widest uppercase"
              style={{
                color: "oklch(0.85 0.05 210)",
                fontSize: "0.85rem",
                letterSpacing: "0.15em",
              }}
            >
              ◈ SESSION ANALYSIS REPORT
            </h2>
            <div
              className="font-mono text-[8px] tracking-widest"
              style={{ color: "oklch(0.4 0.06 220)" }}
            >
              {report.sessionId} · {durationSec}s · {report.durationTicks} ticks
              · {report.totalThoughts} thoughts
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-ocid="session_report.generate_paper_button"
              onClick={handleGeneratePaper}
              className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all"
              style={{
                border: "1px solid oklch(0.55 0.18 165)",
                background: "oklch(0.55 0.18 165 / 0.1)",
                color: "oklch(0.72 0.22 165)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.55 0.18 165 / 0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.55 0.18 165 / 0.1)";
              }}
            >
              ◈ GENERATE PAPER
            </button>
            <button
              type="button"
              data-ocid="session_report.download_button"
              onClick={handleDownload}
              className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all"
              style={{
                border: "1px solid oklch(0.55 0.18 140)",
                background: "oklch(0.55 0.18 140 / 0.1)",
                color: "oklch(0.72 0.22 140)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.55 0.18 140 / 0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.55 0.18 140 / 0.1)";
              }}
            >
              ↓ DOWNLOAD
            </button>
            <button
              type="button"
              data-ocid="session_report.close_button"
              onClick={onClose}
              className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all"
              style={{
                border: "1px solid oklch(0.45 0.12 25)",
                background: "oklch(0.45 0.12 25 / 0.1)",
                color: "oklch(0.65 0.2 25)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.45 0.12 25 / 0.25)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background =
                  "oklch(0.45 0.12 25 / 0.1)";
              }}
            >
              ✕ CLOSE
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto min-h-0 p-6 flex flex-col gap-6">
          {/* ── Publish Gate Banner ── */}
          {report.publishGate && (
            <section data-ocid="session_report.publish_gate.panel">
              {!report.publishGate.passed ? (
                <div
                  className="rounded px-4 py-3 font-mono text-[9px]"
                  style={{
                    background: "oklch(0.18 0.12 25)",
                    border: "1px solid oklch(0.45 0.22 25)",
                    color: "oklch(0.92 0.12 25)",
                  }}
                >
                  <div
                    className="font-bold text-[10px] mb-2 tracking-widest"
                    style={{ color: "oklch(0.95 0.2 25)" }}
                  >
                    ✗ PUBLISH GATE BLOCKED
                  </div>
                  <div className="flex flex-col gap-1">
                    {report.publishGate.blockers.map((b) => (
                      <div key={b.slice(0, 30)} className="flex gap-2">
                        <span style={{ color: "oklch(0.75 0.22 25)" }}>•</span>
                        <span>{b}</span>
                      </div>
                    ))}
                  </div>
                  {report.publishGate.warnings.length > 0 && (
                    <div
                      className="mt-2 pt-2 flex flex-col gap-1"
                      style={{
                        borderTop: "1px solid oklch(0.35 0.12 25 / 0.5)",
                      }}
                    >
                      {report.publishGate.warnings.map((w) => (
                        <div
                          key={w.slice(0, 40)}
                          className="flex gap-2"
                          style={{ color: "oklch(0.82 0.14 55)" }}
                        >
                          <span>⚠</span>
                          <span>{w}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : report.publishGate.warnings.length > 0 ? (
                <div
                  className="rounded px-4 py-3 font-mono text-[9px]"
                  style={{
                    background: "oklch(0.18 0.1 65)",
                    border: "1px solid oklch(0.55 0.18 65)",
                    color: "oklch(0.9 0.12 65)",
                  }}
                >
                  <div className="font-bold text-[10px] mb-2 tracking-widest">
                    ⚠ GATE PASSED WITH WARNINGS
                  </div>
                  {report.publishGate.warnings.map((w) => (
                    <div key={w.slice(0, 40)} className="flex gap-2">
                      <span>⚠</span>
                      <span>{w}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="rounded px-4 py-2 font-mono text-[9px]"
                  style={{
                    background: "oklch(0.15 0.1 150)",
                    border: "1px solid oklch(0.45 0.18 150)",
                    color: "oklch(0.82 0.18 150)",
                  }}
                >
                  ✓ PUBLISH GATE PASSED — All publish conditions met.
                </div>
              )}
            </section>
          )}
          {/* ── Publication-Worthy Findings ── */}
          {report.publicationFindings.length > 0 ? (
            <section data-ocid="session_report.publication_section">
              <div
                className="font-mono text-[10px] tracking-widest uppercase mb-3 pb-1 border-b flex items-center gap-2"
                style={{
                  color: "oklch(0.82 0.26 80)",
                  borderColor: "oklch(0.82 0.26 80 / 0.4)",
                  letterSpacing: "0.12em",
                }}
              >
                <span>◈</span>
                <span>PUBLICATION-WORTHY FINDINGS</span>
                <span
                  className="ml-1 px-2 py-[1px] text-[8px]"
                  style={{
                    background: "oklch(0.82 0.26 80 / 0.15)",
                    border: "1px solid oklch(0.82 0.26 80 / 0.4)",
                    color: "oklch(0.82 0.26 80)",
                  }}
                >
                  {report.publicationFindings.length} FINDING
                  {report.publicationFindings.length > 1 ? "S" : ""}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {report.publicationFindings.map((finding, idx) => (
                  <div
                    key={finding.id}
                    data-ocid={`report.finding.item.${idx + 1}`}
                    className="flex flex-col gap-1"
                    style={{
                      borderLeft: `2px solid ${TYPE_COLORS[finding.type]}`,
                      paddingLeft: "12px",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-[7px] px-2 py-[1px] uppercase tracking-widest"
                        style={{
                          background: `${TYPE_COLORS[finding.type].replace(")", " / 0.12)")}`,
                          border: `1px solid ${TYPE_COLORS[finding.type]}`,
                          color: TYPE_COLORS[finding.type],
                        }}
                      >
                        {TYPE_LABELS[finding.type]}
                      </span>
                      <span
                        className="font-mono text-[7px]"
                        style={{ color: "oklch(0.38 0.05 220)" }}
                      >
                        T{finding.tick}
                      </span>
                      <span
                        className="font-mono text-[9px] font-bold"
                        style={{ color: TYPE_COLORS[finding.type] }}
                      >
                        {finding.title}
                      </span>
                    </div>
                    <div
                      className="font-mono text-[8px] leading-relaxed"
                      style={{ color: "oklch(0.6 0.07 220)" }}
                    >
                      {finding.description}
                    </div>
                    <div
                      className="font-mono text-[7px] italic"
                      style={{ color: "oklch(0.5 0.1 195)" }}
                    >
                      ✦ Significance: {finding.significance}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section>
              <div
                className="font-mono text-[10px] tracking-widest uppercase mb-2 pb-1 border-b"
                style={{
                  color: "oklch(0.45 0.1 80)",
                  borderColor: "oklch(0.25 0.06 255)",
                }}
              >
                ◈ PUBLICATION-WORTHY FINDINGS
              </div>
              <div
                className="font-mono text-[8px] italic"
                style={{ color: "oklch(0.35 0.04 220)" }}
              >
                No publication-worthy findings detected in this session. Run
                longer sessions at complexity 8-10 to increase emergence
                probability.
              </div>
            </section>
          )}

          {/* ── Executive Summary ── */}
          <section data-ocid="session_report.panel">
            <SectionHeader>
              ◈ Executive Summary · AI Scientific Analysis
            </SectionHeader>
            <div className="flex flex-col gap-3">
              {report.aiInterpretation.map((para, i) => (
                <div
                  key={para.slice(0, 40)}
                  className="font-mono text-[9px] leading-relaxed"
                  style={{
                    color: "oklch(0.65 0.08 220)",
                    paddingLeft: "10px",
                    borderLeft: "2px solid oklch(0.28 0.08 255)",
                  }}
                >
                  <span
                    className="font-bold mr-2"
                    style={{ color: "oklch(0.72 0.22 195)" }}
                  >
                    [{i + 1}]
                  </span>
                  {para}
                </div>
              ))}
            </div>
          </section>

          {/* ── Quantitative Metrics ── */}
          {report.quantitativeMetrics && (
            <section data-ocid="session_report.metrics_section">
              <SectionHeader>
                ◈ Quantitative Metrics · Statistical Analysis
              </SectionHeader>
              <div className="grid grid-cols-2 gap-6">
                {/* Left: scalar metrics */}
                <div className="flex flex-col gap-3">
                  {[
                    {
                      label: "Shannon Entropy",
                      value: `${report.quantitativeMetrics.shannonEntropy.toFixed(3)}`,
                      color: "oklch(0.72 0.22 195)",
                      interp:
                        report.quantitativeMetrics.shannonEntropy > 0.6
                          ? "High diversity — rich firing patterns"
                          : report.quantitativeMetrics.shannonEntropy > 0.3
                            ? "Moderate diversity — balanced activity"
                            : "Low diversity — concentrated firing",
                    },
                    {
                      label: "Stimulus Effect Size",
                      value: `d = ${report.quantitativeMetrics.stimulusEffectSize.toFixed(2)}`,
                      color: "oklch(0.82 0.26 80)",
                      interp:
                        report.quantitativeMetrics.stimulusEffectSize > 0.8
                          ? "Large effect — stimulus strongly activated target"
                          : report.quantitativeMetrics.stimulusEffectSize > 0.5
                            ? "Medium effect (Cohen's d)"
                            : "Small effect — weak stimulus response",
                    },
                    {
                      label: "Plasticity Index",
                      value: `${report.quantitativeMetrics.plasticityIndex.toFixed(4)}`,
                      color: "oklch(0.72 0.22 310)",
                      interp:
                        report.quantitativeMetrics.plasticityIndex > 0.01
                          ? "Significant synaptic modification detected"
                          : "Minimal plasticity — run longer for STDP effects",
                    },
                    {
                      label: "Emergent Behavior Score",
                      value: `${report.quantitativeMetrics.emergentBehaviorScore}/3`,
                      color:
                        report.quantitativeMetrics.emergentBehaviorScore > 0
                          ? "oklch(0.82 0.26 80)"
                          : "oklch(0.45 0.08 220)",
                      interp:
                        report.quantitativeMetrics.emergentBehaviorScore === 3
                          ? "All 3 emergent behaviors detected"
                          : report.quantitativeMetrics.emergentBehaviorScore > 0
                            ? `${report.quantitativeMetrics.emergentBehaviorScore} of 3 emergent behaviors`
                            : "No emergent behaviors detected yet",
                    },
                  ].map(({ label, value, color, interp }) => (
                    <div key={label} className="flex flex-col gap-[2px]">
                      <div className="flex items-center justify-between">
                        <span
                          className="font-mono text-[8px]"
                          style={{ color: "oklch(0.45 0.06 220)" }}
                        >
                          {label}
                        </span>
                        <span
                          className="font-mono text-[9px] font-bold"
                          style={{ color }}
                        >
                          {value}
                        </span>
                      </div>
                      <span
                        className="font-mono text-[7px] italic"
                        style={{ color: "oklch(0.38 0.05 220)" }}
                      >
                        {interp}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Right: transfer entropy + correlations */}
                <div className="flex flex-col gap-3">
                  {report.quantitativeMetrics.topPearsonCorrelations.length >
                    0 && (
                    <div>
                      <div
                        className="font-mono text-[8px] uppercase tracking-widest mb-1"
                        style={{ color: "oklch(0.38 0.05 220)" }}
                      >
                        Top Transfer Entropy Pairs
                      </div>
                      <div className="flex flex-col gap-[3px]">
                        {report.quantitativeMetrics.topPearsonCorrelations.map(
                          (te) => (
                            <div
                              key={te.pair}
                              className="flex items-center gap-2"
                            >
                              <span
                                className="font-mono text-[7px] flex-1 truncate"
                                style={{ color: "oklch(0.42 0.06 220)" }}
                              >
                                {te.pair.length > 32
                                  ? `${te.pair.slice(0, 30)}…`
                                  : te.pair}
                              </span>
                              <span
                                className="font-mono text-[8px] font-bold shrink-0"
                                style={{ color: "oklch(0.72 0.22 195)" }}
                              >
                                {te.value.toFixed(4)}
                              </span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  {report.quantitativeMetrics.correlationMatrix.length > 0 && (
                    <div>
                      <div
                        className="font-mono text-[8px] uppercase tracking-widest mb-1"
                        style={{ color: "oklch(0.38 0.05 220)" }}
                      >
                        Top Correlated Pairs
                      </div>
                      <div className="flex flex-col gap-[3px]">
                        {report.quantitativeMetrics.correlationMatrix
                          .slice(0, 5)
                          .map((c) => (
                            <div
                              key={`${c.regionA}-${c.regionB}`}
                              className="flex items-center gap-1"
                            >
                              <span
                                className="font-mono text-[7px] truncate flex-1"
                                style={{ color: "oklch(0.42 0.06 220)" }}
                              >
                                {c.regionA.slice(0, 14)} ↔{" "}
                                {c.regionB.slice(0, 14)}
                              </span>
                              <span
                                className="font-mono text-[8px] font-bold shrink-0"
                                style={{
                                  color:
                                    Math.abs(c.r) > 0.7
                                      ? "oklch(0.72 0.22 140)"
                                      : "oklch(0.62 0.16 195)",
                                }}
                              >
                                r={c.r.toFixed(3)}
                              </span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}

          {/* ── Two-column: Neural Activity + Emotional Arc ── */}
          <div className="grid grid-cols-2 gap-6">
            {/* Neural Activity */}
            <section>
              <SectionHeader>◈ Top Activated Regions</SectionHeader>
              <div className="flex flex-col gap-[5px]">
                {report.topActivatedRegions.map((r, idx) => (
                  <div
                    key={r.region}
                    data-ocid={`report.region.item.${idx + 1}`}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="font-mono text-[8px] truncate shrink-0"
                      style={{ color: "oklch(0.5 0.06 220)", width: "140px" }}
                    >
                      {r.region.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                    <div
                      className="flex-1 h-[4px] relative"
                      style={{ background: "oklch(0.1 0.015 260)" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: 0,
                          top: 0,
                          height: "100%",
                          width: `${r.avgActivation * 100}%`,
                          background: `oklch(0.72 0.22 ${195 - idx * 20})`,
                        }}
                      />
                    </div>
                    <span
                      className="font-mono text-[8px] shrink-0 text-right"
                      style={{ color: "oklch(0.6 0.1 195)", width: "30px" }}
                    >
                      {Math.round(r.avgActivation * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Emotional Arc */}
            <section>
              <SectionHeader>◈ Emotional Arc · Arousal Timeline</SectionHeader>
              <MiniSparkline
                data={report.emotionalArc.map((e) => e.arousal)}
                color="oklch(0.72 0.22 195)"
              />
              <div
                className="font-mono text-[7px] mt-1 mb-2"
                style={{ color: "oklch(0.38 0.05 220)" }}
              >
                Arousal over session · Peak:{" "}
                {Math.round(report.peakArousal * 100)}%
              </div>
              <div className="flex items-center gap-4">
                <div className="flex flex-col">
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: "oklch(0.38 0.05 220)" }}
                  >
                    DOM STATES
                  </span>
                  {report.dominantBrainStates.map((s) => (
                    <span
                      key={s}
                      className="font-mono text-[8px] uppercase"
                      style={{ color: "oklch(0.72 0.22 195)" }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex flex-col">
                  <span
                    className="font-mono text-[7px]"
                    style={{ color: "oklch(0.38 0.05 220)" }}
                  >
                    CARDIAC
                  </span>
                  <span
                    className="font-mono text-[10px] font-bold"
                    style={{ color: "oklch(0.72 0.26 25)" }}
                  >
                    {avgBpm} BPM
                  </span>
                  <MiniSparkline
                    data={report.heartRateArc.slice(-40).map((h) => h.bpm)}
                    color="oklch(0.72 0.26 25)"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* ── STDP Changes ── */}
          <section>
            <SectionHeader>◈ Synaptic Plasticity · STDP Changes</SectionHeader>
            <div className="grid grid-cols-2 gap-x-6 gap-y-[4px]">
              {report.stdpChanges.slice(0, 8).map((c, idx) => {
                const isStrengthened = c.delta > 0;
                return (
                  <div
                    key={c.connection}
                    data-ocid={`report.stdp.item.${idx + 1}`}
                    className="flex items-center gap-2"
                  >
                    <span
                      className="font-mono text-[7px] truncate flex-1"
                      style={{ color: "oklch(0.45 0.06 220)" }}
                    >
                      {c.connection.length > 35
                        ? `${c.connection.slice(0, 32)}…`
                        : c.connection}
                    </span>
                    <span
                      className="font-mono text-[8px] font-bold shrink-0"
                      style={{
                        color: isStrengthened
                          ? "oklch(0.72 0.22 140)"
                          : "oklch(0.65 0.25 25)",
                        width: "48px",
                        textAlign: "right",
                      }}
                    >
                      {isStrengthened ? "+" : ""}
                      {c.delta.toFixed(4)}
                    </span>
                  </div>
                );
              })}
            </div>
            <div
              className="font-mono text-[7px] mt-2 italic"
              style={{ color: "oklch(0.35 0.04 220)" }}
            >
              Positive Δ = Hebbian potentiation (LTP). Negative Δ = synaptic
              depression (LTD). Values represent multiplier change from baseline
              1.0.
            </div>
          </section>

          {/* ── Thought Log ── */}
          <section>
            <SectionHeader>
              ◈ Thought Log · Cognitive Stream Replay
            </SectionHeader>
            {report.thoughtLog.length === 0 ? (
              <div
                className="font-mono text-[8px] italic"
                style={{ color: "oklch(0.32 0.04 220)" }}
              >
                No thoughts were generated during this session. Run longer or
                increase complexity.
              </div>
            ) : (
              <div
                className="flex flex-col gap-[4px] overflow-y-auto"
                style={{ maxHeight: "160px" }}
              >
                {report.thoughtLog.map((t, idx) => (
                  <div
                    key={`${t.tick}-${idx}`}
                    className="flex items-start gap-2"
                    style={{
                      borderLeft: "1px solid oklch(0.25 0.06 255)",
                      paddingLeft: "8px",
                    }}
                  >
                    <span
                      className="font-mono text-[7px] shrink-0"
                      style={{ color: "oklch(0.35 0.04 220)", width: "32px" }}
                    >
                      T{t.tick}
                    </span>
                    <span
                      className="font-mono text-[8px] italic flex-1"
                      style={{ color: "oklch(0.65 0.1 220)" }}
                    >
                      "{t.thought}"
                    </span>
                    <span
                      className="font-mono text-[7px] shrink-0"
                      style={{ color: "oklch(0.5 0.12 195)" }}
                    >
                      [{t.dominantRegion.slice(0, 12)}]
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Behavioral Events ── */}
          <section>
            <SectionHeader>◈ Behavioral Events Log (last 50)</SectionHeader>
            <div
              className="flex flex-col gap-[3px] overflow-y-auto"
              style={{ maxHeight: "120px" }}
            >
              {report.behavioralEvents.slice(0, 50).map((evt, idx) => {
                const typeColors: Record<string, string> = {
                  surge: "oklch(0.72 0.22 195)",
                  drop: "oklch(0.78 0.22 55)",
                  cascade: "oklch(0.72 0.22 310)",
                  stimulus: "oklch(0.78 0.22 80)",
                };
                return (
                  <div
                    key={`${evt.tick}-${evt.region}-${idx}`}
                    className="flex items-start gap-2"
                  >
                    <span
                      className="font-mono text-[7px] shrink-0"
                      style={{ color: "oklch(0.35 0.04 220)", width: "32px" }}
                    >
                      T{evt.tick}
                    </span>
                    <span
                      className="font-mono text-[7px] uppercase shrink-0"
                      style={{
                        color: typeColors[evt.type] ?? "oklch(0.5 0.06 220)",
                        width: "48px",
                      }}
                    >
                      {evt.type}
                    </span>
                    <span
                      className="font-mono text-[7px] flex-1 leading-tight"
                      style={{ color: "oklch(0.5 0.06 220)" }}
                    >
                      {evt.description}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-2 shrink-0 border-t flex items-center justify-between"
          style={{
            background: "oklch(0.065 0.01 265)",
            borderColor: "oklch(0.18 0.04 255)",
          }}
        >
          <span
            className="font-mono text-[7px] tracking-widest"
            style={{ color: "oklch(0.28 0.04 220)" }}
          >
            HUMAN CONNECTOME · 40 REGIONS · 1M+ NEURONS · STDP PLASTICITY ·
            WILSON-COWAN MODEL
          </span>
          <button
            type="button"
            data-ocid="session_report.footer_close_button"
            onClick={onClose}
            className="font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all"
            style={{
              border: "1px solid oklch(0.35 0.06 220)",
              color: "oklch(0.5 0.08 220)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.7 0.12 220)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.color =
                "oklch(0.5 0.08 220)";
            }}
          >
            ✕ CLOSE REPORT
          </button>
        </div>
      </div>
    </div>
  );
}
