import React, { useEffect, useState } from "react";
import { Link } from "react-router"; // ✅ Corrected import
import axios from "axios";

const ExamCoursesPage = () => {
  const [examCourses, setExamCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      console.log("📡 Fetching exams...");
      try {
        const response = await axios.get("http://localhost:8000/api/exams"); // adjust if different
        console.log("✅ Data fetched:", response.data);
        setExamCourses(response.data);
      } catch (error) {
        console.error("❌ Error fetching exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  return (
    <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Exam Courses</h1>

      {loading ? (
        <p>Loading exams...</p>
      ) : (
        <div className="space-y-4">
          {examCourses.length === 0 ? (
            <p>No exams available</p>
          ) : (
            examCourses.map((course, index) => (
              <div
                key={index}
                className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
              >
                <span className="text-sm font-medium">
                  {new Date(course.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>

                <span className="text-blue-700 font-semibold text-center mx-4 flex-1">
                  {course.name}
                </span>
                <span className="text-blue-700 font-semibold text-center mx-4 ">
                  {course.code}
                </span>
                <Link to={`/student/courses-exam/instructions/${course._id}`}>
                  <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                    Attempt
                  </button>
                </Link>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ExamCoursesPage;
