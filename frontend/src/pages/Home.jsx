import HeroSection from "../components/shared/HeroSection";
import AllDumps from "../components/shared/AllDumps";
import PopularDumps from "../components/shared/PopularDumps";
import UnlockGoals from "../components/shared/UnlockGoals";
import AllOtherDumps from "../components/shared/AllOtherDumps";
import Testimonials from "../components/shared/Testimonials";
import AdminSidebar from "../features/admin/components/AdminSidebar";


const Home = () => {
  return (
    <div>
      <HeroSection />
      <AllOtherDumps />
      <AllDumps />
      <PopularDumps />
      <UnlockGoals />
      <Testimonials />
      <AdminSidebar />
    </div>
  );
};

export default Home;
