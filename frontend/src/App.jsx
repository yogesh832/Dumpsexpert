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

// 👇 Slug-based mapping
const pageComponentMap = {
  about: <AboutUs />,
  contact: <Contact />,
  cart: <Cart />,
  blog: <ITDumps />,
};

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
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/web-customization" element={<WebCustomization />} />
              <Route path="/admin/web-customization/basic-info" element={<BasicInformation />} />
              <Route path="/admin/web-customization/menu-builder" element={<MenuBuilder />} />
              <Route path="/admin/web-customization/social-links" element={<SocialLinks />} />
              <Route path="/admin/web-customization/seo" element={<SEOSettings />} />
              <Route path="/admin/web-customization/seo/meta-info" element={<SEOMetaInfo />} />
              <Route path="/admin/web-customization/seo/site-map" element={<SEOSiteMap />} />
              <Route path="/admin/web-customization/permalink" element={<Permalink />} />
              <Route path="/admin/web-customization/maintenance" element={<MaintenanceMode />} />
              <Route path="/admin/web-customization/announcement" element={<Announcement />} />
              <Route path="/admin/web-customization/preloader" element={<PreloaderSettings />} />
              <Route path="/admin/web-customization/footer-info" element={<FooterInfo />} />
              <Route path="/admin/web-customization/footer-link" element={<FooterLink />} />
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
