import {
  type BrainInstance,
  SCHEMA_VERSION,
  createDefaultBrainInstance,
} from "./coreBrainSchemas";

interface TelemetryEntry {
  ts: number;
  instanceId: string;
  event: string;
  detail?: string;
}

type LifecyclePhase = BrainInstance["runtimePhase"];

const VALID_TRANSITIONS: Record<LifecyclePhase, LifecyclePhase[]> = {
  idle: ["running"],
  running: ["paused", "resetting", "destroyed"],
  paused: ["running", "resetting", "destroyed"],
  resetting: ["idle"],
  destroyed: [],
};

export class BrainInstanceManager {
  private instances = new Map<string, BrainInstance>();
  private telemetryLog: TelemetryEntry[] = [];
  private validationHooks = new Map<
    string,
    Array<(inst: BrainInstance) => void>
  >();

  create(config: Partial<BrainInstance> = {}): string {
    const inst = createDefaultBrainInstance(config);
    this.instances.set(inst.instanceId, inst);
    this._emit(inst.instanceId, "created");
    return inst.instanceId;
  }

  pause(id: string): void {
    this._transition(id, "paused");
  }

  resume(id: string): void {
    this._transition(id, "running");
  }

  reset(id: string): void {
    this._transition(id, "resetting");
    const inst = this.instances.get(id);
    if (inst) {
      inst.activeFlags = [];
      inst.currentGoalId = undefined;
      inst.currentPolicyMode = "default";
      this._transition(id, "idle");
    }
  }

  destroy(id: string): void {
    this._transition(id, "destroyed");
    this.instances.delete(id);
    this._emit(id, "destroyed_and_removed");
  }

  getState(id: string): BrainInstance | undefined {
    return this.instances.get(id);
  }

  registerValidationHook(
    id: string,
    hook: (inst: BrainInstance) => void,
  ): void {
    if (!this.validationHooks.has(id)) this.validationHooks.set(id, []);
    this.validationHooks.get(id)!.push(hook);
  }

  runValidationHooks(id: string): void {
    const inst = this.instances.get(id);
    if (!inst) return;
    for (const hook of this.validationHooks.get(id) ?? []) hook(inst);
  }

  getTelemetry() {
    const all = [...this.instances.values()];
    return {
      instanceCount: all.length,
      activeCount: all.filter((i) => i.runtimePhase === "running").length,
      pausedCount: all.filter((i) => i.runtimePhase === "paused").length,
      errorCount: 0,
      recentEvents: this.telemetryLog.slice(-20),
      schemaVersion: SCHEMA_VERSION,
    };
  }

  getAllInstances(): BrainInstance[] {
    return [...this.instances.values()];
  }

  private _transition(id: string, next: LifecyclePhase): void {
    const inst = this.instances.get(id);
    if (!inst) throw new Error(`BrainInstanceManager: unknown instance ${id}`);
    const allowed = VALID_TRANSITIONS[inst.runtimePhase];
    if (!allowed.includes(next)) {
      throw new Error(
        `BrainInstanceManager: invalid transition ${inst.runtimePhase} -> ${next} for ${id}`,
      );
    }
    inst.runtimePhase = next;
    inst.lastTransitionTs = Date.now();
    this._emit(id, `transition:${inst.runtimePhase}->${next}`);
  }

  private _emit(instanceId: string, event: string, detail?: string): void {
    this.telemetryLog.push({ ts: Date.now(), instanceId, event, detail });
    if (this.telemetryLog.length > 500) this.telemetryLog.shift();
  }
}

export const globalBrainInstanceManager = new BrainInstanceManager();
