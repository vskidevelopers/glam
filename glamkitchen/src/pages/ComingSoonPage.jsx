import React, { useState, useEffect } from "react";
import { motion } from "framer-motion"; // Ensure this is installed via `npm install framer-motion`

const ComingSoonPage = () => {
    const targetDate = new Date("2024-11-05T00:00:00"); // Set the target date to November 5th, 2024
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer on component unmount
    }, [targetDate]);

    function calculateTimeLeft(targetDate) {
        const difference = targetDate - new Date(); // Calculate the time difference from now to the target date
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        } else {
            timeLeft = {
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0,
            };
        }

        return timeLeft;
    }

    return (
        <div className="relative min-h-screen flex flex-col justify-between items-center overflow-hidden text-white">
            {/* Gradient background animation */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                initial={{ scale: 1 }}
                animate={{ scale: 1.2 }}
                transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
            />

            {/* Overlay to darken the gradient for better text visibility */}
            <div className="absolute inset-0 bg-black bg-opacity-60" />

            {/* Title Section */}
            <div className="z-10 text-center mt-10">
                <h1 className="text-6xl lg:text-8xl font-bold mb-8 tracking-widest animate-pulse">
                    GLAM YOUR KITCHEN
                </h1>
                <h2 className="text-4xl lg:text-6xl font-semibold mb-8">
                    Coming Soon
                </h2>

                {/* Countdown Timer */}
                <div className="flex justify-center space-x-8 text-4xl lg:text-6xl font-semibold mb-12">
                    <div>
                        <span>{timeLeft.days}</span>
                        <p className="text-lg lg:text-2xl">Days</p>
                    </div>
                    <div>
                        <span>{timeLeft.hours}</span>
                        <p className="text-lg lg:text-2xl">Hours</p>
                    </div>
                    <div>
                        <span>{timeLeft.minutes}</span>
                        <p className="text-lg lg:text-2xl">Minutes</p>
                    </div>
                    <div>
                        <span>{timeLeft.seconds}</span>
                        <p className="text-lg lg:text-2xl">Seconds</p>
                    </div>
                </div>
            </div>

            {/* Footer Section */}
            <div className="z-10 mb-10 text-center">
                <p className="mb-4 text-xl lg:text-2xl">Stay tuned! We are launching something exciting.</p>
                <p className="text-sm lg:text-lg">
                    Follow us on Instagram:
                    <a
                        href="https://www.instagram.com/_glam.yourkitchen/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-pink-400 underline ml-2"
                    >
                        @_glam.yourkitchen
                    </a>
                </p>
                <p className="text-xs lg:text-sm mt-4">&copy; 2024 Glam Your Kitchen. All rights reserved.</p>
            </div>
        </div>
    );
};

export default ComingSoonPage;
