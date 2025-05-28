import React from "react";
import Contact from "./Contact";
import HeroSection from "../components/shared/HeroSection";
import PopularDumps from "../components/shared/PopularDumps";
import UnlockGoals from "../components/shared/UnlockGoals";
import AllDumps from "../components/shared/AllDumps";
import AllOtherDumps from "../components/shared/AllOtherDumps";
import Testimonials from "../components/shared/Testimonials";

const Home = () =>{
    return (
        <div>
            <HeroSection />
        <AllDumps></AllDumps>
        <PopularDumps></PopularDumps>
        <UnlockGoals></UnlockGoals>
<AllOtherDumps/>
<Testimonials/>
           {/* <Contact /> */}
           
        </div>
    )
}

export default Home;
