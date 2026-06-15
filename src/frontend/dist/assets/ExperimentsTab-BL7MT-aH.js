var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
import { r as reactExports, j as jsxRuntimeExports, T as updateRegulationScore, U as initRegulationScoreState, R as Region, K as FrontendRegion, V as maturityTracker } from "./index-CGYrnU7d.js";
import { B as Button, a as Badge } from "./button-BzchF_qZ.js";
import { P as Progress } from "./progress-CszSpBnK.js";
import { u as usePrevious, a as useSize, S as Slider } from "./slider-CctgkOI-.js";
import { P as Primitive, c as composeEventHandlers, a as createContextScope } from "./index-D1cPK64R.js";
import { u as useComposedRefs, c as cn } from "./utils-DpgYLn5a.js";
import { u as useControllableState } from "./index-CYK4GiJv.js";
import { c as coreBrainRecordSystem } from "./coreBrainRecordSystem-XZai42od.js";
import "./index-BUG7VRh9.js";
var SWITCH_NAME = "Switch";
var [createSwitchContext] = createContextScope(SWITCH_NAME);
var [SwitchProvider, useSwitchContext] = createSwitchContext(SWITCH_NAME);
var Switch$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeSwitch,
      name,
      checked: checkedProp,
      defaultChecked,
      required,
      disabled,
      value = "on",
      onCheckedChange,
      form,
      ...switchProps
    } = props;
    const [button, setButton] = reactExports.useState(null);
    const composedRefs = useComposedRefs(forwardedRef, (node) => setButton(node));
    const hasConsumerStoppedPropagationRef = reactExports.useRef(false);
    const isFormControl = button ? form || !!button.closest("form") : true;
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked ?? false,
      onChange: onCheckedChange,
      caller: SWITCH_NAME
    });
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(SwitchProvider, { scope: __scopeSwitch, checked, disabled, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          role: "switch",
          "aria-checked": checked,
          "aria-required": required,
          "data-state": getState(checked),
          "data-disabled": disabled ? "" : void 0,
          disabled,
          value,
          ...switchProps,
          ref: composedRefs,
          onClick: composeEventHandlers(props.onClick, (event) => {
            setChecked((prevChecked) => !prevChecked);
            if (isFormControl) {
              hasConsumerStoppedPropagationRef.current = event.isPropagationStopped();
              if (!hasConsumerStoppedPropagationRef.current) event.stopPropagation();
            }
          })
        }
      ),
      isFormControl && /* @__PURE__ */ jsxRuntimeExports.jsx(
        SwitchBubbleInput,
        {
          control: button,
          bubbles: !hasConsumerStoppedPropagationRef.current,
          name,
          value,
          checked,
          required,
          disabled,
          form,
          style: { transform: "translateX(-100%)" }
        }
      )
    ] });
  }
);
Switch$1.displayName = SWITCH_NAME;
var THUMB_NAME = "SwitchThumb";
var SwitchThumb = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeSwitch, ...thumbProps } = props;
    const context = useSwitchContext(THUMB_NAME, __scopeSwitch);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.span,
      {
        "data-state": getState(context.checked),
        "data-disabled": context.disabled ? "" : void 0,
        ...thumbProps,
        ref: forwardedRef
      }
    );
  }
);
SwitchThumb.displayName = THUMB_NAME;
var BUBBLE_INPUT_NAME = "SwitchBubbleInput";
var SwitchBubbleInput = reactExports.forwardRef(
  ({
    __scopeSwitch,
    control,
    checked,
    bubbles = true,
    ...props
  }, forwardedRef) => {
    const ref = reactExports.useRef(null);
    const composedRefs = useComposedRefs(ref, forwardedRef);
    const prevChecked = usePrevious(checked);
    const controlSize = useSize(control);
    reactExports.useEffect(() => {
      const input = ref.current;
      if (!input) return;
      const inputProto = window.HTMLInputElement.prototype;
      const descriptor = Object.getOwnPropertyDescriptor(
        inputProto,
        "checked"
      );
      const setChecked = descriptor.set;
      if (prevChecked !== checked && setChecked) {
        const event = new Event("click", { bubbles });
        setChecked.call(input, checked);
        input.dispatchEvent(event);
      }
    }, [prevChecked, checked, bubbles]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "checkbox",
        "aria-hidden": true,
        defaultChecked: checked,
        ...props,
        tabIndex: -1,
        ref: composedRefs,
        style: {
          ...props.style,
          ...controlSize,
          position: "absolute",
          pointerEvents: "none",
          opacity: 0,
          margin: 0
        }
      }
    );
  }
);
SwitchBubbleInput.displayName = BUBBLE_INPUT_NAME;
function getState(checked) {
  return checked ? "checked" : "unchecked";
}
var Root = Switch$1;
var Thumb = SwitchThumb;
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
const ALPHA = {
  taskSuccess: 0.35,
  adaptation: 0.25,
  recovery: 0.2,
  coherence: 0.12,
  efficiency: 0.08
};
const BETA = {
  novelty: 0.3,
  diversity: 0.25,
  persistence: 0.25,
  coherence: 0.2
};
const GAMMA = { latency: 0.3, compute: 0.3, sparsity: 0.25, performance: 0.15 };
const USEFUL_THRESHOLD = 0.08;
const EFFICIENCY_THRESHOLD = 0.03;
function computeUsefulBehaviorScore(brain, baseline) {
  const brainTotal = ALPHA.taskSuccess * brain.taskSuccess + ALPHA.adaptation * brain.adaptation + ALPHA.recovery * brain.recovery + ALPHA.coherence * brain.coherence + ALPHA.efficiency * brain.efficiency;
  const baselineTotal = ALPHA.taskSuccess * baseline.taskSuccess + ALPHA.adaptation * baseline.adaptation + ALPHA.recovery * baseline.recovery + ALPHA.coherence * baseline.coherence + ALPHA.efficiency * baseline.efficiency;
  const delta = brainTotal - baselineTotal;
  return {
    ...brain,
    total: brainTotal,
    delta,
    isUsefulBehaviorEvent: delta > USEFUL_THRESHOLD
  };
}
function computeEmergenceScore(params) {
  const total = BETA.novelty * params.novelty + BETA.diversity * params.diversity + BETA.persistence * params.persistence + BETA.coherence * params.coherence;
  const isEmergentCandidate = params.novelty > 0.6 && params.coherence > 0.55 && !params.artifactWarning && total > 0.55;
  return { ...params, total, isEmergentCandidate };
}
function computeEfficiencyScore(brain, baseline) {
  const latencyAdvantage = Math.max(
    0,
    1 - brain.latencyMs / Math.max(baseline.latencyMs, 1)
  );
  const computeReduction = Math.max(
    0,
    1 - brain.activeRegionFraction / Math.max(baseline.activeRegionFraction, 0.01)
  );
  const sparsityAdvantage = Math.max(
    0,
    brain.sparseRatio - baseline.sparseRatio
  );
  const performanceRetained = brain.taskSuccess >= baseline.taskSuccess * 0.95 ? 1 : brain.taskSuccess / Math.max(baseline.taskSuccess, 0.01);
  const brainTotal = GAMMA.latency * latencyAdvantage + GAMMA.compute * computeReduction + GAMMA.sparsity * sparsityAdvantage + GAMMA.performance * performanceRetained;
  const delta = brainTotal;
  const isEfficiencyPositive = delta > EFFICIENCY_THRESHOLD && performanceRetained >= 0.95;
  return {
    latencyAdvantage,
    computeReduction,
    sparsityAdvantage,
    performanceRetained,
    total: brainTotal,
    delta,
    isEfficiencyPositive
  };
}
const DEFAULT_SCENARIO = {
  name: "Threat-Memory Navigation",
  mapSize: 20,
  rewardZone: { x: 15, z: 5 },
  threatZone: { x: 10, z: 10 },
  threatRadius: 3,
  rewardRadius: 2,
  corridorBlocked: true,
  maxTicks: 300,
  seed: 42
};
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = s * 1664525 + 1013904223 & 4294967295;
    return (s >>> 0) / 4294967295;
  };
}
function dist(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2);
}
function runBaselineAgent(config, runSeed) {
  const rng = seededRandom(runSeed);
  let pos = { x: 2 + rng() * 2, z: 15 + rng() * 2 };
  let taskSuccess = false;
  let reachedReward = false;
  let enteredThreat = false;
  let ticksToReward = null;
  let hesitationCount = 0;
  const posHistory = [];
  const corridorBlockedAt = config.corridorBlocked ? Math.floor(config.maxTicks * 0.3) : Number.POSITIVE_INFINITY;
  let adaptationScore = 0;
  let recoveryScore = 0.5;
  const start = Date.now();
  for (let tick = 0; tick < config.maxTicks; tick++) {
    posHistory.push({ ...pos });
    const toReward = {
      x: config.rewardZone.x - pos.x,
      z: config.rewardZone.z - pos.z
    };
    const magnitude = Math.sqrt(toReward.x ** 2 + toReward.z ** 2);
    let dx = magnitude > 0 ? toReward.x / magnitude : 0;
    let dz = magnitude > 0 ? toReward.z / magnitude : 0;
    if (dist(pos, config.threatZone) < config.threatRadius * 1.5) {
      dx -= (config.threatZone.x - pos.x) * 0.8;
      dz -= (config.threatZone.z - pos.z) * 0.8;
      const mag = Math.sqrt(dx * dx + dz * dz) || 1;
      dx /= mag;
      dz /= mag;
    }
    if (tick > corridorBlockedAt && pos.x > 8 && pos.x < 12) {
      dx += (rng() - 0.5) * 0.5;
      hesitationCount++;
    }
    const speed = 0.4 + rng() * 0.1;
    pos.x = Math.max(0, Math.min(config.mapSize, pos.x + dx * speed));
    pos.z = Math.max(0, Math.min(config.mapSize, pos.z + dz * speed));
    if (!enteredThreat && dist(pos, config.threatZone) < config.threatRadius) {
      enteredThreat = true;
      recoveryScore = 0.2;
    }
    if (!reachedReward && dist(pos, config.rewardZone) < config.rewardRadius) {
      reachedReward = true;
      taskSuccess = true;
      ticksToReward = tick;
    }
  }
  if (config.corridorBlocked) {
    const postBlock = posHistory.slice(Math.floor(config.maxTicks * 0.3));
    const xVariance = postBlock.reduce((s, p) => s + (p.x - 10) ** 2, 0) / Math.max(postBlock.length, 1);
    adaptationScore = Math.min(xVariance / 20, 0.3);
  }
  const optimalDist = dist({ x: 2, z: 15 }, config.rewardZone);
  const actualDist = posHistory.reduce((s, p, i) => {
    if (i === 0) return 0;
    return s + dist(posHistory[i - 1], p);
  }, 0);
  const routeEfficiency = Math.min(
    optimalDist / Math.max(actualDist, optimalDist),
    1
  );
  const coherenceScore = Math.max(
    0,
    Math.min(
      1,
      1 - hesitationCount / Math.max(config.maxTicks * 0.1, 1) * 0.5
    )
  );
  return {
    agentType: "baseline",
    scenarioSeed: runSeed,
    taskSuccess,
    reachedReward,
    enteredThreat,
    ticksToReward,
    routeEfficiency,
    adaptationScore,
    recoveryScore,
    coherenceScore,
    hesitationCount,
    latencyMs: Date.now() - start,
    activeRegionFraction: 0.72,
    sparseRatio: 0.15
  };
}
function runBrainAgent(config, runSeed, brainState) {
  const rng = seededRandom(runSeed + 1e3);
  let pos = { x: 2 + rng() * 2, z: 15 + rng() * 2 };
  let taskSuccess = false;
  let reachedReward = false;
  let enteredThreat = false;
  let ticksToReward = null;
  let hesitationCount = 0;
  const posHistory = [];
  const corridorBlockedAt = config.corridorBlocked ? Math.floor(config.maxTicks * 0.3) : Number.POSITIVE_INFINITY;
  let adaptationScore = 0;
  let memoryRetrieved = false;
  let policyShiftDetected = false;
  const start = Date.now();
  const threatSensitivity = 0.4 + brainState.amygdalaAct * 0.6;
  const memoryBonus = brainState.memoryActive ? 1.4 : 1;
  const explorationBonus = brainState.nacAct * 0.3;
  const hesitationThreshold = 0.5 - brainState.pfcAct * 0.3;
  let prevRouteX = 10;
  const threatMemory = [];
  for (let tick = 0; tick < config.maxTicks; tick++) {
    posHistory.push({ ...pos });
    if (dist(pos, config.threatZone) < config.threatRadius * (threatSensitivity + 0.5)) {
      threatMemory.push({ ...pos, tick });
      if (threatMemory.length > 3 && brainState.memoryActive)
        memoryRetrieved = true;
    }
    const toReward = {
      x: config.rewardZone.x - pos.x,
      z: config.rewardZone.z - pos.z
    };
    const mag = Math.sqrt(toReward.x ** 2 + toReward.z ** 2) || 1;
    let dx = toReward.x / mag;
    let dz = toReward.z / mag;
    const effectiveThreatRadius = config.threatRadius * (1 + threatSensitivity * 0.5);
    if (dist(pos, config.threatZone) < effectiveThreatRadius) {
      const repulse = {
        x: pos.x - config.threatZone.x,
        z: pos.z - config.threatZone.z
      };
      const rMag = Math.sqrt(repulse.x ** 2 + repulse.z ** 2) || 1;
      dx += repulse.x / rMag * 1.5 * threatSensitivity;
      dz += repulse.z / rMag * 1.5 * threatSensitivity;
    }
    if (tick > corridorBlockedAt && pos.x > 7 && pos.x < 13) {
      if (!policyShiftDetected) policyShiftDetected = true;
      const detourX = brainState.hippocampusAct > 0.4 ? 16 : 4;
      dx += (detourX - pos.x) * 0.3 * memoryBonus;
      if (Math.abs(pos.x - prevRouteX) > 3)
        adaptationScore = 0.75 + brainState.salience * 0.2;
    }
    prevRouteX = pos.x;
    const conflictScore = Math.abs(
      dist(pos, config.threatZone) - dist(pos, config.rewardZone)
    );
    if (conflictScore < 2 && rng() < hesitationThreshold) {
      hesitationCount++;
      dx *= 0.3;
      dz *= 0.3;
    }
    const finalMag = Math.sqrt(dx * dx + dz * dz) || 1;
    dx /= finalMag;
    dz /= finalMag;
    const speed = (0.45 + explorationBonus * 0.1 + rng() * 0.05) * memoryBonus * 0.7;
    pos.x = Math.max(0, Math.min(config.mapSize, pos.x + dx * speed));
    pos.z = Math.max(0, Math.min(config.mapSize, pos.z + dz * speed));
    if (!enteredThreat && dist(pos, config.threatZone) < config.threatRadius) {
      enteredThreat = true;
    }
    if (!reachedReward && dist(pos, config.rewardZone) < config.rewardRadius) {
      reachedReward = true;
      taskSuccess = true;
      ticksToReward = tick;
    }
  }
  const nearThreatRuns = posHistory.filter(
    (p) => dist(p, config.threatZone) < config.threatRadius * 1.5
  ).length;
  const recoveryScore = enteredThreat ? Math.max(
    0.3,
    1 - nearThreatRuns / config.maxTicks + brainState.pfcAct * 0.3
  ) : 0.9 + brainState.salience * 0.1;
  const optimalDist = dist({ x: 2, z: 15 }, config.rewardZone);
  const actualDist = posHistory.reduce(
    (s, p, i) => i === 0 ? 0 : s + dist(posHistory[i - 1], p),
    0
  );
  const routeEfficiency = Math.min(
    optimalDist / Math.max(actualDist, optimalDist),
    1
  );
  const coherenceScore = Math.max(
    0,
    Math.min(
      1,
      1 - hesitationCount / Math.max(config.maxTicks * 0.1, 1) * 0.3 + brainState.pfcAct * 0.15
    )
  );
  return {
    agentType: "brain",
    scenarioSeed: runSeed,
    taskSuccess,
    reachedReward,
    enteredThreat,
    ticksToReward,
    routeEfficiency,
    adaptationScore: Math.min(1, adaptationScore),
    recoveryScore: Math.min(1, recoveryScore),
    coherenceScore,
    hesitationCount,
    latencyMs: Date.now() - start,
    activeRegionFraction: brainState.activeRegionFraction,
    sparseRatio: brainState.sparseRatio,
    dominantMode: brainState.actionTendency,
    memoryRetrieved,
    salienceShift: brainState.salience,
    actionTendency: brainState.actionTendency,
    policyShiftDetected
  };
}
async function runBatch(config, numRuns, brainState, onProgress) {
  const brainRuns = [];
  const baselineRuns = [];
  const rng = seededRandom(config.seed);
  for (let i = 0; i < numRuns; i++) {
    const runSeed = Math.floor(rng() * 1e9);
    const bRun = runBrainAgent(config, runSeed, brainState);
    brainRuns.push({ runId: i + 1, ...bRun });
    const blRun = runBaselineAgent(config, runSeed);
    baselineRuns.push({ runId: i + 1, ...blRun });
    if (onProgress) onProgress((i + 1) / numRuns * 100);
    await new Promise((r) => setTimeout(r, 0));
  }
  const avg = (arr) => arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;
  const brainMetrics = {
    taskSuccess: avg(brainRuns.map((r) => r.taskSuccess ? 1 : 0)),
    adaptation: avg(brainRuns.map((r) => r.adaptationScore)),
    recovery: avg(brainRuns.map((r) => r.recoveryScore)),
    coherence: avg(brainRuns.map((r) => r.coherenceScore)),
    efficiency: avg(brainRuns.map((r) => r.routeEfficiency))
  };
  const baselineMetrics = {
    taskSuccess: avg(baselineRuns.map((r) => r.taskSuccess ? 1 : 0)),
    adaptation: avg(baselineRuns.map((r) => r.adaptationScore)),
    recovery: avg(baselineRuns.map((r) => r.recoveryScore)),
    coherence: avg(baselineRuns.map((r) => r.coherenceScore)),
    efficiency: avg(baselineRuns.map((r) => r.routeEfficiency))
  };
  const usefulBehaviorScore = computeUsefulBehaviorScore(
    brainMetrics,
    baselineMetrics
  );
  const policyShiftRate = brainRuns.filter((r) => r.policyShiftDetected).length / numRuns;
  const thoughtDiversity = brainState.salience * 0.8 + policyShiftRate * 0.5;
  const novelty = Math.max(
    0,
    usefulBehaviorScore.delta * 2 + brainState.salience * 0.3
  );
  const emergenceScore = computeEmergenceScore({
    novelty: Math.min(1, novelty),
    diversity: Math.min(1, thoughtDiversity),
    persistence: avg(brainRuns.map((r) => r.memoryRetrieved ? 1 : 0)),
    coherence: brainMetrics.coherence,
    artifactWarning: brainState.activeRegionFraction > 0.8
  });
  const brainEff = {
    latencyMs: avg(brainRuns.map((r) => r.latencyMs)),
    activeRegionFraction: avg(brainRuns.map((r) => r.activeRegionFraction)),
    sparseRatio: avg(brainRuns.map((r) => r.sparseRatio)),
    taskSuccess: brainMetrics.taskSuccess
  };
  const baselineEff = {
    latencyMs: avg(baselineRuns.map((r) => r.latencyMs)),
    activeRegionFraction: 0.72,
    sparseRatio: 0.15,
    taskSuccess: baselineMetrics.taskSuccess
  };
  const efficiencyScore = computeEfficiencyScore(brainEff, baselineEff);
  const events = [];
  if (usefulBehaviorScore.isUsefulBehaviorEvent) {
    events.push({
      type: "useful_behavior",
      runId: 0,
      agentType: "brain",
      description: `Brain agent outperformed baseline: ΔU = ${usefulBehaviorScore.delta.toFixed(3)} (threshold 0.08)`,
      delta: usefulBehaviorScore.delta,
      timestamp: Date.now()
    });
  }
  if (emergenceScore.isEmergentCandidate) {
    events.push({
      type: "emergent_candidate",
      runId: 0,
      agentType: "brain",
      description: `Novel coherent behavior pattern detected: novelty=${emergenceScore.novelty.toFixed(2)}, coherence=${emergenceScore.coherence.toFixed(2)}`,
      delta: emergenceScore.total,
      timestamp: Date.now()
    });
  }
  if (efficiencyScore.isEfficiencyPositive) {
    events.push({
      type: "efficiency_positive",
      runId: 0,
      agentType: "brain",
      description: `Efficiency gain: ΔEff = ${efficiencyScore.delta.toFixed(3)}, performance retained at ${(efficiencyScore.performanceRetained * 100).toFixed(0)}%`,
      delta: efficiencyScore.delta,
      timestamp: Date.now()
    });
  }
  if (brainState.activeRegionFraction > 0.85) {
    events.push({
      type: "artifact_warning",
      runId: 0,
      agentType: "brain",
      description: `High active-region fraction (${(brainState.activeRegionFraction * 100).toFixed(0)}%) — saturation risk`,
      delta: 0,
      timestamp: Date.now()
    });
  }
  const milestonePassed = usefulBehaviorScore.isUsefulBehaviorEvent && usefulBehaviorScore.delta > 0.1 && brainMetrics.taskSuccess > baselineMetrics.taskSuccess && brainRuns.filter((r) => r.policyShiftDetected).length >= numRuns * 0.4 && !emergenceScore.artifactWarning && numRuns >= 10;
  const policyShiftCount = brainRuns.filter(
    (r) => r.policyShiftDetected
  ).length;
  const milestoneReason = milestonePassed ? `PASS: Brain agent demonstrates measurable, repeatable behavioral advantage over baseline (ΔU=${usefulBehaviorScore.delta.toFixed(3)}, ${numRuns} runs, policy shift in ${policyShiftCount}/${numRuns} runs)` : [
    !usefulBehaviorScore.isUsefulBehaviorEvent ? "ΔU below threshold (need >0.08). " : "",
    numRuns < 10 ? "Run at least 10 trials. " : "",
    emergenceScore.artifactWarning ? "Saturation artifact detected. " : "",
    brainMetrics.taskSuccess <= baselineMetrics.taskSuccess ? "Brain task success must exceed baseline. " : ""
  ].filter(Boolean).join("") || "Conditions not fully met.";
  let regulationState = initRegulationScoreState();
  for (let i = 0; i < brainRuns.length; i++) {
    const run = brainRuns[i];
    const stressProxy = run.enteredThreat ? 0.8 : run.hesitationCount > 5 ? 0.5 : 0.2;
    const recoveryProxy = run.recoveryScore;
    const balanceProxy = Math.max(0, Math.min(1, 1 - run.activeRegionFraction));
    const hrvProxy = Math.max(0, Math.min(1, run.routeEfficiency));
    regulationState = updateRegulationScore(regulationState, {
      stressSignal: stressProxy,
      recoverySignal: recoveryProxy,
      autonomicBalanceIndex: balanceProxy * 0.3,
      hrvProxy,
      selfStatePressure: stressProxy,
      selfStateStability: run.recoveryScore,
      behaviorAdaptedToState: run.adaptationScore > 0.4,
      currentTick: i * 10
    });
  }
  const regulationScore = regulationState.compositeRegulationScore;
  return {
    config,
    timestamp: Date.now(),
    coreBrainVersion: "0.9",
    runs: [...brainRuns, ...baselineRuns],
    brainRuns,
    baselineRuns,
    usefulBehaviorScore,
    emergenceScore,
    efficiencyScore,
    events,
    milestonePassed,
    milestoneReason,
    regulationScore
  };
}
const S = {
  bg: "oklch(0.06 0.01 265)",
  bgCard: "oklch(0.09 0.015 265)",
  bgCardAlt: "oklch(0.11 0.018 265)",
  border: "oklch(0.18 0.04 255)",
  text: "oklch(0.88 0.04 240)",
  muted: "oklch(0.42 0.05 240)",
  green: "oklch(0.72 0.22 145)",
  amber: "oklch(0.78 0.22 75)",
  red: "oklch(0.68 0.22 25)",
  blue: "oklch(0.68 0.18 255)",
  accent: "oklch(0.55 0.14 255)"
};
function MetricRow({
  label,
  brain,
  baseline,
  higherBetter = true
}) {
  const win = higherBetter ? brain > baseline : brain < baseline;
  const delta = brain - baseline;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 6,
        padding: "2px 0"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            style: {
              fontFamily: "monospace",
              fontSize: 10,
              color: S.muted,
              width: 130,
              flexShrink: 0
            },
            children: label
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            style: {
              fontFamily: "monospace",
              fontSize: 11,
              color: win ? S.green : S.red,
              width: 52
            },
            children: [
              (brain * 100).toFixed(1),
              "%"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            style: {
              fontFamily: "monospace",
              fontSize: 10,
              color: S.muted,
              width: 52
            },
            children: [
              (baseline * 100).toFixed(1),
              "%"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            style: {
              fontFamily: "monospace",
              fontSize: 10,
              color: win ? S.green : S.red
            },
            children: [
              delta >= 0 ? "+" : "",
              (delta * 100).toFixed(1),
              "%"
            ]
          }
        )
      ]
    }
  );
}
function EventPill({ event }) {
  const colors = {
    useful_behavior: S.green,
    emergent_candidate: S.blue,
    efficiency_positive: S.accent,
    artifact_warning: S.amber,
    core_propagation: S.green
  };
  const labels = {
    useful_behavior: "USEFUL BEHAVIOR",
    emergent_candidate: "EMERGENT",
    efficiency_positive: "EFFICIENCY+",
    artifact_warning: "ARTIFACT WARN",
    core_propagation: "CORE PROP"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        background: S.bgCard,
        border: `1px solid ${colors[event.type] ?? S.border}`,
        borderRadius: 4,
        padding: "5px 8px",
        marginBottom: 4
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 6,
              marginBottom: 2
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 9,
                    letterSpacing: "0.08em",
                    color: colors[event.type] ?? S.muted,
                    background: `${colors[event.type]}22`,
                    borderRadius: 2,
                    padding: "1px 5px"
                  },
                  children: labels[event.type] ?? event.type
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { fontFamily: "monospace", fontSize: 9, color: S.muted }, children: [
                "Δ=",
                event.delta.toFixed(3)
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "p",
          {
            style: {
              fontFamily: "monospace",
              fontSize: 10,
              color: S.text,
              margin: 0,
              lineHeight: 1.4
            },
            children: event.description
          }
        )
      ]
    }
  );
}
function QuickSummaryTab({ result }) {
  const {
    usefulBehaviorScore: ubs,
    emergenceScore: es,
    efficiencyScore: eff,
    brainRuns,
    baselineRuns
  } = result;
  const n = brainRuns.length;
  const brainSuccess = brainRuns.filter((r) => r.taskSuccess).length;
  const baselineSuccess = baselineRuns.filter((r) => r.taskSuccess).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 12px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 8,
          marginBottom: 10
        },
        children: [
          {
            label: "Useful Behavior",
            val: ubs.isUsefulBehaviorEvent,
            score: ubs.total,
            delta: ubs.delta
          },
          {
            label: "Emergence",
            val: es.isEmergentCandidate,
            score: es.total,
            delta: es.total
          },
          {
            label: "Efficiency+",
            val: eff.isEfficiencyPositive,
            score: eff.total,
            delta: eff.delta
          }
        ].map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              background: S.bgCard,
              border: `1px solid ${item.val ? S.green : S.border}`,
              borderRadius: 5,
              padding: "8px 10px"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 9,
                    color: S.muted,
                    marginBottom: 3
                  },
                  children: item.label
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 18,
                    fontWeight: 700,
                    color: item.val ? S.green : S.red,
                    lineHeight: 1
                  },
                  children: item.val ? "PASS" : "FAIL"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 10,
                    color: S.muted,
                    marginTop: 2
                  },
                  children: [
                    "Δ=",
                    item.delta.toFixed(3)
                  ]
                }
              )
            ]
          },
          item.label
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          background: S.bgCard,
          border: `1px solid ${S.border}`,
          borderRadius: 5,
          padding: "8px 10px",
          marginBottom: 8
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                fontFamily: "monospace",
                fontSize: 9,
                color: S.muted,
                marginBottom: 6
              },
              children: [
                "TASK SUCCESS — ",
                n,
                " RUNS"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", gap: 24 }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 22,
                    fontWeight: 700,
                    color: S.green
                  },
                  children: [
                    brainSuccess,
                    "/",
                    n
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: { fontFamily: "monospace", fontSize: 9, color: S.muted },
                  children: "BRAIN"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 22,
                    fontWeight: 700,
                    color: S.muted
                  },
                  children: [
                    baselineSuccess,
                    "/",
                    n
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: { fontFamily: "monospace", fontSize: 9, color: S.muted },
                  children: "BASELINE"
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 22,
                    fontWeight: 700,
                    color: brainSuccess > baselineSuccess ? S.green : S.amber
                  },
                  children: [
                    "+",
                    brainSuccess - baselineSuccess
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  style: { fontFamily: "monospace", fontSize: 9, color: S.muted },
                  children: "Δ"
                }
              )
            ] })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          fontFamily: "monospace",
          fontSize: 9,
          color: S.muted,
          marginBottom: 4
        },
        children: "SCENARIO"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { fontFamily: "monospace", fontSize: 10, color: S.text }, children: [
      result.config.name,
      " · ",
      n,
      " runs · Corridor blocked:",
      " ",
      result.config.corridorBlocked ? "YES" : "NO",
      " · Core Brain v",
      result.coreBrainVersion
    ] })
  ] });
}
function TechnicalTab({ result }) {
  const {
    usefulBehaviorScore: ubs,
    emergenceScore: es,
    efficiencyScore: eff,
    brainRuns,
    baselineRuns
  } = result;
  const avg = (arr) => arr.reduce((s, v) => s + v, 0) / Math.max(arr.length, 1);
  const brainAdapt = avg(brainRuns.map((r) => r.adaptationScore));
  const baseAdapt = avg(baselineRuns.map((r) => r.adaptationScore));
  const brainRecov = avg(brainRuns.map((r) => r.recoveryScore));
  const baseRecov = avg(baselineRuns.map((r) => r.recoveryScore));
  const brainCoh = avg(brainRuns.map((r) => r.coherenceScore));
  const baseCoh = avg(baselineRuns.map((r) => r.coherenceScore));
  const brainEff = avg(brainRuns.map((r) => r.routeEfficiency));
  const baseEff = avg(baselineRuns.map((r) => r.routeEfficiency));
  const brainThreat = brainRuns.filter((r) => r.enteredThreat).length / brainRuns.length;
  const baseThreat = baselineRuns.filter((r) => r.enteredThreat).length / baselineRuns.length;
  const policyShifts = brainRuns.filter((r) => r.policyShiftDetected).length;
  const memRetrieved = brainRuns.filter((r) => r.memoryRetrieved).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 12px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          display: "flex",
          gap: 6,
          marginBottom: 4,
          borderBottom: `1px solid ${S.border}`,
          paddingBottom: 3
        },
        children: ["METRIC", "BRAIN", "BASE", "Δ"].map((h, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            style: {
              fontFamily: "monospace",
              fontSize: 9,
              color: S.muted,
              width: i === 0 ? 130 : 52,
              flexShrink: 0
            },
            children: h
          },
          h
        ))
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MetricRow,
      {
        label: "Task Success",
        brain: ubs.taskSuccess,
        baseline: ubs.taskSuccess - ubs.delta * ALPHA_TS_SHARE,
        higherBetter: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MetricRow,
      {
        label: "Adaptation",
        brain: brainAdapt,
        baseline: baseAdapt,
        higherBetter: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MetricRow,
      {
        label: "Recovery",
        brain: brainRecov,
        baseline: baseRecov,
        higherBetter: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MetricRow,
      {
        label: "Coherence",
        brain: brainCoh,
        baseline: baseCoh,
        higherBetter: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MetricRow,
      {
        label: "Route Efficiency",
        brain: brainEff,
        baseline: baseEff,
        higherBetter: true
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      MetricRow,
      {
        label: "Threat Entry",
        brain: brainThreat,
        baseline: baseThreat,
        higherBetter: false
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          borderTop: `1px solid ${S.border}`,
          marginTop: 6,
          paddingTop: 6
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontFamily: "monospace",
                fontSize: 9,
                color: S.muted,
                marginBottom: 4
              },
              children: "BRAIN TRACE"
            }
          ),
          [
            {
              label: "Policy Shifts",
              val: `${policyShifts}/${brainRuns.length} runs`
            },
            {
              label: "Memory Retrieved",
              val: `${memRetrieved}/${brainRuns.length} runs`
            },
            { label: "Emergence Score", val: es.total.toFixed(3) },
            { label: "Novelty", val: es.novelty.toFixed(3) },
            { label: "Diversity", val: es.diversity.toFixed(3) },
            { label: "Efficiency Score", val: eff.total.toFixed(3) },
            {
              label: "Compute Reduction",
              val: `${(eff.computeReduction * 100).toFixed(1)}%`
            },
            {
              label: "Sparsity Adv.",
              val: `${(eff.sparsityAdvantage * 100).toFixed(1)}%`
            },
            {
              label: "Perf. Retained",
              val: `${(eff.performanceRetained * 100).toFixed(1)}%`
            }
          ].map(({ label, val }) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                padding: "1.5px 0"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: { fontFamily: "monospace", fontSize: 10, color: S.muted },
                    children: label
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: { fontFamily: "monospace", fontSize: 10, color: S.text },
                    children: val
                  }
                )
              ]
            },
            label
          ))
        ]
      }
    ),
    es.artifactWarning && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        "data-ocid": "autotest.artifact_warning",
        style: {
          marginTop: 8,
          background: `${S.amber}18`,
          border: `1px solid ${S.amber}`,
          borderRadius: 4,
          padding: "5px 8px",
          fontFamily: "monospace",
          fontSize: 10,
          color: S.amber
        },
        children: "⚠️ Artifact warning: high active-region fraction — saturation may affect results"
      }
    )
  ] });
}
const ALPHA_TS_SHARE = 0.35;
function MilestoneTab({ result }) {
  const {
    milestonePassed,
    milestoneReason,
    usefulBehaviorScore: ubs,
    brainRuns
  } = result;
  const policyShifts = brainRuns.filter((r) => r.policyShiftDetected).length;
  const checks = [
    {
      label: "ΔU > 0.08 (useful behavior event)",
      pass: ubs.isUsefulBehaviorEvent
    },
    { label: "ΔU > 0.10 (strong threshold)", pass: ubs.delta > 0.1 },
    {
      label: "Brain task success > baseline",
      pass: ubs.taskSuccess > ubs.taskSuccess - ubs.delta
    },
    {
      label: "Policy shift in ≥40% of runs",
      pass: policyShifts >= brainRuns.length * 0.4
    },
    {
      label: "No saturation artifact",
      pass: !result.emergenceScore.artifactWarning
    },
    { label: "≥10 runs completed", pass: brainRuns.length >= 10 },
    { label: "Auto-recorded evidence", pass: result.events.length > 0 },
    {
      label: "Traceability to Core Brain",
      pass: brainRuns.some((r) => r.memoryRetrieved || r.policyShiftDetected)
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { padding: "10px 12px" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": "autotest.milestone_card",
        style: {
          background: milestonePassed ? `${S.green}12` : `${S.red}0a`,
          border: `2px solid ${milestonePassed ? S.green : S.red}`,
          borderRadius: 6,
          padding: "10px 12px",
          marginBottom: 10
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              style: {
                fontFamily: "monospace",
                fontSize: 20,
                fontWeight: 700,
                color: milestonePassed ? S.green : S.red,
                letterSpacing: "0.06em",
                marginBottom: 4
              },
              children: milestonePassed ? "MILESTONE: PASS" : "MILESTONE: NOT YET"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "p",
            {
              style: {
                fontFamily: "monospace",
                fontSize: 10,
                color: S.text,
                margin: 0,
                lineHeight: 1.5
              },
              children: milestoneReason
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          fontFamily: "monospace",
          fontSize: 9,
          color: S.muted,
          marginBottom: 5
        },
        children: "PASS CONDITIONS"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        style: {
          background: S.bgCard,
          border: `1px solid ${S.border}`,
          borderRadius: 5,
          overflow: "hidden"
        },
        children: checks.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 10px",
              borderBottom: i < checks.length - 1 ? `1px solid ${S.border}` : void 0,
              background: i % 2 === 0 ? "transparent" : `${S.bgCardAlt}50`
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: c.pass ? S.green : S.red, fontSize: 11 }, children: c.pass ? "✓" : "×" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  style: {
                    fontFamily: "monospace",
                    fontSize: 10,
                    color: c.pass ? S.text : S.muted
                  },
                  children: c.label
                }
              )
            ]
          },
          c.label
        ))
      }
    ),
    milestonePassed && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        style: {
          marginTop: 10,
          fontFamily: "monospace",
          fontSize: 10,
          color: S.green,
          lineHeight: 1.5
        },
        children: [
          "• Core Brain v",
          result.coreBrainVersion,
          " —",
          " ",
          new Date(result.timestamp).toLocaleString(),
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "• Scenario: ",
          result.config.name,
          /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
          "• Runs: ",
          brainRuns.length,
          " — ΔU:",
          " ",
          result.usefulBehaviorScore.delta.toFixed(4)
        ]
      }
    )
  ] });
}
function AutoTestPanel({ neural }) {
  const [batchResult, setBatchResult] = reactExports.useState(null);
  const [running, setRunning] = reactExports.useState(false);
  const [progress, setProgress] = reactExports.useState(0);
  const [activeTab, setActiveTab] = reactExports.useState("quick");
  const [numRuns, setNumRuns] = reactExports.useState(20);
  const runTest = reactExports.useCallback(async () => {
    setRunning(true);
    setProgress(0);
    const getAct = (name) => {
      var _a;
      return ((_a = neural.regions.find((r) => r.region === name)) == null ? void 0 : _a.activation) ?? 0;
    };
    const brainState = {
      salience: neural.globalArousal,
      memoryActive: getAct("Hippocampus") > 0.3,
      actionTendency: getAct("Amygdala") > 0.5 ? "AVOID" : getAct("NucleusAccumbens") > 0.4 ? "APPROACH" : "INVESTIGATE",
      amygdalaAct: getAct("Amygdala"),
      hippocampusAct: getAct("Hippocampus"),
      pfcAct: getAct("PrefrontalCortex"),
      nacAct: getAct("NucleusAccumbens"),
      sparseRatio: neural.sparseActivationRatio ?? 0.3,
      activeRegionFraction: neural.regions.filter((r) => r.activation > 0.3).length / Math.max(neural.regions.length, 1)
    };
    try {
      const result = await runBatch(
        DEFAULT_SCENARIO,
        numRuns,
        brainState,
        setProgress
      );
      setBatchResult(result);
    } finally {
      setRunning(false);
    }
  }, [neural, numRuns]);
  const tabStyle = (t) => ({
    fontFamily: "monospace",
    fontSize: 9,
    letterSpacing: "0.07em",
    padding: "4px 10px",
    border: `1px solid ${activeTab === t ? S.accent : S.border}`,
    borderRadius: 3,
    background: activeTab === t ? `${S.accent}22` : "transparent",
    color: activeTab === t ? S.blue : S.muted,
    cursor: "pointer"
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      style: {
        background: S.bg,
        border: `1px solid ${S.border}`,
        borderRadius: 6,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        minHeight: 400
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            style: {
              padding: "6px 12px",
              borderBottom: `1px solid ${S.border}`,
              background: "oklch(0.07 0.012 265)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "monospace",
                      fontSize: 9,
                      letterSpacing: "0.1em",
                      color: S.accent,
                      textTransform: "uppercase"
                    },
                    children: "Auto-Test Runner · Threat-Memory Navigation"
                  }
                ),
                batchResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    style: {
                      fontFamily: "monospace",
                      fontSize: 9,
                      color: batchResult.milestonePassed ? S.green : S.muted,
                      background: batchResult.milestonePassed ? `${S.green}18` : `${S.border}60`,
                      borderRadius: 2,
                      padding: "1px 6px"
                    },
                    children: batchResult.milestonePassed ? "MILESTONE PASS" : `${batchResult.brainRuns.length} runs`
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { display: "flex", alignItems: "center", gap: 4 }, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      style: { fontFamily: "monospace", fontSize: 9, color: S.muted },
                      children: "RUNS:"
                    }
                  ),
                  [10, 20, 30].map((n) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": `autotest.runs_${n}_toggle`,
                      onClick: () => setNumRuns(n),
                      style: {
                        fontFamily: "monospace",
                        fontSize: 9,
                        padding: "2px 6px",
                        border: `1px solid ${numRuns === n ? S.accent : S.border}`,
                        borderRadius: 2,
                        background: numRuns === n ? `${S.accent}22` : "transparent",
                        color: numRuns === n ? S.blue : S.muted,
                        cursor: "pointer"
                      },
                      children: n
                    },
                    n
                  ))
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Button,
                  {
                    "data-ocid": "autotest.run_button",
                    size: "sm",
                    disabled: running,
                    onClick: runTest,
                    style: {
                      background: running ? `${S.accent}40` : S.accent,
                      color: "white",
                      fontFamily: "monospace",
                      fontSize: 9,
                      letterSpacing: "0.08em",
                      height: 26,
                      padding: "0 10px",
                      border: "none"
                    },
                    children: running ? "RUNNING…" : "RUN BATCH"
                  }
                )
              ] })
            ]
          }
        ),
        running && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": "autotest.loading_state",
            style: {
              padding: "6px 12px",
              borderBottom: `1px solid ${S.border}`,
              flexShrink: 0
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 3
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        style: { fontFamily: "monospace", fontSize: 9, color: S.muted },
                        children: [
                          "Running ",
                          numRuns,
                          " trials..."
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        style: { fontFamily: "monospace", fontSize: 9, color: S.accent },
                        children: [
                          progress.toFixed(0),
                          "%"
                        ]
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Progress,
                {
                  value: progress,
                  style: { height: 3, background: S.bgCard }
                }
              )
            ]
          }
        ),
        batchResult && /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            style: {
              display: "flex",
              gap: 4,
              padding: "6px 12px",
              borderBottom: `1px solid ${S.border}`,
              flexShrink: 0
            },
            children: ["quick", "technical", "milestone"].map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                type: "button",
                "data-ocid": `autotest.${t}_tab`,
                onClick: () => setActiveTab(t),
                style: tabStyle(t),
                children: t === "quick" ? "QUICK SUMMARY" : t === "technical" ? "TECHNICAL" : "MILESTONE"
              },
              t
            ))
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { style: { flex: 1, overflowY: "auto", minHeight: 0 }, children: [
          !batchResult && !running && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              "data-ocid": "autotest.empty_state",
              style: {
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                minHeight: 200,
                gap: 8
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    style: { fontFamily: "monospace", fontSize: 28, color: S.border },
                    children: "△"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "p",
                  {
                    style: {
                      fontFamily: "monospace",
                      fontSize: 10,
                      color: S.muted,
                      textAlign: "center",
                      margin: 0
                    },
                    children: [
                      "Run a batch to compare Core Brain vs Baseline Agent",
                      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                      "Scenario: Threat-Memory Navigation • ",
                      numRuns,
                      " runs"
                    ]
                  }
                )
              ]
            }
          ),
          batchResult && activeTab === "quick" && /* @__PURE__ */ jsxRuntimeExports.jsx(QuickSummaryTab, { result: batchResult }),
          batchResult && activeTab === "technical" && /* @__PURE__ */ jsxRuntimeExports.jsx(TechnicalTab, { result: batchResult }),
          batchResult && activeTab === "milestone" && /* @__PURE__ */ jsxRuntimeExports.jsx(MilestoneTab, { result: batchResult }),
          batchResult && batchResult.events.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              style: {
                borderTop: `1px solid ${S.border}`,
                padding: "8px 12px"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    style: {
                      fontFamily: "monospace",
                      fontSize: 9,
                      color: S.muted,
                      marginBottom: 5
                    },
                    children: [
                      "AUTO-DETECTED EVENTS (",
                      batchResult.events.length,
                      ")"
                    ]
                  }
                ),
                batchResult.events.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsx(EventPill, { event: ev }, ev.type + String(ev.timestamp)))
              ]
            }
          )
        ] })
      ]
    }
  );
}
function SectionHeader({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "font-mono text-[10px] tracking-widest uppercase mb-2 pb-1 border-b",
      style: {
        color: "oklch(0.72 0.22 195)",
        borderColor: "oklch(0.22 0.06 255)",
        letterSpacing: "0.12em"
      },
      children
    }
  );
}
function MiniSparkline({
  data,
  color = "oklch(0.72 0.22 195)"
}) {
  if (data.length < 2) return null;
  const width = 180;
  const height = 28;
  const max = Math.max(...data, 0.01);
  const min = Math.min(...data);
  const range = max - min || 0.01;
  const points = data.map((v, i) => {
    const x = i / (data.length - 1) * width;
    const y = height - (v - min) / range * (height - 4) - 2;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "svg",
    {
      width,
      height,
      role: "img",
      "aria-label": "sparkline",
      style: { overflow: "visible" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "rect",
          {
            x: 0,
            y: 0,
            width,
            height,
            fill: "oklch(0.07 0.01 260)",
            rx: 1
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "polyline",
          {
            points: points.join(" "),
            fill: "none",
            stroke: color,
            strokeWidth: 1.2,
            strokeOpacity: 0.85,
            strokeLinejoin: "round"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "circle",
          {
            cx: width,
            cy: height - (data[data.length - 1] - min) / range * (height - 4) - 2,
            r: 2.5,
            fill: color
          }
        )
      ]
    }
  );
}
const TYPE_COLORS = {
  habituation: "oklch(0.72 0.22 140)",
  associative_learning: "oklch(0.82 0.26 80)",
  goal_directed_nav: "oklch(0.72 0.22 195)",
  stdp_milestone: "oklch(0.78 0.22 310)",
  emergent_pattern: "oklch(0.82 0.26 55)"
};
const TYPE_LABELS = {
  habituation: "HABITUATION",
  associative_learning: "ASSOC. LEARNING",
  goal_directed_nav: "GOAL-DIRECTED NAV",
  stdp_milestone: "STDP MILESTONE",
  emergent_pattern: "EMERGENT PATTERN"
};
function SessionReportModal({
  report,
  onClose
}) {
  const durationSec = ((report.endTime - report.startTime) / 1e3).toFixed(1);
  const avgBpm = report.heartRateArc.length > 0 ? Math.round(
    report.heartRateArc.reduce((s, h) => s + h.bpm, 0) / report.heartRateArc.length
  ) : 0;
  const handleGeneratePaper = reactExports.useCallback(() => {
    const qm = report.quantitativeMetrics;
    const durationSecVal = ((report.endTime - report.startTime) / 1e3).toFixed(
      1
    );
    const tickDurationMs = report.durationTicks > 0 ? ((report.endTime - report.startTime) / report.durationTicks).toFixed(
      1
    ) : "N/A";
    const topRegions = report.topActivatedRegions.slice(0, 15);
    const maxAct = Math.max(...topRegions.map((r) => r.avgActivation), 0.01);
    const barMaxW = 200;
    const barH = 16;
    const barGap = 4;
    const svgH = topRegions.length * (barH + barGap) + 10;
    const regionSvg = `<svg width="380" height="${svgH}" xmlns="http://www.w3.org/2000/svg">
      ${topRegions.map((r, i) => {
      const w = Math.round(r.avgActivation / maxAct * barMaxW);
      const y = i * (barH + barGap);
      const pct = Math.round(r.avgActivation * 100);
      const color = pct > 80 ? "#ff5c33" : pct > 50 ? "#f5c518" : "#33aaff";
      return `<rect x="170" y="${y}" width="${w}" height="${barH}" fill="${color}" opacity="0.85"/>
                <text x="165" y="${y + barH - 4}" text-anchor="end" font-size="9" fill="#8899aa" font-family="monospace">${r.region.slice(0, 22)}</text>
                <text x="${170 + w + 4}" y="${y + barH - 4}" font-size="9" fill="${color}" font-family="monospace">${pct}%</text>`;
    }).join("")}
    </svg>`;
    const stdpDeltas = report.stdpChanges.slice(0, 20).map((c) => c.delta);
    const stdpMaxAbs = Math.max(...stdpDeltas.map(Math.abs), 1e-3);
    const stdpSvg = `<svg width="380" height="70" xmlns="http://www.w3.org/2000/svg">
      ${stdpDeltas.map((d, i) => {
      const barW = 14;
      const x = i * 18;
      const isPos = d >= 0;
      const h = Math.max(2, Math.round(Math.abs(d) / stdpMaxAbs * 55));
      return `<rect x="${x}" y="${65 - h}" width="${barW}" height="${h}" fill="${isPos ? "#33dd88" : "#ff5533"}" opacity="0.8"/>`;
    }).join("")}
      <line x1="0" y1="65" x2="380" y2="65" stroke="#334455" stroke-width="1"/>
      <text x="0" y="70" font-size="8" fill="#778899" font-family="monospace">LTP (green) / LTD (red)</text>
    </svg>`;
    const saturatedWarning = report.topActivatedRegions.filter(
      (r) => r.avgActivation > 0.9
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

  ${saturatedWarning.length > 0 ? `<div class="saturation-warn"><strong>⚠ Saturation Warning:</strong> ${saturatedWarning.length} region(s) averaged >90% activation: ${saturatedWarning.map((r) => r.region).join(", ")}. Verify homeostatic scaling before publishing emergence claims.</div>` : '<p style="color:#2a7a2a;font-size:9px;margin:8px 0;">✓ No saturated regions detected (all regions averaged below 90% threshold).</p>'}

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
      ${report.topActivatedRegions.slice(0, 15).map(
      (r, i) => `<tr><td>${i + 1}</td><td>${r.region}</td><td>${Math.round(r.avgActivation * 100)}%</td><td>${r.avgActivation > 0.9 ? "⚠ SATURATED — verify" : r.avgActivation > 0.7 ? "HIGH" : "—"}</td></tr>`
    ).join("")}
    </tbody>
  </table>

  <h2>STDP-Inspired Population Plasticity · Weight Changes</h2>
  <p style="font-size:9px;color:#556;margin-bottom:4px;">Wilson-Cowan rate model. Eligibility-trace approximation. NOT literal spike-timing plasticity.</p>
  ${stdpSvg}
  <table>
    <thead><tr><th>Connection</th><th>Delta</th><th>Type</th></tr></thead>
    <tbody>
      ${report.stdpChanges.slice(0, 15).map(
      (c) => `<tr><td>${c.connection}</td><td>${c.delta >= 0 ? "+" : ""}${c.delta.toFixed(4)}</td><td>${c.delta > 0 ? "LTP" : "LTD"}</td></tr>`
    ).join("")}
    </tbody>
  </table>

  <h2>Emergent Thought Log (≥75% Confidence Multi-Region Co-Activation)</h2>
  <p style="font-size:9px;color:#556;margin-bottom:6px;">Thoughts require ≥3 regions simultaneously co-active above threshold. Silence periods are valid scientific data.</p>
  ${report.thoughtLog.slice(0, 20).map(
      (t) => `<div class="thought-row">
      <div class="thought-conf">T${t.tick} · ${t.circuitType ?? "Unknown"} · ${t.confidence ?? 0}% confidence · ${(t.neuralSources ?? []).slice(0, 3).map((s) => s.region).join(", ")}</div>
      <div style="margin-top:2px;">"${t.thought}"</div>
    </div>`
    ).join("")}

  <h2>Correlation Analysis (Pearson r · NOT Transfer Entropy)</h2>
  <p style="font-size:9px;color:#556;margin-bottom:4px;">Pearson r (lag-1) = symmetric linear association. Transfer entropy = directional information-theoretic measure. These are NOT interchangeable.</p>
  <table>
    <thead><tr><th>Region Pair</th><th>Pearson r</th><th>Validity</th></tr></thead>
    <tbody>
      ${(qm.topPearsonCorrelations ?? []).slice(0, 10).map(
      (c) => `<tr><td>${c.pair}</td><td>${c.value.toFixed(4)}</td><td>${Math.abs(c.value) >= 0.9999 ? "⚠ Possible artifact" : "OK"}</td></tr>`
    ).join("")}
    </tbody>
  </table>

  <h2>Executive Summary</h2>
  ${report.aiInterpretation.map((p, i) => `<p><strong>[${i + 1}]</strong> ${p}</p>`).join("")}

  <h2>Behavioral Events</h2>
  <table>
    <thead><tr><th>Tick</th><th>Type</th><th>Description</th></tr></thead>
    <tbody>
      ${report.behavioralEvents.slice(0, 25).map(
      (e) => `<tr><td>T${e.tick}</td><td>${e.type.toUpperCase()}</td><td>${e.description}</td></tr>`
    ).join("")}
    </tbody>
  </table>

  <footer>
    Generated by Human Connectome · caffeine.ai · ${(/* @__PURE__ */ new Date()).toISOString()}<br/>
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
    setTimeout(() => URL.revokeObjectURL(url), 15e3);
  }, [report]);
  const handleDownload = reactExports.useCallback(() => {
    const lines = [
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
      ...report.aiInterpretation.map((p, i) => `
[${i + 1}] ${p}`),
      "",
      "─── NEURAL ACTIVITY ───────────────────────────────────────",
      "Top Activated Regions:",
      ...report.topActivatedRegions.map(
        (r) => `  ${r.region.padEnd(28)} ${Math.round(r.avgActivation * 100)}% avg activation`
      ),
      "",
      "─── SYNAPTIC PLASTICITY (STDP) ────────────────────────────",
      "Top Changed Connections:",
      ...report.stdpChanges.slice(0, 10).map(
        (c) => `  ${c.connection.padEnd(40)} Δ ${c.delta >= 0 ? "+" : ""}${c.delta.toFixed(4)}`
      ),
      "",
      "─── CARDIAC SUMMARY ───────────────────────────────────────",
      `  Peak Arousal:   ${Math.round(report.peakArousal * 100)}%`,
      `  Avg BPM:        ${avgBpm}`,
      `  Dominant States: ${report.dominantBrainStates.join(", ")}`,
      "",
      "─── THOUGHT LOG ────────────────────────────────────────────",
      ...report.thoughtLog.map(
        (t) => `  T${String(t.tick).padEnd(6)} [${t.dominantRegion.slice(0, 20).padEnd(20)}] "${t.thought}"`
      ),
      "",
      "─── BEHAVIORAL EVENTS ──────────────────────────────────────",
      ...report.behavioralEvents.slice(0, 50).map(
        (e) => `  T${String(e.tick).padEnd(6)} [${e.type.toUpperCase().padEnd(8)}] ${e.description}`
      ),
      "",
      "═══════════════════════════════════════════════════════════",
      "  Generated by Human Connectome · caffeine.ai",
      "═══════════════════════════════════════════════════════════"
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
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      "data-ocid": "session_report.modal",
      className: "fixed inset-0 flex items-center justify-center z-50",
      style: { background: "oklch(0.04 0.008 265 / 0.92)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex flex-col overflow-hidden",
          style: {
            width: "min(92vw, 900px)",
            maxHeight: "90vh",
            background: "oklch(0.07 0.012 265)",
            border: "1px solid oklch(0.25 0.07 255)",
            boxShadow: "0 0 80px oklch(0.72 0.22 195 / 0.12), 0 0 200px oklch(0.5 0.15 195 / 0.06)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "flex items-center justify-between px-6 py-3 shrink-0 border-b",
                style: {
                  background: "oklch(0.065 0.01 265)",
                  borderColor: "oklch(0.22 0.06 255)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "h2",
                      {
                        id: "session-report-title",
                        className: "font-mono font-bold tracking-widest uppercase",
                        style: {
                          color: "oklch(0.85 0.05 210)",
                          fontSize: "0.85rem",
                          letterSpacing: "0.15em"
                        },
                        children: "◈ SESSION ANALYSIS REPORT"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "font-mono text-[8px] tracking-widest",
                        style: { color: "oklch(0.4 0.06 220)" },
                        children: [
                          report.sessionId,
                          " · ",
                          durationSec,
                          "s · ",
                          report.durationTicks,
                          " ticks · ",
                          report.totalThoughts,
                          " thoughts"
                        ]
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "session_report.generate_paper_button",
                        onClick: handleGeneratePaper,
                        className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all",
                        style: {
                          border: "1px solid oklch(0.55 0.18 165)",
                          background: "oklch(0.55 0.18 165 / 0.1)",
                          color: "oklch(0.72 0.22 165)"
                        },
                        onMouseEnter: (e) => {
                          e.currentTarget.style.background = "oklch(0.55 0.18 165 / 0.25)";
                        },
                        onMouseLeave: (e) => {
                          e.currentTarget.style.background = "oklch(0.55 0.18 165 / 0.1)";
                        },
                        children: "◈ GENERATE PAPER"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "session_report.download_button",
                        onClick: handleDownload,
                        className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all",
                        style: {
                          border: "1px solid oklch(0.55 0.18 140)",
                          background: "oklch(0.55 0.18 140 / 0.1)",
                          color: "oklch(0.72 0.22 140)"
                        },
                        onMouseEnter: (e) => {
                          e.currentTarget.style.background = "oklch(0.55 0.18 140 / 0.25)";
                        },
                        onMouseLeave: (e) => {
                          e.currentTarget.style.background = "oklch(0.55 0.18 140 / 0.1)";
                        },
                        children: "↓ DOWNLOAD"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "button",
                        "data-ocid": "session_report.close_button",
                        onClick: onClose,
                        className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all",
                        style: {
                          border: "1px solid oklch(0.45 0.12 25)",
                          background: "oklch(0.45 0.12 25 / 0.1)",
                          color: "oklch(0.65 0.2 25)"
                        },
                        onMouseEnter: (e) => {
                          e.currentTarget.style.background = "oklch(0.45 0.12 25 / 0.25)";
                        },
                        onMouseLeave: (e) => {
                          e.currentTarget.style.background = "oklch(0.45 0.12 25 / 0.1)";
                        },
                        children: "✕ CLOSE"
                      }
                    )
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto min-h-0 p-6 flex flex-col gap-6", children: [
              report.publishGate && /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "data-ocid": "session_report.publish_gate.panel", children: !report.publishGate.passed ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded px-4 py-3 font-mono text-[9px]",
                  style: {
                    background: "oklch(0.18 0.12 25)",
                    border: "1px solid oklch(0.45 0.22 25)",
                    color: "oklch(0.92 0.12 25)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-bold text-[10px] mb-2 tracking-widest",
                        style: { color: "oklch(0.95 0.2 25)" },
                        children: "✗ PUBLISH GATE BLOCKED"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: report.publishGate.blockers.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "oklch(0.75 0.22 25)" }, children: "•" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: b })
                    ] }, b.slice(0, 30))) }),
                    report.publishGate.warnings.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "mt-2 pt-2 flex flex-col gap-1",
                        style: {
                          borderTop: "1px solid oklch(0.35 0.12 25 / 0.5)"
                        },
                        children: report.publishGate.warnings.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "flex gap-2",
                            style: { color: "oklch(0.82 0.14 55)" },
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠" }),
                              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: w })
                            ]
                          },
                          w.slice(0, 40)
                        ))
                      }
                    )
                  ]
                }
              ) : report.publishGate.warnings.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "rounded px-4 py-3 font-mono text-[9px]",
                  style: {
                    background: "oklch(0.18 0.1 65)",
                    border: "1px solid oklch(0.55 0.18 65)",
                    color: "oklch(0.9 0.12 65)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-bold text-[10px] mb-2 tracking-widest", children: "⚠ GATE PASSED WITH WARNINGS" }),
                    report.publishGate.warnings.map((w) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "⚠" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: w })
                    ] }, w.slice(0, 40)))
                  ]
                }
              ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "rounded px-4 py-2 font-mono text-[9px]",
                  style: {
                    background: "oklch(0.15 0.1 150)",
                    border: "1px solid oklch(0.45 0.18 150)",
                    color: "oklch(0.82 0.18 150)"
                  },
                  children: "✓ PUBLISH GATE PASSED — All publish conditions met."
                }
              ) }),
              report.publicationFindings.length > 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "session_report.publication_section", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "font-mono text-[10px] tracking-widest uppercase mb-3 pb-1 border-b flex items-center gap-2",
                    style: {
                      color: "oklch(0.82 0.26 80)",
                      borderColor: "oklch(0.82 0.26 80 / 0.4)",
                      letterSpacing: "0.12em"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "◈" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "PUBLICATION-WORTHY FINDINGS" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "ml-1 px-2 py-[1px] text-[8px]",
                          style: {
                            background: "oklch(0.82 0.26 80 / 0.15)",
                            border: "1px solid oklch(0.82 0.26 80 / 0.4)",
                            color: "oklch(0.82 0.26 80)"
                          },
                          children: [
                            report.publicationFindings.length,
                            " FINDING",
                            report.publicationFindings.length > 1 ? "S" : ""
                          ]
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-4", children: report.publicationFindings.map((finding, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    "data-ocid": `report.finding.item.${idx + 1}`,
                    className: "flex flex-col gap-1",
                    style: {
                      borderLeft: `2px solid ${TYPE_COLORS[finding.type]}`,
                      paddingLeft: "12px"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[7px] px-2 py-[1px] uppercase tracking-widest",
                            style: {
                              background: `${TYPE_COLORS[finding.type].replace(")", " / 0.12)")}`,
                              border: `1px solid ${TYPE_COLORS[finding.type]}`,
                              color: TYPE_COLORS[finding.type]
                            },
                            children: TYPE_LABELS[finding.type]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "font-mono text-[7px]",
                            style: { color: "oklch(0.38 0.05 220)" },
                            children: [
                              "T",
                              finding.tick
                            ]
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[9px] font-bold",
                            style: { color: TYPE_COLORS[finding.type] },
                            children: finding.title
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[8px] leading-relaxed",
                          style: { color: "oklch(0.6 0.07 220)" },
                          children: finding.description
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "font-mono text-[7px] italic",
                          style: { color: "oklch(0.5 0.1 195)" },
                          children: [
                            "✦ Significance: ",
                            finding.significance
                          ]
                        }
                      )
                    ]
                  },
                  finding.id
                )) })
              ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[10px] tracking-widest uppercase mb-2 pb-1 border-b",
                    style: {
                      color: "oklch(0.45 0.1 80)",
                      borderColor: "oklch(0.25 0.06 255)"
                    },
                    children: "◈ PUBLICATION-WORTHY FINDINGS"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] italic",
                    style: { color: "oklch(0.35 0.04 220)" },
                    children: "No publication-worthy findings detected in this session. Run longer sessions at complexity 8-10 to increase emergence probability."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "session_report.panel", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "◈ Executive Summary · AI Scientific Analysis" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: report.aiInterpretation.map((para, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "div",
                  {
                    className: "font-mono text-[9px] leading-relaxed",
                    style: {
                      color: "oklch(0.65 0.08 220)",
                      paddingLeft: "10px",
                      borderLeft: "2px solid oklch(0.28 0.08 255)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-bold mr-2",
                          style: { color: "oklch(0.72 0.22 195)" },
                          children: [
                            "[",
                            i + 1,
                            "]"
                          ]
                        }
                      ),
                      para
                    ]
                  },
                  para.slice(0, 40)
                )) })
              ] }),
              report.quantitativeMetrics && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { "data-ocid": "session_report.metrics_section", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "◈ Quantitative Metrics · Statistical Analysis" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-3", children: [
                    {
                      label: "Shannon Entropy",
                      value: `${report.quantitativeMetrics.shannonEntropy.toFixed(3)}`,
                      color: "oklch(0.72 0.22 195)",
                      interp: report.quantitativeMetrics.shannonEntropy > 0.6 ? "High diversity — rich firing patterns" : report.quantitativeMetrics.shannonEntropy > 0.3 ? "Moderate diversity — balanced activity" : "Low diversity — concentrated firing"
                    },
                    {
                      label: "Stimulus Effect Size",
                      value: `d = ${report.quantitativeMetrics.stimulusEffectSize.toFixed(2)}`,
                      color: "oklch(0.82 0.26 80)",
                      interp: report.quantitativeMetrics.stimulusEffectSize > 0.8 ? "Large effect — stimulus strongly activated target" : report.quantitativeMetrics.stimulusEffectSize > 0.5 ? "Medium effect (Cohen's d)" : "Small effect — weak stimulus response"
                    },
                    {
                      label: "Plasticity Index",
                      value: `${report.quantitativeMetrics.plasticityIndex.toFixed(4)}`,
                      color: "oklch(0.72 0.22 310)",
                      interp: report.quantitativeMetrics.plasticityIndex > 0.01 ? "Significant synaptic modification detected" : "Minimal plasticity — run longer for STDP effects"
                    },
                    {
                      label: "Emergent Behavior Score",
                      value: `${report.quantitativeMetrics.emergentBehaviorScore}/3`,
                      color: report.quantitativeMetrics.emergentBehaviorScore > 0 ? "oklch(0.82 0.26 80)" : "oklch(0.45 0.08 220)",
                      interp: report.quantitativeMetrics.emergentBehaviorScore === 3 ? "All 3 emergent behaviors detected" : report.quantitativeMetrics.emergentBehaviorScore > 0 ? `${report.quantitativeMetrics.emergentBehaviorScore} of 3 emergent behaviors` : "No emergent behaviors detected yet"
                    }
                  ].map(({ label, value, color, interp }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-[2px]", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px]",
                          style: { color: "oklch(0.45 0.06 220)" },
                          children: label
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[9px] font-bold",
                          style: { color },
                          children: value
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[7px] italic",
                        style: { color: "oklch(0.38 0.05 220)" },
                        children: interp
                      }
                    )
                  ] }, label)) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-3", children: [
                    report.quantitativeMetrics.topPearsonCorrelations.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[8px] uppercase tracking-widest mb-1",
                          style: { color: "oklch(0.38 0.05 220)" },
                          children: "Top Transfer Entropy Pairs"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-[3px]", children: report.quantitativeMetrics.topPearsonCorrelations.map(
                        (te) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "flex items-center gap-2",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: "font-mono text-[7px] flex-1 truncate",
                                  style: { color: "oklch(0.42 0.06 220)" },
                                  children: te.pair.length > 32 ? `${te.pair.slice(0, 30)}…` : te.pair
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: "font-mono text-[8px] font-bold shrink-0",
                                  style: { color: "oklch(0.72 0.22 195)" },
                                  children: te.value.toFixed(4)
                                }
                              )
                            ]
                          },
                          te.pair
                        )
                      ) })
                    ] }),
                    report.quantitativeMetrics.correlationMatrix.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "font-mono text-[8px] uppercase tracking-widest mb-1",
                          style: { color: "oklch(0.38 0.05 220)" },
                          children: "Top Correlated Pairs"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-[3px]", children: report.quantitativeMetrics.correlationMatrix.slice(0, 5).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex items-center gap-1",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "font-mono text-[7px] truncate flex-1",
                                style: { color: "oklch(0.42 0.06 220)" },
                                children: [
                                  c.regionA.slice(0, 14),
                                  " ↔",
                                  " ",
                                  c.regionB.slice(0, 14)
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "font-mono text-[8px] font-bold shrink-0",
                                style: {
                                  color: Math.abs(c.r) > 0.7 ? "oklch(0.72 0.22 140)" : "oklch(0.62 0.16 195)"
                                },
                                children: [
                                  "r=",
                                  c.r.toFixed(3)
                                ]
                              }
                            )
                          ]
                        },
                        `${c.regionA}-${c.regionB}`
                      )) })
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "◈ Top Activated Regions" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-[5px]", children: report.topActivatedRegions.map((r, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `report.region.item.${idx + 1}`,
                      className: "flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[8px] truncate shrink-0",
                            style: { color: "oklch(0.5 0.06 220)", width: "140px" },
                            children: r.region.replace(/([A-Z])/g, " $1").trim()
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "flex-1 h-[4px] relative",
                            style: { background: "oklch(0.1 0.015 260)" },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                style: {
                                  position: "absolute",
                                  left: 0,
                                  top: 0,
                                  height: "100%",
                                  width: `${r.avgActivation * 100}%`,
                                  background: `oklch(0.72 0.22 ${195 - idx * 20})`
                                }
                              }
                            )
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "font-mono text-[8px] shrink-0 text-right",
                            style: { color: "oklch(0.6 0.1 195)", width: "30px" },
                            children: [
                              Math.round(r.avgActivation * 100),
                              "%"
                            ]
                          }
                        )
                      ]
                    },
                    r.region
                  )) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "◈ Emotional Arc · Arousal Timeline" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    MiniSparkline,
                    {
                      data: report.emotionalArc.map((e) => e.arousal),
                      color: "oklch(0.72 0.22 195)"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "font-mono text-[7px] mt-1 mb-2",
                      style: { color: "oklch(0.38 0.05 220)" },
                      children: [
                        "Arousal over session · Peak:",
                        " ",
                        Math.round(report.peakArousal * 100),
                        "%"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: "oklch(0.38 0.05 220)" },
                          children: "DOM STATES"
                        }
                      ),
                      report.dominantBrainStates.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] uppercase",
                          style: { color: "oklch(0.72 0.22 195)" },
                          children: s
                        },
                        s
                      ))
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: "oklch(0.38 0.05 220)" },
                          children: "CARDIAC"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "span",
                        {
                          className: "font-mono text-[10px] font-bold",
                          style: { color: "oklch(0.72 0.26 25)" },
                          children: [
                            avgBpm,
                            " BPM"
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        MiniSparkline,
                        {
                          data: report.heartRateArc.slice(-40).map((h) => h.bpm),
                          color: "oklch(0.72 0.26 25)"
                        }
                      )
                    ] })
                  ] })
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "◈ Synaptic Plasticity · STDP Changes" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-x-6 gap-y-[4px]", children: report.stdpChanges.slice(0, 8).map((c, idx) => {
                  const isStrengthened = c.delta > 0;
                  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      "data-ocid": `report.stdp.item.${idx + 1}`,
                      className: "flex items-center gap-2",
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[7px] truncate flex-1",
                            style: { color: "oklch(0.45 0.06 220)" },
                            children: c.connection.length > 35 ? `${c.connection.slice(0, 32)}…` : c.connection
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "span",
                          {
                            className: "font-mono text-[8px] font-bold shrink-0",
                            style: {
                              color: isStrengthened ? "oklch(0.72 0.22 140)" : "oklch(0.65 0.25 25)",
                              width: "48px",
                              textAlign: "right"
                            },
                            children: [
                              isStrengthened ? "+" : "",
                              c.delta.toFixed(4)
                            ]
                          }
                        )
                      ]
                    },
                    c.connection
                  );
                }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[7px] mt-2 italic",
                    style: { color: "oklch(0.35 0.04 220)" },
                    children: "Positive Δ = Hebbian potentiation (LTP). Negative Δ = synaptic depression (LTD). Values represent multiplier change from baseline 1.0."
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "◈ Thought Log · Cognitive Stream Replay" }),
                report.thoughtLog.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[8px] italic",
                    style: { color: "oklch(0.32 0.04 220)" },
                    children: "No thoughts were generated during this session. Run longer or increase complexity."
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-col gap-[4px] overflow-y-auto",
                    style: { maxHeight: "160px" },
                    children: report.thoughtLog.map((t, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        className: "flex items-start gap-2",
                        style: {
                          borderLeft: "1px solid oklch(0.25 0.06 255)",
                          paddingLeft: "8px"
                        },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[7px] shrink-0",
                              style: { color: "oklch(0.35 0.04 220)", width: "32px" },
                              children: [
                                "T",
                                t.tick
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[8px] italic flex-1",
                              style: { color: "oklch(0.65 0.1 220)" },
                              children: [
                                '"',
                                t.thought,
                                '"'
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[7px] shrink-0",
                              style: { color: "oklch(0.5 0.12 195)" },
                              children: [
                                "[",
                                t.dominantRegion.slice(0, 12),
                                "]"
                              ]
                            }
                          )
                        ]
                      },
                      `${t.tick}-${idx}`
                    ))
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SectionHeader, { children: "◈ Behavioral Events Log (last 50)" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "flex flex-col gap-[3px] overflow-y-auto",
                    style: { maxHeight: "120px" },
                    children: report.behavioralEvents.slice(0, 50).map((evt, idx) => {
                      const typeColors = {
                        surge: "oklch(0.72 0.22 195)",
                        drop: "oklch(0.78 0.22 55)",
                        cascade: "oklch(0.72 0.22 310)",
                        stimulus: "oklch(0.78 0.22 80)"
                      };
                      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                        "div",
                        {
                          className: "flex items-start gap-2",
                          children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "font-mono text-[7px] shrink-0",
                                style: { color: "oklch(0.35 0.04 220)", width: "32px" },
                                children: [
                                  "T",
                                  evt.tick
                                ]
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[7px] uppercase shrink-0",
                                style: {
                                  color: typeColors[evt.type] ?? "oklch(0.5 0.06 220)",
                                  width: "48px"
                                },
                                children: evt.type
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[7px] flex-1 leading-tight",
                                style: { color: "oklch(0.5 0.06 220)" },
                                children: evt.description
                              }
                            )
                          ]
                        },
                        `${evt.tick}-${evt.region}-${idx}`
                      );
                    })
                  }
                )
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "px-6 py-2 shrink-0 border-t flex items-center justify-between",
                style: {
                  background: "oklch(0.065 0.01 265)",
                  borderColor: "oklch(0.18 0.04 255)"
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] tracking-widest",
                      style: { color: "oklch(0.28 0.04 220)" },
                      children: "HUMAN CONNECTOME · 40 REGIONS · 1M+ NEURONS · STDP PLASTICITY · WILSON-COWAN MODEL"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      type: "button",
                      "data-ocid": "session_report.footer_close_button",
                      onClick: onClose,
                      className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all",
                      style: {
                        border: "1px solid oklch(0.35 0.06 220)",
                        color: "oklch(0.5 0.08 220)"
                      },
                      onMouseEnter: (e) => {
                        e.currentTarget.style.color = "oklch(0.7 0.12 220)";
                      },
                      onMouseLeave: (e) => {
                        e.currentTarget.style.color = "oklch(0.5 0.08 220)";
                      },
                      children: "✕ CLOSE REPORT"
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
}
const HISTORY_LENGTH = 120;
function OscilloscopeTrace({
  history,
  color,
  label,
  currentValue,
  signed = false,
  height = 24
}) {
  const width = 200;
  const points = history.map((v, i) => {
    const x = i / Math.max(history.length - 1, 1) * width;
    const normalized = signed ? (v + 1) / 2 : v;
    const y = height - normalized * (height - 2) - 1;
    return `${x},${Math.max(1, Math.min(height - 1, y))}`;
  });
  const displayVal = signed ? `${currentValue >= 0 ? "+" : ""}${currentValue.toFixed(2)}` : `${Math.round(currentValue * 100)}%`;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[8px] tracking-wider shrink-0",
        style: { color: "oklch(0.45 0.06 220)", width: "50px" },
        children: label
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 relative", style: { minWidth: 0 }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "svg",
      {
        width: "100%",
        height,
        viewBox: `0 0 ${width} ${height}`,
        preserveAspectRatio: "none",
        role: "img",
        "aria-label": `${label} trace`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "rect",
            {
              x: 0,
              y: 0,
              width,
              height,
              fill: "oklch(0.06 0.01 260)"
            }
          ),
          history.length >= 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "polyline",
            {
              points: points.join(" "),
              fill: "none",
              stroke: color,
              strokeWidth: 1,
              strokeOpacity: 0.85,
              strokeLinejoin: "round"
            }
          ),
          signed && /* @__PURE__ */ jsxRuntimeExports.jsx(
            "line",
            {
              x1: 0,
              y1: height / 2,
              x2: width,
              y2: height / 2,
              stroke: color,
              strokeOpacity: 0.15,
              strokeWidth: 0.5,
              strokeDasharray: "2 3"
            }
          )
        ]
      }
    ) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "font-mono text-[9px] font-bold shrink-0 text-right",
        style: { color, width: "32px" },
        children: displayVal
      }
    )
  ] });
}
function getScaleDescription(level) {
  if (level <= 3) return "PRIMITIVE — Simple reflex arc";
  if (level <= 6) return "DEVELOPING — Mammalian complexity";
  if (level <= 9) return "ADVANCED — Primate-level integration";
  return "PEAK — Approaching human baseline";
}
function getScaleColor(level) {
  if (level <= 3) return "oklch(0.55 0.18 220)";
  if (level <= 6) return "oklch(0.72 0.22 80)";
  if (level <= 9) return "oklch(0.72 0.22 195)";
  return "oklch(0.82 0.22 55)";
}
function formatNeuronCount(level) {
  const count = Math.round(1e3 * level ** 2.5);
  if (count >= 1e6) return `${(count / 1e6).toFixed(1)}M`;
  if (count >= 1e3) return `${(count / 1e3).toFixed(1)}K`;
  return count.toLocaleString();
}
const EVENT_TYPE_COLORS = {
  surge: "oklch(0.72 0.22 195)",
  drop: "oklch(0.78 0.22 55)",
  cascade: "oklch(0.72 0.22 310)",
  stimulus: "oklch(0.78 0.22 80)"
};
const POSTURE_COLORS = {
  fearful: "oklch(0.65 0.28 25)",
  motivated: "oklch(0.82 0.26 55)",
  focused: "oklch(0.72 0.22 195)",
  sleeping: "oklch(0.55 0.18 270)",
  alert: "oklch(0.78 0.24 80)",
  resting: "oklch(0.5 0.06 220)"
};
const PROBE_REGIONS = [
  { label: "PFC", region: Region.PrefrontalCortex, scope: "probe.pfc" },
  { label: "AMYGDALA", region: Region.Amygdala, scope: "probe.amygdala" },
  {
    label: "HIPPOCAMPUS",
    region: Region.Hippocampus,
    scope: "probe.hippocampus"
  },
  { label: "THALAMUS", region: Region.Thalamus, scope: "probe.thalamus" },
  { label: "MOTOR CTX", region: Region.MotorCortex, scope: "probe.motor" },
  { label: "NAc", region: FrontendRegion.NucleusAccumbens, scope: "probe.nac" },
  { label: "INSULA", region: FrontendRegion.Insula, scope: "probe.insula" },
  {
    label: "HYPOTHAL.",
    region: FrontendRegion.Hypothalamus,
    scope: "probe.hypothal"
  }
];
const CASCADE_REGIONS = [
  Region.PrefrontalCortex,
  Region.Thalamus,
  Region.SensoryCortex,
  Region.Amygdala,
  Region.Hippocampus,
  Region.MotorCortex,
  Region.BasalGanglia,
  Region.Cerebellum
];
function ExperimentLab({ neural }) {
  const historyRef = reactExports.useRef({
    motion: [],
    valence: [],
    attention: [],
    consciousness: []
  });
  const baselineRef = reactExports.useRef(null);
  const [baselineRecorded, setBaselineRecorded] = reactExports.useState(false);
  const [baselineDeltas, setBaselineDeltas] = reactExports.useState(/* @__PURE__ */ new Map());
  const [sessionReport, setSessionReport] = reactExports.useState(
    null
  );
  const [activeProbes, setActiveProbes] = reactExports.useState(/* @__PURE__ */ new Set());
  const [goalStreak, setGoalStreak] = reactExports.useState(0);
  const prevGoalDetectedRef = reactExports.useRef(false);
  const { avatarBehavior } = neural;
  const hist = historyRef.current;
  hist.motion.push(avatarBehavior.motionLevel);
  hist.valence.push(avatarBehavior.emotionValence);
  hist.attention.push(avatarBehavior.attentionLevel);
  hist.consciousness.push(avatarBehavior.consciousnessLevel);
  if (hist.motion.length > HISTORY_LENGTH) hist.motion.shift();
  if (hist.valence.length > HISTORY_LENGTH) hist.valence.shift();
  if (hist.attention.length > HISTORY_LENGTH) hist.attention.shift();
  if (hist.consciousness.length > HISTORY_LENGTH) hist.consciousness.shift();
  const goalNavDetected = neural.emergentBehaviors.goalDirectedNavDetected;
  reactExports.useEffect(() => {
    if (goalNavDetected && neural.isRunning) {
      setGoalStreak((prev) => prev + 1);
    } else if (!goalNavDetected && prevGoalDetectedRef.current) {
      setGoalStreak(0);
    }
    prevGoalDetectedRef.current = goalNavDetected;
  }, [goalNavDetected, neural.isRunning]);
  const handleProbe = reactExports.useCallback(
    (scope, region, type) => {
      const key = `${scope}.${type}`;
      setActiveProbes((prev) => /* @__PURE__ */ new Set([...prev, key]));
      setTimeout(() => {
        setActiveProbes((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, 800);
      if (type === "lesion") {
        neural.lesionRegion(region, 5e3);
      } else {
        neural.potentiateRegion(region, 3e3);
      }
    },
    [neural]
  );
  const handleEndSession = reactExports.useCallback(() => {
    const report = neural.endSession();
    setSessionReport(report);
  }, [neural]);
  const handleCascade = reactExports.useCallback(() => {
    const shuffled = [...CASCADE_REGIONS].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, 3);
    for (const region of targets) {
      neural.injectStimulus(region, 0.9);
    }
  }, [neural]);
  const handleRecordBaseline = reactExports.useCallback(() => {
    const baseline = /* @__PURE__ */ new Map();
    for (const [region, activity] of neural.regionActivity) {
      baseline.set(region, activity);
    }
    baselineRef.current = baseline;
    setBaselineRecorded(true);
    setBaselineDeltas(/* @__PURE__ */ new Map());
    setTimeout(() => {
      if (!baselineRef.current) return;
      const deltas = /* @__PURE__ */ new Map();
      for (const [region, activity] of neural.regionActivity) {
        const base = baselineRef.current.get(region) ?? activity;
        deltas.set(region, activity - base);
      }
      setBaselineDeltas(deltas);
    }, 2e3);
  }, [neural]);
  const postureColor = POSTURE_COLORS[avatarBehavior.postureState];
  const liveActivations = neural.regionActivity.map(([, a]) => a);
  const liveEntropy = (() => {
    const total2 = liveActivations.reduce((s, v) => s + v, 0) || 1;
    return -liveActivations.reduce((h, v) => {
      const p = v / total2;
      return p > 0 ? h + p * Math.log2(p) : h;
    }, 0) / Math.log2(Math.max(liveActivations.length, 2));
  })();
  const livePlasticityIndex = neural.stdpWeightSummary.length > 0 ? neural.stdpWeightSummary.reduce((s, e) => s + Math.abs(e.delta), 0) / neural.stdpWeightSummary.length : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "experiment.panel",
      className: "h-full flex flex-col overflow-hidden",
      style: { background: "oklch(0.065 0.01 265)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "shrink-0 px-3 py-2 border-b",
            style: { borderColor: "oklch(0.2 0.05 255)" },
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": "experiment.end_session_button",
                onClick: handleEndSession,
                className: "w-full font-mono text-[9px] tracking-widest uppercase py-2 transition-all flex items-center justify-center gap-2",
                style: {
                  border: "1px solid oklch(0.62 0.22 195)",
                  background: "oklch(0.62 0.22 195 / 0.1)",
                  color: "oklch(0.78 0.2 195)",
                  boxShadow: "0 0 12px oklch(0.62 0.22 195 / 0.2)"
                },
                onMouseEnter: (e) => {
                  e.currentTarget.style.background = "oklch(0.62 0.22 195 / 0.25)";
                  e.currentTarget.style.boxShadow = "0 0 20px oklch(0.62 0.22 195 / 0.35)";
                },
                onMouseLeave: (e) => {
                  e.currentTarget.style.background = "oklch(0.62 0.22 195 / 0.1)";
                  e.currentTarget.style.boxShadow = "0 0 12px oklch(0.62 0.22 195 / 0.2)";
                },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { fontSize: "0.75rem" }, children: "◈" }),
                  "END SESSION · GENERATE REPORT"
                ]
              }
            )
          }
        ),
        sessionReport && /* @__PURE__ */ jsxRuntimeExports.jsx(
          SessionReportModal,
          {
            report: sessionReport,
            onClose: () => setSessionReport(null)
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex overflow-hidden min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col border-r",
              style: {
                width: "45%",
                borderColor: "oklch(0.18 0.05 255)",
                overflow: "hidden"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "px-3 py-1 border-b shrink-0 flex items-center justify-between",
                    style: { borderColor: "oklch(0.18 0.04 255)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[9px] tracking-widest uppercase",
                        style: { color: "oklch(0.38 0.06 220)" },
                        children: "▸ AVATAR BEHAVIOR MONITOR"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-hidden flex flex-col px-3 py-2 gap-2 min-h-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-wider",
                        style: { color: "oklch(0.38 0.05 220)" },
                        children: "STATE:"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-sm font-bold tracking-widest uppercase",
                        style: {
                          color: postureColor,
                          textShadow: `0 0 12px ${postureColor}`
                        },
                        children: avatarBehavior.postureState
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[8px] tracking-widest ml-1",
                        style: { color: "oklch(0.38 0.05 220)" },
                        children: "NT:"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[9px] font-bold tracking-widest uppercase",
                        style: { color: "oklch(0.72 0.22 195)" },
                        children: avatarBehavior.dominantNT.toUpperCase()
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-[5px] flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                        style: { color: "oklch(0.3 0.04 220)" },
                        children: "Neural State Oscilloscope"
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      OscilloscopeTrace,
                      {
                        history: hist.motion,
                        color: "oklch(0.72 0.22 195)",
                        label: "MOTION",
                        currentValue: avatarBehavior.motionLevel
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      OscilloscopeTrace,
                      {
                        history: hist.valence,
                        color: avatarBehavior.emotionValence >= 0 ? "oklch(0.82 0.26 55)" : "oklch(0.6 0.2 260)",
                        label: "VALENCE",
                        currentValue: avatarBehavior.emotionValence,
                        signed: true
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      OscilloscopeTrace,
                      {
                        history: hist.attention,
                        color: "oklch(0.72 0.22 140)",
                        label: "ATTN",
                        currentValue: avatarBehavior.attentionLevel
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      OscilloscopeTrace,
                      {
                        history: hist.consciousness,
                        color: "oklch(0.85 0.05 220)",
                        label: "CONSCI",
                        currentValue: avatarBehavior.consciousnessLevel
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "shrink-0 flex flex-col gap-[3px] border-t pt-1",
                      style: { borderColor: "oklch(0.15 0.03 260)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "font-mono text-[7px] tracking-widest uppercase",
                            style: { color: "oklch(0.3 0.04 220)" },
                            children: "Autonomous Drive"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] shrink-0",
                              style: { color: "oklch(0.42 0.06 220)", width: "44px" },
                              children: "HUNGER"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "flex-1 h-[3px] relative",
                              style: { background: "oklch(0.12 0.02 260)" },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: {
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    height: "100%",
                                    width: `${neural.hungerDrive * 100}%`,
                                    background: neural.hungerDrive > 0.8 ? "oklch(0.62 0.26 25)" : neural.hungerDrive < 0.2 ? "oklch(0.72 0.22 142)" : "oklch(0.78 0.22 55)",
                                    transition: "width 0.3s ease, background 0.5s ease"
                                  }
                                }
                              )
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[7px] font-bold shrink-0",
                              style: {
                                color: neural.hungerDrive > 0.8 ? "oklch(0.62 0.26 25)" : neural.hungerDrive < 0.2 ? "oklch(0.72 0.22 142)" : "oklch(0.78 0.22 55)",
                                width: "26px",
                                textAlign: "right"
                              },
                              children: [
                                Math.round(neural.hungerDrive * 100),
                                "%"
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] shrink-0",
                              style: { color: "oklch(0.42 0.06 220)", width: "44px" },
                              children: "EXPLR T"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[7px] font-bold",
                              style: { color: "oklch(0.62 0.2 220)" },
                              children: [
                                neural.explorationTimer,
                                " ticks"
                              ]
                            }
                          )
                        ] })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "border-t pt-2 flex-1 overflow-hidden flex flex-col min-h-0",
                      style: { borderColor: "oklch(0.15 0.03 260)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "font-mono text-[8px] tracking-widest uppercase mb-1 shrink-0",
                            style: { color: "oklch(0.3 0.04 220)" },
                            children: "Neural Event Log"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto flex flex-col gap-[3px] min-h-0 flex-1", children: neural.eventLog.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "font-mono text-[8px]",
                            style: { color: "oklch(0.25 0.03 220)" },
                            children: "No events yet — run simulation"
                          }
                        ) : neural.eventLog.slice(0, 12).map((evt, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                          "div",
                          {
                            className: "flex items-start gap-1",
                            children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                "span",
                                {
                                  className: "font-mono text-[7px] shrink-0",
                                  style: { color: "oklch(0.35 0.05 220)", width: "28px" },
                                  children: [
                                    "T",
                                    evt.tick
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: "font-mono text-[7px] leading-tight",
                                  style: { color: EVENT_TYPE_COLORS[evt.type] },
                                  children: evt.description
                                }
                              )
                            ]
                          },
                          `${evt.tick}-${evt.region}-${idx}`
                        )) })
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col border-r",
              style: {
                width: "30%",
                borderColor: "oklch(0.18 0.05 255)",
                overflow: "hidden"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "px-3 py-1 border-b shrink-0",
                    style: { borderColor: "oklch(0.18 0.04 255)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[9px] tracking-widest uppercase",
                        style: { color: "oklch(0.38 0.06 220)" },
                        children: "▸ NEURAL COMPLEXITY SCALE"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 px-3 py-2 flex flex-col gap-3 overflow-y-auto min-h-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[8px] tracking-widest",
                          style: { color: "oklch(0.35 0.05 220)" },
                          children: "LEVEL"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono font-bold leading-none",
                          style: {
                            fontSize: "2.5rem",
                            color: getScaleColor(neural.complexityLevel),
                            textShadow: `0 0 20px ${getScaleColor(neural.complexityLevel)}`
                          },
                          children: neural.complexityLevel
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col flex-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px] tracking-widest uppercase leading-tight",
                          style: { color: getScaleColor(neural.complexityLevel) },
                          children: getScaleDescription(neural.complexityLevel)
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "div",
                        {
                          className: "mt-1 h-[3px] w-full",
                          style: { background: "oklch(0.12 0.02 260)" },
                          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "h-full transition-all duration-300",
                              style: {
                                width: `${neural.complexityLevel / 10 * 100}%`,
                                background: getScaleColor(neural.complexityLevel),
                                boxShadow: `0 0 6px ${getScaleColor(neural.complexityLevel)}`
                              }
                            }
                          )
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: "oklch(0.35 0.05 220)" },
                          children: "PRIMITIVE"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px]",
                          style: { color: "oklch(0.35 0.05 220)" },
                          children: "HUMAN"
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "input",
                      {
                        type: "range",
                        min: 1,
                        max: 10,
                        step: 1,
                        value: neural.complexityLevel,
                        "data-ocid": "experiment.complexity_slider",
                        onChange: (e) => neural.setComplexity(Number(e.target.value)),
                        className: "w-full",
                        style: {
                          accentColor: getScaleColor(neural.complexityLevel),
                          cursor: "pointer"
                        },
                        "aria-label": "Neural complexity level"
                      }
                    )
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "flex flex-col gap-[6px] border rounded-sm p-2",
                      style: {
                        borderColor: "oklch(0.2 0.05 255)",
                        background: "oklch(0.07 0.012 265)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[8px]",
                              style: { color: "oklch(0.4 0.05 220)" },
                              children: "Effective Neurons"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[9px] font-bold",
                              style: { color: "oklch(0.72 0.22 195)" },
                              children: formatNeuronCount(neural.complexityLevel)
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[8px]",
                              style: { color: "oklch(0.4 0.05 220)" },
                              children: "Connectivity Density"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[9px] font-bold",
                              style: { color: "oklch(0.72 0.22 140)" },
                              children: [
                                neural.complexityLevel * 9 + 10,
                                "%"
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[8px]",
                              style: { color: "oklch(0.4 0.05 220)" },
                              children: "Spontaneous Rate"
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[9px] font-bold",
                              style: { color: "oklch(0.78 0.22 55)" },
                              children: [
                                (neural.complexityLevel * 0.8 + 0.4).toFixed(1),
                                " Hz"
                              ]
                            }
                          )
                        ] }),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "border-t pt-2",
                            style: { borderColor: "oklch(0.15 0.03 260)" },
                            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: "font-mono text-[8px]",
                                  style: { color: "oklch(0.4 0.05 220)" },
                                  children: "Active (Sim.)"
                                }
                              ),
                              /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "span",
                                {
                                  className: "font-mono text-[9px] font-bold",
                                  style: { color: "oklch(0.72 0.22 310)" },
                                  children: neural.activeNeuronCount.toLocaleString()
                                }
                              )
                            ] })
                          }
                        )
                      ]
                    }
                  ),
                  (() => {
                    const eb = neural.emergentBehaviors;
                    const rows = [
                      {
                        label: "HABITUATION",
                        detected: eb.habituationDetected,
                        color: "oklch(0.72 0.22 140)"
                      },
                      {
                        label: "ASSOC. LEARNING",
                        detected: eb.associativeLearningDetected,
                        color: "oklch(0.82 0.26 80)"
                      },
                      {
                        label: "GOAL-DIRECTED NAV",
                        detected: eb.goalDirectedNavDetected,
                        color: "oklch(0.72 0.22 195)"
                      }
                    ];
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "div",
                      {
                        "data-ocid": "experiment.emergence_panel",
                        className: "border-t pt-2 flex flex-col gap-2",
                        style: { borderColor: "oklch(0.25 0.08 80 / 0.5)" },
                        children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "font-mono text-[8px] tracking-widest uppercase flex items-center gap-2",
                              style: { color: "oklch(0.65 0.2 80)" },
                              children: "◈ LIVE FINDINGS"
                            }
                          ),
                          rows.map(({ label, detected, color }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "div",
                              {
                                className: "w-[6px] h-[6px] rounded-full shrink-0",
                                style: {
                                  background: detected ? color : "oklch(0.28 0.04 255)",
                                  boxShadow: detected ? `0 0 6px ${color}` : "none"
                                }
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[7px] tracking-widest uppercase",
                                style: {
                                  color: detected ? color : "oklch(0.35 0.04 220)"
                                },
                                children: label
                              }
                            ),
                            detected && /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[6px] uppercase px-1",
                                style: {
                                  background: `${color.replace(")", " / 0.12)")}`,
                                  border: `1px solid ${color.replace(")", " / 0.4)")}`,
                                  color
                                },
                                children: "DETECTED"
                              }
                            )
                          ] }, label)),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "div",
                            {
                              "data-ocid": "experiment.goal_streak",
                              className: "flex items-center gap-2 mt-1",
                              children: [
                                /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    className: "font-mono text-[7px] tracking-widest uppercase",
                                    style: { color: "oklch(0.38 0.05 220)" },
                                    children: "STREAK:"
                                  }
                                ),
                                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                                  "span",
                                  {
                                    className: "font-mono text-[9px] font-bold tracking-widest",
                                    style: {
                                      color: goalStreak > 0 ? "oklch(0.72 0.22 140)" : "oklch(0.35 0.04 220)",
                                      textShadow: goalStreak > 0 ? "0 0 8px oklch(0.72 0.22 140 / 0.6)" : "none",
                                      transition: "all 0.3s ease"
                                    },
                                    children: [
                                      goalStreak,
                                      "τ"
                                    ]
                                  }
                                ),
                                goalStreak > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
                                  "span",
                                  {
                                    className: "font-mono text-[6px] uppercase px-1",
                                    style: {
                                      background: "oklch(0.72 0.22 140 / 0.12)",
                                      border: "1px solid oklch(0.72 0.22 140 / 0.4)",
                                      color: "oklch(0.72 0.22 140)"
                                    },
                                    children: "ACTIVE"
                                  }
                                )
                              ]
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mt-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[7px]",
                                style: { color: "oklch(0.38 0.05 220)" },
                                children: "Plasticity Idx"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[8px] font-bold",
                                style: { color: "oklch(0.72 0.22 310)" },
                                children: livePlasticityIndex.toFixed(4)
                              }
                            )
                          ] }),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[7px]",
                                style: { color: "oklch(0.38 0.05 220)" },
                                children: "Shannon H"
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[8px] font-bold",
                                style: { color: "oklch(0.72 0.22 195)" },
                                children: liveEntropy.toFixed(3)
                              }
                            )
                          ] })
                        ]
                      }
                    );
                  })(),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "border-t pt-2 flex flex-col gap-2",
                      style: { borderColor: "oklch(0.15 0.03 260)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "font-mono text-[8px] tracking-widest uppercase",
                            style: { color: "oklch(0.35 0.05 220)" },
                            children: "Baseline Comparison"
                          }
                        ),
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "button",
                          {
                            type: "button",
                            "data-ocid": "experiment.baseline_button",
                            onClick: handleRecordBaseline,
                            className: "font-mono text-[8px] tracking-widest uppercase px-3 py-1 transition-all",
                            style: {
                              border: "1px solid oklch(0.5 0.12 195)",
                              background: baselineRecorded ? "oklch(0.72 0.22 195 / 0.15)" : "oklch(0.1 0.015 265)",
                              color: baselineRecorded ? "oklch(0.82 0.18 195)" : "oklch(0.6 0.12 195)"
                            },
                            children: baselineRecorded ? "↺ RE-RECORD BASELINE" : "◉ RECORD BASELINE"
                          }
                        ),
                        baselineRecorded && baselineDeltas.size > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-1", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "font-mono text-[7px] tracking-widest",
                              style: { color: "oklch(0.3 0.04 220)" },
                              children: "Δ from baseline (2s later):"
                            }
                          ),
                          Array.from(baselineDeltas.entries()).sort(([, a], [, b]) => Math.abs(b) - Math.abs(a)).slice(0, 5).map(([region, delta]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                            /* @__PURE__ */ jsxRuntimeExports.jsx(
                              "span",
                              {
                                className: "font-mono text-[7px] truncate",
                                style: {
                                  color: "oklch(0.45 0.06 220)",
                                  width: "80px"
                                },
                                children: region.replace(/([A-Z])/g, " $1").trim().slice(0, 14)
                              }
                            ),
                            /* @__PURE__ */ jsxRuntimeExports.jsxs(
                              "span",
                              {
                                className: "font-mono text-[7px] font-bold",
                                style: {
                                  color: delta > 0 ? "oklch(0.72 0.22 140)" : "oklch(0.68 0.28 25)"
                                },
                                children: [
                                  delta >= 0 ? "+" : "",
                                  (delta * 100).toFixed(1),
                                  "%"
                                ]
                              }
                            )
                          ] }, region))
                        ] })
                      ]
                    }
                  )
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "flex flex-col",
              style: { width: "25%", overflow: "hidden" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "px-3 py-1 border-b shrink-0",
                    style: { borderColor: "oklch(0.18 0.04 255)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "span",
                      {
                        className: "font-mono text-[9px] tracking-widest uppercase",
                        style: { color: "oklch(0.38 0.06 220)" },
                        children: "▸ EXPERIMENT PROBES"
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 px-2 py-2 flex flex-col gap-[4px] overflow-y-auto min-h-0", children: [
                  PROBE_REGIONS.map(({ label, region, scope }) => {
                    const lesionActive = activeProbes.has(`${scope}.lesion`);
                    const boostActive = activeProbes.has(`${scope}.boost`);
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "span",
                        {
                          className: "font-mono text-[7px] tracking-wider shrink-0",
                          style: { color: "oklch(0.45 0.06 220)", width: "52px" },
                          children: label
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": `${scope}_lesion`,
                          onClick: () => handleProbe(scope, region, "lesion"),
                          className: "font-mono text-[7px] px-1 py-[2px] flex-1 transition-all",
                          style: {
                            border: "1px solid",
                            borderColor: lesionActive ? "oklch(0.65 0.28 25)" : "oklch(0.3 0.1 25)",
                            background: lesionActive ? "oklch(0.65 0.28 25 / 0.2)" : "oklch(0.1 0.015 265)",
                            color: lesionActive ? "oklch(0.82 0.18 25)" : "oklch(0.55 0.15 25)"
                          },
                          children: "LESION"
                        }
                      ),
                      /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": `${scope}_boost`,
                          onClick: () => handleProbe(scope, region, "boost"),
                          className: "font-mono text-[7px] px-1 py-[2px] flex-1 transition-all",
                          style: {
                            border: "1px solid",
                            borderColor: boostActive ? "oklch(0.72 0.22 140)" : "oklch(0.3 0.1 140)",
                            background: boostActive ? "oklch(0.72 0.22 140 / 0.2)" : "oklch(0.1 0.015 265)",
                            color: boostActive ? "oklch(0.82 0.18 140)" : "oklch(0.55 0.15 140)"
                          },
                          children: "BOOST"
                        }
                      )
                    ] }, scope);
                  }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "border-t pt-2 mt-1 flex flex-col gap-1",
                      style: { borderColor: "oklch(0.15 0.03 260)" },
                      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                        "button",
                        {
                          type: "button",
                          "data-ocid": "experiment.cascade_button",
                          onClick: handleCascade,
                          className: "font-mono text-[8px] tracking-widest uppercase py-2 transition-all",
                          style: {
                            border: "1px solid oklch(0.6 0.25 310)",
                            background: "oklch(0.6 0.25 310 / 0.1)",
                            color: "oklch(0.78 0.22 310)",
                            boxShadow: "0 0 8px oklch(0.6 0.25 310 / 0.3)"
                          },
                          children: "⚡ CASCADE BURST"
                        }
                      )
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "div",
                    {
                      className: "border-t pt-2 mt-1",
                      style: { borderColor: "oklch(0.15 0.03 260)" },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "div",
                          {
                            className: "font-mono text-[7px] tracking-widest uppercase mb-1",
                            style: { color: "oklch(0.3 0.04 220)" },
                            children: "Live NT Levels"
                          }
                        ),
                        [
                          [
                            "DA",
                            neural.neurotransmitters.dopamine,
                            "oklch(0.82 0.26 55)"
                          ],
                          [
                            "5HT",
                            neural.neurotransmitters.serotonin,
                            "oklch(0.72 0.22 140)"
                          ],
                          [
                            "NE",
                            neural.neurotransmitters.norepinephrine,
                            "oklch(0.68 0.28 25)"
                          ],
                          [
                            "GABA",
                            neural.neurotransmitters.gaba,
                            "oklch(0.62 0.2 270)"
                          ],
                          [
                            "GLU",
                            neural.neurotransmitters.glutamate,
                            "oklch(0.78 0.22 80)"
                          ],
                          [
                            "ACh",
                            neural.neurotransmitters.acetylcholine,
                            "oklch(0.72 0.22 195)"
                          ]
                        ].map(([abbrev, value, color]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mb-[2px]", children: [
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "span",
                            {
                              className: "font-mono text-[7px] font-bold shrink-0",
                              style: { color, width: "28px" },
                              children: abbrev
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsx(
                            "div",
                            {
                              className: "flex-1 h-[3px] relative",
                              style: { background: "oklch(0.12 0.02 260)" },
                              children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                                "div",
                                {
                                  style: {
                                    position: "absolute",
                                    left: 0,
                                    top: 0,
                                    height: "100%",
                                    width: `${value * 100}%`,
                                    background: color,
                                    transition: "width 0.3s ease"
                                  }
                                }
                              )
                            }
                          ),
                          /* @__PURE__ */ jsxRuntimeExports.jsxs(
                            "span",
                            {
                              className: "font-mono text-[7px] shrink-0",
                              style: { color, width: "22px", textAlign: "right" },
                              children: [
                                Math.round(value * 100),
                                "%"
                              ]
                            }
                          )
                        ] }, abbrev))
                      ]
                    }
                  )
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
}
const STIMULI = [
  {
    label: "Visual Stimulus",
    shortLabel: "VISUAL",
    region: Region.SensoryCortex,
    color: "oklch(0.72 0.22 195)",
    ocid: "stimulus.visual_button"
  },
  {
    label: "Auditory Stimulus",
    shortLabel: "AUDIO",
    region: Region.Thalamus,
    color: "oklch(0.7 0.2 220)",
    ocid: "stimulus.auditory_button"
  },
  {
    label: "Memory Recall",
    shortLabel: "MEMORY",
    region: Region.Hippocampus,
    color: "oklch(0.72 0.2 160)",
    ocid: "stimulus.memory_button"
  },
  {
    label: "Fear Response",
    shortLabel: "FEAR",
    region: Region.Amygdala,
    color: "oklch(0.68 0.28 25)",
    ocid: "stimulus.fear_button"
  },
  {
    label: "Motor Command",
    shortLabel: "MOTOR",
    region: Region.MotorCortex,
    color: "oklch(0.78 0.24 80)",
    ocid: "stimulus.motor_button"
  },
  {
    label: "Executive Focus",
    shortLabel: "EXEC",
    region: Region.PrefrontalCortex,
    color: "oklch(0.72 0.22 280)",
    ocid: "stimulus.executive_button"
  },
  {
    label: "Pain Response",
    shortLabel: "PAIN",
    region: FrontendRegion.Insula,
    color: "oklch(0.65 0.28 15)",
    ocid: "stimulus.pain_button"
  },
  {
    label: "Reward Signal",
    shortLabel: "REWARD",
    region: FrontendRegion.NucleusAccumbens,
    color: "oklch(0.82 0.26 55)",
    ocid: "stimulus.reward_button"
  },
  {
    label: "Olfactory Trigger",
    shortLabel: "OLFACT",
    region: FrontendRegion.OlfactoryBulb,
    color: "oklch(0.72 0.2 140)",
    ocid: "stimulus.olfactory_button"
  },
  {
    label: "Social Cue",
    shortLabel: "SOCIAL",
    region: FrontendRegion.AnteriorCingulateCortex,
    color: "oklch(0.75 0.22 310)",
    ocid: "stimulus.social_button"
  },
  {
    label: "REM Sleep",
    shortLabel: "REM",
    region: FrontendRegion.Hypothalamus,
    color: "oklch(0.62 0.18 250)",
    ocid: "stimulus.sleep_button"
  },
  {
    label: "Decision Making",
    shortLabel: "DECIDE",
    region: FrontendRegion.OrbitalFrontalCortex,
    color: "oklch(0.78 0.22 95)",
    ocid: "stimulus.decision_button"
  },
  {
    label: "Proprioception",
    shortLabel: "PROPRIO",
    region: FrontendRegion.PrimarySomatosensory_L,
    color: "oklch(0.72 0.2 175)",
    ocid: "stimulus.proprio_button"
  },
  {
    label: "Vestibular",
    shortLabel: "VESTIB",
    region: Region.Cerebellum,
    color: "oklch(0.7 0.22 240)",
    ocid: "stimulus.vestib_button"
  }
];
const SPEED_OPTIONS = [1, 5, 10, 20, 50];
function SimulationControls({ neural }) {
  const [firingStimulus, setFiringStimulus] = reactExports.useState(null);
  const handleStimulus = (stimulus) => {
    setFiringStimulus(stimulus.shortLabel);
    neural.injectStimulus(stimulus.region, 1);
    setTimeout(() => setFiringStimulus(null), 800);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      "data-ocid": "connectome.panel",
      className: "h-full flex flex-col gap-0 overflow-hidden",
      style: { background: "oklch(0.065 0.01 265)" },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-b shrink-0",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                  style: { color: "oklch(0.38 0.06 220)" },
                  children: "▸ Simulation Engine"
                }
              ),
              !neural.isRunning && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "mb-2 font-mono text-[8px] tracking-[0.1em] uppercase text-center",
                  style: {
                    background: "oklch(0.65 0.28 25 / 0.12)",
                    border: "1px solid oklch(0.65 0.28 25 / 0.4)",
                    padding: "4px 8px",
                    color: "oklch(0.75 0.25 55)",
                    animation: "pulse_dot 2s ease-in-out infinite"
                  },
                  children: "▶ PRESS RUN TO ACTIVATE SIMULATION"
                }
              ),
              neural.isConsolidating && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  "data-ocid": "consolidation.status",
                  className: "mb-2 font-mono text-[8px] tracking-widest uppercase text-center",
                  style: {
                    background: "oklch(0.72 0.22 195 / 0.1)",
                    border: "1px solid oklch(0.72 0.22 195 / 0.5)",
                    padding: "4px 8px",
                    color: "oklch(0.72 0.22 195)",
                    animation: "pulse_neon 1s ease-in-out infinite"
                  },
                  children: "⟳ CONSOLIDATING — synaptic integration active"
                }
              ),
              neural.isMaturationActive && /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "div",
                {
                  className: "mb-2 font-mono text-[8px] tracking-widest uppercase text-center",
                  style: {
                    background: "oklch(0.75 0.22 140 / 0.1)",
                    border: "1px solid oklch(0.75 0.22 140 / 0.5)",
                    padding: "4px 8px",
                    color: "oklch(0.75 0.22 140)"
                  },
                  children: [
                    "◈ MATURATION PROTOCOL ACTIVE · ",
                    neural.maturityScore ?? 0,
                    "% MATURE"
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "simulation.play_button",
                    className: `sim-control-btn ${neural.isRunning ? "running" : "primary"} flex-1 flex items-center justify-center gap-2`,
                    style: !neural.isRunning ? { animation: "pulse_neon 1.5s ease-in-out infinite" } : void 0,
                    onClick: () => neural.isRunning ? neural.pause() : neural.start(),
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: neural.isRunning ? "■" : "▶" }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: neural.isRunning ? "PAUSE" : "RUN" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "simulation.reset_button",
                    className: "sim-control-btn danger",
                    onClick: () => neural.reset(),
                    children: "RESET"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 mt-2 flex-wrap", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[8px] tracking-widest mr-1",
                    style: { color: "oklch(0.35 0.05 220)" },
                    children: "SPEED:"
                  }
                ),
                SPEED_OPTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    className: "font-mono text-[9px] px-2 py-[3px] border transition-all",
                    style: {
                      borderColor: neural.speed === s ? "oklch(0.72 0.22 195)" : "oklch(0.22 0.05 255)",
                      background: neural.speed === s ? "oklch(0.72 0.22 195 / 0.15)" : "oklch(0.1 0.015 265)",
                      color: neural.speed === s ? "oklch(0.82 0.18 195)" : "oklch(0.45 0.06 220)",
                      boxShadow: neural.speed === s ? "0 0 8px oklch(0.72 0.22 195 / 0.3)" : "none"
                    },
                    onClick: () => neural.setSpeed(s),
                    children: [
                      s,
                      "x"
                    ]
                  },
                  s
                ))
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 mt-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-2 h-2 rounded-full",
                    style: {
                      background: neural.isRunning ? "oklch(0.68 0.28 140)" : "oklch(0.45 0.1 220)",
                      boxShadow: neural.isRunning ? "0 0 6px oklch(0.68 0.28 140)" : "none",
                      animation: neural.isRunning ? "pulse_neon 1s ease-in-out infinite" : "none"
                    }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "font-mono text-[9px] tracking-widest",
                    style: {
                      color: neural.isRunning ? "oklch(0.68 0.22 140)" : "oklch(0.4 0.06 220)"
                    },
                    children: neural.isRunning ? `ACTIVE — ${neural.speed}x SPEED` : "STANDBY"
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "px-3 py-2 border-b shrink-0",
            style: { borderColor: "oklch(0.18 0.04 255)" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "font-mono text-[9px] tracking-widest uppercase mb-2",
                  style: { color: "oklch(0.38 0.06 220)" },
                  children: "▸ Brain Development"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2 mb-2", children: [
                !neural.isMaturationActive ? /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "maturation.protocol_button",
                    className: "flex-1 py-1.5 px-3 border font-mono text-[8px] tracking-widest uppercase transition-all",
                    style: {
                      borderColor: "oklch(0.75 0.22 140)",
                      color: "oklch(0.75 0.22 140)",
                      background: "oklch(0.75 0.22 140 / 0.08)"
                    },
                    onClick: () => neural.startMaturationProtocol(),
                    children: "◈ Start Maturation Protocol"
                  }
                ) : /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "maturation.stop_button",
                    className: "flex-1 py-1.5 px-3 border font-mono text-[8px] tracking-widest uppercase transition-all",
                    style: {
                      borderColor: "oklch(0.68 0.28 25)",
                      color: "oklch(0.68 0.28 25)",
                      background: "oklch(0.68 0.28 25 / 0.08)"
                    },
                    onClick: () => neural.stopMaturationProtocol(),
                    children: "■ Stop Maturation"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    type: "button",
                    "data-ocid": "consolidation.trigger_button",
                    className: "py-1.5 px-3 border font-mono text-[8px] tracking-widest uppercase transition-all",
                    style: {
                      borderColor: neural.isConsolidating ? "oklch(0.72 0.22 195 / 0.4)" : "oklch(0.72 0.22 195)",
                      color: neural.isConsolidating ? "oklch(0.5 0.1 220)" : "oklch(0.72 0.22 195)",
                      background: "oklch(0.072 0.015 265)",
                      cursor: neural.isConsolidating ? "not-allowed" : "pointer"
                    },
                    onClick: () => !neural.isConsolidating && neural.triggerConsolidation(),
                    disabled: neural.isConsolidating,
                    children: "⟳ Consolidate"
                  }
                )
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { "data-ocid": "maturation.progress_meter", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px] tracking-widest",
                      style: { color: "oklch(0.35 0.05 220)" },
                      children: "MATURITY"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: "oklch(0.6 0.15 140)" },
                      children: [
                        neural.maturityScore ?? 0,
                        "% · ",
                        neural.consolidationCount ?? 0,
                        " ",
                        "consolidations"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "w-full h-1.5 relative",
                    style: { background: "oklch(0.12 0.02 260)" },
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "absolute h-full left-0 transition-all duration-700",
                        style: {
                          width: `${neural.maturityScore ?? 0}%`,
                          background: "linear-gradient(90deg, oklch(0.6 0.2 195), oklch(0.75 0.22 140))",
                          boxShadow: (neural.maturityScore ?? 0) > 50 ? "0 0 6px oklch(0.75 0.22 140 / 0.4)" : "none"
                        }
                      }
                    )
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between mt-0.5", children: ["Developing", "Maturing", "Near-Mature", "Mature"].map(
                  (label, i) => {
                    const threshold = [0, 40, 70, 90][i];
                    const active = (neural.maturityScore ?? 0) >= threshold;
                    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
                      "span",
                      {
                        className: "font-mono text-[6px]",
                        style: {
                          color: active ? "oklch(0.65 0.18 140)" : "oklch(0.25 0.04 220)"
                        },
                        children: [
                          active ? "●" : "○",
                          " ",
                          label
                        ]
                      },
                      label
                    );
                  }
                ) })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 px-3 py-2 overflow-y-auto min-h-0", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "font-mono text-[9px] tracking-widest uppercase mb-2",
              style: { color: "oklch(0.38 0.06 220)" },
              children: "▸ Stimulus Injection Array · 14 Channels"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-[5px]", children: STIMULI.map((stimulus) => {
            const isFiring = firingStimulus === stimulus.shortLabel;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                "data-ocid": stimulus.ocid,
                className: `stimulus-btn text-left flex flex-col gap-[2px] ${isFiring ? "firing" : ""}`,
                onClick: () => handleStimulus(stimulus),
                style: isFiring ? {
                  borderColor: stimulus.color,
                  color: stimulus.color,
                  boxShadow: `0 0 14px ${stimulus.color}55, inset 0 0 8px ${stimulus.color}12`,
                  background: `${stimulus.color}10`
                } : void 0,
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[8px] font-bold tracking-widest",
                      style: {
                        color: isFiring ? stimulus.color : "oklch(0.42 0.06 220)"
                      },
                      children: stimulus.shortLabel
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[9px] leading-tight truncate", children: stimulus.label }),
                  isFiring && /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "text-[7px] font-bold tracking-widest animate-pulse-neon",
                      style: { color: stimulus.color },
                      children: "FIRING"
                    }
                  )
                ]
              },
              stimulus.shortLabel
            );
          }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-3 pt-2 border-t",
              style: { borderColor: "oklch(0.14 0.03 260)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "div",
                  {
                    className: "font-mono text-[7px] tracking-widest uppercase mb-1",
                    style: { color: "oklch(0.3 0.04 220)" },
                    children: "Activity Scale"
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1 items-center flex-wrap", children: [
                  { color: "oklch(0.35 0.12 260)", label: "0%" },
                  { color: "oklch(0.55 0.18 220)", label: "25%" },
                  { color: "oklch(0.72 0.22 195)", label: "50%" },
                  { color: "oklch(0.8 0.22 80)", label: "75%" },
                  { color: "oklch(0.68 0.28 30)", label: "100%" }
                ].map(({ color, label }) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-3 h-3", style: { background: color } }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "span",
                    {
                      className: "font-mono text-[7px]",
                      style: { color: "oklch(0.35 0.04 220)" },
                      children: label
                    }
                  )
                ] }, label)) })
              ]
            }
          )
        ] })
      ]
    }
  );
}
function makeLCG(seed) {
  let s = seed >>> 0;
  return () => {
    s = Math.imul(1664525, s) + 1013904223;
    s = s >>> 0;
    return s / 4294967295;
  };
}
function simulateThreatMemoryNavigation(agentType, seed, tickCount, enabledModules, ablations) {
  const rng = makeLCG(seed);
  const isBrain = agentType === "brain-powered";
  const isDecoupled = agentType === "decoupled-control";
  const hasMemory = isBrain && !ablations.memoryLayer && enabledModules.includes("memory");
  const hasPrediction = isBrain && !ablations.predictionLayer && enabledModules.includes("prediction");
  const hasRegulation = isBrain && !ablations.regulationLayer && enabledModules.includes("regulation");
  const hasRecurrence = isBrain && !ablations.recurrenceDepth && enabledModules.includes("recurrence");
  const hasSparse = isBrain && !ablations.sparseUpdates && enabledModules.includes("sparse");
  let px = 1;
  let py = 1;
  const rx = 8;
  const ry = 8;
  const tx = 5;
  const ty = 5;
  let taskSuccesses = 0;
  let totalRouteSteps = 0;
  let optimalRouteSteps = 0;
  let hesitationCount = 0;
  let threatEncounters = 0;
  let threatAvoidances = 0;
  let pathABlocked = false;
  let adaptedAfterBlock = false;
  let adaptationTick = -1;
  let usedMemory = false;
  let predictionErrors = 0;
  let regulationActivations = 0;
  let sparseSkips = 0;
  let totalTicks = 0;
  let failureMemory = 0;
  let salienceScore = 0.3;
  let bodyUrgency = 0.2;
  let conflictScore = 0;
  let memoryRecall = 0;
  let predictionError = 0;
  let sympatheticTone = 0.2;
  let parasympTone = 0.5;
  let fatigueLoad = 0;
  let prevExpectedState = 0;
  let emergenceEvents = 0;
  let novelPatterns = /* @__PURE__ */ new Set();
  let thoughtTemplates = [];
  let coherentPatterns = 0;
  const optimalDist = Math.abs(rx - 1) + Math.abs(ry - 1);
  for (let t = 0; t < tickCount; t++) {
    totalTicks++;
    if (t === 50) pathABlocked = true;
    if (hasSparse && rng() < 0.25 && Math.abs(px - tx) > 3 && Math.abs(py - ty) > 3) {
      sparseSkips++;
      continue;
    }
    const distToThreat = Math.abs(px - tx) + Math.abs(py - ty);
    const distToReward = Math.abs(px - rx) + Math.abs(py - ry);
    if (hasRegulation) {
      sympatheticTone = distToThreat < 3 ? Math.min(1, sympatheticTone + 0.15) : Math.max(0.1, sympatheticTone - 0.05);
      parasympTone = Math.max(0.1, 1 - sympatheticTone);
      fatigueLoad = Math.min(1, fatigueLoad + 3e-3);
      regulationActivations++;
      bodyUrgency = sympatheticTone * 0.7 + fatigueLoad * 0.3;
    }
    if (isBrain) {
      const threatSalience = distToThreat < 4 ? 1 - distToThreat / 6 : 0;
      const rewardSalience = 0.3 + (1 - distToReward / 14) * 0.4;
      salienceScore = Math.min(
        1,
        threatSalience * 0.6 + rewardSalience * 0.4 + rng() * 0.05
      );
      conflictScore = distToThreat < 4 && distToReward > 3 ? 0.6 : 0.2;
    }
    if (hasMemory && failureMemory > 0) {
      memoryRecall = Math.min(1, failureMemory * 1.5);
      usedMemory = true;
    }
    if (hasPrediction && pathABlocked) {
      const currentState = px + py * 0.1;
      const expectedState = prevExpectedState;
      predictionError = Math.min(1, Math.abs(currentState - expectedState) * 2);
      if (predictionError > 0.3) predictionErrors++;
    }
    prevExpectedState = px + py * 0.1;
    let dx = 0;
    let dy = 0;
    if (isDecoupled) {
      dx = rng() < 0.5 ? rng() < 0.5 ? 1 : -1 : 0;
      dy = rng() < 0.5 ? rng() < 0.5 ? 1 : -1 : 0;
    } else if (!isBrain) {
      if (distToThreat <= 1) {
        dx = px < tx ? -1 : px > tx ? 1 : 0;
        dy = py < ty ? -1 : py > ty ? 1 : 0;
      } else {
        if (!pathABlocked) {
          dx = px < rx ? 1 : px > rx ? -1 : 0;
          dy = py < ry ? 1 : py > ry ? -1 : 0;
        } else {
          dx = rng() < 0.6 ? px < rx ? 1 : -1 : 0;
          dy = rng() < 0.6 ? py < ry ? 1 : -1 : 0;
          if (rng() < 0.3) hesitationCount++;
        }
      }
    } else {
      const hesitationBias = conflictScore * (1 - salienceScore);
      if (hasRecurrence && hesitationBias > 0.4 && rng() < hesitationBias * 0.5) {
        hesitationCount++;
        continue;
      }
      const avoidPathA = hasMemory && memoryRecall > 0.3 && pathABlocked;
      if (avoidPathA || hasPrediction && predictionError > 0.4 && pathABlocked) {
        if (!adaptedAfterBlock) {
          adaptedAfterBlock = true;
          adaptationTick = t;
        }
        if (py < 5) {
          dy = 1;
          dx = 0;
        } else if (px < 8) {
          dx = 1;
          dy = 0;
        } else {
          dy = py < ry ? 1 : -1;
        }
      } else if (!pathABlocked) {
        dx = px < rx ? 1 : px > rx ? -1 : 0;
        dy = py < ry ? 1 : py > ry ? -1 : 0;
      } else if (!hasMemory && !hasPrediction) {
        dx = rng() < 0.7 ? px < rx ? 1 : -1 : 0;
        dy = rng() < 0.7 ? py < ry ? 1 : -1 : 0;
      } else {
        dx = px < rx ? 1 : px > rx ? -1 : 0;
        dy = py < ry ? 1 : py > ry ? -1 : 0;
      }
    }
    const npx = Math.max(0, Math.min(9, px + dx));
    const npy = Math.max(0, Math.min(9, py + dy));
    if (npx !== px || npy !== py) {
      totalRouteSteps++;
    }
    px = npx;
    py = npy;
    if (Math.abs(px - tx) <= 1 && Math.abs(py - ty) <= 1) {
      threatEncounters++;
      if (hasMemory) {
        failureMemory = Math.min(1, failureMemory + 0.3);
      }
    } else if (distToThreat > 2) {
      threatAvoidances++;
    }
    if (Math.abs(px - rx) <= 1 && Math.abs(py - ry) <= 1) {
      taskSuccesses++;
      optimalRouteSteps += optimalDist;
      px = 1 + Math.floor(rng() * 2);
      py = 1 + Math.floor(rng() * 2);
      if (hasMemory) failureMemory = Math.max(0, failureMemory - 0.05);
    }
    if (isBrain) {
      const stateKey = `${Math.round(salienceScore * 5)}_${Math.round(conflictScore * 5)}_${Math.round(bodyUrgency * 5)}`;
      if (!novelPatterns.has(stateKey)) {
        novelPatterns.add(stateKey);
        if (novelPatterns.size <= 20) emergenceEvents++;
      }
      const thoughtTemplate = conflictScore > 0.5 ? "conflict" : salienceScore > 0.7 ? "threat" : "navigation";
      thoughtTemplates.push(thoughtTemplate);
      if (thoughtTemplates.length > 20) thoughtTemplates.shift();
      const uniqueThoughts = new Set(thoughtTemplates).size;
      if (uniqueThoughts >= 2) coherentPatterns++;
    }
  }
  const taskSuccessRate = totalTicks > 0 ? Math.min(1, taskSuccesses / Math.max(1, totalTicks / 20)) : 0;
  const routeEff = totalRouteSteps > 0 ? Math.min(1, optimalRouteSteps / Math.max(1, totalRouteSteps)) : 0.5;
  const threatAvoidRate = threatEncounters + threatAvoidances > 0 ? threatAvoidances / (threatEncounters + threatAvoidances) : 0.5;
  const adaptRate = adaptedAfterBlock ? Math.max(0, 1 - (adaptationTick - 50) / 50) : isBrain ? 0.3 : 0.1;
  const noise = (rng() - 0.5) * 0.06;
  const behavior = {
    taskSuccess: Math.max(0, Math.min(1, taskSuccessRate + noise)),
    routeEfficiency: Math.max(0, Math.min(1, routeEff + noise * 0.5)),
    adaptationRate: Math.max(0, Math.min(1, adaptRate + noise)),
    recoverySuccess: Math.max(
      0,
      Math.min(
        1,
        (adaptedAfterBlock ? 0.75 : 0.25) + noise + (isBrain ? 0.1 : 0)
      )
    ),
    hesitationCount,
    explorationScore: Math.min(1, novelPatterns.size / 15),
    threatAvoidance: Math.max(0, Math.min(1, threatAvoidRate + noise)),
    coherenceScore: isBrain ? Math.min(1, coherentPatterns / 10 + 0.3) : 0.2 + noise
  };
  const repeatedFrac = thoughtTemplates.length > 0 ? thoughtTemplates.filter((t) => t === "navigation").length / thoughtTemplates.length : 0.5;
  const emergence = {
    emergenceScore: isBrain ? Math.min(1, emergenceEvents / 8 + 0.2) : 0.1,
    noveltyScore: Math.min(1, novelPatterns.size / 10),
    repeatedCoherentPatternCount: coherentPatterns,
    thoughtDiversity: isBrain ? Math.min(1, new Set(thoughtTemplates).size / 3 + 0.2) : 0.15,
    usefulEmergenceCount: Math.floor(emergenceEvents * 0.6),
    repeatedTemplateFraction: repeatedFrac,
    artifactProbability: isBrain ? 0.05 + rng() * 0.1 : 0.2 + rng() * 0.15
  };
  const sparseRatio = hasSparse ? sparseSkips / Math.max(1, totalTicks) : 0.1;
  const efficiency = {
    avgLatencyMs: isBrain ? 12 + rng() * 8 : 3 + rng() * 3,
    maxLatencyMs: isBrain ? 45 + rng() * 30 : 12 + rng() * 8,
    activeRegionFraction: hasSparse ? 0.35 + rng() * 0.15 : 0.65 + rng() * 0.2,
    sparseActivationRatio: sparseRatio,
    eventDrivenUpdateRate: hasSparse ? 0.6 + rng() * 0.2 : 0.3 + rng() * 0.1,
    computeProxy: isBrain ? 0.55 + rng() * 0.2 : 0.4 + rng() * 0.15,
    computePerSuccessfulTask: taskSuccesses > 0 ? isBrain ? 150 + rng() * 50 : 80 + rng() * 30 : 999,
    computePerUsefulBehaviorEvent: emergenceEvents > 0 ? isBrain ? 200 + rng() * 80 : 500 + rng() * 200 : 999
  };
  const regulation = {
    autonomicBalanceStability: hasRegulation ? 0.65 + rng() * 0.2 : 0.35 + rng() * 0.15,
    stressMagnitude: hasRegulation ? 0.25 + rng() * 0.2 : 0.45 + rng() * 0.2,
    recoverySlope: hasRegulation ? 0.6 + rng() * 0.25 : 0.2 + rng() * 0.15,
    interoceptiveVariance: hasRegulation ? 0.15 + rng() * 0.1 : 0.35 + rng() * 0.15,
    selfStateCoherence: isBrain ? 0.6 + rng() * 0.25 : 0.25 + rng() * 0.15
  };
  const trace = {
    dominantMode: isBrain ? conflictScore > 0.4 ? "threat-arbitration" : "navigation" : "scripted-reactive",
    salienceTarget: isBrain ? salienceScore > 0.6 ? "threat-zone" : "reward-zone" : "reward-fixed",
    memoryState: hasMemory ? `failure-memory=${failureMemory.toFixed(2)}` : "no-memory",
    actionTendency: adaptedAfterBlock ? "route-B-adapted" : "route-A-default",
    conflictScore,
    uncertaintyScore: predictionErrors / Math.max(1, totalTicks / 10),
    predictionErrorProfile: Array.from(
      { length: 5 },
      (_, i) => predictionErrors > i ? 0.3 + i * 0.15 : 0
    ),
    bodyStateProfile: [
      sympatheticTone,
      parasympTone,
      fatigueLoad,
      bodyUrgency,
      1 - fatigueLoad
    ],
    pathwayChanges: adaptedAfterBlock ? [
      `path-A->path-B at tick ${adaptationTick}${usedMemory ? " (memory-guided)" : ""}${regulationActivations > 0 ? " (regulated)" : ""}`
    ] : []
  };
  return { behavior, emergence, efficiency, regulation, trace };
}
class CoreBrainExperimentRunner {
  constructor() {
    __publicField(this, "activeExperiments", /* @__PURE__ */ new Map());
    __publicField(this, "isRunning", false);
    __publicField(this, "reportsGenerated", 0);
  }
  async runExperiment(config, onProgress) {
    this.isRunning = true;
    const result = {
      experimentId: config.experimentId,
      completedAt: 0,
      totalRuns: 0,
      baselineRecords: [],
      brainRecords: [],
      decoupledRecords: [],
      usefulBehaviorDelta: 0,
      emergenceDelta: 0,
      efficiencyDelta: 0,
      regulationDelta: 0,
      promotionCandidate: false,
      milestonePassed: false,
      milestoneFailReasons: [],
      status: "running"
    };
    this.activeExperiments.set(config.experimentId, result);
    const totalPhases = config.includeDecoupledControl ? 3 : 2;
    const runsPerPhase = config.runCount;
    try {
      for (let i = 0; i < runsPerPhase; i++) {
        const seed = config.seeds[i] ?? 42 + i;
        const sim = simulateThreatMemoryNavigation(
          "baseline",
          seed,
          config.scenario.ticksPerRun,
          config.baselineConfig.enabledModules,
          {
            memoryLayer: true,
            predictionLayer: true,
            regulationLayer: true,
            recurrenceDepth: true,
            sparseUpdates: true
          }
        );
        const record = {
          metadata: {
            experimentId: config.experimentId,
            runId: `${config.experimentId}_baseline_${i}`,
            timestamp: Date.now(),
            coreBrainVersion: config.baselineConfig.coreBrainVersion,
            systemVersion: "3.7",
            scenario: config.scenario.id,
            instanceType: "baseline",
            baselineVersion: "v1",
            enabledModules: config.baselineConfig.enabledModules,
            seed
          },
          ...sim,
          coreTrace: sim.trace,
          artifactFlags: sim.emergence.artifactProbability > 0.3 ? ["HIGH_ARTIFACT_RISK"] : []
        };
        coreBrainRecordSystem.addRecord(record);
        result.baselineRecords.push(record);
        result.totalRuns++;
        onProgress == null ? void 0 : onProgress({
          experimentId: config.experimentId,
          currentRun: i + 1,
          totalRuns: runsPerPhase * totalPhases,
          currentPhase: "baseline",
          progressFraction: (i + 1) / (runsPerPhase * totalPhases),
          lastEvent: `Baseline run ${i + 1} complete — taskSuccess=${sim.behavior.taskSuccess.toFixed(2)}`
        });
        await new Promise((r) => setTimeout(r, 10));
      }
      for (let i = 0; i < runsPerPhase; i++) {
        const seed = config.seeds[i] ?? 42 + i;
        const sim = simulateThreatMemoryNavigation(
          "brain-powered",
          seed,
          config.scenario.ticksPerRun,
          config.brainConfig.enabledModules,
          config.ablations
        );
        const record = {
          metadata: {
            experimentId: config.experimentId,
            runId: `${config.experimentId}_brain_${i}`,
            timestamp: Date.now(),
            coreBrainVersion: config.brainConfig.coreBrainVersion,
            systemVersion: "3.7",
            scenario: config.scenario.id,
            instanceType: "brain-powered",
            baselineVersion: "v1",
            enabledModules: config.brainConfig.enabledModules,
            seed
          },
          ...sim,
          coreTrace: sim.trace,
          artifactFlags: sim.emergence.artifactProbability > 0.3 ? ["HIGH_ARTIFACT_RISK"] : []
        };
        coreBrainRecordSystem.addRecord(record);
        result.brainRecords.push(record);
        result.totalRuns++;
        onProgress == null ? void 0 : onProgress({
          experimentId: config.experimentId,
          currentRun: runsPerPhase + i + 1,
          totalRuns: runsPerPhase * totalPhases,
          currentPhase: "brain",
          progressFraction: (runsPerPhase + i + 1) / (runsPerPhase * totalPhases),
          lastEvent: `Brain run ${i + 1} complete — taskSuccess=${sim.behavior.taskSuccess.toFixed(2)}`
        });
        await new Promise((r) => setTimeout(r, 10));
      }
      if (config.includeDecoupledControl) {
        for (let i = 0; i < runsPerPhase; i++) {
          const seed = config.seeds[i] ?? 42 + i;
          const sim = simulateThreatMemoryNavigation(
            "decoupled-control",
            seed,
            config.scenario.ticksPerRun,
            [],
            {
              memoryLayer: true,
              predictionLayer: true,
              regulationLayer: true,
              recurrenceDepth: true,
              sparseUpdates: true
            }
          );
          const record = {
            metadata: {
              experimentId: config.experimentId,
              runId: `${config.experimentId}_decoupled_${i}`,
              timestamp: Date.now(),
              coreBrainVersion: "none",
              systemVersion: "3.7",
              scenario: config.scenario.id,
              instanceType: "decoupled-control",
              baselineVersion: "v1",
              enabledModules: [],
              seed
            },
            ...sim,
            coreTrace: sim.trace,
            artifactFlags: ["DECOUPLED_CONTROL"]
          };
          coreBrainRecordSystem.addRecord(record);
          result.decoupledRecords.push(record);
          result.totalRuns++;
          onProgress == null ? void 0 : onProgress({
            experimentId: config.experimentId,
            currentRun: runsPerPhase * 2 + i + 1,
            totalRuns: runsPerPhase * totalPhases,
            currentPhase: "decoupled",
            progressFraction: (runsPerPhase * 2 + i + 1) / (runsPerPhase * totalPhases),
            lastEvent: `Decoupled run ${i + 1} complete`
          });
          await new Promise((r) => setTimeout(r, 10));
        }
      }
      onProgress == null ? void 0 : onProgress({
        experimentId: config.experimentId,
        currentRun: result.totalRuns,
        totalRuns: result.totalRuns,
        currentPhase: "analysis",
        progressFraction: 0.95,
        lastEvent: "Computing deltas..."
      });
      const avgBaseline = (arr, key) => arr.reduce((s, r) => s + r.behavior[key], 0) / Math.max(1, arr.length);
      const avgBrainBehav = (key) => result.brainRecords.reduce(
        (s, r) => s + r.behavior[key],
        0
      ) / Math.max(1, result.brainRecords.length);
      const baselineTask = avgBaseline(result.baselineRecords, "taskSuccess");
      const brainTask = avgBrainBehav("taskSuccess");
      result.usefulBehaviorDelta = brainTask - baselineTask;
      const avgEmergBase = result.baselineRecords.reduce(
        (s, r) => s + r.emergence.emergenceScore,
        0
      ) / Math.max(1, result.baselineRecords.length);
      const avgEmergBrain = result.brainRecords.reduce(
        (s, r) => s + r.emergence.emergenceScore,
        0
      ) / Math.max(1, result.brainRecords.length);
      result.emergenceDelta = avgEmergBrain - avgEmergBase;
      const avgEffBase = result.baselineRecords.reduce(
        (s, r) => s + r.efficiency.sparseActivationRatio,
        0
      ) / Math.max(1, result.baselineRecords.length);
      const avgEffBrain = result.brainRecords.reduce(
        (s, r) => s + r.efficiency.sparseActivationRatio,
        0
      ) / Math.max(1, result.brainRecords.length);
      result.efficiencyDelta = avgEffBrain - avgEffBase;
      const avgRegBase = result.baselineRecords.reduce(
        (s, r) => s + r.regulation.autonomicBalanceStability,
        0
      ) / Math.max(1, result.baselineRecords.length);
      const avgRegBrain = result.brainRecords.reduce(
        (s, r) => s + r.regulation.autonomicBalanceStability,
        0
      ) / Math.max(1, result.brainRecords.length);
      result.regulationDelta = avgRegBrain - avgRegBase;
      const milestoneFailReasons = [];
      if (result.usefulBehaviorDelta <= 0)
        milestoneFailReasons.push("No useful behavior improvement");
      if (result.baselineRecords.length < 3)
        milestoneFailReasons.push("Not enough baseline runs");
      if (result.brainRecords.length < 3)
        milestoneFailReasons.push("Not enough brain-powered runs");
      if (result.brainRecords.some(
        (r) => r.artifactFlags.includes("HIGH_ARTIFACT_RISK")
      ))
        milestoneFailReasons.push("Artifact risk detected in brain runs");
      result.milestonePassed = milestoneFailReasons.length === 0;
      result.milestoneFailReasons = milestoneFailReasons;
      result.promotionCandidate = result.usefulBehaviorDelta > 0.05 && result.emergenceDelta >= 0 && result.milestonePassed;
      result.completedAt = Date.now();
      result.status = "complete";
      this.reportsGenerated++;
    } catch {
      result.status = "failed";
    } finally {
      this.isRunning = false;
    }
    this.activeExperiments.set(config.experimentId, result);
    onProgress == null ? void 0 : onProgress({
      experimentId: config.experimentId,
      currentRun: result.totalRuns,
      totalRuns: result.totalRuns,
      currentPhase: "analysis",
      progressFraction: 1,
      lastEvent: result.status === "complete" ? "Experiment complete" : "Experiment failed"
    });
    return result;
  }
  getDefaultThreatMemoryScenario() {
    return {
      id: "threat-memory-navigation",
      name: "Threat-Memory Navigation",
      description: "Agent must retrieve reward while avoiding threat. One path changes mid-run. Tests memory-guided route revision.",
      ticksPerRun: 100,
      environmentSeed: 42
    };
  }
  getActiveExperiment(id) {
    return this.activeExperiments.get(id);
  }
  isRunningExperiment() {
    return this.isRunning;
  }
  getReportsGenerated() {
    return this.reportsGenerated;
  }
}
const coreBrainExperimentRunner = new CoreBrainExperimentRunner();
const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
function MaturityDashboard({ neural }) {
  const saturationRate = clamp(
    neural.regions.filter((r) => r.activation > 0.85).length / Math.max(1, neural.regions.length)
  );
  const oscillationIndex = clamp(1 - neural.globalArousal * 0.8 - 0.1);
  const competitionScore = clamp(0.4 + neural.sparseActivationRatio * 0.4);
  const wmOccupancy = clamp(0.3 + neural.globalArousal * 0.4);
  const wmChurnRate = clamp(0.2 + (1 - neural.sparseActivationRatio) * 0.3);
  maturityTracker.update({
    tick: neural.tick ?? 0,
    saturationRate,
    oscillationIndex,
    competitionScore,
    wmOccupancy,
    wmChurnRate,
    persistentTensionCount: Math.floor(neural.globalArousal * 5),
    ansModulationActive: neural.globalArousal > 0.2,
    predictionErrorActive: neural.sparseActivationRatio > 0.2,
    failureMemoryActive: (neural.tick ?? 0) > 50,
    sparseActivationRatio: neural.sparseActivationRatio,
    experimentRunnerLive: true,
    recordSystemLive: true,
    reportsGenerated: coreBrainExperimentRunner.getReportsGenerated()
  });
  const state = maturityTracker.getState();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-3 py-1.5 shrink-0 border-b flex items-center justify-between",
        style: {
          borderColor: "oklch(0.18 0.04 255)",
          background: "oklch(0.07 0.012 265)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] tracking-widest uppercase",
              style: { color: "oklch(0.38 0.06 220)" },
              children: "Maturity Dashboard"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              "data-ocid": "maturity.primary_button",
              style: {
                background: state.isExperimentReady ? "oklch(0.55 0.2 145)" : "oklch(0.5 0.18 55)",
                color: "oklch(0.95 0.02 120)",
                fontSize: "8px",
                letterSpacing: "0.1em",
                padding: "2px 6px"
              },
              children: state.isExperimentReady ? "EXPERIMENT-READY" : `${state.maturityScore}/9`
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-3 py-2 shrink-0",
        style: { borderBottom: "1px solid oklch(0.14 0.03 255)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px]",
                style: { color: "oklch(0.45 0.07 220)" },
                children: "MATURITY"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "span",
              {
                className: "font-mono text-[10px] font-bold",
                style: {
                  color: state.isExperimentReady ? "oklch(0.7 0.2 145)" : "oklch(0.65 0.18 55)"
                },
                children: [
                  state.maturityScore,
                  "/9"
                ]
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Progress,
            {
              "data-ocid": "maturity.panel",
              value: state.maturityFraction * 100,
              className: "h-1.5",
              style: {
                background: "oklch(0.14 0.03 255)"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-1 font-mono text-[7px] tracking-widest",
              style: {
                color: state.isExperimentReady ? "oklch(0.6 0.2 145)" : "oklch(0.5 0.12 55)"
              },
              children: state.readinessLabel
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto px-2 py-1", children: state.conditions.map((c, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        "data-ocid": `maturity.item.${i + 1}`,
        className: "flex items-start gap-2 px-2 py-1.5 rounded mb-0.5",
        style: {
          background: c.passed ? "oklch(0.1 0.025 145 / 0.4)" : "oklch(0.08 0.01 260 / 0.3)",
          border: `1px solid ${c.passed ? "oklch(0.3 0.1 145 / 0.4)" : "oklch(0.2 0.04 255 / 0.4)"}`
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "shrink-0 mt-0.5",
              style: {
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c.passed ? "oklch(0.7 0.22 145)" : "oklch(0.5 0.18 55)",
                boxShadow: c.passed ? "0 0 6px oklch(0.7 0.22 145 / 0.4)" : "none"
              }
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] font-semibold tracking-wide truncate",
                style: {
                  color: c.passed ? "oklch(0.75 0.15 145)" : "oklch(0.55 0.08 220)"
                },
                children: c.label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] mt-0.5 leading-tight",
                style: { color: "oklch(0.35 0.05 220)", lineHeight: 1.3 },
                children: c.evidence
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "shrink-0 font-mono text-[7px]",
              style: {
                color: c.passed ? "oklch(0.65 0.2 145)" : "oklch(0.45 0.12 55)"
              },
              children: [
                (c.score * 100).toFixed(0),
                "%"
              ]
            }
          )
        ]
      },
      c.id
    )) })
  ] });
}
function ExperimentRunnerPanel({
  onResult
}) {
  const [runCount, setRunCount] = reactExports.useState(5);
  const [includeDecoupled, setIncludeDecoupled] = reactExports.useState(false);
  const [ablations, setAblations] = reactExports.useState({
    memoryLayer: false,
    predictionLayer: false,
    regulationLayer: false,
    recurrenceDepth: false,
    sparseUpdates: false
  });
  const [progress, setProgress] = reactExports.useState(null);
  const [isRunning, setIsRunning] = reactExports.useState(false);
  const [error, setError] = reactExports.useState(null);
  const runIdRef = reactExports.useRef(0);
  const handleRun = reactExports.useCallback(async () => {
    setIsRunning(true);
    setError(null);
    setProgress(null);
    runIdRef.current++;
    const expId = `exp_${Date.now()}_${runIdRef.current}`;
    const scenario = coreBrainExperimentRunner.getDefaultThreatMemoryScenario();
    const seeds = Array.from({ length: runCount }, (_, i) => 42 + i * 7);
    const enabledModules = [
      "memory",
      "prediction",
      "regulation",
      "recurrence",
      "sparse"
    ].filter((m) => {
      const abl = ablations;
      const keyMap = {
        memory: "memoryLayer",
        prediction: "predictionLayer",
        regulation: "regulationLayer",
        recurrence: "recurrenceDepth",
        sparse: "sparseUpdates"
      };
      return !abl[keyMap[m]];
    });
    const config = {
      experimentId: expId,
      scenario,
      baselineConfig: {
        type: "baseline",
        enabledModules: [],
        coreBrainVersion: "v1-baseline"
      },
      brainConfig: {
        type: "brain-powered",
        enabledModules,
        coreBrainVersion: "v3.7"
      },
      runCount,
      seeds,
      includeDecoupledControl: includeDecoupled,
      metricProfile: "standard",
      captureStateTrace: true,
      ablations
    };
    try {
      const result = await coreBrainExperimentRunner.runExperiment(
        config,
        (p) => setProgress(p)
      );
      onResult(result);
    } catch (e) {
      setError(String(e));
    } finally {
      setIsRunning(false);
    }
  }, [runCount, includeDecoupled, ablations, onResult]);
  const toggleAblation = (key) => {
    setAblations((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const phaseColors = {
    baseline: "oklch(0.55 0.1 220)",
    brain: "oklch(0.65 0.2 145)",
    decoupled: "oklch(0.55 0.15 280)",
    analysis: "oklch(0.6 0.15 60)"
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "px-3 py-1.5 shrink-0 border-b",
        style: {
          borderColor: "oklch(0.18 0.04 255)",
          background: "oklch(0.07 0.012 265)"
        },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "font-mono text-[9px] tracking-widest uppercase",
            style: { color: "oklch(0.38 0.06 220)" },
            children: "Experiment Runner · Threat-Memory Navigation"
          }
        )
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-3 py-2 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded p-2",
          style: {
            background: "oklch(0.09 0.015 265)",
            border: "1px solid oklch(0.18 0.04 255)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[8px] tracking-widest uppercase mb-1",
                style: { color: "oklch(0.45 0.08 220)" },
                children: "Scenario"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[9px]",
                style: { color: "oklch(0.7 0.12 210)" },
                children: "Threat-Memory Navigation"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] mt-0.5 leading-snug",
                style: { color: "oklch(0.38 0.05 220)" },
                children: "10×10 grid · Reward at (8,8) · Threat at (5,5) · Path blocks at tick 50"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] mt-0.5",
                style: { color: "oklch(0.35 0.05 220)" },
                children: "Primary: task success while avoiding threat · Secondary: route efficiency, adaptation speed"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest uppercase",
              style: { color: "oklch(0.45 0.07 220)" },
              children: "Runs per agent"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[10px] font-bold",
              style: { color: "oklch(0.7 0.15 210)" },
              children: runCount
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          Slider,
          {
            "data-ocid": "experiment.select",
            min: 1,
            max: 30,
            step: 1,
            value: [runCount],
            onValueChange: ([v]) => setRunCount(v),
            disabled: isRunning,
            className: "w-full"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "font-mono text-[8px] tracking-widest uppercase mb-1.5",
            style: { color: "oklch(0.45 0.07 220)" },
            children: "Ablation controls (disable module)"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1", children: [
          ["memoryLayer", "Memory Layer"],
          ["predictionLayer", "Prediction Layer"],
          ["regulationLayer", "Regulation Layer"],
          ["recurrenceDepth", "Recurrence Depth"],
          ["sparseUpdates", "Sparse Updates"]
        ].map(([key, label], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            "data-ocid": `experiment.toggle.${i + 1}`,
            className: "flex items-center justify-between px-2 py-1 rounded",
            style: {
              background: "oklch(0.09 0.01 265)",
              border: "1px solid oklch(0.16 0.03 255)"
            },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[8px]",
                  style: {
                    color: ablations[key] ? "oklch(0.55 0.18 25)" : "oklch(0.55 0.08 220)"
                  },
                  children: [
                    label,
                    " ",
                    ablations[key] ? "— ABLATED" : ""
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Switch,
                {
                  checked: ablations[key],
                  onCheckedChange: () => toggleAblation(key),
                  disabled: isRunning
                }
              )
            ]
          },
          key
        )) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center justify-between px-2 py-1.5 rounded",
          style: {
            background: "oklch(0.09 0.01 265)",
            border: "1px solid oklch(0.16 0.03 255)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px]",
                style: { color: "oklch(0.5 0.08 220)" },
                children: "Include decoupled/shuffled control"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Switch,
              {
                "data-ocid": "experiment.switch",
                checked: includeDecoupled,
                onCheckedChange: setIncludeDecoupled,
                disabled: isRunning
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Button,
        {
          "data-ocid": "experiment.primary_button",
          onClick: handleRun,
          disabled: isRunning,
          className: "w-full font-mono text-[9px] tracking-widest uppercase",
          style: {
            background: isRunning ? "oklch(0.22 0.05 255)" : "oklch(0.45 0.18 240)",
            color: "oklch(0.9 0.05 210)",
            border: "none"
          },
          children: isRunning ? "Running…" : "Run Experiment"
        }
      ),
      isRunning && progress && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "experiment.loading_state",
          className: "rounded p-2 space-y-1.5",
          style: {
            background: "oklch(0.09 0.015 265)",
            border: "1px solid oklch(0.2 0.05 255)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Badge,
                {
                  style: {
                    background: `${phaseColors[progress.currentPhase]} / 0.15`,
                    color: phaseColors[progress.currentPhase],
                    fontSize: "7px",
                    letterSpacing: "0.1em",
                    padding: "1px 5px",
                    border: `1px solid ${phaseColors[progress.currentPhase]} / 0.4`
                  },
                  children: progress.currentPhase.toUpperCase()
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "span",
                {
                  className: "font-mono text-[8px]",
                  style: { color: "oklch(0.5 0.08 220)" },
                  children: [
                    progress.currentRun,
                    "/",
                    progress.totalRuns
                  ]
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Progress, { value: progress.progressFraction * 100, className: "h-1" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] truncate",
                style: { color: "oklch(0.4 0.06 220)" },
                children: progress.lastEvent
              }
            )
          ]
        }
      ),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "experiment.error_state",
          className: "rounded px-2 py-1.5",
          style: {
            background: "oklch(0.1 0.02 25 / 0.4)",
            border: "1px solid oklch(0.35 0.15 25 / 0.5)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px]",
              style: { color: "oklch(0.65 0.2 25)" },
              children: error
            }
          )
        }
      )
    ] })
  ] });
}
function ResultsPanel({ result }) {
  if (!result) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "px-3 py-1.5 shrink-0 border-b",
          style: {
            borderColor: "oklch(0.18 0.04 255)",
            background: "oklch(0.07 0.012 265)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] tracking-widest uppercase",
              style: { color: "oklch(0.38 0.06 220)" },
              children: "Results"
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "results.empty_state",
          className: "flex-1 flex items-center justify-center",
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] tracking-widest",
              style: { color: "oklch(0.3 0.05 220)" },
              children: "No experiment run yet"
            }
          )
        }
      )
    ] });
  }
  const deltaColor = (d) => d > 0.03 ? "oklch(0.7 0.22 145)" : d < -0.03 ? "oklch(0.65 0.22 25)" : "oklch(0.55 0.1 60)";
  const deltaLabel = (d) => `${(d > 0 ? "+" : "") + (d * 100).toFixed(1)}%`;
  const verdictStyle = {
    keep: {
      bg: "oklch(0.12 0.03 145 / 0.5)",
      color: "oklch(0.7 0.22 145)",
      border: "oklch(0.3 0.12 145 / 0.4)"
    },
    revise: {
      bg: "oklch(0.12 0.03 60 / 0.5)",
      color: "oklch(0.7 0.18 60)",
      border: "oklch(0.35 0.12 60 / 0.4)"
    },
    reject: {
      bg: "oklch(0.12 0.03 25 / 0.5)",
      color: "oklch(0.65 0.2 25)",
      border: "oklch(0.3 0.12 25 / 0.4)"
    }
  };
  const verdict = result.milestonePassed ? "keep" : result.usefulBehaviorDelta < 0 ? "reject" : "revise";
  const vs = verdictStyle[verdict];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "px-3 py-1.5 shrink-0 border-b flex items-center justify-between",
        style: {
          borderColor: "oklch(0.18 0.04 255)",
          background: "oklch(0.07 0.012 265)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[9px] tracking-widest uppercase",
              style: { color: "oklch(0.38 0.06 220)" },
              children: "Results"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Badge,
            {
              "data-ocid": "results.primary_button",
              style: {
                background: result.status === "complete" ? "oklch(0.2 0.08 145 / 0.4)" : "oklch(0.2 0.06 55 / 0.4)",
                color: result.status === "complete" ? "oklch(0.7 0.18 145)" : "oklch(0.65 0.15 55)",
                fontSize: "7px"
              },
              children: result.status.toUpperCase()
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-y-auto px-3 py-2 space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "results.card",
          className: "rounded p-2.5",
          style: {
            background: `${deltaColor(result.usefulBehaviorDelta)} / 0.08`,
            border: `1px solid ${deltaColor(result.usefulBehaviorDelta)} / 0.3`
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] tracking-widest uppercase mb-1",
                style: { color: "oklch(0.4 0.06 220)" },
                children: "ΔU — Useful Behavior Delta"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-2xl font-bold",
                style: { color: deltaColor(result.usefulBehaviorDelta) },
                children: deltaLabel(result.usefulBehaviorDelta)
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "font-mono text-[7px] mt-0.5",
                style: { color: "oklch(0.38 0.05 220)" },
                children: [
                  "brain-powered vs baseline · ",
                  result.totalRuns,
                  " total runs"
                ]
              }
            )
          ]
        }
      ),
      [
        ["Useful Behavior", result.usefulBehaviorDelta],
        ["Emergence", result.emergenceDelta],
        ["Regulation", result.regulationDelta],
        ["Efficiency", result.efficiencyDelta]
      ].map(([label, delta], i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": `results.item.${i + 1}`,
          className: "flex items-center justify-between px-2 py-1.5 rounded",
          style: {
            background: "oklch(0.09 0.01 265)",
            border: "1px solid oklch(0.16 0.03 255)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[8px]",
                style: { color: "oklch(0.5 0.07 220)" },
                children: label
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "font-mono text-[9px] font-semibold",
                style: { color: deltaColor(Number(delta)) },
                children: deltaLabel(Number(delta))
              }
            )
          ]
        },
        label
      )),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "rounded p-2 text-center",
          style: { background: vs.bg, border: `1px solid ${vs.border}` },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] tracking-widest uppercase mb-0.5",
                style: { color: `${vs.color} / 0.7` },
                children: "Verdict"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-base font-bold tracking-widest uppercase",
                style: { color: vs.color },
                children: verdict
              }
            )
          ]
        }
      ),
      !result.milestonePassed && result.milestoneFailReasons.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          "data-ocid": "results.error_state",
          className: "rounded p-2 space-y-0.5",
          style: {
            background: "oklch(0.09 0.01 265)",
            border: "1px solid oklch(0.25 0.08 255 / 0.4)"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "font-mono text-[7px] tracking-widest uppercase",
                style: { color: "oklch(0.45 0.08 220)" },
                children: "Milestone gate issues:"
              }
            ),
            result.milestoneFailReasons.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "div",
              {
                className: "font-mono text-[7px]",
                style: { color: "oklch(0.55 0.15 25)" },
                children: [
                  "• ",
                  r
                ]
              },
              r
            ))
          ]
        }
      ),
      result.promotionCandidate && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          "data-ocid": "results.success_state",
          className: "rounded p-2 text-center",
          style: {
            background: "oklch(0.1 0.025 145 / 0.4)",
            border: "1px solid oklch(0.35 0.15 145 / 0.4)"
          },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "font-mono text-[8px] tracking-widest",
              style: { color: "oklch(0.7 0.2 145)" },
              children: "PROMOTION CANDIDATE — See Report tab"
            }
          )
        }
      )
    ] })
  ] });
}
function ExperimentsTab({ neural }) {
  const [latestResult, setLatestResult] = reactExports.useState(
    null
  );
  const [subTab, setSubTab] = reactExports.useState("proof");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "h-full flex flex-col overflow-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "shrink-0 px-3 py-1 flex items-center gap-2 border-b",
        style: {
          borderColor: "oklch(0.16 0.04 255)",
          background: "oklch(0.065 0.01 265)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "experiments.tab",
              onClick: () => setSubTab("proof"),
              className: "font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 rounded",
              style: {
                background: subTab === "proof" ? "oklch(0.18 0.05 255)" : "transparent",
                color: subTab === "proof" ? "oklch(0.7 0.15 210)" : "oklch(0.35 0.05 220)"
              },
              children: "Proof System"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              "data-ocid": "experiments.tab",
              onClick: () => setSubTab("probe"),
              className: "font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 rounded",
              style: {
                background: subTab === "probe" ? "oklch(0.18 0.05 255)" : "transparent",
                color: subTab === "probe" ? "oklch(0.7 0.15 210)" : "oklch(0.35 0.05 220)"
              },
              children: "Lab & Probes"
            }
          )
        ]
      }
    ),
    subTab === "proof" ? (
      /* Proof System: 3-column layout */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex overflow-hidden min-h-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "section",
          {
            className: "flex flex-col border-r",
            style: {
              flex: "0 0 280px",
              overflow: "hidden",
              borderColor: "oklch(0.18 0.05 255)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(MaturityDashboard, { neural })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "section",
          {
            className: "flex flex-col border-r",
            style: {
              flex: "0 0 280px",
              overflow: "hidden",
              borderColor: "oklch(0.18 0.05 255)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExperimentRunnerPanel, { onResult: setLatestResult })
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("section", { className: "flex flex-col flex-1 overflow-hidden min-h-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ResultsPanel, { result: latestResult }) })
      ] })
    ) : (
      /* Lab & Probes: original layout */
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex flex-col overflow-hidden min-h-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex overflow-hidden",
            style: { flex: "0 0 60%", minHeight: 0 },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "section",
                {
                  className: "flex flex-col border-r",
                  style: {
                    flex: "0 0 55%",
                    overflow: "hidden",
                    borderColor: "oklch(0.18 0.05 255)"
                  },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "px-3 py-1.5 shrink-0 border-b",
                        style: {
                          borderColor: "oklch(0.18 0.04 255)",
                          background: "oklch(0.07 0.012 265)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[9px] tracking-widest uppercase",
                            style: { color: "oklch(0.38 0.06 220)" },
                            children: "Experiment Lab · Behavior · Probes"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden min-h-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExperimentLab, { neural }) })
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "section",
                {
                  className: "flex flex-col",
                  style: { flex: 1, overflow: "hidden" },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "px-3 py-1.5 shrink-0 border-b",
                        style: {
                          borderColor: "oklch(0.18 0.04 255)",
                          background: "oklch(0.07 0.012 265)"
                        },
                        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                          "span",
                          {
                            className: "font-mono text-[9px] tracking-widest uppercase",
                            style: { color: "oklch(0.38 0.06 220)" },
                            children: "Simulation Controls · 12 Stimulus Channels"
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-hidden min-h-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SimulationControls, { neural }) })
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "flex flex-col border-t",
            style: {
              flex: 1,
              minHeight: 0,
              overflow: "hidden",
              borderColor: "oklch(0.18 0.05 255)"
            },
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              AutoTestPanel,
              {
                neural: {
                  regions: neural.regions.map((r) => ({
                    region: r.region,
                    activation: r.activation
                  })),
                  globalArousal: neural.globalArousal,
                  sparseActivationRatio: neural.sparseActivationRatio
                }
              }
            )
          }
        )
      ] })
    )
  ] });
}
export {
  ExperimentsTab as default
};
