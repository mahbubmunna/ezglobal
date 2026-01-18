'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterStore } from '@/store/registerStore';
import api from '@/lib/api';
import AuthLayout from '../../components/AuthLayout';
import Link from 'next/link';

export default function RegisterStep1() {
    const router = useRouter();
    const { data, updateData } = useRegisterStore();

    // Internal step state to switch between "Details" and "Email"
    const [step, setStep] = useState<'details' | 'email'>('details');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        first_name: data.first_name,
        middle_name: data.middle_name,
        last_name: data.last_name,
        email: data.email,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleNextToEmail = (e: React.FormEvent) => {
        e.preventDefault();
        // Validation for details
        if (!formData.first_name || !formData.last_name) {
            setError('Please enter your first and last name.');
            return;
        }
        setError('');
        setStep('email');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register/start', formData);
            updateData(formData);
            router.push('/register/step-2');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            {step === 'details' ? (
                <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Please enter your Details</h2>
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                    <form className="space-y-4" onSubmit={handleNextToEmail}>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">First Name *</label>
                            <input
                                name="first_name"
                                type="text"
                                className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                placeholder="Enter your First Name"
                                value={formData.first_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Middle Name</label>
                            <input
                                name="middle_name"
                                type="text"
                                className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                placeholder="Enter your Middle Name"
                                value={formData.middle_name}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Last Name *</label>
                            <input
                                name="last_name"
                                type="text"
                                className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                placeholder="Enter your Last Name"
                                value={formData.last_name}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
                            >
                                Next
                            </button>
                        </div>

                        <div className="mt-6 text-center text-xs text-gray-500">
                            Already have an account? <Link href="/login" className="text-indigo-600 hover:text-indigo-500 font-bold">Log in here</Link>
                        </div>
                    </form>
                </>
            ) : (
                <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">What is your Email address?</h2>
                    {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Email address *</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                                placeholder="name@company.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="pt-4 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setStep('details')}
                                className="w-1/3 flex justify-center py-3 px-4 border border-gray-200 rounded-lg shadow-sm text-sm font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-all"
                            >
                                Back
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-2/3 flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
                            >
                                {loading ? 'Processing...' : 'Next'}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </AuthLayout>
    );
}
