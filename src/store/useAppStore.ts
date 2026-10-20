import { create } from 'zustand';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export interface Child {
  id: number;
  name: string;
  section: string;
  level?: string;
  photo_url?: string;
}

interface AppState {
  isOffline: boolean;
  isInstallPromptVisible: boolean;
  deferredPrompt: BeforeInstallPromptEvent | null;
  children: Child[];
  activeChildId: number | null;

  // Actions
  setOffline: (offline: boolean) => void;
  setDeferredPrompt: (prompt: BeforeInstallPromptEvent | null) => void;
  dismissInstallPrompt: () => void;
  showInstallPrompt: () => void;
  setChildren: (children: Child[]) => void;
  setActiveChild: (id: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isOffline: typeof navigator !== 'undefined' ? !navigator.onLine : false,
  isInstallPromptVisible: false,
  deferredPrompt: null,
  children: [],
  activeChildId: null,

  setOffline: (offline) => set({ isOffline: offline }),
  setDeferredPrompt: (prompt) => set({ deferredPrompt: prompt, isInstallPromptVisible: !!prompt }),
  dismissInstallPrompt: () => set({ isInstallPromptVisible: false }),
  showInstallPrompt: () => set({ isInstallPromptVisible: true }),
  setChildren: (children) =>
    set((state) => ({
      children,
      activeChildId:
        state.activeChildId && children.some((c) => c.id === state.activeChildId)
          ? state.activeChildId
          : (children[0]?.id ?? null),
    })),
  setActiveChild: (id) => set({ activeChildId: id }),
}));
