import React, { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

const ExamCoursesPage = () => {
  const [examCourses, setExamCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("studentId");
        if (!userId) {
          console.error("No user ID found in localStorage");
          return;
        }

        const res = await axios.get(`http://localhost:8000/api/orders/user/${userId}`, {
          withCredentials: true,
        });

const orders = res.data?.data || []; // ✅ FIXED HERE
        const { examCourses } = separateCoursesByType(orders);
        setExamCourses(examCourses);
        console.log("exam courses", examCourses);
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);


  const handleAttemptClick = async (courseId) => {
  const res = await axios.get(`http://localhost:8000/api/exams/byCourseId/${courseId}`);
  const examId = res.data._id;
  Navigate(`/student/courses-exam/instructions/${examId}`);
};
  return (
    <div className="bg-white text-black p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Exam Courses</h1>
      {loading ? (
        <p>Loading exams...</p>
      ) : examCourses.length === 0 ? (
        <p>No exams found</p>
      ) : (
        <div className="space-y-4">
          {examCourses.map((course, index) => (
            <div
              key={index}
              className="flex items-center justify-between border p-4 rounded-lg shadow-sm"
            >
              <span className="text-sm font-medium">
                {new Date(course.createdAt).toLocaleDateString("en-GB")}
              </span>
              <span className="text-blue-700 font-semibold text-center mx-4 flex-1">
                {course.name}
              </span>
              <span className="text-blue-700 font-semibold text-center mx-4">
                {course.code}
              </span>
            <button
  onClick={() => handleAttemptClick(course._id)}
  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
>
  Attempt
</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamCoursesPage;

// Helper
function separateCoursesByType(orders) {
  const pdfCourses = [];
  const examCourses = [];

  orders.forEach(order => {
    order.courseDetails.forEach(course => {
      if (course.name?.toLowerCase().includes("[pdf]")) {
        pdfCourses.push({
          name: course.name,
          code: course.sapExamCode,
          date: new Date(order.purchaseDate).toLocaleDateString("en-GB"),
          downloadUrl: course.mainPdfUrl || course.samplePdfUrl,
        });
      } else if (course.name?.toLowerCase().includes("[online exam]")) {
        examCourses.push({
          _id: course._id,
          name: course.name,
          code: course.sapExamCode,
          createdAt: order.purchaseDate,
        });
      }
    });
  });

  return { pdfCourses, examCourses };
}
