import { useCallback, useEffect, useState } from "react";
import { getArtifactUploadFn } from "./artifactBlobUploader";

// ─── Types ────────────────────────────────────────────────────────────────────
export type ArtifactType =
  | "report"
  | "ai_review"
  | "readiness_check"
  | "go_live_report"
  | "compatibility_validation"
  | "binding_validation"
  | "deployment_health"
  | "benchmark_comparison"
  | "analytics_snapshot"
  | "optimization_recommendation"
  | "trace_bundle"
  | "scenario_result"
  | "battle_result"
  | "replay_export"
  | "experiment_result"
  | "benchmark_comparison_result"
  | "deployment_health_result";

export interface Artifact {
  artifact_id: string;
  artifact_type: ArtifactType;
  source_system: "core" | "battleops" | "warcommandops";
  title: string;
  summary: string;
  score: number;
  status: "pass" | "warn" | "fail" | "info";
  ai_review_summary?: string;
  metadata: Record<string, unknown>;
  related_artifact_ids: string[];
  parent_artifact_id?: string;
  tags: string[];
  created_at: number;
  archived_at?: number;
  version: string;
  blob_uri?: string;
  blob_status?: "pending" | "uploaded" | "failed";
}

export interface ArtifactComparison {
  artifact_a: Artifact;
  artifact_b: Artifact;
  score_delta: number;
  score_delta_pct: number;
  status_changed: boolean;
  key_differences: string[];
}

// ─── Storage constants ───────────────────────────────────────────────────────
const STORAGE_KEY = "neuro_artifacts";
const MAX_ARTIFACTS = 200;

function uuid(): string {
  return `art_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

function loadFromStorage(): Artifact[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Artifact[];
  } catch {
    return [];
  }
}

function saveToStorage(artifacts: Artifact[]): void {
  try {
    // Evict oldest if over limit
    const trimmed = artifacts
      .slice()
      .sort((a, b) => b.created_at - a.created_at)
      .slice(0, MAX_ARTIFACTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // Storage quota exceeded — ignore
  }
}

// ─── Core functions ───────────────────────────────────────────────────────────

export function createArtifact(
  data: Omit<Artifact, "artifact_id" | "created_at">,
): Artifact {
  const artifact: Artifact = {
    ...data,
    artifact_id: uuid(),
    created_at: Date.now(),
  };
  const existing = loadFromStorage();
  const updated = [artifact, ...existing];
  saveToStorage(updated);

  // Async ICP blob upload — real upload if upload fn is wired, else DEV-LIVE pending
  setTimeout(() => {
    try {
      const bytes = new TextEncoder().encode(JSON.stringify(artifact));
      const filename = `artifact_${artifact.artifact_id}.json`;
      const uploadFn = getArtifactUploadFn();
      if (uploadFn) {
        // Real ICP blob upload (production canister wired)
        uploadFn(bytes, filename)
          .then((uri) => {
            const s = loadFromStorage();
            saveToStorage(
              s.map((a) =>
                a.artifact_id === artifact.artifact_id
                  ? { ...a, blob_uri: uri, blob_status: "uploaded" as const }
                  : a,
              ),
            );
          })
          .catch(() => {
            const s = loadFromStorage();
            saveToStorage(
              s.map((a) =>
                a.artifact_id === artifact.artifact_id
                  ? { ...a, blob_status: "failed" as const }
                  : a,
              ),
            );
          });
      } else {
        // No upload fn yet — DEV-LIVE mode: localStorage is primary durable store
        const s = loadFromStorage();
        saveToStorage(
          s.map((a) =>
            a.artifact_id === artifact.artifact_id
              ? { ...a, blob_uri: filename, blob_status: "pending" as const }
              : a,
          ),
        );
      }
    } catch {
      // ignore — localStorage is the primary durable store
    }
  }, 100);

  return artifact;
}

export function getArtifacts(filter?: {
  type?: ArtifactType;
  status?: string;
  limit?: number;
}): Artifact[] {
  let artifacts = loadFromStorage();
  if (filter?.type) {
    artifacts = artifacts.filter((a) => a.artifact_type === filter.type);
  }
  if (filter?.status) {
    artifacts = artifacts.filter((a) => a.status === filter.status);
  }
  artifacts = artifacts.sort((a, b) => b.created_at - a.created_at);
  if (filter?.limit) {
    artifacts = artifacts.slice(0, filter.limit);
  }
  return artifacts;
}

export function getArtifact(id: string): Artifact | undefined {
  return loadFromStorage().find((a) => a.artifact_id === id);
}

export function archiveArtifact(id: string): void {
  const artifacts = loadFromStorage();
  const updated = artifacts.map((a) =>
    a.artifact_id === id ? { ...a, archived_at: Date.now() } : a,
  );
  saveToStorage(updated);
}

export function compareArtifacts(a: Artifact, b: Artifact): ArtifactComparison {
  const score_delta = a.score - b.score;
  const score_delta_pct =
    b.score > 0 ? ((a.score - b.score) / b.score) * 100 : 0;
  const status_changed = a.status !== b.status;
  const key_differences: string[] = [];

  if (Math.abs(score_delta) >= 5) {
    key_differences.push(
      `Score ${score_delta > 0 ? "+" : ""}${score_delta.toFixed(1)} pts (${
        score_delta > 0 ? "improvement" : "regression"
      })`,
    );
  }
  if (status_changed) {
    key_differences.push(`Status changed: ${b.status} → ${a.status}`);
  }
  if (a.artifact_type !== b.artifact_type) {
    key_differences.push(
      `Different types: ${a.artifact_type} vs ${b.artifact_type}`,
    );
  }
  if (a.source_system !== b.source_system) {
    key_differences.push(
      `Different sources: ${a.source_system} vs ${b.source_system}`,
    );
  }
  if (a.tags.length !== b.tags.length) {
    key_differences.push(`Tag count: ${a.tags.length} vs ${b.tags.length}`);
  }
  if (key_differences.length === 0) {
    key_differences.push("No significant differences detected");
  }

  return {
    artifact_a: a,
    artifact_b: b,
    score_delta,
    score_delta_pct,
    status_changed,
    key_differences,
  };
}

// ─── React hook ──────────────────────────────────────────────────────────────
export function useArtifacts(): [
  Artifact[],
  (data: Omit<Artifact, "artifact_id" | "created_at">) => Artifact,
  (id: string) => void,
] {
  const [artifacts, setArtifacts] = useState<Artifact[]>(() =>
    loadFromStorage(),
  );

  // Sync from storage on mount & focus
  useEffect(() => {
    const sync = () => setArtifacts(loadFromStorage());
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync); // cross-tab sync
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const create = useCallback(
    (data: Omit<Artifact, "artifact_id" | "created_at">) => {
      const artifact = createArtifact(data);
      setArtifacts(loadFromStorage());
      return artifact;
    },
    [],
  );

  const archive = useCallback((id: string) => {
    archiveArtifact(id);
    setArtifacts(loadFromStorage());
  }, []);

  return [artifacts, create, archive];
}
