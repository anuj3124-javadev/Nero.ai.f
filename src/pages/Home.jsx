import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AiTools from "../components/AiTools";
import Testimonial from "../components/Testimonial";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar/>
      <Hero/>
      <AiTools/>
      <Testimonial/>
      <Footer/>
    </div>
  );
};

export default Home;
