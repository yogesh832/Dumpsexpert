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



function App() {

  return (
    <>
    <Navbar></Navbar>
    {/* <HeroSection></HeroSection>
    <AboutUs></AboutUs> */}

{/* <AllDumps></AllDumps> */}

<PopularDumps></PopularDumps>
<UnlockGoals></UnlockGoals>


     {/* <h1 className=" font-bold   text-red-500 ">
    Hello world!
  </h1> */}
    {/* {/* <Button>Hello</Button>
    <Input placeholder="Enter Name"/>
    <CarouselCard
  title="Card Title"
  description="This is a reusable card component with a button."
  buttonText="Explore"
  onClick={() => alert("Button Clicked")}/>
  
  <ClientCarouselCard
  name="Jane Doe"
  designation="Product Manager"
  description="Working with this team has been an incredible experience. Their dedication and talent are unmatched."
/>

<BlogCard
  title="Why Tailwind CSS is Great for React Developers"
  date="2025-09-05 10:00:00"
  buttonText="Explore Article"
  onClick={() => alert("Navigating to article...")}
/> */}
<Footer></Footer>
    </>
  )
}

export default App
