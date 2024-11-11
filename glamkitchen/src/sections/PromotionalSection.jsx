import React from "react";

const PromotionalSection = () => {
  return (
    <div className="bg-jonquil-600/50">
      <div className="container mx-auto py-16 space-y-12 px-16  ">
        {/* Top Row */}
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex flex-col text-center items-center md:w-1/4 text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-3xl font-bold mb-4 font-serif">New Arrivals</h2>
            <p className="text-lg mb-6">
              Unveiling a fresh new wave of style, innovation and trendsetting
              kitchenware. From cutting-edge technology to chic designs, explore
              the excitement of the new!
            </p>
            <button className="bg-gray-800 text-white py-2 px-4 rounded">
              Shop Now
            </button>
          </div>

          <div className="md:w-3/4">
            <div className="relative w-[90%] h-56 overflow-hidden">
              <img
                src="https://www.parem.co/content/images/thumbs/0000108_fil-disi-rengi-granit-tencere-seti-gold-cam-kapak_700.jpeg"
                alt="New Arrivals"
                className="rounded-lg shadow-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
        <br />

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-3/4 order-1 md:order-none">
            <div className="relative w-[90%] h-56 overflow-hidden">
              <img
                src="https://cdn.everythingkitchens.com/media/wysiwyg/Add_a_heading_1.png"
                alt="Deals For You"
                className="rounded-lg shadow-lg object-cover w-full h-full"
              />
            </div>
          </div>
          <div className="md:w-1/4 text-center md:text-left mb-6 md:mb-0 flex flex-col text-center items-center">
            <h2 className="text-3xl font-bold mb-4 font-serif">
              Deals For You
            </h2>
            <p className="text-lg mb-6">
              Unlock incredible savings on top-quality cookware, utensils, and
              appliances. From stylish cookware sets to cutting-edge kitchen
              gadgets, you'll find everything you need!
            </p>
            <button className="bg-gray-800 text-white py-2 px-4 rounded">
              Shop Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromotionalSection;
