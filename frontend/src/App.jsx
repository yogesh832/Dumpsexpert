import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";
import LoadingSpinner from "./components/ui/LoadingSpinner";

const PublicLayout         = lazy(() => import("./layout/PublicLayout"));
const PrivateAdminLayout   = lazy(() => import("./layout/PrivateAdminLayout"));
const PrivateStudentLayout = lazy(() => import("./layout/PrivateStudentLayout"));
const PrivateGuestLayout   = lazy(() => import("./layout/PrivateGuestLayout"));

const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

const PrivateRoute = lazy(() => import("./routes/PrivateRoutes"));

const StudentDashboard = lazy(() =>
  import("./features/student/pages/StudentDashboard")
);
const GuestDashboard = lazy(() =>
  import("./features/guest/pages/GuestDashboard")
);
const AdminDashboard = lazy(() =>
  import("./features/admin/pages/AdminDashboard")
);

const MonthlySaleReport = lazy(() =>
  import("./features/admin/pages/MonthlySaleReport")
);
const WebCustomization = lazy(() =>
  import("./features/admin/pages/WebCustomization")
);
const BasicInformation = lazy(() =>
  import("./features/admin/pages/BasicInformation")
);
const MenuBuilder = lazy(() => import("./features/admin/pages/MenuBuilder"));
const SocialLinks = lazy(() => import("./features/admin/pages/SocialLinks"));
const SEOSettings = lazy(() => import("./features/admin/pages/SEOSettings"));
const MaintenanceMode = lazy(() =>
  import("./features/admin/pages/MaintenanceMode")
);
const Announcement = lazy(() => import("./features/admin/pages/Announcement"));
const PreloaderSettings = lazy(() =>
  import("./features/admin/pages/PreloaderSettings")
);
const FooterInfo = lazy(() => import("./features/admin/pages/FooterInfo"));
const GeneralSettings = lazy(() =>
  import("./features/admin/pages/GeneralSettings")
);
const EmailConfiguration = lazy(() =>
  import("./features/admin/pages/EmailConfiguration")
);
const ScriptsPage = lazy(() => import("./features/admin/pages/ScriptsPage"));
const CookieAlert = lazy(() => import("./features/admin/pages/CookieAlert"));
const CustomCSS = lazy(() => import("./features/admin/pages/CustomCSS"));
const PaymentSettings = lazy(() =>import("./features/admin/pages/PaymentSettings"));
const ProductManagement = lazy(() =>
  import("./features/admin/pages/ProductManagement")
);
const OrdersManagement = lazy(() =>
  import("./features/admin/pages/OrdersManagement")
);
const CustomersManagement = lazy(() =>
  import("./features/admin/pages/CustomersManagement")
);
const ExamManagement = lazy(() =>
  import("./features/admin/pages/ExamManagement")
);
const MediaManagement = lazy(() =>
  import("./features/admin/pages/MediaManagement")
);
const BlogManagement = lazy(() =>
  import("./features/admin/pages/BlogManagement")
);
const SubscribersManagement = lazy(() =>
  import("./features/admin/pages/SubscribersManagement")
);
const SettingsPage = lazy(() => import("./features/admin/pages/SettingsPage"));

