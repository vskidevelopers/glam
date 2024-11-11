import React, { useRef } from "react";
import { useInView } from "framer-motion";
import { Headset, Award, Cable, Utensils } from "lucide-react";
const features =
  "https://media.istockphoto.com/id/476392316/photo/kitchen-utensil.jpg?s=612x612&w=0&k=20&c=Mb2d_7WGJP6N5Jb__soAl74ZUhFwH47iSdJtXeoW47o=";

function Features() {
  const ref = useRef(null);
  const isInView = useInView(ref, { amount: 0.2, once: true });

  return (
    <div className="bg-gray-100 w-full px-6 md:px-16">
      <div ref={ref} className="container mx-auto py-10 ">
        <div
          className="text-center mb-8"
          style={{
            transform: isInView ? "none" : "translateY(100vh)",
            opacity: isInView ? 1 : 0,
            transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.1s",
          }}
        >
          <h6 className="text-lg font-semibold text-robin_egg_blue bg-white px-4 inline-block">
            Why Choose Us
          </h6>
          <h1 className="text-4xl font-bold text-gray-800 mt-4">
            Elevate Your Kitchen Experience
          </h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-5 lg:px-0">
          <div className="space-y-8">
            <FeatureItem
              iconClass=<Utensils />
              title="Premium Kitchenware"
              description="Only the best quality kitchenware to enhance your cooking experience."
              delay="0.5s"
              isInView={isInView}
            />
            <FeatureItem
              iconClass=<Award />
              title="Unique Designs"
              description="Standout kitchen pieces with stylish, durable designs for every kitchen."
              delay="1.2s"
              isInView={isInView}
            />
          </div>
          <div
            className="relative h-80 lg:h-full overflow-hidden rounded-md shadow-lg"
            style={{
              transform: isInView ? "none" : "translateY(100vh)",
              opacity: isInView ? 1 : 0,
              transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.5s",
            }}
          >
            <img
              src={features}
              alt="feature"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="space-y-8">
            <FeatureItem
              iconClass=<Cable />
              title="Personalized Service"
              description="Get expert advice to select the best kitchenware for your needs."
              delay="0.7s"
              isInView={isInView}
            />
            <FeatureItem
              iconClass=<Headset />
              title="24/7 Customer Support"
              description="Our support team is available anytime to assist with your inquiries."
              delay="1.3s"
              isInView={isInView}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ iconClass, title, description, delay, isInView }) {
  return (
    <div
      className="flex flex-col  md:items-start items-center text-center md:text-left"
      style={{
        transform: isInView ? "none" : "translateY(100vh)",
        opacity: isInView ? 1 : 0,
        transition: `all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) ${delay}`,
      }}
    >
      <div className="flex items-center justify-center bg-robin_egg_blue text-white rounded-full w-16 h-16 mb-4 md:mr-4">
        {iconClass}
      </div>
      <div>
        <h4 className="text-xl font-semibold text-gray-800">{title}</h4>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default Features;
