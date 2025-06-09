import React, { useState } from 'react';

const EmailConfigToAdmin = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add an API call or logic to handle the email submission here
    console.log('Submitted email:', email);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-6">Mail To Admin</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email Address<span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email address"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailConfigToAdmin;
