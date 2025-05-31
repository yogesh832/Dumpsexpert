import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { instance } from '../lib/axios';
import useAuthStore from '../store/index';

const Login = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const navigate = useNavigate();
const [error, setError] = useState('');
const setUser = useAuthStore((state) => state.setUser);

const handleLogin = async (e) => {
  e.preventDefault();
  const cleanedEmail = email.trim().toLowerCase();

  try {
    const res = await instance.post('/api/auth/signin', {
      email: cleanedEmail,
      password,
    });

    setUser(res.data.user);

    const role = res.data.user.role;
    if (role === 'admin') navigate('/admin/dashboard');
    else if (role === 'student') navigate('/student/dashboard');
    else if (role === 'guest') navigate('/guest/dashboard');
    else navigate('/');
  } catch (err) {
    setError(err.response?.data?.message || 'Login failed');
  }
};

return (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
    <div className="max-w-md w-full p-6 shadow-lg rounded-lg border bg-white">
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
  </div>
);
};

export default Login;
