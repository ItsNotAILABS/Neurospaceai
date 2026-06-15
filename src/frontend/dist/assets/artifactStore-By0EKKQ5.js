import { r as reactExports } from "./index-CGYrnU7d.js";
let _uploadFn = null;
function getArtifactUploadFn() {
  return _uploadFn;
}
const STORAGE_KEY = "neuro_artifacts";
const MAX_ARTIFACTS = 200;
function uuid() {
  return `art_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}
function saveToStorage(artifacts) {
  try {
    const trimmed = artifacts.slice().sort((a, b) => b.created_at - a.created_at).slice(0, MAX_ARTIFACTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
  }
}
function createArtifact(data) {
  const artifact = {
    ...data,
    artifact_id: uuid(),
    created_at: Date.now()
  };
  const existing = loadFromStorage();
  const updated = [artifact, ...existing];
  saveToStorage(updated);
  setTimeout(() => {
    try {
      const bytes = new TextEncoder().encode(JSON.stringify(artifact));
      const filename = `artifact_${artifact.artifact_id}.json`;
      const uploadFn = getArtifactUploadFn();
      if (uploadFn) ;
      else {
        const s = loadFromStorage();
        saveToStorage(
          s.map(
            (a) => a.artifact_id === artifact.artifact_id ? { ...a, blob_uri: filename, blob_status: "pending" } : a
          )
        );
      }
    } catch {
    }
  }, 100);
  return artifact;
}
function archiveArtifact(id) {
  const artifacts = loadFromStorage();
  const updated = artifacts.map(
    (a) => a.artifact_id === id ? { ...a, archived_at: Date.now() } : a
  );
  saveToStorage(updated);
}
function compareArtifacts(a, b) {
  const score_delta = a.score - b.score;
  const score_delta_pct = b.score > 0 ? (a.score - b.score) / b.score * 100 : 0;
  const status_changed = a.status !== b.status;
  const key_differences = [];
  if (Math.abs(score_delta) >= 5) {
    key_differences.push(
      `Score ${score_delta > 0 ? "+" : ""}${score_delta.toFixed(1)} pts (${score_delta > 0 ? "improvement" : "regression"})`
    );
  }
  if (status_changed) {
    key_differences.push(`Status changed: ${b.status} → ${a.status}`);
  }
  if (a.artifact_type !== b.artifact_type) {
    key_differences.push(
      `Different types: ${a.artifact_type} vs ${b.artifact_type}`
    );
  }
  if (a.source_system !== b.source_system) {
    key_differences.push(
      `Different sources: ${a.source_system} vs ${b.source_system}`
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
    key_differences
  };
}
function useArtifacts() {
  const [artifacts, setArtifacts] = reactExports.useState(
    () => loadFromStorage()
  );
  reactExports.useEffect(() => {
    const sync = () => setArtifacts(loadFromStorage());
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const create = reactExports.useCallback(
    (data) => {
      const artifact = createArtifact(data);
      setArtifacts(loadFromStorage());
      return artifact;
    },
    []
  );
  const archive = reactExports.useCallback((id) => {
    archiveArtifact(id);
    setArtifacts(loadFromStorage());
  }, []);
  return [artifacts, create, archive];
}
export {
  compareArtifacts as a,
  createArtifact as c,
  useArtifacts as u
};
