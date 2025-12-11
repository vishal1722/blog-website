import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Link } from "react-router-dom"
import logo from "@/assets/images/logo-white.png"

import { MdHome } from "react-icons/md"
import { BiCategory } from "react-icons/bi"
import { CiUser } from "react-icons/ci"
import { FaRegComment } from "react-icons/fa"
import { SiBloglovin } from "react-icons/si"
import { GoDot } from "react-icons/go";

export function AppSidebar() {
  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="bg-white">
        <img src={logo} alt="Logo" className="w-28" />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="bg-white">

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <MdHome />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/blogs">
                  <SiBloglovin />
                  <span>Blog</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/categories">
                  <BiCategory />
                  <span>Categories</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/comments">
                  <FaRegComment />
                  <span>Comments</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/users">
                  <CiUser />
                  <span>Users</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>

        {/* Category Section */}
        <SidebarGroup>
          <SidebarGroupLabel>
            Category
          </SidebarGroupLabel>
          <SidebarMenu>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="/">
                  <GoDot />
                  Categoty item
                  
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>

      </SidebarContent>

      
     
    </Sidebar>
  )
}

export default AppSidebar
