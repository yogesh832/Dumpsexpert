import React from "react";
import Contact from "./Contact";
import Login from "./Login";
import Register from "./Register";
import HeroSection from "../components/shared/HeroSection";
import AllDumps from "../components/shared/AllDumps";
import PopularDumps from "../components/shared/PopularDumps";
import UnlockGoals from "../components/shared/UnlockGoals";
import AllOtherDumps from "../components/shared/AllOtherDumps";
import Testimonials from "../components/shared/Testimonials";

const Home = () =>{
    return (
        <div>
            <HeroSection />
<AllOtherDumps/>
        {/* <AllDumps></AllDumps> */}
        <PopularDumps></PopularDumps>
        <UnlockGoals></UnlockGoals>
<Testimonials/>
           {/* <Contact /> */}
           {/* <Login /> */}
           {/* <Register /> */}
        </div>
    )
}

export default Home;
