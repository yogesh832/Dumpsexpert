import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import axios from "axios";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import AuthProvider from "./layout/AuthProvider";
import ScriptManager from "./components/Scripts/ScriptManager";

// Public Layouts and Pages
const PublicLayout = lazy(() => import("./layout/PublicLayout"));
const PrivateAdminLayout = lazy(() => import("./layout/PrivateAdminLayout"));
const PrivateRoute = lazy(() => import("./routes/PrivateRoutes"));
const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const AboutUs = lazy(() => import("./pages/AboutUs"));
const Contact = lazy(() => import("./pages/Contact"));
const ITDumps = lazy(() => import("./pages/ItDumps"));
const CategoryProducts = lazy(() => import("./pages/CategoryProducts"));
const ProductDetails = lazy(() => import("./pages/ProductDetails"));
const Cart = lazy(() => import("./pages/Cart"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const SEOTesterPage = lazy(() => import("./pages/SEOTesterPage"));

// Admin Pages
const AdminDashboard = lazy(() => import("./features/admin/pages/AdminDashboard"));
const WebCustomization = lazy(() => import("./features/admin/pages/WebCustomization"));
const BasicInformation = lazy(() => import("./features/admin/pages/BasicInformation"));
const MenuBuilder = lazy(() => import("./features/admin/pages/MenuBuilder"));
const SocialLinks = lazy(() => import("./features/admin/pages/SocialLinks"));
const SEOSettings = lazy(() => import("./features/admin/pages/SEOSettings"));
const SEOMetaInfo = lazy(() => import("./features/admin/pages/SEOMetaInfo"));
const SEOSiteMap = lazy(() => import("./features/admin/pages/SEOSiteMap"));
const MaintenanceMode = lazy(() => import("./features/admin/pages/MaintenancePage"));
const Announcement = lazy(() => import("./features/admin/pages/Announcement"));
const PreloaderSettings = lazy(() => import("./features/admin/pages/PreloaderSettings"));
const FooterInfo = lazy(() => import("./features/admin/pages/FooterInfo"));
const FooterLink = lazy(() => import("./features/admin/pages/FooterLink"));
const Permalink = lazy(() => import("./features/admin/pages/Permalink"));

// import AuthProvider from "./layout/AuthProvider";
import StudentOrders from "./features/student/pages/StudentOrders";
import PdfCoursesPage from "./features/student/pages/PdfCoursesPage";
import ExamCoursesPage from "./features/student/pages/ExamCoursesPage";
import ResultHistoryPage from "./features/student/pages/ResultHistoryPage";
import EditProfile from "./features/student/pages/EditProfile";
import EditProfileGuest from "./features/guest/components/EditProfile.jsx";
import ChangePassword from "./features/student/pages/ChangePassword";
import ChangePasswordGuest from "./features/guest/components/ChangePassword.jsx";
import Logout from "./features/student/pages/Logout";
import BlogPosts from "./features/admin/pages/BlogPosts";
import BlogList from "./features/admin/pages/BlogList";
import EditBlog from "./features/admin/pages/EditBlog";
import AddBlogCategory from "./features/admin/pages/AddBlogCategory";
import ScriptManager from "./components/Scripts/ScriptManager";
import InstructionsPage from "./pages/onlineExam/InstructionsPage";
import TestPage from "./pages/onlineExam/TestPage";
import ResultPage from "./pages/onlineExam/ResultPage";
import DetailedResultPage from "./pages/onlineExam/DetailedResultPage";
import AddProductCategory from "./features/admin/pages/AddProductCategory.jsx";
import EditProductCategory from "./features/admin/pages/EditProductCategory";
import ProductForm from "./features/admin/pages/ProductForm.jsx";
import SEOTesterPage from "./pages/SEOTesterPage";

const App = () => {
  const [permalinks, setPermalinks] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/permalinks")
      .then((res) => {
        setPermalinks(res.data);
        console.log("✅ Permalinks loaded:", res.data);
      })
      .catch((err) => console.error("❌ Permalink error:", err));
  }, []);

  return (
    <AuthProvider>
      <ScriptManager />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />

            {/* 🔁 Dynamic Permalink Routes */}
            {permalinks.map((page) => {
              const Component = pageComponentMap[page.slug];
              return (
                <Route
                  key={page._id}
                  path={`/${page.slug}`}
                  element={
                    Component ? (
                      Component
                    ) : (
                      <NotFound />
                    )
                  }
                />
              );
            })}

            {/* Static Public Routes */}
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/courses/:categoryName" element={<CategoryProducts />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/seo-tester" element={<SEOTesterPage />} />
          </Route>

          {/* Admin Pages */}
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
                    <Route path="meta-info" element={<SEOMetaInfo />} />
                    <Route path="site-map" element={<SEOSiteMap />} />
                  </Route>
                  <Route path="permalink" element={<Permalink />} />
                  <Route path="maintenance" element={<MaintenanceMode />} />
                  <Route path="announcement" element={<Announcement />} />
                  <Route path="preloader" element={<PreloaderSettings />} />
                  <Route path="footer-info" element={<FooterInfo />} />
                  <Route path="footer-link" element={<FooterLink />} />
                </Route>

                <Route path="settings">
                  <Route path="general" element={<GeneralSettings />} />
                  <Route path="email-config">
                    <Route index element={<EmailConfiguration />} />
                    <Route
                      path="from-admin"
                      element={<EmailConfigFromAdmin />}
                    />
                    <Route path="to-admin" element={<EmailConfigToAdmin />} />
                    <Route path="follow-up" element={<EmailConfigFollowUp />} />
                    <Route path="advanced" element={<EmailConfigAdvanced />} />
                  </Route>
                  <Route path="scripts" element={<ScriptsPage />} />
                  <Route path="cookie-alert" element={<CookieAlert />} />
                  <Route path="custom-css" element={<CustomCSS />} />
                </Route>

                <Route path="payment">
                  <Route index element={<PaymentSettings />} />
                  <Route path="currencies" element={<PaymentCurrencies />} />
                  <Route path="gateway" element={<PaymentGateway />} />
                  <Route path="shipping" element={<PaymentShipping />} />
                </Route>

                <Route path="products">
                  <Route index element={<ProductManagement />} />
                  <Route path="categories" element={<ProductCategories />} />
                  <Route
                    path="categories/add"
                    element={<AddProductCategory />}
                  />
                  <Route
                    path="categories/edit/:id"
                    element={<EditProductCategory />}
                  />
                  <Route path="add" element={<ProductForm mode="add" />} />
                  <Route
                    path="edit/:id"
                    element={<ProductForm mode="edit" />}
                  />

                  <Route path="list" element={<ProductList />} />
                  <Route path="reviews" element={<ProductReviews />} />
                </Route>

                <Route path="coupons">
                  <Route index element={<ProductManagement />} />
                  <Route path="list" element={<Coupons />} />
                  <Route path="add" element={<CouponForm />} />
                  <Route path="edit/:id" element={<CouponForm />} />
                </Route>

                <Route path="orders">
                  <Route index element={<OrdersManagement />} />
                  <Route path="all" element={<OrdersAll />} />
                  <Route path="pending" element={<OrdersPending />} />
                  <Route path="completed" element={<OrdersCompleted />} />
                  <Route path="rejected" element={<OrdersRejected />} />
                </Route>

                <Route path="order-reports">
                  <Route index element={<MonthlySaleReport />} />
                  <Route path="all" element={<MonthlyOrderAll />} />
                  <Route path="sale" element={<MonthlySaleReport />} />
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
                  <Route index element={<BlogManagement />} />
                  <Route path="category" element={<BlogCategory />} />
                  <Route path="category/add" element={<AddBlogCategory />} />
                  <Route path="archive" element={<BlogArchive />} />
                  <Route path="posts" element={<BlogPosts />} />
                  <Route path="list" element={<BlogList />} />
                  <Route path="edit" element={<EditBlog />} />
                </Route>

                <Route path="subscribers">
                  <Route index element={<SubscribersManagement />} />
                  <Route path="list" element={<SubscribersList />} />
                  <Route path="mail" element={<MailToSubscribers />} />
                </Route>

                <Route path="downloads">
                  <Route index element={<SettingsPage />} />
                  <Route path="samples" element={<DownloadedSamples />} />
                </Route>

                <Route path="settings" element={<SettingsPage />} />
                <Route
                  path="email-config/to-admin"
                  element={<EmailConfigToAdmin />}
                />
                <Route
                  path="email-config/from-admin"
                  element={<EmailConfigFromAdmin />}
                />
              </Route>
            </Route>
          </Route>

          {/* Student routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<PrivateStudentLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/orders" element={<StudentOrders />} />
              <Route path="/student/courses-pdf" element={<PdfCoursesPage />} />

              <Route
                path="/student/courses-exam/list"
                element={<ExamCoursesPage />}
              />
              <Route
                path="/student/courses-exam/instructions/:examId"
                element={<InstructionsPage />}
              />

              <Route
                path="/student/courses-exam/test/:examId"
                element={<TestPage />}
              />

              {/* <Route path="/student/courses-exam/test" element={<TestPage />} /> */}
              <Route
                path="/student/courses-exam/result"
                element={<ResultPage />}
              />
              <Route
                path="/student/courses-exam/result-details"
                element={<DetailedResultPage />}
              />
              <Route path="/student/results" element={<ResultHistoryPage />} />

              <Route path="/student/edit-profile" element={<EditProfile />} />
              <Route
                path="/student/change-password"
                element={<ChangePassword />}
              />
              <Route path="/exams/:id" element={<InstructionsPage />} />

              <Route path="/logout" element={<Logout />} />
            </Route>
          </Route>

          {/* Guest routes */}
          <Route element={<PrivateRoute />}>
            <Route element={<PrivateGuestLayout />}>
              <Route path="/guest/dashboard" element={<GuestDashboard />} />
              <Route
                path="/guest/edit-profile"
                element={<EditProfileGuest />}
              />
              <Route
                path="/guest/change-password"
                element={<ChangePasswordGuest />}
              />
              <Route path="/logout" element={<Logout />} />
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
