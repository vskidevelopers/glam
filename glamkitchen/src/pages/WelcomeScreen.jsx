import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import glamlogo from "@/assets/glamlogo.png";
import { UtensilsCrossed } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/utils/firebase";

const WelcomeScreen = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const user = auth?.currentUser;

  useEffect(() => {
    const fetchUser = () => {
      var isAuth = localStorage.getItem("isAuth");
      if (isAuth) {
        console.log("User Logged In!");
      } else if (user) {
        console.log("User exists >>", user);
      } else {
        console.log("There is no user at all!");
      }
    };

    fetchUser();
  }, []);

  const handleWelcomeClick = () => {
    navigate("/home");
  };

  return (
    <div
      className="relative min-h-screen flex flex-col justify-center items-center overflow-hidden text-white bg-gray-900"
      style={{
        backdropFilter: "blur(5px)",
      }}
    >
      {/* Animated Gradient Background */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-gray-800 via-gray-600 to-black"
        initial={{ scale: 1 }}
        animate={{ scale: 1.1 }}
        transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Content Section */}
      <div className="z-10 text-center mt-20 px-4 md:px-0">
        {/* Animated Logo */}
        <motion.div
          className="mb-8 transition ease-in-out animate-pulse duration-5000"
          whileHover={{ scale: 1.1 }}
        >
          <img
            src={glamlogo}
            alt="Glam Your Kitchen Logo"
            className="w-48 md:w-64 lg:w-80 mx-auto"
          />
        </motion.div>

        {/* Animated Food Illustration */}
        <motion.div
          className="mb-8"
          animate={{
            rotate: 360,
            transition: { duration: 10, repeat: Infinity },
          }}
        >
          <UtensilsCrossed
            size={80}
            className="mx-auto text-black md:text-2xl lg:text-3xl"
          />
        </motion.div>

        {/* Welcome Message */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 tracking-wider text-flame-500">
          Welcome to Glam Your Kitchen
        </h1>
        <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-8 text-jonquil-400">
          {userName
            ? `Welcome back, ${userName}!`
            : "Where culinary creativity meets premium kitchenware"}
        </h2>

        {/* Clickable Welcome Area */}
        <motion.div
          className="w-full h-16 bg-opacity-50 rounded-lg cursor-pointer mb-8"
          onClick={handleWelcomeClick}
          whileHover={{ scale: 1.1 }}
        >
          <button
            onClick={handleWelcomeClick}
            className="w-full h-full bg-flame-500 text-white font-bold text-lg rounded-lg"
          >
            Enter the Kitchen
          </button>
        </motion.div>

        {/* Instagram Follow Section */}
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
    </div>
  );
};

export default WelcomeScreen;
