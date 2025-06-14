import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { instance } from '../lib/axios';
import useAuthStore from '../store/index';
import { FcGoogle } from 'react-icons/fc';
import { FaFacebookF } from 'react-icons/fa';
import { HiOutlineMail, HiOutlineLockClosed } from 'react-icons/hi';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const setUser = useAuthStore((state) => state.setUser);
  
  // Check for error parameters in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorParam = params.get('error');
    
    if (errorParam === 'auth_failed') {
      setError('Authentication failed. Please try again.');
    }
  }, [location]);

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
    <div className="min-h-screen flex items-center mt-12 justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Login</h2>

        {/* OAuth Buttons */}
        
        {/* Email/Password Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Email"
              />
              <HiOutlineMail className="absolute top-2.5 left-3 text-gray-400 text-lg" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Password"
              />
              <HiOutlineLockClosed className="absolute top-2.5 left-3 text-gray-400 text-lg" />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-all duration-200"
          >
            Login
          </button>
        </form>
<div className="py-6 text-center  text-gray-400">--------------------- OR --------------------</div>

<div className="flex flex-col gap-4 mb-6">
          <a href="https://dumpsexpert-2.onrender.com/api/auth/google">
            <button className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-red-100 hover:bg-red-200 text-red-600 font-semibold rounded-md transition-all duration-200">
              <FcGoogle className="text-xl" /> Google
            </button>
          </a>
          <a href="https://dumpsexpert-2.onrender.com/api/auth/facebook">
            <button className="flex items-center justify-center gap-2 w-full py-2 px-4 bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold rounded-md transition-all duration-200">
              <FaFacebookF className="text-xl" /> Facebook
            </button>
          </a>
        </div>
        <p className="mt-6 text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <span
            onClick={() => navigate('/register')}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
