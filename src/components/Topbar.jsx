import React from "react";
import logo from "@/assets/images/logo-white.png";
import { Link } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import SearchBox from "./SearchBox";
import { Button } from "@/components/ui/button"; // <-- shadcn button
import { RouteSignin } from "@/helpers/RouteName";

const Topbar = () => {
  return (
    <div className="flex justify-between items-center h-16 fixed w-full z-20 bg-white px-6 shadow-sm">

      {/* Logo */}
      <div>
        <img src={logo} alt="Logo" className="h-10" />
      </div>

      {/* SearchBox */}
      <div>
        <SearchBox />
      </div>

      {/* Sign In Button */}
      <div>
        <Button
          asChild
          variant="default"
          size="default"
          className="rounded-full px-5 gap-2"
        >
          <Link to={RouteSignin}>
            <CiLogin className="size-5" />
            Sign In
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
