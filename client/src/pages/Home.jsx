import React from "react";

import Linkform from "../components/Linkform";
import Cards from "../components/Cards";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <Linkform />
      <Cards />
      <Footer/>
    </>
  );
};

export default Home;
