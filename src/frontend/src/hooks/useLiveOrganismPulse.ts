import { useQuery } from "@tanstack/react-query";
import { useActor } from "./useActor";

export function useLiveOrganismPulse() {
  const { actor } = useActor();

  const canonicalQuery = useQuery({
    queryKey: ["liveOrganismPulse_canonical"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as any).getCanonicalState();
      } catch {
        return null;
      }
    },
    refetchInterval: 5000,
    staleTime: 0,
  });

  const modeQuery = useQuery({
    queryKey: ["liveOrganismPulse_mode"],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await (actor as any).getBehavioralMode();
      } catch {
        return null;
      }
    },
    refetchInterval: 5000,
    staleTime: 0,
  });

  const canonical = canonicalQuery.data;
  const mode = modeQuery.data;

  const coh = canonical?.coh ?? 0;
  const rt = canonical?.rt ?? 0;

  return {
    beat: canonical ? Number(canonical.b) : 0,
    coherence: coh,
    jasmineActive: coh > 0.6 && rt > 3,
    omnis: canonical?.eg ?? false,
    modeName: (mode?.modeName as string) ?? "STANDARD",
    modeCode: (mode?.mode as number) ?? 0,
    sovereign: (mode?.sovereign as boolean) ?? false,
    emergency: (mode?.emergency as boolean) ?? false,
    outlaw: (mode?.outlaw as boolean) ?? false,
    loaded: !!canonical,
  };
}
