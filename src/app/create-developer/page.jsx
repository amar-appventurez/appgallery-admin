"use client";
import { useState, useEffect } from 'react';
import { createDeveloper, updateDeveloper } from '@/app/actions';

export default function CreateUpdateDeveloper({ isUpdateDeveloper = false, initialDeveloperData = null }) {

    const [developerData, setDeveloperData] = useState({
        name: '',
    });
    const [errors, setErrors] = useState({});
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    /**On using as an update component */
    useEffect(() => {
        if (isUpdateDeveloper && initialDeveloperData) {
            const {
                name
            } = initialDeveloperData

            setDeveloperData({
                name
            });
        }
    }, [isUpdateDeveloper, initialDeveloperData]);


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

            const requestBody = {
                name: developerData.name
            }

            if (isUpdateDeveloper) {
                // Call update APIs
                requestBody['developerId'] = initialDeveloperData?.id;
                await updateDeveloper(requestBody);
            } else {
                // Call create API
                await createDeveloper(requestBody);
            }
            setIsConfirmationModalOpen(true);
        } catch (err) {
            console.error(err)
            console.error(err?.response?.data?.message);
            setErrors({ name: err?.response?.data?.message })
        }
    };


    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md text-[black]">
                <h1 className="text-2xl font-bold mb-4">{isUpdateDeveloper ? 'Update Developer' : 'Create Developer'}</h1>

                {/* App Name */}
                <div className={"pb-2 font-[200]"}><label className={"bold"}>Developer Name
                    <input
                        className="border p-2 w-full mb-4"
                        type="text"
                        placeholder="Developer Name"
                        value={developerData.name}
                        onChange={(e) => setDeveloperData({ ...developerData, name: e.target.value })}
                    />
                    {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                </label>
                </div>
                {/* Submit Button */}
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    {isUpdateDeveloper ? 'Update Developer' : 'Create Developer'}
                </button>
            </form>


            {isConfirmationModalOpen && (
                <div className="fixed inset-0 text-white bg-opacity-50 flex items-center justify-center">
                    <div className="bg-[#353f4d] p-6 rounded-md flex flex-col justify-center items-center">
                        {<span>{`Successfully ${isUpdateDeveloper ? "updated the " : "created a new"} developer!`}</span>}

                        <button onClick={() => { setIsConfirmationModalOpen(false); }} className="bg-slate-600 text-white px-4 py-2 mt-4 rounded-md">Close</button>
                    </div>
                </div>
            )}
        </>
    );
}
