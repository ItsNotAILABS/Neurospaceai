import { useState } from "react";
import {
  createIntelligenceNetwork,
  makeFusionNode,
  makeMeasurementNode,
  type IntelligenceNetwork,
} from "../lib/mars-crew/intelligence-network";
import {
  createUnifiedMind,
  stepUnifiedMind,
  type UnifiedMind,
} from "../lib/mars-crew/unified-mind";

function makeDemoNetwork(): IntelligenceNetwork {
  const perceptionA = makeMeasurementNode("camera-visible", "targetConfidence", 0.72, 0.04);
  const perceptionB = makeMeasurementNode("mesie-spectral", "targetConfidence", 0.81, 0.08);
  const fusion = makeFusionNode("state-estimator", "targetConfidence");

  return createIntelligenceNetwork(
    [perceptionA, perceptionB, fusion],
    [
      { from: perceptionA.id, to: fusion.id, bandwidthBitsPerSecond: 1_000_000, delayS: 0.01, enabled: true },
      { from: perceptionB.id, to: fusion.id, bandwidthBitsPerSecond: 1_000_000, delayS: 0.01, enabled: true },
    ],
  );
}

export default function IntelligenceNetworkPanel() {
  const [mind, setMind] = useState<UnifiedMind>(() =>
    createUnifiedMind(makeDemoNetwork()),
  );
  const [lastProduced, setLastProduced] = useState(0);
  const [lastRejected, setLastRejected] = useState(0);

  function stepNetwork() {
    setMind((current) => {
      const result = stepUnifiedMind(current, 1);
      setLastProduced(result.networkResult.produced.length);
      setLastRejected(result.networkResult.rejected.length);
      return result.mind;
    });
  }

  const network = mind.network;

  return (
    <div className="rounded-xl border border-cyan-300/20 bg-cyan-300/[0.04] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white">
            Unified computational mind
          </h2>
          <p className="mt-1 text-xs text-slate-400">
            Photon/MESIE specialists → global workspace → mission decision
          </p>
        </div>
        <button
          type="button"
          onClick={stepNetwork}
          className="rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100"
        >
          RUN NETWORK STEP
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        {network.nodes.map((node) => (
          <div key={node.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="font-mono text-xs text-cyan-100">{node.id}</div>
            <div className="mt-1 text-[10px] uppercase tracking-wider text-slate-500">
              {node.domain}
            </div>
            <div className="mt-3 text-xs text-slate-400">
              reliability {(node.reliability * 100).toFixed(0)}%
            </div>
            <div className="text-xs text-slate-400">
              latency {node.latencyS.toFixed(3)} s
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {[
          ["time", `${network.timeS.toFixed(1)} s`],
          ["energy", `${network.energySpentJ.toFixed(1)} J`],
          ["coherence", mind.state.globalCoherence.toFixed(3)],
          ["approval", mind.state.humanApprovalRequired ? "REQUIRED" : "READY"],
          ["produced", String(lastProduced)],
          ["rejected", String(lastRejected)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-white/10 bg-black/20 p-3">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">{label}</div>
            <div className="mt-1 font-mono text-sm text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">dominant workspace</div>
          <div className="mt-1 font-mono text-sm text-cyan-100">{mind.state.dominantVariable ?? "none"}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">prediction error</div>
          <div className="mt-1 font-mono text-sm text-cyan-100">{mind.state.predictionError.toFixed(4)}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-black/20 p-3">
          <div className="text-[10px] uppercase tracking-wider text-slate-500">workspace capacity</div>
          <div className="mt-1 font-mono text-sm text-cyan-100">{mind.state.workspace.length} / 8</div>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="text-xs uppercase tracking-wider text-slate-500">Current beliefs</div>
        {network.beliefs.length === 0 ? (
          <div className="text-xs text-slate-500">Run a step to produce measurements.</div>
        ) : (
          network.beliefs.map((belief, index) => (
            <div key={`${belief.variable}-${belief.source}-${index}`} className="flex flex-wrap justify-between gap-2 border-t border-white/10 pt-2 font-mono text-xs">
              <span className="text-cyan-100">{belief.variable}</span>
              <span className="text-white">{belief.value.toFixed(4)}</span>
              <span className="text-slate-500">variance {belief.variance.toFixed(4)}</span>
              <span className="text-slate-500">{belief.source}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
