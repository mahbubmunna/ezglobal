'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterStore } from '@/store/registerStore';
import api from '@/lib/api';

export default function RegisterStep2() {
    const router = useRouter();
    const { data } = useRegisterStore();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await api.post('/auth/register/verify-otp', {
                email: data.email,
                code: otp
            });
            router.push('/register/step-3');
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Invalid OTP');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full space-y-8 p-8 bg-white rounded shadow">
                <h2 className="text-3xl font-bold text-center">Verify OTP</h2>
                <p className="text-center text-gray-600">Sent to {data.email}</p>
                {error && <div className="text-red-500 text-center">{error}</div>}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <input
                            name="otp"
                            type="text"
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Verifying...' : 'Next'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
