import React, { useEffect, useState } from "react";
import Pagination from "@/components/Pagination";

import ProductCard from "@/components/ProductCard";
import { useProductFunctions } from "@/utils/firebase";

export default function ShopGrid() {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [currentItems, setCurrentItems] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);

  const itemsPerPage = 9;

  const { fetchAllProducts } = useProductFunctions();
  const fetchAllProductsInStore = async () => {
    setLoading(true);
    try {
      const fetchAllProductsResponse = await fetchAllProducts();
      console.log("fetch_all_products_response >> ", fetchAllProductsResponse);
      setItems(fetchAllProductsResponse?.data);
      setLoading(false);
    } catch (error) {
      console.error("error_response_fetching_all_products >> ", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("fetching_all_products_in_store_initilized ... ");
    fetchAllProductsInStore();
  }, []);

  useEffect(() => {
    try {
      const endOffset = itemOffset + itemsPerPage;
      console.log(`Loading items from ${itemOffset} to ${endOffset}`);
      setCurrentItems(items?.slice(itemOffset, endOffset));
      setPageCount(Math.ceil(items?.length / itemsPerPage));
    } catch (error) {
      console.log("an error occured at /shop >> ", error);
    }
  }, [itemOffset, itemsPerPage, items]);

  const lastCount = itemOffset + itemsPerPage;
  console.log(currentItems);
  console.log("Last Count >>", lastCount);
  return (
    <div>
      <div className="flex flex-col">
        <div className="my-5">
          {" "}
          Showing {itemOffset + 1}–
          {lastCount > items?.length ? items?.length : lastCount} of{" "}
          {items?.length} results
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems && currentItems?.length > 0 ? (
            currentItems.map((data, i) => {
              console.log(`Item ${i + 1}:`, data); // Logs each item in the array
              return (
                <div key={i}>
                  <ProductCard product={data} index={1 + i} />
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center text-lg">
              No products in store
            </div>
          )}
        </div>

        {/* Pagination */}
        <div>
          <div className="w-full flex justify-end my-4">
            <Pagination
              items={items}
              pageCount={pageCount}
              setItemOffset={setItemOffset}
              itemsPerPage={itemsPerPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
