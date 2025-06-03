import React from "react";

const PdfCoursesPage = () => {
const courseData = [
  {
    date: "25/05/2025",
    title: "C_S4PM_2504 - SAP Certified Associate - Managing SAP S/4HANA Cloud Public Edition Projects"
  },
  {
    date: "12/04/2025",
    title: "AZ-104 - Microsoft Azure Administrator Associate"
  },
  {
    date: "30/03/2025",
    title: "AWS Certified Solutions Architect – Associate (SAA-C03)"
  },
  {
    date: "15/06/2025",
    title: "Google Cloud Digital Leader Certification"
  },
  {
    date: "22/07/2025",
    title: "Certified Kubernetes Administrator (CKA)"
  },
  {
    date: "09/08/2025",
    title: "Oracle Cloud Infrastructure Foundations 2023 Certified Associate"
  }
];

  return (
    <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>
      <div className="space-y-4">
        {courseData.map((course, index) => (
          <div
            key={index}
            className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
          >
            <span className="text-sm font-medium">{course.date}</span>
            <span className="text-blue-700 font-semibold text-center mx-4">
              {course.title}
            </span>
            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
              Download File
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PdfCoursesPage;
