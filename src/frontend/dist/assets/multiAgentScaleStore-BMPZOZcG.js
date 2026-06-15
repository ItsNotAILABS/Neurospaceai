const multiAgentScaleStore = {
  verdict: "NOT_RUN"
};
function setMultiAgentScaleResult(r) {
  Object.assign(multiAgentScaleStore, r);
  try {
    localStorage.setItem("multi_agent_scale", JSON.stringify(r));
  } catch {
  }
}
function loadMultiAgentScaleResult() {
  try {
    const saved = localStorage.getItem("multi_agent_scale");
    if (saved) Object.assign(multiAgentScaleStore, JSON.parse(saved));
  } catch {
  }
}
loadMultiAgentScaleResult();
export {
  loadMultiAgentScaleResult,
  multiAgentScaleStore,
  setMultiAgentScaleResult
};
