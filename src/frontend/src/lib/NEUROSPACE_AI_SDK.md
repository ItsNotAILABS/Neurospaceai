# NeurospaceAI Mind SDK

The SDK exposes a single developer-facing interface over the current research architecture.

## Capabilities

- deterministic Mars crew scenario;
- physics-based habitat and rover stepping;
- photon and retinal-event observation;
- MESIE spectral signatures;
- belief ingestion with uncertainty;
- specialist algorithm network;
- unified global workspace;
- human approval signal;
- seeded replay;
- fault injection;
- rover leader election;
- delayed Earth messages.

## Example

    import { createNeurospaceMind } from "./lib/neurospace-ai-sdk";

    const mind = createNeurospaceMind(42);

    const observation = mind.observePhotons("ROVER-1", {
      irradianceWPerM2: 0.02,
      wavelengthNm: 532,
      exposureAreaM2: 0.000001,
      exposureSeconds: 0.01,
    });

    mind.ingestBelief({
      variable: "hazardScore",
      value: 0.31,
      variance: 0.04,
      timestampS: mind.getScenario().timeS,
      source: "rover-perception",
      evidenceClass: "inference",
    });

    const result = mind.step(0.25);

    if (result.mind.humanApprovalRequired) {
      console.log("Human approval required before action.");
    }

## Design

The SDK intentionally keeps specialists visible:

photon perception -> MESIE spectral features -> belief network -> unified workspace -> policy/approval

A unified mind is an orchestration and attention layer. It is not a claim of machine consciousness and it does not directly control safety-critical hardware.

## Current entry point

src/frontend/src/lib/neurospace-ai-sdk.ts
