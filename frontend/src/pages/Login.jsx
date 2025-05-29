import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { instance } from '../lib/axios'; 

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const cleanedEmail = email.trim().toLowerCase();
        // console.log('Sending payload:', { email: cleanedEmail, password });
        try {
            const res = await instance.post('/api/auth/signin', { email: cleanedEmail, password });
            console.log('Login success:', res.data);
            navigate('/dashboard'); 
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg border">
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
                <div>
                    <label className="block mb-1">Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block mb-1">Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded"
                    />
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    Login
                </button>
            </form>

            <p className="mt-4 text-center text-sm">
                Don't have an account?{' '}
                <span
                    onClick={() => navigate('/register')}
                    className="text-blue-600 cursor-pointer underline"
                >
                    Sign up
                </span>
            </p>
        </div>
    );
};

export default Login;
