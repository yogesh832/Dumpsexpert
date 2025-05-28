import React from "react";
import Contact from "./Contact";
import Login from "./Login";
import Register from "./Register";

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
           {/* <Login /> */}
           <Register />
        </div>
    )
}

export default Home;
