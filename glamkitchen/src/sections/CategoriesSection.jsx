import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCategoriesFunctions } from "@/utils/firebase";

const CategoriesSection = () => {
  const { fetchAllCategories } = useCategoriesFunctions();
  const [categories, setCategories] = useState([]);

  const shuffleArray = (array) => {
    return array
      .map((item) => ({ item, sort: Math.random() })) // Attach a random sort key
      .sort((a, b) => a.sort - b.sort) // Sort by the random key
      .map(({ item }) => item); // Extract the shuffled items
  };

  const fetchCategories = async () => {
    const categoriesResponse = await fetchAllCategories();
    if (categoriesResponse?.success) {
      console.log("Categories data >> ", categoriesResponse?.data);
      const shuffledCategories = shuffleArray(categoriesResponse?.data).slice(
        0,
        4
      ); // Pick first 4 after shuffle
      setCategories(shuffledCategories);
    } else {
      console.log("Error fetching categories >> ", categoriesResponse?.message);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
        {categories?.length > 0 && (
          <>
            {/* First Row - Single Large Item */}
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              <Link
                className="block category-item relative overflow-hidden h-64 bg-cover bg-center group"
                to={`/explore/${categories[0]?.categoryName}`}
                style={{
                  backgroundImage: `url(${categories[0]?.categoryImage})`,
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                <div className="absolute inset-0 transform scale-100 group-hover:scale-110 transition-transform duration-300"></div>
                <div className="w-full h-full flex justify-center items-center">
                  <Button className="flex items-center justify-center text-white font-bold bg-transparent border-2 border-white px-4 py-2 rounded transition-all duration-300 z-10 hover:bg-flame-600 hover:border-flame-600">
                    {categories[0]?.categoryName}
                  </Button>
                </div>
              </Link>
            </div>

            {/* Second Row - Two Smaller Items */}
            <div className="w-full md:w-1/3 px-2 mb-4 md:mb-0">
              {categories[1] && (
                <Link
                  className="block category-item relative overflow-hidden h-64 bg-cover bg-center group"
                  to={`/explore/${categories[1]?.categoryName}`}
                  style={{
                    backgroundImage: `url(${categories[1]?.categoryImage})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 transform scale-100 group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="w-full h-full flex justify-center items-center">
                    <Button className="flex items-center justify-center text-white font-bold bg-transparent border-2 border-white px-4 py-2 rounded transition-all duration-300 z-10 hover:bg-flame-600 hover:border-flame-600">
                      {categories[1]?.categoryName}
                    </Button>
                  </div>
                </Link>
              )}

              {categories[2] && (
                <Link
                  className="block category-item relative overflow-hidden h-64 bg-cover bg-center group mt-4"
                  to={`/explore/${categories[2]?.categoryName}`}
                  style={{
                    backgroundImage: `url(${categories[2]?.categoryImage})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 transform scale-100 group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="w-full h-full flex justify-center items-center">
                    <Button className="flex items-center justify-center text-white font-bold bg-transparent border-2 border-white px-4 py-2 rounded transition-all duration-300 z-10 hover:bg-flame-600 hover:border-flame-600">
                      {categories[2]?.categoryName}
                    </Button>
                  </div>
                </Link>
              )}
            </div>

            {/* Third Row - Single Large Item */}
            {categories[3] && (
              <div className="w-full md:w-1/3 px-2">
                <Link
                  className="block category-item relative overflow-hidden h-64 bg-cover bg-center group"
                  to={`/explore/${categories[3]?.categoryName}`}
                  style={{
                    backgroundImage: `url(${categories[3]?.categoryImage})`,
                  }}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                  <div className="absolute inset-0 transform scale-100 group-hover:scale-110 transition-transform duration-300"></div>
                  <div className="w-full h-full flex justify-center items-center">
                    <Button className="flex items-center justify-center text-white font-bold bg-transparent border-2 border-white px-4 py-2 rounded transition-all duration-300 z-10 hover:bg-flame-600 hover:border-flame-600">
                      {categories[3]?.categoryName}
                    </Button>
                  </div>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CategoriesSection;
