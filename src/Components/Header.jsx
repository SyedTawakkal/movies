import React from "react";
import heroImg from "/hero-img.svg";

const Header = () => {
  return (
    <>
      <img className="mx-auto" src={heroImg} alt="" />
      <h1>
        Find <span className="text-gradient">Movies </span> You'll Enjoy Without
        the Hassle
      </h1>
    </>
  );
};

export default Header;
