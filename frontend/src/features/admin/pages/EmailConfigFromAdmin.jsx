import React, { useState } from 'react';

const EmailConfigFromAdmin = () => {
  const [formData, setFormData] = useState({
    smtpStatus: 'Activated',
    mailEngine: '',
    smtpHost: '',
    smtpPort: '',
    encryption: '',
    smtpUsername: '',
    smtpPassword: '',
    fromEmail: '',
    fromName: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add submission logic here (e.g. API call)
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-10">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Mail From Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* SMTP Status */}
          <div>
            <label className="block mb-1 font-medium">
              SMTP<span className="text-red-500">*</span>
            </label>
            <select
              name="smtpStatus"
              value={formData.smtpStatus}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="Activated">Activated</option>
              <option value="Deactivated">Deactivated</option>
            </select>
          </div>

          {/* Mail Engine */}
          <div>
            <label className="block mb-1 font-medium">
              Mail Engine<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="mailEngine"
              value={formData.mailEngine}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* SMTP HOST */}
          <div>
            <label className="block mb-1 font-medium">
              SMTP HOST<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="smtpHost"
              value={formData.smtpHost}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* SMTP PORT */}
          <div>
            <label className="block mb-1 font-medium">
              SMTP PORT<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="smtpPort"
              value={formData.smtpPort}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Encryption */}
          <div>
            <label className="block mb-1 font-medium">Encryption</label>
            <input
              type="text"
              name="encryption"
              value={formData.encryption}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          {/* SMTP Username */}
          <div>
            <label className="block mb-1 font-medium">
              SMTP Username<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="smtpUsername"
              value={formData.smtpUsername}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* SMTP Password */}
          <div>
            <label className="block mb-1 font-medium">
              SMTP Password<span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="smtpPassword"
              value={formData.smtpPassword}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* From Email */}
          <div>
            <label className="block mb-1 font-medium">
              From Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="fromEmail"
              value={formData.fromEmail}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* From Name */}
          <div>
            <label className="block mb-1 font-medium">
              From Name<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fromName"
              value={formData.fromName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailConfigFromAdmin;
