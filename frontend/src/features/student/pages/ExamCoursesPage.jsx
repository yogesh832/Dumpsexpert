import React from "react";

const examCourses = [
  {
    date: "25/05/2025",
    title: "C_FIORC_2502 – SAP Certified Associate – SAP Fiori Application Developer"
  },
  {
    date: "20/04/2025",
    title: "C_TS4FI_2023 – SAP Certified Application Associate – SAP S/4HANA for Financial Accounting"
  },
  {
    date: "10/06/2025",
    title: "C_TADM_23 – SAP Certified Technology Associate – System Administration"
  },
  {
    date: "05/05/2025",
    title: "C_HCDEV_2305 – SAP Certified Development Associate – SAP HANA Cloud"
  },
  {
    date: "30/03/2025",
    title: "C_ARCIG_2308 – SAP Certified Application Associate – SAP Ariba Integration"
  }
];

const ExamCoursesPage = () => {
  return (
    <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Exam Courses</h1>
      <div className="space-y-4">
        {examCourses.map((course, index) => (
          <div
            key={index}
            className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
          >
            <span className="text-sm font-medium">{course.date}</span>
            <span className="text-blue-700 font-semibold text-center mx-4">
              {course.title}
            </span>
            <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
              Attempt
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamCoursesPage;
