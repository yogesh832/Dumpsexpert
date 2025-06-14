import React, { useState } from "react";
import { useNavigate } from "react-router";
import { instance } from "../lib/axios";
import useAuthStore from "../store";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF } from "react-icons/fa";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineKey } from "react-icons/hi";

const Register = () => {
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isValidEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleSendOtp = async () => {
    if (!isValidEmail(email)) {
      setMessage("Please enter a valid email");
      return;
    }

    setLoading(true);
    try {
      const res = await instance.post("/api/auth/email/send-otp", { email });
      if (res.status === 200) {
        setMessage("OTP sent successfully");
        setError("");
        setStep("otp");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send OTP");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setMessage("Please enter OTP");
      return;
    }

    setLoading(true);
    try {
      const res = await instance.post("/api/auth/email/verify-otp", { email, otp });
      if (res.status === 200) {
        setMessage("OTP verified");
        setError("");
        setStep("password");
      }
    } catch (err) {
      setError(err.response?.data?.message || "OTP verification failed");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitPassword = async () => {
    if (password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await instance.post("/api/auth/signup", { email, password });
      setUser(res.data.user);
      navigate("/guest/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">Register</h2>

        {/* Message Boxes */}
        {message && (
          <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded text-sm text-center">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">
            {error}
          </div>
        )}

        {/* Step-based Email Registration */}
        {step === "email" && (
          <div className="space-y-4 mb-6">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <div className="relative">
              <input
                type="email"
                className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <HiOutlineMail className="absolute top-2.5 left-3 text-gray-400 text-lg" />
            </div>
            <button
              onClick={handleSendOtp}
              disabled={!isValidEmail(email) || loading}
              className={`w-full py-2 rounded-md text-white transition-all duration-300 ${
                isValidEmail(email) && !loading
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4 mb-6">
            <label className="block text-sm font-medium text-gray-700">OTP</label>
            <div className="relative">
              <input
                type="text"
                className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                placeholder="OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <HiOutlineKey className="absolute top-2.5 left-3 text-gray-400 text-lg" />
            </div>
            <button
              onClick={handleVerifyOtp}
              disabled={!otp.trim() || loading}
              className={`w-full py-2 rounded-md text-white transition-all duration-300 ${
                otp.trim() && !loading
                  ? "bg-yellow-500 hover:bg-yellow-600"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        )}

        {step === "password" && (
          <div className="space-y-4 mb-6">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input
                type="password"
                className="w-full px-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <HiOutlineLockClosed className="absolute top-2.5 left-3 text-gray-400 text-lg" />
            </div>
            <button
              onClick={handleSubmitPassword}
              disabled={password.length < 6 || loading}
              className={`w-full py-2 rounded-md text-white transition-all duration-300 ${
                password.length >= 6 && !loading
                  ? "bg-purple-600 hover:bg-purple-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {loading ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">or continue with</span>
          </div>
        </div>

        {/* OAuth Buttons (Now at Bottom) */}
        <div className="flex flex-col gap-4">
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
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
