import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { instance } from '../lib/axios'; 


const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const res = await instance.post('/api/auth/signup', { email, password });
            console.log('Registration success:', res.data);
            navigate('/dashboard'); 
        } catch (err) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-lg border">
            <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4">
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
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                    Register
                </button>
            </form>

            <p className="mt-4 text-center text-sm">
                Already have an account?{' '}
                <span
                    onClick={() => navigate('/login')}
                    className="text-blue-600 cursor-pointer underline"
                >
                    Login
                </span>
            </p>
        </div>
    );
};

export default Register;
