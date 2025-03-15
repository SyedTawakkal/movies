import React from "react";
import { IoIosSearch } from "react-icons/io";

const Search = ({ searchTerm, setSearchTerm }) => {
  //   console.log(searchTerm);
  return (
    <>
      <div className="search flex justify-center w-[500px] max-w-[90%]">
        <div className="w-full">
          <IoIosSearch className="text-white" size={30} />
          <input
            type="text"
            value={searchTerm}
            placeholder="Search through Thousands of Movies"
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Search;
