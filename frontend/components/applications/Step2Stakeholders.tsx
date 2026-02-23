'use client';

import { useState } from 'react';
import { useApplicationStore, Stakeholder } from '@/store/applicationStore';

export default function Step2Stakeholders() {
    const { stakeholders, addStakeholder, updateStakeholder, removeStakeholder, currentStep, setStep, applicationId, isSubmitting, setIsSubmitting } = useApplicationStore();
    const [isFormOpen, setIsFormOpen] = useState(stakeholders.length === 0);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);

    const emptyStakeholder: Stakeholder = {
        roles: ['Shareholder'],
        first_name: '',
        middle_name: '',
        last_name: '',
        nationality: '',
        gender: '',
        date_of_birth: '',
        email: '',
        phone_number: '',
        uae_resident: false,
        passport_number: '',
        passport_expiry_date: '',
        emirates_id_number: '',
        unified_number: '',
        is_ubo: false
    };

    const [formState, setFormState] = useState<Stakeholder>(emptyStakeholder);

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
        setFormState({ ...formState, [e.target.name]: value });
    };

    const toggleRole = (role: string) => {
        const newRoles = formState.roles.includes(role)
            ? formState.roles.filter(r => r !== role)
            : [...formState.roles, role];
        setFormState({ ...formState, roles: newRoles });
    };

    const saveStakeholder = () => {
        if (!formState.first_name || !formState.last_name || formState.roles.length === 0) {
            alert("Please fill in the required fields (First Name, Last Name, Roles)");
            return;
        }

        if (editingIndex !== null) {
            updateStakeholder(editingIndex, formState);
            setEditingIndex(null);
        } else {
            addStakeholder(formState);
        }
        setIsFormOpen(false);
        setFormState(emptyStakeholder);
    };

    const editStakeholder = (index: number) => {
        setFormState(stakeholders[index]);
        setEditingIndex(index);
        setIsFormOpen(true);
    };

    const handleSubmit = async () => {
        if (stakeholders.length === 0) {
            alert("Please add at least one stakeholder.");
            return;
        }
        setIsSubmitting(true);
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1'}/applications/${applicationId}/stakeholders`;
            const res = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(stakeholders)
            });
            if (!res.ok) throw new Error("Failed to save default");
            setStep(currentStep + 1);
        } catch (err) {
            console.error(err);
            alert("Error saving stakeholders");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Stakeholders</h2>
                    <p className="text-gray-500">Add all partners, shareholders, managers, and directors.</p>
                </div>
                {!isFormOpen && (
                    <button
                        onClick={() => { setFormState(emptyStakeholder); setIsFormOpen(true); }}
                        className="bg-[#494FBB]/10 text-[#494FBB] hover:bg-[#494FBB]/20 px-4 py-2 rounded-xl font-bold transition-colors"
                    >
                        + Add Stakeholder
                    </button>
                )}
            </div>

            {/* List of Stakeholders */}
            {!isFormOpen && stakeholders.length > 0 && (
                <div className="space-y-4">
                    {stakeholders.map((st, i) => (
                        <div key={i} className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-200 gap-4">
                            <div>
                                <h4 className="font-bold text-gray-900">{st.first_name} {st.last_name}</h4>
                                <div className="text-sm text-gray-500 flex gap-2 mt-1">
                                    {st.roles.map(r => (
                                        <span key={r} className="bg-gray-200 px-2 py-0.5 rounded text-xs">{r}</span>
                                    ))}
                                    {st.uae_resident && <span className="bg-[#10b981]/10 text-[#10b981] px-2 py-0.5 rounded text-xs font-semibold">Resident</span>}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => editStakeholder(i)} className="text-[#494FBB] hover:underline text-sm font-semibold">Edit</button>
                                <button onClick={() => removeStakeholder(i)} className="text-red-500 hover:underline text-sm font-semibold">Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty State */}
            {!isFormOpen && stakeholders.length === 0 && (
                <div className="text-center p-12 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl">
                    <p className="text-gray-500 font-medium mb-4">No stakeholders added yet.</p>
                </div>
            )}

            {/* Stakeholder Form */}
            {isFormOpen && (
                <div className="bg-white border border-gray-200 shadow-xl shadow-gray-200/50 rounded-2xl p-6 relative">
                    <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                        ✕
                    </button>
                    <h3 className="text-lg font-bold text-gray-900 mb-6">{editingIndex !== null ? 'Edit' : 'Add'} Stakeholder</h3>

                    <div className="space-y-6">
                        {/* Roles */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Roles (Select all that apply)</label>
                            <div className="flex gap-3">
                                {['Shareholder', 'Manager', 'Director'].map(role => (
                                    <label key={role} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formState.roles.includes(role)}
                                            onChange={() => toggleRole(role)}
                                            className="w-4 h-4 text-[#494FBB] rounded border-gray-300 focus:ring-[#494FBB]"
                                        />
                                        <span className="text-sm font-medium text-gray-700">{role}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Personal Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">First Name *</label>
                                <input type="text" name="first_name" value={formState.first_name} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]" required />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Middle Name</label>
                                <input type="text" name="middle_name" value={formState.middle_name} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Last Name *</label>
                                <input type="text" name="last_name" value={formState.last_name} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]" required />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Nationality</label>
                                <input type="text" name="nationality" value={formState.nationality} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Gender</label>
                                <select name="gender" value={formState.gender} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]">
                                    <option value="">Select...</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Date of Birth</label>
                                <input type="date" name="date_of_birth" value={formState.date_of_birth} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]" />
                            </div>
                        </div>

                        {/* Contact & Residency */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                                <input type="email" name="email" value={formState.email} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Phone Number</label>
                                <input type="text" name="phone_number" value={formState.phone_number} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]" />
                            </div>
                        </div>

                        {/* Identifications */}
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl space-y-4">
                            <label className="flex items-center gap-2 cursor-pointer mb-2">
                                <input
                                    type="checkbox"
                                    name="uae_resident"
                                    checked={formState.uae_resident}
                                    onChange={handleFormChange}
                                    className="w-4 h-4 text-[#494FBB] rounded border-gray-300 focus:ring-[#494FBB]"
                                />
                                <span className="font-bold text-gray-900">Is a UAE Resident?</span>
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Passport Number</label>
                                    <input type="text" name="passport_number" value={formState.passport_number} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Passport Expiry Date</label>
                                    <input type="date" name="passport_expiry_date" value={formState.passport_expiry_date} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]" />
                                </div>

                                {formState.uae_resident && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Emirates ID Number</label>
                                            <input type="text" name="emirates_id_number" value={formState.emirates_id_number} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]" />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Unified Number (UID)</label>
                                            <input type="text" name="unified_number" value={formState.unified_number} onChange={handleFormChange} className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#494FBB]" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <button onClick={() => setIsFormOpen(false)} className="px-6 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                            <button onClick={saveStakeholder} className="bg-gray-900 hover:bg-black text-white px-8 py-2 rounded-xl font-bold transition-all shadow-lg shadow-black/10">Save Stakeholder</button>
                        </div>
                    </div>
                </div>
            )}

            {!isFormOpen && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-12 z-20 md:relative md:border-0 md:bg-transparent md:p-0 md:mt-8">
                    <div className="flex justify-between max-w-4xl mx-auto">
                        <button onClick={() => setStep(currentStep - 1)} className="text-gray-500 font-bold hover:text-gray-900 px-4 py-3">← Back</button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || stakeholders.length === 0}
                            className="bg-[#494FBB] hover:opacity-90 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#494FBB]/20 disabled:opacity-50 disabled:shadow-none"
                        >
                            {isSubmitting ? 'Saving...' : 'Save & Continue'}
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
