import React, { useState } from 'react';
import axios from 'axios';

const DeveloperSearch = ({setAppData}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [developers, setDevelopers] = useState([]);
  const [selectedDeveloperId, setSelectedDeveloperId] = useState(null);
  const [showAddNew, setShowAddNew] = useState(false);

  // Fetch developers from API
  const handleSearch = async (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length > 0) {
      try {
        const response = await axios.get(`/api/developers?name=${term}`);
        const results = response.data;
        setDevelopers(results);

        if (results.length === 0) {
          setShowAddNew(true); // Show "Add New" if no results
        } else {
          setShowAddNew(false);
        }
      } catch (error) {
        console.error("Error fetching developers", error);
      }
    } else {
      setDevelopers([]);
      setShowAddNew(false);
    }
  };

  // Handle developer selection
  const handleSelectDeveloper = (developer) => {
    // setSelectedDeveloperId(developer.id);
    setAppData((prev)=>({...prev, developerId: developer.id}))
    setSearchTerm(developer.name);
    setDevelopers([]); // Hide the dropdown after selection
  };

  // Add a new developer via API
  const handleAddNew = async () => {
    if (searchTerm.trim() === '') return;

    try {
      const response = await axios.post('/api/developers', { name: searchTerm });
      const newDeveloper = response.data;

      setSelectedDeveloperId(newDeveloper.id);
      setSearchTerm(newDeveloper.name);
      setDevelopers([]);
      setShowAddNew(false); // Hide "Add New" after adding
    } catch (error) {
      console.error('Error creating developer', error);
    }
  };

  return (
    <div className="relative">
      <input
        type="text"
        className="w-full p-2 border rounded-md"
        placeholder="Search for a developer..."
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* Dropdown list of developers */}
      {developers.length > 0 && (
        <ul className="absolute z-10 bg-white border rounded-md w-full mt-1 max-h-40 overflow-y-auto">
          {developers.map((developer) => (
            <li
              key={developer.id}
              className="p-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSelectDeveloper(developer)}
            >
              {developer.name}
            </li>
          ))}
        </ul>
      )}

      {/* Add New Button */}
      {showAddNew && (
        <button
          className="absolute right-0 top-0 mt-2 mr-2 bg-blue-500 text-white px-4 py-1 rounded-md"
          onClick={handleAddNew}
        >
          Add New
        </button>
      )}
    </div>
  );
};

export default DeveloperSearch;
