import React from "react";
import { Link } from "react-router-dom";
import bannerImage from "../assets/images/banner.jpg";
import glamlogo from "../assets/glamlogo.png"; // Update with the actual path to your logo

function Introbanner() {
  return (
    <div
      className="w-full py-32 bg-cover bg-bottom relative"
      style={{ backgroundImage: `url(${bannerImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Content */}
      <div className="flex h-96 justify-center items-center h-full text-center text-white relative z-10 px-4">
        <div className="max-w-xl w-full">
          {/* Logo */}
          <div className="mb-6">
            <img
              src={glamlogo}
              alt="Glam Your Kitchen Logo"
              className="w-32 mx-auto"
            />
          </div>

          {/* Texts */}
          <h2 className="text-xl font-semibold mb-2">
            Stylish, reliable & eco-friendly
          </h2>
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Transform your kitchen with{" "}
            <span className="text-flame-500"> Glam Your Kitchen</span>'s premium
            kitchenware.
          </h1>
          <Link
            to="shop"
            className="inline-block bg-sky-500 text-white py-3 px-8 rounded-lg font-semibold shadow-md hover:bg-sky-600 transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-sky-300"
          >
            Shop Now!
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Introbanner;
