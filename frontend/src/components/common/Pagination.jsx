function Pagination({
  page,
  totalPages,
  setPage
}) {

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-6">


      {/* Previous Button */}

      <button
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Previous
      </button>



      {/* Page Numbers */}

      {Array.from(
        { length: totalPages },
        (_, index) => index + 1
      ).map((number) => (

        <button
          key={number}
          onClick={() => setPage(number)}
          className={`px-4 py-2 rounded ${
            page === number
              ? "bg-blue-600 text-white"
              : "border"
          }`}
        >
          {number}
        </button>

      ))}



      {/* Next Button */}

      <button
        disabled={page === totalPages}
        onClick={() => setPage(page + 1)}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Next
      </button>


    </div>
  );
}

export default Pagination;