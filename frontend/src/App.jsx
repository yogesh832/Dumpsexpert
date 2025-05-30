import { Route, Routes } from "react-router";

import PublicLayout from "./layout/PublicLayout";
import PrivateAdminLayout from "./layout/PrivateAdminLayout";
import PrivateStudentLayout from "./layout/PrivateStudentLayout";
import PrivateGuestLayout from "./layout/PrivateGuestLayout";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";

import PrivateRoute from "./routes/PrivateRoutes";
import StudentDashboard from "./features/student/pages/StudentDashboard";
import GuestDashboard from "./features/guest/pages/GuestDashboard";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import AboutUs from "./components/shared/AboutUs";

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* Admin routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<PrivateAdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>

      {/* Student routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<PrivateStudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
        </Route>
      </Route>

      {/* Guest routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<PrivateGuestLayout />}>
          <Route path="/guest/dashboard" element={<GuestDashboard />} />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
