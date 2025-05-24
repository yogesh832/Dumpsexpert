
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