import React from "react";
import { motion } from "framer-motion"; // Ensure this is installed via `npm install framer-motion`

const MaintenancePage = () => {
    return (
        <div className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden text-white bg-gray-900">
            {/* Animated Gradient Background */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900 via-purple-900 to-gray-800"
                initial={{ scale: 1 }}
                animate={{ scale: 1.1 }}
                transition={{ duration: 12, repeat: Infinity, repeatType: "reverse" }}
            />

            {/* Dark Overlay for Better Contrast */}
            <div className="absolute inset-0 bg-black bg-opacity-70" />

            {/* Content Section */}
            <div className="z-10 text-center mt-20 px-4 md:px-0">
                <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold mb-6 tracking-wider">
                    GLAM YOUR KITCHEN
                </h1>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8">
                    We're Under Maintenance
                </h2>
                <p className="text-lg md:text-xl lg:text-2xl mb-10 max-w-lg mx-auto">
                    We're currently working hard to improve your experience. Please check back later for updates, and thank you for your patience.
                </p>
                <button
                    className="px-8 py-4 rounded-lg bg-pink-500 text-white font-semibold text-lg shadow-lg hover:bg-pink-400 transition duration-200"
                    onClick={() => window.location.reload()}
                >
                    Refresh Page
                </button>
            </div>

            {/* Footer Section */}
            <div className="z-10 mb-10 text-center px-4 md:px-0">
                <p className="mb-2 text-lg md:text-xl lg:text-2xl">
                    Follow us for updates:
                </p>
                <p className="text-sm md:text-base lg:text-lg">
                    Instagram:
                    <a
                        href="https://www.instagram.com/_glam.yourkitchen/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 underline ml-2"
                    >
                        @_glam.yourkitchen
                    </a>
                </p>
                <p className="text-xs md:text-sm lg:text-base mt-4">
                    &copy; 2024 Glam Your Kitchen. All rights reserved.
                </p>
            </div>
        </div>
    );
};

export default MaintenancePage;
