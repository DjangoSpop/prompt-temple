import { create } from "zustand";
import { createLearnerSlice } from "./learnerSlice";
import { createOptimizerSlice } from "./optimizerSlice";
import { createUserSlice } from "./userSlice";
import type { BoundState } from "./types";

export const useBoundStore = create<BoundState>()((...args) => ({
  ...createLearnerSlice(...args),
  ...createOptimizerSlice(...args),
  ...createUserSlice(...args),
}));
