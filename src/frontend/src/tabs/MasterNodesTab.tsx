import { useQuery } from "@tanstack/react-query";
import { useActor } from "../hooks/useActor";

const C = {
  bg: "oklch(0.06 0.01 265)",
  panel: "oklch(0.09 0.015 265)",
  border: "oklch(0.2 0.05 255)",
  cyan: "oklch(0.72 0.22 195)",
  gold: "oklch(0.82 0.22 80)",
  dim: "oklch(0.38 0.05 220)",
  text: "oklch(0.85 0.05 210)",
  green: "oklch(0.68 0.28 140)",
  amber: "oklch(0.78 0.2 70)",
};

const NODES = [
  {
    id: "VAULT",
    live: true,
    desc: "Zero-Exposure Wall · Semantic Mapping · Vault Key Storage",
    details: [
      "ZERO-EXPOSURE WALL",
      "SEMANTIC MAPPING",
      "VAULT KEY",
      "JURISDICTION",
    ],
  },
  {
    id: "CHRONO",
    desc: "Temporal Coordination · Time-lock Events · Beat Synchronization",
  },
  {
    id: "NEXUS",
    desc: "Cross-Organism Routing · Ecosystem Signal Bus · Relay",
  },
  {
    id: "AEGIS",
    desc: "Defense Coordination · Threat Response · Lock Protocol",
  },
  {
    id: "ANIMA",
    desc: "Identity Chain · Continuity Verification · ANT Minting",
  },
  {
    id: "FORGE",
    desc: "Construction Engine · World Building · Structure Generation",
  },
  {
    id: "GENESIS",
    desc: "Artifact Aggregation · IP Registry · NFT Attribution",
  },
  {
    id: "OMNIS",
    desc: "Emergence Governance · OMNIS Arbitration · Quality Gate",
  },
  { id: "ARES", desc: "Temporal Reversal · Failed State Archive · Recovery" },
  {
    id: "GAIA",
    desc: "Repair Coordination · Substrate Healing · Recovery Boost",
  },
  {
    id: "SENTINEL",
    desc: "Anomaly Watch · Signal Monitoring · Threat Detection",
  },
  {
    id: "VULCAN",
    desc: "Fortification · Prediction Hardening · Defense Optimization",
  },
];

export default function MasterNodesTab() {
  const { actor } = useActor();
  const attrQ = useQuery({
    queryKey: ["creatorAttribution"],
    queryFn: async () => {
      if (!actor) return null;
      return (actor as any).getCreatorAttribution();
    },
    enabled: !!actor,
    refetchInterval: 30000,
  });

  const attr = attrQ.data;

  return (
    <div className="h-full overflow-y-auto p-4" style={{ background: C.bg }}>
      {/* Header */}
      <div className="mb-5">
        <h2
          className="font-mono text-[11px] tracking-widest uppercase font-bold"
          style={{ color: C.gold }}
        >
          12 MASTER NODES — ECOSYSTEM MACRO-GOVERNORS
        </h2>
        <p
          className="font-mono text-[9px] tracking-widest mt-1"
          style={{ color: C.dim }}
        >
          Each node is a sovereign intelligence coordinating one domain across
          the entire ecosystem.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {NODES.map((node) => {
          const isLive = node.live;
          return (
            <div
              key={node.id}
              className="border rounded p-3 space-y-2"
              style={{
                borderColor: isLive ? C.green : C.border,
                background: C.panel,
                boxShadow: isLive
                  ? "0 0 16px oklch(0.68 0.28 140 / 0.15)"
                  : "none",
              }}
            >
              {/* Node ID */}
              <div className="flex items-center justify-between">
                <div
                  className="font-mono text-[11px] font-bold tracking-widest"
                  style={{ color: isLive ? C.green : C.cyan }}
                >
                  {node.id}
                </div>
                <span
                  className="font-mono text-[7px] tracking-widest uppercase px-1.5 py-0.5 rounded"
                  style={{
                    color: isLive ? C.green : C.amber,
                    background: isLive
                      ? "oklch(0.68 0.28 140 / 0.12)"
                      : "oklch(0.78 0.2 70 / 0.12)",
                    border: isLive
                      ? "1px solid oklch(0.68 0.28 140 / 0.4)"
                      : "1px solid oklch(0.78 0.2 70 / 0.4)",
                  }}
                >
                  {isLive ? "DEPLOYED" : "PENDING"}
                </span>
              </div>

              {/* Description */}
              <p
                className="font-mono text-[8px] leading-relaxed"
                style={{ color: C.dim }}
              >
                {node.desc}
              </p>

              {/* VAULT live details */}
              {isLive && (
                <div
                  className="space-y-1 mt-2 pt-2 border-t"
                  style={{ borderColor: C.border }}
                >
                  <div className="flex justify-between">
                    <span
                      className="font-mono text-[7px]"
                      style={{ color: C.dim }}
                    >
                      STATUS
                    </span>
                    <span
                      className="font-mono text-[7px] font-bold"
                      style={{ color: C.green }}
                    >
                      ACTIVE
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="font-mono text-[7px]"
                      style={{ color: C.dim }}
                    >
                      ZERO-EXPOSURE WALL
                    </span>
                    <span
                      className="font-mono text-[7px] font-bold"
                      style={{ color: C.green }}
                    >
                      ON
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span
                      className="font-mono text-[7px]"
                      style={{ color: C.dim }}
                    >
                      SEMANTIC MAP
                    </span>
                    <span
                      className="font-mono text-[7px] font-bold"
                      style={{ color: C.gold }}
                    >
                      ENCRYPTED
                    </span>
                  </div>
                  {attr && (
                    <>
                      <div>
                        <div
                          className="font-mono text-[7px]"
                          style={{ color: C.dim }}
                        >
                          VAULT KEY
                        </div>
                        <div
                          className="font-mono text-[8px] break-all"
                          style={{ color: C.cyan }}
                        >
                          0x
                          {attr.doctrineHash
                            .toString(16)
                            .toUpperCase()
                            .padStart(8, "0")}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span
                          className="font-mono text-[7px]"
                          style={{ color: C.dim }}
                        >
                          JURISDICTION
                        </span>
                        <span
                          className="font-mono text-[7px] font-bold"
                          style={{ color: C.text }}
                        >
                          {attr.jurisdiction}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Pending deployment ring */}
              {!isLive && (
                <div className="flex items-center justify-center pt-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      border: "1px solid oklch(0.78 0.2 70 / 0.3)",
                      color: C.amber,
                    }}
                  >
                    <span className="font-mono text-[7px]">0%</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="mt-8 pt-4 border-t text-center"
        style={{ borderColor: C.border }}
      >
        <p
          className="font-mono text-[8px] tracking-widest"
          style={{ color: "oklch(0.28 0.04 220)" }}
        >
          Medina Doctrine · 12-Node Sovereign Ecosystem Architecture · Dallas,
          TX · 2026
        </p>
      </div>
    </div>
  );
}
