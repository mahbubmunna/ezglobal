import { create } from 'zustand';

export interface CompanyBasics {
    legal_type: string;
    license_type: string;
    trade_name_1: string;
    trade_name_2: string;
    trade_name_3: string;
    activities: string[];
    jurisdiction: string;
    free_zone_name: string;
}

export interface Stakeholder {
    id?: number;
    roles: string[];
    first_name: string;
    middle_name?: string;
    last_name: string;
    nationality?: string;
    gender?: string;
    date_of_birth?: string;
    email?: string;
    phone_number?: string;
    uae_resident: boolean;
    passport_number?: string;
    passport_expiry_date?: string;
    emirates_id_number?: string;
    unified_number?: string;
    is_ubo: boolean;
    ownership_percentage?: number;
}

export interface LocationData {
    wait_for_ejari: boolean;
    ejari_number: string;
    package_type: string;
}

export interface DocumentData {
    document_type: string;
    file_path: string;
    stakeholder_id?: number;
}

interface ApplicationStore {
    applicationId: number | null;
    currentStep: number;
    isSubmitting: boolean;

    // Data
    companyBasics: CompanyBasics;
    stakeholders: Stakeholder[];
    location: LocationData;
    documents: DocumentData[];

    // Actions
    setApplicationId: (id: number) => void;
    setStep: (step: number) => void;
    setIsSubmitting: (status: boolean) => void;

    updateCompanyBasics: (data: Partial<CompanyBasics>) => void;

    addStakeholder: (stakeholder: Stakeholder) => void;
    updateStakeholder: (index: number, stakeholder: Partial<Stakeholder>) => void;
    removeStakeholder: (index: number) => void;

    updateLocation: (data: Partial<LocationData>) => void;

    addDocument: (doc: DocumentData) => void;
    resetState: () => void;
}

const defaultCompanyBasics: CompanyBasics = {
    legal_type: '',
    license_type: '',
    trade_name_1: '',
    trade_name_2: '',
    trade_name_3: '',
    activities: [],
    jurisdiction: 'Mainland',
    free_zone_name: ''
};

const defaultLocation: LocationData = {
    wait_for_ejari: false,
    ejari_number: '',
    package_type: ''
};

export const useApplicationStore = create<ApplicationStore>((set) => ({
    applicationId: null,
    currentStep: 1,
    isSubmitting: false,

    companyBasics: defaultCompanyBasics,
    stakeholders: [],
    location: defaultLocation,
    documents: [],

    setApplicationId: (id) => set({ applicationId: id }),
    setStep: (step) => set({ currentStep: step }),
    setIsSubmitting: (status) => set({ isSubmitting: status }),

    updateCompanyBasics: (data) => set((state) => ({ companyBasics: { ...state.companyBasics, ...data } })),

    addStakeholder: (stakeholder) => set((state) => ({ stakeholders: [...state.stakeholders, stakeholder] })),
    updateStakeholder: (index, data) => set((state) => {
        const newStakeholders = [...state.stakeholders];
        newStakeholders[index] = { ...newStakeholders[index], ...data };
        return { stakeholders: newStakeholders };
    }),
    removeStakeholder: (index) => set((state) => ({
        stakeholders: state.stakeholders.filter((_, i) => i !== index)
    })),

    updateLocation: (data) => set((state) => ({ location: { ...state.location, ...data } })),

    addDocument: (doc) => set((state) => ({ documents: [...state.documents, doc] })),

    resetState: () => set({
        applicationId: null,
        currentStep: 1,
        companyBasics: defaultCompanyBasics,
        stakeholders: [],
        location: defaultLocation,
        documents: []
    })
}));
