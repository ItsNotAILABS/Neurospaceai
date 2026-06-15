import { PharmaTesting } from "../components/PharmaTesting";
import type {
  NeuralSimulationControls,
  NeuralSimulationState,
} from "../hooks/useNeuralSimulation";

type Neural = NeuralSimulationState & NeuralSimulationControls;

export default function PharmaTab({ neural }: { neural: Neural }) {
  return (
    <div className="h-full overflow-hidden">
      <PharmaTesting neural={neural} />
    </div>
  );
}
