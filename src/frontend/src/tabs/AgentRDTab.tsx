import { AgentRnD } from "../components/AgentRnD";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";

type Neural = NeuralSimulationState & NeuralSimulationControls;

export default function AgentRDTab({ neural }: { neural: Neural }) {
  return (
    <div className="h-full overflow-hidden">
      <AgentRnD neural={neural} />
    </div>
  );
}
