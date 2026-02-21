import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./layout/Layout";
import Index from "./pages/Index.jsx";
import {
  RouteCategoryAdd,
  RouteCategoryDetails,
  RouteCategoryEdit,
  RouteProfile,
  signIn,
  signUp,
  RoutesBlogEdit,
} from "./helper/RoutesName";

import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import AddCategory from "./pages/categories/AddCategory";
import DetailCategory from "./pages/categories/DetailCategory";
import EditCategory from "./pages/categories/EditCategory";
import DetailBlog from "./pages/blogs/DetailBlog";
import AddBlog from "./pages/blogs/AddBlog";
import EditBlog from "./pages/blogs/Editblog";
import SingleBlogDetails from "./pages/SingleBlogPageShow";
import BlogbyCategory from "./pages/blogs/BlogbyCategory";
import SearchResult from "./pages/SearchResult";
import AuthProtection from "./components/AuthProtection";
import OnlyForAdmin from "./components/OnlyForAdmin";
import User from "./pages/User";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES WITH LAYOUT */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />

          <Route path={RouteCategoryDetails} element={<DetailCategory />} />

          <Route
            path="/blog/:categorySlug/:blogSlug"
            element={<SingleBlogDetails />}
          />
          <Route
            path="/blog/category/:categorySlug"
            element={<BlogbyCategory />}
          />
          <Route path="/search" element={<SearchResult />} />

          {/* 🔐 PROTECTED ROUTES */}
          <Route element={<AuthProtection />}>
            <Route path="blog/detail" element={<DetailBlog />} />
            <Route path="blog/add" element={<AddBlog />} />
            <Route path={RoutesBlogEdit()} element={<EditBlog />} />
            <Route path={RouteProfile} element={<Profile />} />
          </Route>
          {/* only admin can access these routes */}
          <Route element={<OnlyForAdmin />}>
            <Route path={RouteCategoryAdd} element={<AddCategory />} />
            <Route path={RouteCategoryEdit()} element={<EditCategory />} />
            <Route path="/user" element={<User />} />
          </Route>
        </Route>

        {/* AUTH ROUTES */}
        <Route path={signIn} element={<SignIn />} />
        <Route path={signUp} element={<SignUp />} />

        {/* 404 */}
        <Route
          path="*"
          element={
            <div className="flex items-center justify-center min-h-screen">
              <h1 className="text-4xl font-bold">404 Not Found</h1>
            </div>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
