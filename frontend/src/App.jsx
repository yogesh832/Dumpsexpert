import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";
import LoadingSpinner from "./components/ui/LoadingSpinner";

const PublicLayout         = lazy(() => import("./layout/PublicLayout.jsx"));
const PrivateAdminLayout   = lazy(() => import("./layout/PrivateAdminLayout.jsx"));
const PrivateStudentLayout = lazy(() => import("./layout/PrivateStudentLayout.jsx"));
const PrivateGuestLayout   = lazy(() => import("./layout/PrivateGuestLayout.jsx"));

const Home                 = lazy(() => import("./pages/Home"));
const NotFound             = lazy(() => import("./pages/NotFound"));
const AboutUs                = lazy(() => import("./pages/AboutUs"));
const Contact              = lazy(() => import("./pages/Contact"));
const Cart                 = lazy(() => import("./pages/Cart"));
const Login                = lazy(() => import("./pages/Login"));
const Register             = lazy(() => import("./pages/Register"));

const PrivateRoute         = lazy(() => import("./routes/PrivateRoutes"));

const StudentDashboard     = lazy(() => import("./features/student/pages/StudentDashboard"));
const GuestDashboard       = lazy(() => import("./features/guest/pages/GuestDashboard"));
const AdminDashboard       = lazy(() => import("./features/admin/pages/AdminDashboard"));

const MonthlySaleReport    = lazy(() => import("./features/admin/pages/MonthlySaleReport"));
const WebCustomization     = lazy(() => import("./features/admin/pages/WebCustomization"));
const BasicInformation     = lazy(() => import("./features/admin/pages/BasicInformation"));
const MenuBuilder          = lazy(() => import("./features/admin/pages/MenuBuilder"));
const SocialLinks          = lazy(() => import("./features/admin/pages/SocialLinks"));
const SEOSettings          = lazy(() => import("./features/admin/pages/SEOSettings"));
const MaintenanceMode      = lazy(() => import("./features/admin/pages/MaintenanceMode"));
const Announcement         = lazy(() => import("./features/admin/pages/Announcement"));
const PreloaderSettings    = lazy(() => import("./features/admin/pages/PreloaderSettings"));
const FooterInfo           = lazy(() => import("./features/admin/pages/FooterInfo"));
const GeneralSettings      = lazy(() => import("./features/admin/pages/GeneralSettings"));
const EmailConfiguration   = lazy(() => import("./features/admin/pages/EmailConfiguration"));
const ScriptsPage          = lazy(() => import("./features/admin/pages/ScriptsPage"));
const CookieAlert          = lazy(() => import("./features/admin/pages/CookieAlert"));
const CustomCSS            = lazy(() => import("./features/admin/pages/CustomCSS"));
const PaymentSettings      = lazy(() => import("./features/admin/pages/PaymentSettings"));
const ProductManagement    = lazy(() => import("./features/admin/pages/ProductManagement"));
const OrdersManagement     = lazy(() => import("./features/admin/pages/OrdersManagement"));
const CustomersManagement  = lazy(() => import("./features/admin/pages/CustomersManagement"));
const ExamManagement       = lazy(() => import("./features/admin/pages/ExamManagement"));
const MediaManagement      = lazy(() => import("./features/admin/pages/MediaManagement"));
const BlogManagement       = lazy(() => import("./features/admin/pages/BlogManagement"));
const SubscribersManagement= lazy(() => import("./features/admin/pages/SubscribersManagement"));
const SettingsPage         = lazy(() => import("./features/admin/pages/SettingsPage"));

import AuthProvider from "./layout/AuthProvider";



const App = () => {
  return (
    <AuthProvider>
      <Suspense fallback={<LoadingSpinner />}>
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
              <Route path="/admin/monthly-sale-report" element={<MonthlySaleReport />} />
              <Route path="/admin/web-customization" element={<WebCustomization />} />
              <Route path="/admin/basic-information" element={<BasicInformation />} />
              <Route path="/admin/menu-builder" element={<MenuBuilder />} />
              <Route path="/admin/social-links" element={<SocialLinks />} />
              <Route path="/admin/seo-settings" element={<SEOSettings />} />
              <Route path="/admin/maintenance-mode" element={<MaintenanceMode />} />
              <Route path="/admin/announcement" element={<Announcement />} />
              <Route path="/admin/preloader-settings" element={<PreloaderSettings />} />
              <Route path="/admin/footer-info" element={<FooterInfo />} />
              <Route path="/admin/general-settings" element={<GeneralSettings />} />
              <Route path="/admin/email-configuration" element={<EmailConfiguration />} />
              <Route path="/admin/scripts" element={<ScriptsPage />} />
              <Route path="/admin/cookie-alert" element={<CookieAlert />} />
              <Route path="/admin/custom-css" element={<CustomCSS />} />
              <Route path="/admin/payment-settings" element={<PaymentSettings />} />
              <Route path="/admin/product-management" element={<ProductManagement />} />
              <Route path="/admin/orders-management" element={<OrdersManagement />} />
              <Route path="/admin/customers-management" element={<CustomersManagement />} />
              <Route path="/admin/exam-management" element={<ExamManagement />} />
              <Route path="/admin/media-management" element={<MediaManagement />} />
              <Route path="/admin/blog-management" element={<BlogManagement />} />
              <Route path="/admin/subscribers-management" element={<SubscribersManagement />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
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
      </Suspense>
    </AuthProvider>
  );
};

export default App;
