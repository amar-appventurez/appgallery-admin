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
  const [loading, setLoading] =useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadApps = async () => {
      setLoading(true);
      const response = await fetchDevelopers(page, searchName, searchDate);
   
      if (response?.data?.result) {
        setDevelopers(response.data.result.rows);
        setTotalPages(Math.ceil(response.data.result.count / 10));
        setLoading(false);
      }
    };
    loadApps();
  }, [page, searchName, searchDate]);

  const handleSearch = () => {
    setPage(1); // reset to the first page when a new search is initiated
  };

  const handleView = (developerId) => {
    console.log(`Viewing details for deeveloper: ${developerId}`);
  };

  const handleUpdate = async (developerId) => {
    router.push(`/update-developer?developerId=${developerId}`);
  };

  const handleRemove = async (developerId) => {

    // const response = await deleteDeveloper(developerId); 
    // if (response.success) {
    //   setDevelopers(apps.filter(app => app.id !== appId)); 
    // } else {
    //   console.error('Failed to delete app');
    // }

  };

  return (
    <div className="text-black">
      <h1 className="text-2xl font-bold mb-4">View Developers</h1>

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
            {/* <th className="px-4 py-2">Icon</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Date Created</th>
            <th className="px-4 py-2">Actions</th> */}
          </tr>
        </thead>
        <tbody>
          {developers && developers.length > 0 ? (
            developers.map((developer) => (
              <tr key={developer.id} className="border-b">
                <td className="border px-4 py-2">{developer.name}</td>
                {/* <td className="border px-4 py-2"><div className={`max-w-[6rem] flex flex-row justify-between`}><img src={`https://cityminiapps.kobil.com/images/${app.icon}`} alt="icon image"></img></div></td>
                <td className="border px-4 py-2">{app.description}</td>
                <td className="border px-4 py-2">{new Date(app.createdAt).toLocaleDateString()}</td> */}
                <td className="px-4 py-4 flex gap-2">
                  {/* <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    onClick={() => handleView(app.id)}
                  >
                    View Details
                  </button> */}
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
                </td>
              </tr>
            ))
          ) : (
            Array.from({ length: 12 }).map((_, index) => {
                return (
                  <tr className="border-b" key={index}>
                    <td colSpan="1" className="border-b px-4 py-4 text-center py-4 animate-pulse bg-slate-500">
                      {<>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</>}
                    </td>
                    <td colSpan="1" className="border-b px-4 py-4 text-center py-4 animate-pulse bg-slate-500">
                      {<>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</>}
                    </td>
                    <td colSpan="1" className="border-b px-4 py-4 text-center py-4 animate-pulse bg-slate-500">
                      {<>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</>}
                    </td>
                    <td colSpan="1" className="border-b px-4 py-4 text-center py-4 animate-pulse bg-slate-500">
                      {<>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</>}
                    </td>
                    <td colSpan="1" className="border-b px-4 py-4 text-center py-4 animate-pulse bg-slate-500">
                      {<>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</>}
                    </td>
                  </tr>
                )
              })
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
