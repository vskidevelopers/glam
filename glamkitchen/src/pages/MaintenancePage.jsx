import React from "react";
import { motion } from "framer-motion";
import glamlogo from "../assets/glamlogo.png";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MaintenancePage = () => {
  const navigate = useNavigate();
  const handleTakeTour = () => {
    navigate("/home");
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden text-white bg-gray-900"
      style={{
        // Add a subtle background blur for a more modern feel
        backdropFilter: "blur(5px)",
      }}
    >
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-robin_egg_blue-900 via-flame-600 to-gray-800"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Dark Overlay for Better Contrast */}
      <div className="absolute inset-0 bg-black bg-opacity-70" />

      {/* Content Section */}
      <div className="z-10 text-center mt-20 px-4 md:px-0">
        {/* Logo SVG */}
        <motion.div
          className="mb-8 transition ease-in-out animate-pulse duration-5000"
          whileHover={{ scale: 1.1 }} // Add a subtle zoom-in on hover
        >
          <img
            src={glamlogo}
            alt="Glam Your Kitchen Logo"
            className="w-48 md:w-64 lg:w-80 mx-auto" // Increase logo size
          />
        </motion.div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 tracking-wider text-flame-500">
          GLAM YOUR KITCHEN
        </h1>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold mb-8 text-jonquil-400">
          We're Under Maintenance
        </h2>
        <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-lg mx-auto text-robin_egg_blue-500">
          We're making some updates to enhance your experience. Want to see our
          progress? 👀 Click below for a tour!
        </p>

        {/* Tour Button with Ping Effect */}
        <Button
          className="relative px-10 py-4 rounded-lg bg-jonquil-500 text-black font-semibold text-lg shadow-lg hover:bg-jonquil-400 transition duration-200"
          onClick={handleTakeTour}
        >
          <span className="animate-ping absolute -right-2 -top-2 inline-flex h-5 w-5 rounded-full bg-robin_egg_blue-400 opacity-75"></span>
          <span className="absolute -right-2 -top-2 inline-flex rounded-full h-5 w-5 bg-robin_egg_blue-500"></span>
          <span className="relative">Take a Tour</span>
        </Button>
      </div>

      {/* Footer Section */}
      <div className="z-10 mb-10 text-center px-4 md:px-0">
        <p className="mb-2 text-lg md:text-xl lg:text-2xl text-jonquil-300">
          Follow us for updates:
        </p>
        <p className="text-sm md:text-base lg:text-lg">
          Instagram:
          <a
            href="https://www.instagram.com/_glam.yourkitchen/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-flame-400 underline ml-2"
          >
            @_glam.yourkitchen
          </a>
        </p>
        <p className="text-xs md:text-sm lg:text-base mt-4 text-flame-500">
          &copy; 2024 Glam Your Kitchen. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