import AuthProvider from "./layout/AuthProvider";
import BlogSection from "./components/shared/BlogSection";
import AllDumps from "./components/shared/AllDumps";
import AllOtherDumps from "./components/shared/AllOtherDumps";
import DownloadedSamples from "./features/admin/pages/DownloadedSamples";



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
            <Route path="/blogs" element={<BlogSection />} />
            <Route path="/dumps" element={<AllOtherDumps />} />
          </Route>

          {/* Admin routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<PrivateAdminLayout />}>
              <Route path="/admin">
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route
                  path="monthly-sale-report"
                  element={<MonthlySaleReport />}
                />
                <Route path="web-customization">
                  <Route index element={<WebCustomization />} />
                  <Route path="basic-info" element={<BasicInformation />} />
                  <Route path="menu-builder" element={<MenuBuilder />} />
                  <Route path="social-links" element={<SocialLinks />} />
                  <Route path="seo">
                    <Route index element={<SEOSettings />} />
                    <Route path="test" element={<SEOSettings />} />
                  </Route>
                  <Route path="permalink" element={<SettingsPage />} />
                  <Route path="maintenance" element={<MaintenanceMode />} />
                  <Route path="announcement" element={<Announcement />} />
                  <Route path="preloader" element={<PreloaderSettings />} />
                  <Route path="footer-info" element={<FooterInfo />} />
                  {/* <Route path="footer-link" element={<FooterLink />} /> */}
                </Route>
                <Route path="settings">
                  <Route path="general" element={<GeneralSettings />} />
                  <Route path="email-config">
                    <Route index element={<EmailConfiguration />} />
                    {/* <Route path="from-admin" element={<EmailConfigFromAdmin />} /> */}
                    {/* <Route path="to-admin" element={<EmailConfigToAdmin />} /> */}
                    {/* <Route path="follow-up" element={<EmailConfigFollowUp />} /> */}
                    {/* <Route path="advanced" element={<EmailConfigAdvanced />} /> */}
                  </Route>
                  {/* <Route path="scripts" element={<ScriptsPage />} />
                  <Route path="cookie-alert" element={<CookieAlert />} />
                  <Route path="custom-css" element={<CustomCSS />} /> */}
                </Route>
                <Route path="payment">
                  {/* <Route index element={<PaymentSettings />} />
                  <Route path="currencies" element={<PaymentCurrencies />} />
                  <Route path="gateway" element={<PaymentGateway />} />
                  <Route path="shipping" element={<PaymentShipping />} /> */}
                </Route>
                <Route path="products">
                  {/* <Route index element={<ProductManagement />} />
                  <Route path="categories" element={<ProductCategories />} />
                  <Route path="list" element={<ProductList />} />
                  <Route path="reviews" element={<ProductReviews />} /> */}
                </Route>
                <Route path="coupons">
                  <Route index element={<ProductManagement />} />
                  {/* <Route path="list" element={<Coupons />} /> */}
                </Route>
                <Route path="orders">
                  <Route index element={<OrdersManagement />} />
                  {/* <Route path="all" element={<OrdersAll />} />
                  <Route path="pending" element={<OrdersPending />} />
                  <Route path="completed" element={<OrdersCompleted />} />
                  <Route path="rejected" element={<OrdersRejected />} /> */}
                </Route>
                <Route path="order-reports">
                  {/* <Route index element={<MonthlySaleReport />} />
                  <Route path="all" element={<MonthlyOrderAll />} />
                  <Route path="sale" element={<MonthlySaleReport />} /> */}
                </Route>
                <Route path="customers" element={<CustomersManagement />} />
                <Route path="exam">
                  <Route index element={<ExamManagement />} />
                  <Route path="code" element={<ExamManagement />} />
                </Route>
                <Route path="media">
                  <Route index element={<MediaManagement />} />
                  <Route path="list" element={<MediaManagement />} />
                </Route>
                <Route path="blog">
                  {/* <Route index element={<BlogManagement />} />
                  <Route path="category" element={<BlogCategory />} />
                  <Route path="archive" element={<BlogArchive />} />
                  <Route path="posts" element={<BlogPosts />} /> */}
                </Route>
                <Route path="subscribers">
                  {/* <Route index element={<SubscribersManagement />} />
                  <Route path="list" element={<SubscribersList />} />
                  <Route path="mail" element={<MailToSubscribers />} /> */}
                </Route>
                <Route path="downloads">
                  <Route index element={<SettingsPage />} />
                  <Route path="samples" element={<DownloadedSamples />} />
                </Route>
                <Route path="settings" element={<SettingsPage />} />
              </Route>
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
