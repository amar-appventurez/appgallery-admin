"use client";
import { useState, useEffect } from 'react';
import { createDeveloper, updateDeveloper } from '@/app/actions';

export default function CreateUpdateDeveloper({ updateDeveloper = false, initialDeveloperData = null }) {

    const [developerData, setDeveloperData] = useState({
        name: '',
    });
    /**On using as an update component */
    useEffect(() => {
        if (updateDeveloper && initialDeveloperData) {
            const {
                name
            } = initialDeveloperData

            setDeveloperData({
                name
            });

        }
    }, [updateDeveloper, initialDeveloperData]);

    const [developerOptions, setDeveloperOptions] = useState([]);

    const handleDeveloperSearch = async (query) => {
        // Fetch developer options based on search
        const response = await fetch(`/api/developers?search=${query}`, { cache: 'force-cache' });
        const data = await response.json();
        setDeveloperOptions(data);
    };




    const handleSubmit = async (e) => {
        e.preventDefault();
        try {

           const requestBody={
            name: developerData.name
           }

            
            if (updateDeveloper) {
                // Call update APIs
                body['developerId']=initialDeveloperData?.id;
                await updateDeveloper(requestBody);
            } else {
                // Call create API
                await createDeveloper(requestBody);
            }

        } catch (err) {
            console.error(err);
        }
    };


    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md text-[black]">
            <h1 className="text-2xl font-bold mb-4">{updateDeveloper ? 'Update Developer' : 'Create Developer'}</h1>

            {/* App Name */}
            <div className={"pb-2 font-[200]"}><label className={"bold"}>Developer Name</label></div>
            <input
                className="border p-2 w-full mb-4"
                type="text"
                placeholder="Developer Name"
                value={developerData.name}
                onChange={(e) => setDeveloperData({ ...developerData, name: e.target.value })}
            />


            {/* Submit Button */}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                {updateDeveloper ? 'Update Developer' : 'Create Developer'}
            </button>
        </form>
    );
}
