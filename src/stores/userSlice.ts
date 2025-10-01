import { signOut } from "next-auth/react";
import { BaseApiClient } from "@/lib/api/base";
import type { BoundState, UserProfile, UserSlice } from "./types";
import { StateCreator } from "zustand";

export const createUserSlice: StateCreator<BoundState, [], [], UserSlice> = (set) => ({
  user: null,
  isAuthenticating: false,

  setUser(user: UserProfile | null) {
    set({ user });
  },

  async logout() {
    set({ isAuthenticating: true });
    try {
      await signOut({ redirect: false });
    } catch (error) {
      console.error("Failed to sign out", error);
    } finally {
      BaseApiClient.clearTokens();
      set({ user: null, isAuthenticating: false });
    }
  },
});
