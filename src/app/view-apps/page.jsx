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
  const [loading, setLoading] =useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadApps = async () => {
      setLoading(true);
      const response = await fetchApps(page, searchName, searchDate);
   
      if (response?.data?.result) {
        setApps(response.data.result.rows);
        setTotalPages(Math.ceil(response.data.result.count / 10));
        setLoading(false);
      }
    };
    loadApps();
  }, [page, searchName, searchDate]);

  const handleSearch = () => {
    setPage(1); // reset to the first page when a new search is initiated
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
        <button
          className="bg-blue-500 text-white px-4 py-2"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>

      {/* Apps Table */}
      <table className="table-auto w-full mb-4">
        <thead>
          <tr>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Icon</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Date Created</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps && apps.length > 0 ? (
            apps.map((app) => (
              <tr key={app.id} className="border-b">
                <td className="border px-4 py-2">{app.name}</td>
                <td className="border px-4 py-2">{<img src={`https://cityminiapps.kobil.com/images/${app.icon}`} alt="icon image"></img>}</td>
                <td className="border px-4 py-2">{app.description}</td>
                <td className="border px-4 py-2">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="border px-4 py-2 flex gap-2">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => handleView(app.id)}
                  >
                    View Details
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => handleUpdate(app.id)}
                  >
                    Update Details
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => handleRemove(app.id)}
                  >
                    Remove App
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No apps found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
