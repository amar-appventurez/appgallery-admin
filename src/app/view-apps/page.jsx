"use client";
import { useEffect, useState } from 'react';
import { fetchApps, deleteApp } from '@/app/actions';
import { useRouter } from 'next/navigation';

export default function ViewApps() {
  const [apps, setApps] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchName, setSearchName] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [promoted, setPromoted] = useState('');
  const [suggested, setSuggested] = useState('');
  const [section, setSection] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadApps = async () => {
      setLoading(true);
      const response = await fetchApps(page, 10, searchName, searchDate, promoted, suggested, section);

      if (response?.data?.result) {
        setApps(response.data.result.rows);
        setTotalPages(Math.ceil(response.data.result.count / 10));
        setLoading(false);
      }
    };
    loadApps();
  }, [page, searchName, searchDate, promoted, suggested, section]);

  const handleSearch = () => {
    setPage(1); // Reset to the first page when a new search is initiated
  };

  const handleView = (appId) => {
    console.log(`Viewing details for app ID: ${appId}`);
  };

  const handleUpdate = async (appId) => {
    router.push(`/update-app?appId=${appId}`);
  };

  const handleRemove = async (appId) => {
    const response = await deleteApp(appId);
    if (response.success) {
      setApps(apps.filter(app => app.id !== appId));
    } else {
      console.error('Failed to delete app');
    }
  };

  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4">View Apps</h1>

      {/* Search Filters */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by Name"
          className="border px-4 py-2 mr-4"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
        <input
          type="date"
          placeholder="Search by Date Created"
          className="border px-4 py-2 mr-4"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
        />

        {/* Promoted Filter */}
        <select
          className="border px-4 py-2 mr-4"
          value={promoted}
          onChange={(e) => setPromoted(e.target.value)}
        >
          <option value="">Promoted</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        {/* Suggested Filter */}
        <select
          className="border px-4 py-2 mr-4"
          value={suggested}
          onChange={(e) => setSuggested(e.target.value)}
        >
          <option value="">Suggested</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select>

        {/* Appear in Section Filter */}
        <select
          className="border px-4 py-2 mr-4"
          value={section}
          onChange={(e) => setSection(e.target.value)}
        >
          <option value="">Appear in Section</option>
          <option value="1">Banner</option>
          <option value="2">Featured</option>
          <option value="3">Helpful1</option>
          <option value="4">Helpful2</option>
        </select>

        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Apps as Tabs */}
      <div className="mb-4 space-y-4">
        {apps && apps.length > 0 ? (
          apps.map((app) => (
            <div key={app.id} className="border px-4 py-[0.1rem] rounded-lg shadow-lg bg-white flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-0 w-full">
              <div className="flex flex-col sm:flex-row items-center w-full gap-2">
                <div className="flex-grow-[1] text-lg font-bold text-center sm:text-left">
                  {app.name}
                </div>
                <div className="flex-grow-[0.8] flex justify-around items-center gap-10">
                  <div className="lg:w-8 lg:h-8 flex-shrink-0">
                    <img
                      src={`https://cityminiapps.kobil.com/images/${app.icon}`}
                      alt="icon image"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  className="bg-blue-500 text-white px-4 py-[0.1rem] rounded-lg"
                  onClick={() => handleView(app.id)}
                >
                  View Details
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-[0.1rem] rounded-lg"
                  onClick={() => handleUpdate(app.id)}
                >
                  Update Details
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-[0.1rem] rounded-lg"
                  onClick={() => handleRemove(app.id)}
                >
                  Remove App
                </button>
              </div>
                  {/* <div className="text-sm text-gray-500 text-center sm:text-left">
                    {app.description}
                  </div> */}
                </div>
              </div>
            
            </div>
          ))
        ) : (
          <>
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
                Oops! No Apps Match the filter
              </div>
            )}
          </>
        )}
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
