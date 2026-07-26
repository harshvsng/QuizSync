import { IUserSession } from "@/types/auth";
import { create } from "zustand";

interface AppState {
  user?: IUserSession | null;
  setUser: (user: IUserSession | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));
