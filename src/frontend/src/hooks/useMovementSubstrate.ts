// ─── useMovementSubstrate Hook ───────────────────────────────────────────────
// 30Hz tick driver for the shared movement substrate.
// Consumes neural simulation state, exposes live MovementSubstrateState.

import { useCallback, useEffect, useRef, useState } from "react";
import { liveBrainBus } from "../utils/liveBrainBus";
import {
  defaultTuning,
  initMovementSubstrate,
  tickMovementSubstrate,
} from "../utils/movementSubstrate";
import type {
  MovementSubstrateState,
  MovementSubstrateTuning,
  StrategicMovementIntent,
  TacticalMovementContext,
} from "../utils/movementSubstrateTypes";

const TICK_INTERVAL_MS = 33; // ~30Hz

export function useMovementSubstrate() {
  const [state, setState] = useState<MovementSubstrateState>(() =>
    initMovementSubstrate(),
  );
  const stateRef = useRef(state);
  stateRef.current = state;

  const strategicRef = useRef<StrategicMovementIntent | null>(null);
  const tacticalRef = useRef<TacticalMovementContext | null>(null);
  const tuningOverrideRef = useRef<Partial<MovementSubstrateTuning>>({});
  const runningRef = useRef(false);

  // Ingest strategic intent from WarCommand
  const setStrategicIntent = useCallback(
    (intent: StrategicMovementIntent | null) => {
      strategicRef.current = intent;
      // Also propagate to liveBrainBus so WarCommand adapter can see it
      if (
        typeof (liveBrainBus as any).setStrategicMovementIntent === "function"
      ) {
        (liveBrainBus as any).setStrategicMovementIntent(intent);
      }
    },
    [],
  );

  // Ingest tactical context from BattleOps
  const setTacticalContext = useCallback(
    (ctx: TacticalMovementContext | null) => {
      tacticalRef.current = ctx;
      if (
        typeof (liveBrainBus as any).setTacticalMovementContext === "function"
      ) {
        (liveBrainBus as any).setTacticalMovementContext(ctx);
      }
    },
    [],
  );

  const applyTuning = useCallback(
    (tuning: Partial<MovementSubstrateTuning>) => {
      tuningOverrideRef.current = { ...tuningOverrideRef.current, ...tuning };
    },
    [],
  );

  const start = useCallback(() => {
    runningRef.current = true;
  }, []);
  const stop = useCallback(() => {
    runningRef.current = false;
  }, []);
  const reset = useCallback(() => {
    setState(initMovementSubstrate());
  }, []);

  useEffect(() => {
    runningRef.current = true;
    const interval = setInterval(() => {
      if (!runningRef.current) return;

      // Pull neural state from liveBrainBus
      const bus = liveBrainBus as any;
      // Extract neural activations from the bus's last packet or fallback to defaults
      const lastPacket = bus._lastPacket ?? {};
      const neural = {
        pfcActivation: lastPacket.pfc_activation ?? Math.random() * 0.3 + 0.4,
        amygdalaActivation:
          lastPacket.amygdala_activation ?? Math.random() * 0.2 + 0.2,
        nacActivation: lastPacket.nac_activation ?? Math.random() * 0.3 + 0.3,
        hippocampusActivation:
          lastPacket.hippocampus_activation ?? Math.random() * 0.2 + 0.3,
        fatigueLoad: lastPacket.fatigue ?? Math.random() * 0.15,
        arousaLevel: lastPacket.arousal ?? Math.random() * 0.3 + 0.3,
        stressSignal: lastPacket.stress ?? Math.random() * 0.2,
        recoverySignal: lastPacket.recovery ?? Math.random() * 0.1,
      };

      const next = tickMovementSubstrate(
        stateRef.current,
        neural,
        strategicRef.current,
        tacticalRef.current,
        Object.keys(tuningOverrideRef.current).length > 0
          ? tuningOverrideRef.current
          : undefined,
      );

      setState(next);
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return {
    state,
    setStrategicIntent,
    setTacticalContext,
    applyTuning,
    start,
    stop,
    reset,
  };
}
