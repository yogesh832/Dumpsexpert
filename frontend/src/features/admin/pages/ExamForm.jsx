import React from "react";

const ExamForm = ({ exam, setView }) => {
  const isEditing = Boolean(exam);

  return (
    <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 space-y-8">
      {/* Back & Title */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => setView("list")}
          className="text-sm text-gray-600 hover:underline"
        >
          ← Back
        </button>
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800">
          {isEditing ? "Edit Exam" : "Add New Exam"}
        </h2>
      </div>

      {/* Form */}
      <form className="bg-white rounded-xl border border-gray-200 shadow p-6 md:p-10 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {[
            { label: "Exam Name", placeholder: "e.g. Final Test" },
            { label: "Each Question Mark", placeholder: "e.g. 2" },
            { label: "Duration (Minutes)", placeholder: "e.g. 60" },
            { label: "Sample Duration (Minutes)", placeholder: "e.g. 30" },
            { label: "Passing Score (%)", placeholder: "e.g. 50" },
            { label: "Exam Code", placeholder: "e.g. EX-123" },
            { label: "Number of Questions", placeholder: "e.g. 20" },
            { label: "Price ($)", placeholder: "e.g. 10" },
            { label: "Price (₹)", placeholder: "e.g. 799" },
          ].map((field, i) => (
            <div key={i}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              <input
                type="text"
                placeholder={field.placeholder}
                className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm focus:ring focus:ring-blue-100"
              />
            </div>
          ))}

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm">
              <option value="unpublish">Unpublish</option>
              <option value="publish">Publish</option>
            </select>
          </div>
        </div>

        {/* Instructions */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Main Exam Instructions
            </label>
            <textarea
              className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm h-28 resize-none"
              placeholder="Write instructions for the main exam..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sample Exam Instructions
            </label>
            <textarea
              className="w-full border rounded-lg px-4 py-2 text-sm shadow-sm h-28 resize-none"
              placeholder="Write instructions for the sample exam..."
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg shadow"
          >
            {isEditing ? "Update Exam" : "Save Exam"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExamForm;
