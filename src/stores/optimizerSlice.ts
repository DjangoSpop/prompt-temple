import { StateCreator } from "zustand";
import type { BoundState, CritiqueItem, OptimizerSlice } from "./types";

interface OptimizeResponse {
  revised: string;
  critique: CritiqueItem[];
  score_before?: number;
  score_after?: number;
}

async function requestOptimization(prompt: string, mode: "fast" | "deep" = "fast"): Promise<OptimizeResponse> {
  const agentUrl = process.env.NEXT_PUBLIC_AGENT_URL ?? "/api/agent/optimize";
  const response = await fetch(agentUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, mode }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Failed to optimize prompt");
  }

  const data = (await response.json()) as OptimizeResponse;
  return {
    revised: data.revised,
    critique: data.critique ?? [],
    score_before: data.score_before,
    score_after: data.score_after,
  };
}

export const createOptimizerSlice: StateCreator<BoundState, [], [], OptimizerSlice> = (set, get) => ({
  originalPrompt: "",
  revisedPrompt: "",
  critique: [],
  scoreBefore: undefined,
  scoreAfter: undefined,
  isOptimizing: false,

  setOriginalPrompt(prompt) {
    set({ originalPrompt: prompt });
  },

  resetOptimization() {
    set({
      originalPrompt: "",
      revisedPrompt: "",
      critique: [],
      scoreBefore: undefined,
      scoreAfter: undefined,
    });
  },

  async optimize(input) {
    const mode = input?.mode ?? "fast";
    const prompt = get().originalPrompt;
    if (!prompt.trim()) {
      throw new Error("Provide a prompt to optimize");
    }

    set({ isOptimizing: true });
    try {
      const result = await requestOptimization(prompt, mode);
      set({
        revisedPrompt: result.revised,
        critique: result.critique,
        scoreBefore: result.score_before,
        scoreAfter: result.score_after,
      });
    } finally {
      set({ isOptimizing: false });
    }
  },
});
