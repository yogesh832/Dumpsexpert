import AboutUs from "./components/shared/AboutUs"
import AllDumps from "./components/shared/AllDumps"
import Footer from "./components/shared/Footer"
import HeroSection from "./components/shared/HeroSection"
import Navbar from "./components/shared/Navbar"
import PopularDumps from "./components/shared/PopularDumps"
import UnlockGoals from "./components/shared/UnlockGoals"
import BlogCard from "./components/ui/BlogCard"
import Button from "./components/ui/Button"
import CarouselCard from "./components/ui/CarouselCard"
import ClientCarouselCard from "./components/ui/ClientCarouselCard"
import Input from "./components/ui/Input"

import { Route,Routes } from "react-router";
import PublicLayout from "./layout/publicLayout";
import PrivateLayout from "./layout/privateLayout";

import Home from "./pages/Home"
import Dashboard from "./features/guest/pages/Dashboard";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import Cart from "./pages/Cart";
const App = () =>{
  return(
    <div>
      <Routes>
        {/* public routes  */}
        <Route element={<PublicLayout/>}>
        <Route path="/" element={<Home/>} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cart" element={<Cart />} />
        </Route>

        {/* private routes  */}
        <Route element={<PrivateLayout/>}>
        <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App;