import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RegisterData {
    first_name: string;
    middle_name: string;
    last_name: string;
    email: string;
}

interface RegisterState {
    step: number;
    data: RegisterData;
    updateData: (data: Partial<RegisterData>) => void;
    setStep: (step: number) => void;
    reset: () => void;
}

export const useRegisterStore = create<RegisterState>()(
    persist(
        (set) => ({
            step: 1,
            data: {
                first_name: '',
                middle_name: '',
                last_name: '',
                email: '',
            },
            updateData: (newData) => set((state) => ({ data: { ...state.data, ...newData } })),
            setStep: (step) => set({ step }),
            reset: () => set({
                step: 1,
                data: {
                    first_name: '',
                    middle_name: '',
                    last_name: '',
                    email: '',
                }
            }),
        }),
        {
            name: 'register-storage',
        }
    )
);
