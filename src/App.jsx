import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";
import { RouteIndex, RouteSignin, RouteSignup } from "./helpers/RouteName";
import Index from "./pages/Index";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main Layout */}
        <Route path={RouteIndex} element={<Layout />}>
          {/* Home */}
          <Route index element={<Index />} />

          {/* Profile */}
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Auth */}
        <Route path={RouteSignin} element={<Signin />} />
        <Route path={RouteSignup} element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
