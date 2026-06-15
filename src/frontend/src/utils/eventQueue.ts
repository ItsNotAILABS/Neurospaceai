export interface TypedRuntimeEvent {
  id: string;
  type: string;
  timestamp: number;
  instanceId: string;
  subsystem: string;
  payload: unknown;
  replayed: boolean;
}

export interface EventQueueStats {
  depth: number;
  totalEnqueued: number;
  replayCount: number;
}

export class EventQueue {
  private queue: TypedRuntimeEvent[] = [];
  private archived: TypedRuntimeEvent[] = [];
  private totalEnqueued = 0;
  private replayCount = 0;
  private maxSize = 1000;

  enqueue(
    event: Omit<TypedRuntimeEvent, "id" | "timestamp" | "replayed">,
  ): void {
    const e: TypedRuntimeEvent = {
      ...event,
      id: `evt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      timestamp: Date.now(),
      replayed: false,
    };
    this.queue.push(e);
    this.totalEnqueued++;
    if (this.queue.length > this.maxSize) {
      const dropped = this.queue.shift();
      if (dropped) this.archived.push(dropped);
      if (this.archived.length > 2000) this.archived.shift();
    }
  }

  dequeue(): TypedRuntimeEvent | undefined {
    return this.queue.shift();
  }

  peek(): TypedRuntimeEvent | undefined {
    return this.queue[0];
  }

  getRecent(n: number): TypedRuntimeEvent[] {
    return this.queue.slice(-n);
  }

  replay(fromTimestamp: number): TypedRuntimeEvent[] {
    this.replayCount++;
    return [...this.archived, ...this.queue]
      .filter((e) => e.timestamp >= fromTimestamp)
      .map((e) => ({ ...e, replayed: true }));
  }

  getStats(): EventQueueStats {
    return {
      depth: this.queue.length,
      totalEnqueued: this.totalEnqueued,
      replayCount: this.replayCount,
    };
  }

  clear(): void {
    this.queue = [];
  }
}

export const globalEventQueue = new EventQueue();
