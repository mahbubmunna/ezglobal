'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useRegisterStore } from '@/store/registerStore';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';
import { Eye, EyeOff } from 'lucide-react';
import AuthLayout from '@/app/components/AuthLayout';

export default function RegisterStep3() {
    const router = useRouter();
    const { data, reset } = useRegisterStore();
    const { setAuth } = useAuthStore();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await api.post('/auth/register/set-password', {
                email: data.email,
                password: password
            });

            // Backend returns UserResponse and sets cookies
            const user = response.data;

            setAuth(user);
            reset(); // Reset registration store
            router.push('/dashboard');

        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to set password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    <span className="text-indigo-600">EZ</span>Global
                </h1>
                <h2 className="text-xl font-bold text-gray-900">Create your Password</h2>
            </div>
            {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Your Username</label>
                    <input
                        type="text"
                        disabled
                        className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-500 bg-gray-100 cursor-not-allowed text-sm"
                        value={data.email || 'name@company.com'}
                    />
                </div>

                <div className="relative">
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Password</label>
                    <div className="relative">
                        <input
                            name="password"
                            type={showPassword ? "text" : "password"}
                            required
                            className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-400 hover:text-indigo-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Confirm Password</label>
                    <div className="relative">
                        <input
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            className="block w-full px-4 py-3 border border-gray-200 rounded-lg text-gray-900 bg-gray-50/50 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-sm"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            className="absolute right-3 top-3 text-gray-400 hover:text-indigo-500"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-70"
                    >
                        {loading ? 'Registering...' : 'Next'}
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
}
