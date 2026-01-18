import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Partner {
    id: string;
    name: string;
    nationality: string;
    role?: string;
}

export interface BusinessSetupData {
    // Step 1: Activities
    activities: string[]; // Store activity IDs or names

    // Step 2: Partners
    partners: Partner[];

    // Step 3: Legal Type
    legalType: string;

    // Future steps placeholders
}

interface BusinessSetupState {
    currentStep: number;
    totalSteps: number;
    data: BusinessSetupData;

    // Actions
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    updateData: (data: Partial<BusinessSetupData>) => void;
    addPartner: (partner: Partner) => void;
    removePartner: (id: string) => void;
    reset: () => void;
}

export const useBusinessSetupStore = create<BusinessSetupState>()(
    persist(
        (set) => ({
            currentStep: 1,
            totalSteps: 12,
            data: {
                activities: [],
                partners: [],
                legalType: '',
            },

            setStep: (step) => set({ currentStep: step }),
            nextStep: () => set((state) => ({
                currentStep: Math.min(state.currentStep + 1, state.totalSteps)
            })),
            prevStep: () => set((state) => ({
                currentStep: Math.max(state.currentStep - 1, 1)
            })),
            updateData: (newData) => set((state) => ({
                data: { ...state.data, ...newData }
            })),
            addPartner: (partner) => set((state) => ({
                data: { ...state.data, partners: [...state.data.partners, partner] }
            })),
            removePartner: (id) => set((state) => ({
                data: { ...state.data, partners: state.data.partners.filter(p => p.id !== id) }
            })),
            reset: () => set({
                currentStep: 1,
                data: {
                    activities: [],
                    partners: [],
                    legalType: '',
                }
            }),
        }),
        {
            name: 'business-setup-storage',
            partialize: (state) => ({
                currentStep: state.currentStep,
                data: state.data
            }),
        }
    )
);
