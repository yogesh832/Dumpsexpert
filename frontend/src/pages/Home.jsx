import HeroSection from "../components/shared/HeroSection";
import AllDumps from "../components/shared/AllDumps";
import PopularDumps from "../components/shared/PopularDumps";
import UnlockGoals from "../components/shared/UnlockGoals";
import AllOtherDumps from "../components/shared/AllOtherDumps";
import Testimonials from "../components/shared/Testimonials";
import AdminSidebar from "../features/admin/components/AdminSidebar";
import BlogSection from "../components/shared/BlogSection";
import SEOTester from "../components/SEOTester";


const Home = () => {
  return (
    <div>
      <SEOTester />
      <HeroSection />
      <AllOtherDumps />
      <BlogSection />
      <AllDumps />
      <PopularDumps />
      <UnlockGoals />
      <Testimonials />
    </div>
  );
};

export default Home;
