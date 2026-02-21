// src/helper/RoutesName.js
export const RoutesName = "/";
export const signIn = "/sign-in";
export const signUp = "/sign-up";

export const RouteBlogAdd = "/blog/add";
export const RouteBlogEdit = "/blog/edit/:id";
export const RouteBlogDetails = "/blog/:slug";
export const RouteProfile = "/profile";

export const RouteCategoryDetails = "/categories";
export const RouteCategoryAdd = "/category/add";
export const RouteCategoryEdit = (id = ":id") => `/category/edit/${id}`;

export const RoutesBlogEdit = (id = ":id") => `/blog/edit/${id}`;
export const RouteBlogDetailspage = (categorySlug, blogSlug) =>
  `/blog/${categorySlug}/${blogSlug}`;
export const RouteBlogByCategory = (categorySlug) =>
  `/blog/category/${categorySlug}`;

export const RouteSearch = (query) =>
  `/search?q=${query}`;
