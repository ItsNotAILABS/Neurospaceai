import { useMemo, useState } from "react";
import {
  createMarsScenario,
  electRoverLeader,
  enqueueEarthMessage,
  injectFault,
  stepMarsScenario,
  type MarsScenarioState,
  type ScenarioFault,
} from "../lib/mars-crew/scenario";

const FAULTS: ScenarioFault[] = [
  "packet-loss",
  "rover-leader-loss",
  "power-shortage",
  "thermal-excursion",
  "false-sensor",
];

const formatHours = (seconds: number) =>
  `${(seconds / 3600).toFixed(2)} h`;

export default function MarsCrewLabTab() {
  const [scenario, setScenario] = useState<MarsScenarioState>(() =>
    createMarsScenario(42),
  );

  const leader = scenario.rovers.find((rover) => rover.leader);
  const averageWorkload =
    scenario.crew.reduce((sum, member) => sum + member.workload, 0) /
    scenario.crew.length;
  const missionHealth = useMemo(() => {
    const power = scenario.habitat.power.storedEnergyJ / scenario.habitat.power.capacityJ;
    const oxygen = Math.min(1, scenario.habitat.oxygenKg / 720);
    const water = Math.min(1, scenario.habitat.waterKg / 2400);
    return Math.max(0, Math.min(1, (power + oxygen + water) / 3));
  }, [scenario]);

  function step(hours: number) {
    setScenario((current) => stepMarsScenario(current, hours * 3600));
  }

  function reset() {
    setScenario(createMarsScenario(42));
  }

  return (
    <section className="h-full overflow-y-auto space-y-5 p-5" aria-labelledby="mars-crew-title">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/70">
            Neurospace / Physical Systems Lab
          </p>
          <h1 id="mars-crew-title" className="mt-2 text-2xl font-semibold text-white">
            Mars Crew Mission
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-300">
            A deterministic human–AI–robot mission sandbox. Every step is seeded,
            inspectable, and designed for replay before adding live hardware.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => step(0.25)} className="rounded-lg border border-cyan-300/40 bg-cyan-300/10 px-3 py-2 text-xs text-cyan-100">
            STEP 15 MIN
          </button>
          <button type="button" onClick={() => step(1)} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-200">
            STEP 1 HOUR
          </button>
          <button type="button" onClick={reset} className="rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-400">
            RESET SEED 42
          </button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["MISSION CLOCK", formatHours(scenario.timeS)],
          ["EARTH DELAY", `${scenario.oneWayDelayS.toFixed(1)} s`],
          ["MISSION HEALTH", `${(missionHealth * 100).toFixed(1)}%`],
          ["CREW LOAD", `${(averageWorkload * 100).toFixed(1)}%`],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="text-xs uppercase tracking-widest text-cyan-200">{label}</div>
            <div className="mt-2 text-xl font-semibold text-white">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Crew state</h2>
            <span className="text-xs text-slate-500">local mission control</span>
          </div>
          <div className="space-y-3">
            {scenario.crew.map((member) => (
              <div key={member.id} className="grid grid-cols-[1fr_auto] gap-3 border-t border-white/10 pt-3">
                <div>
                  <div className="font-mono text-xs text-cyan-100">{member.id}</div>
                  <div className="mt-1 text-xs uppercase text-slate-500">{member.role}</div>
                </div>
                <div className="text-right text-xs text-slate-300">
                  <div>workload {(member.workload * 100).toFixed(1)}%</div>
                  <div>fatigue {(member.fatigue * 100).toFixed(1)}%</div>
                  <div>health {member.healthSignal.toFixed(3)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Habitat telemetry</h2>
            <span className="text-xs text-slate-500">
              {scenario.habitat.communicationOnline ? "LINK NOMINAL" : "LINK OFFLINE"}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              ["power", `${(scenario.habitat.power.storedEnergyJ / 1_000_000).toFixed(1)} MJ`],
              ["thermal", `${scenario.habitat.thermal.temperatureK.toFixed(1)} K`],
              ["oxygen", `${scenario.habitat.oxygenKg.toFixed(2)} kg`],
              ["CO₂", `${scenario.habitat.carbonDioxideKg.toFixed(3)} kg`],
              ["water", `${scenario.habitat.waterKg.toFixed(2)} kg`],
              ["maintenance", scenario.habitat.maintenanceBacklog.toFixed(3)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="text-xs uppercase text-slate-500">{label}</div>
                <div className="mt-1 font-mono text-cyan-100">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Rover swarm</h2>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>leader: {leader?.id ?? "none"}</span>
            <button type="button" onClick={() => setScenario((current) => electRoverLeader(current))} className="rounded border border-cyan-300/30 px-2 py-1 text-cyan-100">
              ELECT LEADER
            </button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {scenario.rovers.map((rover) => (
            <div key={rover.id} className="rounded-lg border border-white/10 bg-black/20 p-3">
              <div className="flex justify-between gap-2">
                <span className="font-mono text-xs text-white">{rover.id}</span>
                <span className="text-[10px] uppercase text-cyan-200">{rover.leader ? "leader" : "agent"}</span>
              </div>
              <div className="mt-3 space-y-1 text-xs text-slate-400">
                <div>position {rover.state.positionM.x.toFixed(2)}, {rover.state.positionM.y.toFixed(2)} m</div>
                <div>battery {(rover.batteryJ / 1_000_000).toFixed(2)} MJ</div>
                <div>map confidence {(rover.localMapConfidence * 100).toFixed(1)}%</div>
                <div>peers {rover.connectedPeerIds.length}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Inject a fault</h2>
          <div className="flex flex-wrap gap-2">
            {FAULTS.map((fault) => (
              <button key={fault} type="button" onClick={() => setScenario((current) => injectFault(current, fault))} className="rounded-lg border border-amber-300/25 px-3 py-2 text-xs text-amber-100">
                {fault}
              </button>
            ))}
          </div>
          <button type="button" onClick={() => setScenario((current) => enqueueEarthMessage(current, "GROUND: prioritize science target ALPHA", "science"))} className="mt-4 w-full rounded-lg border border-white/15 px-3 py-2 text-xs text-slate-300">
            QUEUE DELAYED EARTH MESSAGE
          </button>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-white">Mission event stream</h2>
            <span className="font-mono text-xs text-slate-500">{scenario.messages.length} pending</span>
          </div>
          <div className="max-h-48 space-y-2 overflow-y-auto font-mono text-xs text-slate-400">
            {scenario.events.slice().reverse().map((event, index) => (
              <div key={`${event}-${index}`} className="border-l border-cyan-300/30 pl-3">{event}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
