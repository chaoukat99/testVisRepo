import { create } from 'zustand';

interface OnboardingState {
    isTourActive: boolean;
    robotMessage: string | null;
    robotPosition: { top: string; left: string } | null;
    currentStepIndex: number;
    totalSteps: number;
    highlightedElement: string | null;
    startTour: (totalSteps: number) => void;
    endTour: () => void;
    setRobotMessage: (message: string | null) => void;
    setRobotPosition: (position: { top: string; left: string } | null) => void;
    setCurrentStepIndex: (index: number) => void;
    setHighlightedElement: (id: string | null) => void;
    onNextStep: (() => void) | null;
    onPrevStep: (() => void) | null;
    setNavHandlers: (next: (() => void) | null, prev: (() => void) | null) => void;
    isIntroActive: boolean;
    setIntroActive: (active: boolean) => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
    isTourActive: false,
    robotMessage: null,
    robotPosition: null,
    currentStepIndex: 0,
    totalSteps: 0,
    highlightedElement: null,
    onNextStep: null,
    onPrevStep: null,
    isIntroActive: false,
    setIntroActive: (active) => set({ isIntroActive: active }),
    startTour: (total) => set({ isTourActive: true, totalSteps: total, currentStepIndex: 0 }),
    endTour: () => {
        set({ isTourActive: false, robotMessage: null, robotPosition: null, currentStepIndex: 0, highlightedElement: null });
        localStorage.setItem('hasSeenNavbarTour', 'true');
    },
    setRobotMessage: (message) => set({ robotMessage: message }),
    setRobotPosition: (position) => set({ robotPosition: position }),
    setCurrentStepIndex: (index) => set({ currentStepIndex: index }),
    setHighlightedElement: (id) => set({ highlightedElement: id }),
    setNavHandlers: (next, prev) => set({ onNextStep: next, onPrevStep: prev }),
}));



