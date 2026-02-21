import React from "react";

const SearchBox = () => {
  return (
    <form className="flex justify-center">
      <input
        type="text"
        placeholder="Search here..."
        className="
          h-10 w-64 px-5 rounded-full 
          border border-border bg-background text-foreground
          transition-all duration-300 ease-in-out
          focus:w-80 focus:shadow-lg focus:shadow-primary/20 
          focus:ring-2 focus:ring-primary focus:outline-none
          animate-in fade-in slide-in-from-top-2
        "
      />
    </form>
  );
};

export default SearchBox;
