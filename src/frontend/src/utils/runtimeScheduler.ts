export interface LoopHealth {
  fastLoopHz: number;
  midLoopHz: number;
  slowLoopHz: number;
  isRunning: boolean;
  tickCount: number;
  lastStepMs: number;
}

type LoopFn = (dt: number, tick: number) => void;

export class RuntimeScheduler {
  private fastFns: LoopFn[] = [];
  private midFns: LoopFn[] = [];
  private slowFns: LoopFn[] = [];

  private fastInterval = 50;
  private midInterval = 200;
  private slowInterval = 2000;

  private fastTimer: ReturnType<typeof setInterval> | null = null;
  private midTimer: ReturnType<typeof setInterval> | null = null;
  private slowTimer: ReturnType<typeof setInterval> | null = null;

  private _isRunning = false;
  private tickCount = 0;
  private fastTicks = 0;
  private midTicks = 0;
  private slowTicks = 0;
  private startTs = 0;
  private lastStepMs = 0;

  registerFastLoop(fn: LoopFn): void {
    this.fastFns.push(fn);
  }
  registerMidLoop(fn: LoopFn): void {
    this.midFns.push(fn);
  }
  registerSlowLoop(fn: LoopFn): void {
    this.slowFns.push(fn);
  }

  start(): void {
    if (this._isRunning) return;
    this._isRunning = true;
    this.startTs = Date.now();
    this.fastTimer = setInterval(() => this._runFast(), this.fastInterval);
    this.midTimer = setInterval(() => this._runMid(), this.midInterval);
    this.slowTimer = setInterval(() => this._runSlow(), this.slowInterval);
  }

  stop(): void {
    this._isRunning = false;
    if (this.fastTimer) {
      clearInterval(this.fastTimer);
      this.fastTimer = null;
    }
    if (this.midTimer) {
      clearInterval(this.midTimer);
      this.midTimer = null;
    }
    if (this.slowTimer) {
      clearInterval(this.slowTimer);
      this.slowTimer = null;
    }
  }

  /** Deterministic step: runs one fast + one mid + one slow tick synchronously */
  step(): void {
    const t0 = Date.now();
    this._runFast();
    this._runMid();
    this._runSlow();
    this.lastStepMs = Date.now() - t0;
  }

  getHealth(): LoopHealth {
    const elapsed = Math.max(1, (Date.now() - this.startTs) / 1000);
    return {
      fastLoopHz: this._isRunning ? Math.round(this.fastTicks / elapsed) : 0,
      midLoopHz: this._isRunning ? Math.round(this.midTicks / elapsed) : 0,
      slowLoopHz: this._isRunning
        ? Math.round((this.slowTicks / elapsed) * 100) / 100
        : 0,
      isRunning: this._isRunning,
      tickCount: this.tickCount,
      lastStepMs: this.lastStepMs,
    };
  }

  get isRunning() {
    return this._isRunning;
  }

  private _runFast(): void {
    this.tickCount++;
    this.fastTicks++;
    for (const fn of this.fastFns) fn(this.fastInterval, this.tickCount);
  }
  private _runMid(): void {
    this.midTicks++;
    for (const fn of this.midFns) fn(this.midInterval, this.tickCount);
  }
  private _runSlow(): void {
    this.slowTicks++;
    for (const fn of this.slowFns) fn(this.slowInterval, this.tickCount);
  }
}

export const globalScheduler = new RuntimeScheduler();
