import ReactPaginate from 'react-paginate';

export default function Pagination({ items, itemsPerPage, pageCount, setItemOffset }) {
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    console.log(`User requested page number ${event.selected}, which is offset ${newOffset}`);
    setItemOffset(newOffset);
  };

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel="»"
      onPageChange={handlePageClick}
      pageRangeDisplayed={2}
      pageCount={pageCount}
      previousLabel="«"
      renderOnZeroPageCount={null}
      marginPagesDisplayed={2}
      containerClassName="flex justify-center md:justify-end list-none p-0"
      pageClassName="inline-block mx-1"
      pageLinkClassName="text-black px-3 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-200"
      previousClassName="inline-block mx-1"
      previousLinkClassName="text-black px-3 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-200"
      nextClassName="inline-block mx-1"
      nextLinkClassName="text-black px-3 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-200"
      activeClassName="bg-blue-500 text-white border-blue-500"
    />
  );
}
