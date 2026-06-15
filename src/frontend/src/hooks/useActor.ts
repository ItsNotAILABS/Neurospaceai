// Auto-generated re-export stub for useActor.
// Wraps @caffeineai/core-infrastructure's useActor pre-bound with the backend createActor.
// NOTE: backend.d.ts types are stubs until pnpm bindgen runs against a live canister.
// Actor is cast to `any` so direct method calls compile before bindgen generates real types.

import { useActor as _useActor } from "@caffeineai/core-infrastructure";
import { createActor } from "../backend";

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useActor(): { actor: any; isFetching: boolean } {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = _useActor(createActor as Parameters<typeof _useActor>[0]);
  return result as { actor: any; isFetching: boolean };
}
