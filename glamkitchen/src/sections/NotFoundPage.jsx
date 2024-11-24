import { useNavigate } from "react-router-dom";
import glamLogo from "@/assets/navlogo.png";

export default function NotFoundPage({ title }) {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1); // Go to the previous page
  };

  const goHome = () => {
    navigate("/admin"); // Navigate to the home page
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-gray-100 via-jonquil to-robin-egg-blue">
      <div className="text-center px-4">
        {/* Animated Not Found Title */}
        <h1 className="text-5xl md:text-7xl font-extrabold text-flame-800 mb-4 animate-pulse">
          {title || "Lost in the Kitchen?"}
        </h1>

        {/* Message */}
        <p className="text-lg md:text-2xl text-gray-800 mb-6">
          Sorry, we couldn't find the page you were looking for.
          <br />
          Let's get you back to exploring our premium kitchenware.
        </p>

        {/* Illustration or Icon */}
        <div className="mb-6">
          <img
            src={glamLogo}
            alt="Kitchen Illustration"
            className="w-52 md:w-72 mx-auto"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={goBack}
            className="px-6 py-3 bg-flame-800 text-white font-bold text-lg rounded-lg hover:bg-flame-600 transition duration-300"
          >
            Go Back
          </button>
          <button
            onClick={goHome}
            className="px-6 py-3 bg-robin-egg-blue text-black font-bold text-lg rounded-lg hover:bg-robin-egg-blue-dark transition duration-300"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
