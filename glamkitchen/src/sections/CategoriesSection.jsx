import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

export default function CategoriesSection() {
  return (
    <section className="px-16 bg-sky-500/10 py-16">
      <header className="text-center">
        <p className="text-sm text-gray-500 uppercase mb-1">
          Carefully created collections
        </p>
        <h2 className="text-xl font-bold uppercase mb-4">
          Browse our categories
        </h2>
      </header>

      <div className="flex flex-wrap -mx-2 items-center">
        {/* First Column */}
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <Link
            className="block category-item relative overflow-hidden h-64 bg-cover bg-center group"
            to="shop"
            style={{
              backgroundImage:
                "url(https://firebasestorage.googleapis.com/v0/b/glam-your-kitchen.firebasestorage.app/o/products%2F05e93c4f-ddd8-44c5-a018-9e267b29646f.jpeg?alt=media&token=ae6a4204-5595-4d9b-9319-fb8d6296e796)",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="absolute inset-0 transform scale-100 group-hover:scale-110 transition-transform duration-300"></div>

            <div className="w-full h-full flex justify-center items-center ">
              <Button className=" flex items-center justify-center text-white font-bold bg-transparent border-2 border-white px-4 py-2 rounded transition-all duration-300 z-10 hover:bg-flame-600 hover:border-flame-600">
                Cookware Sets
              </Button>
            </div>
          </Link>
        </div>

        {/* Second Column */}
        <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
          <Link
            className="block category-item relative overflow-hidden h-64 bg-cover bg-center group"
            to="shop"
            style={{
              backgroundImage:
                "url(https://homeandbeyond.co.ke/cdn/shop/files/Kingston24Set-1.jpg)",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="absolute inset-0 transform scale-100 group-hover:scale-110 transition-transform duration-300"></div>

            <div className="w-full h-full flex justify-center items-center ">
              <Button className=" flex items-center justify-center text-white font-bold bg-transparent border-2 border-white px-4 py-2 rounded transition-all duration-300 z-10 hover:bg-flame-600 hover:border-flame-600">
                Cutlery
              </Button>
            </div>
          </Link>

          <Link
            className="block category-item relative overflow-hidden h-64 bg-cover bg-center group mt-4"
            to="shop"
            style={{
              backgroundImage:
                "url(https://m.media-amazon.com/images/I/91WLU+okRxL.jpg)",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="absolute inset-0 transform scale-100 group-hover:scale-110 transition-transform duration-300"></div>
            <div className="w-full h-full flex justify-center items-center ">
              <Button className=" flex items-center justify-center text-white font-bold bg-transparent border-2 border-white px-4 py-2 rounded transition-all duration-300 z-10 hover:bg-flame-600 hover:border-flame-600">
                Bakeware
              </Button>
            </div>
          </Link>
        </div>

        {/* Third Column */}
        <div className="w-full md:w-1/3 px-2">
          <Link
            className="block category-item relative overflow-hidden h-64 bg-cover bg-center group"
            to="shop"
            style={{
              backgroundImage:
                "url(https://t4.ftcdn.net/jpg/09/56/55/79/360_F_956557990_elyjOhKGxc0GmhuxD12NXzFgpEeK48Il.jpg)",
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
            <div className="absolute inset-0 transform scale-100 group-hover:scale-110 transition-transform duration-300"></div>

            <div className="w-full h-full flex justify-center items-center ">
              <Button className=" flex items-center justify-center text-white font-bold bg-transparent border-2 border-white px-4 py-2 rounded transition-all duration-300 z-10 hover:bg-flame-600 hover:border-flame-600">
                Small Appliances
              </Button>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
