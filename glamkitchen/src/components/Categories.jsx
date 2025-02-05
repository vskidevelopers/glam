import React from "react";
import { Link } from "react-router-dom";

const Categories = () => {
  const categories = [
    {
      id: 1,
      name: "Cookware",
      subcategories: ["Pots", "Pans", "Cookware Sets", "Grills"],
    },
    {
      id: 2,
      name: "Small Appliances",
      subcategories: ["Blenders", "Toasters", "Microwaves", "Coffee Makers"],
    },
    {
      id: 3,
      name: "Utensils",
      subcategories: ["Knives", "Cutting Boards", "Measuring Cups", "Spoons"],
    },
    {
      id: 4,
      name: "Storage & Organization",
      subcategories: ["Containers", "Baskets", "Racks", "Jars"],
    },
    {
      id: 5,
      name: "Dining",
      subcategories: ["Plates", "Glasses", "Cutlery", "Cups"],
    },
  ];

  return (
    <div className="flex flex-col w-full justify-center bg-white p-6 rounded-lg shadow-xl">
      {categories.map((category) => (
        <div
          className="m-4 p-4 bg-robin_egg_blue-900 rounded-lg shadow-md w-full"
          key={category.id}
        >
          <h2 className="text-xl font-bold mb-4 text-robin_egg_blue-500">
            {category.name}
          </h2>
          <ul className="list-disc ml-6 space-y-2">
            {category.subcategories.map((subcategory, i) => (
              <Link key={i} to={`/explore/${subcategory}`}>
                <li className="hover:text-flame-500 cursor-pointer text-gray-700">
                  {subcategory}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Categories;
