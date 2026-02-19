import {create} from "zustand";
import {persist} from "zustand/middleware";

interface GlobalSettingsState {
  touchscreenMode: boolean;
  muteAudio: boolean;
  setTouchscreenMode: (touchscreenMode: boolean) => void;
  setMuteAudio: (muteAudio: boolean) => void;
}

export const useGlobalSettingsStore = create<GlobalSettingsState>()(
  persist((set) => ({
    touchscreenMode: false,
    muteAudio: false,
    setTouchscreenMode: (touchscreenMode) => set({touchscreenMode}),
    setMuteAudio: (muteAudio) => set({muteAudio})
  }), {name: "GlobalSettings"})
);
