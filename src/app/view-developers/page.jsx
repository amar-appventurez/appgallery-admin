"use client";
import { useEffect, useState } from 'react';
import { fetchDevelopers, deleteApp } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function ViewDeveloper() {
  const [developers, setDevelopers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadDevelopers = async () => {
      setLoading(true);
      const response = await fetchDevelopers(page, 10 ,searchName, searchDate);

      if (response?.data?.result) {
        setDevelopers(response.data.result.rows);
        setTotalPages(Math.ceil(response.data.result.count / 10));
        setLoading(false);
      }
    };
    loadDevelopers();
  }, [page, searchName, searchDate]);

  const handleSearch = () => {
    setPage(1); // reset to the first page when a new search is initiated
  };

  const handleView = (developerId) => {
    console.log(`Viewing details for developer: ${developerId}`);
  };

  const handleUpdate = async (developerId) => {
    router.push(`/update-developer?developerId=${developerId}`);
  };

  const handleRemove = async (developerId) => {
    // Handle developer removal
  };

  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4">View Developers</h1>

      {/* Search Filters */}
      <div className="mb-4 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Search by Name"
          className="border px-4 py-2"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="date"
          placeholder="Search by Date Created"
          className="border px-4 py-2"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Developers Table */}
      <div className="mb-4 flex flex-col gap-1">
        {developers && developers.length > 0 ? (
          developers.map((developer) => (
            <div
              key={developer.id}
              className="border px-4 py-[0.1rem] rounded-lg shadow-lg bg-white flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 w-full"
            >
              <div className="flex-grow text-lg font-bold text-center sm:text-left">
                {developer.name}
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => handleUpdate(developer.id)}
                >
                  Update Details
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  onClick={() => handleRemove(developer.id)}
                >
                  Remove Developer
                </button>
              </div>
            </div>
          ))
        ) :  <>
        {loading &&
          Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="border px-4 py-[0.1rem] rounded-lg shadow-lg bg-slate-400 animate-pulse"
            >
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </div>
          ))}
        {!loading && (
          <div className="border px-4 py-[0.1rem] text-center text-white bg-[#1f2937] rounded-lg">
            Oops! No result match the filter
          </div>
        )}
      </>}
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between">
        {page > 1 && (
          <button
            className="bg-blue-300 px-4 py-2 text-white"
            onClick={() => setPage(page - 1)}
          >
            Previous (Page {page - 1})
          </button>
        )}
        {page < totalPages && (
          <button
            className="bg-blue-300 px-4 py-2 ml-auto text-white"
            onClick={() => setPage(page + 1)}
          >
            Next (Page {page + 1})
          </button>
        )}
      </div>
    </div>
  );
}
