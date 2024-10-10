"use client";
import { useState, useEffect } from 'react';
import { createApp, fetchDevelopers, updateAppDetails, updateAppImages } from '@/app/actions';
import debounce from 'lodash.debounce';

export default function CreateUpdateApp({ updateApp = false, initialAppData = null }) {

    const [appData, setAppData] = useState({
        name: '',
        developerId: null,
        summary: '',
        summaryClr: '#000000',  // Default color
        officialWebsite: '',
        icon: null,
        images: [],  // Multiple file uploads for images
        bannerImg: null,
        status: [],
        suggest: true,  // Checkbox for Suggest
        description: '',
        size: '',
        version: '',
        versionUpdate: '',
        id: null,
    });

    const [posting, setPosting] = useState(false);

    /**On using as an update component */
    useEffect(() => {
        if (updateApp && initialAppData) {
            const {
                AppDetail: { official_website, version, version_update, size, description, images },
                banner_img,
                icon, summary, summary_clr, status, name,
                AppDeveloper: { id },
                Segments
            } = initialAppData

            // setAppData({
            //     name,
            //     developerId: id,
            //     summary,
            //     summaryClr: summary_clr,  // Default color
            //     officialWebsite: official_website,
            //     icon,
            //     images,  // Multiple file uploads for images
            //     bannerImg: banner_img,
            //     status,
            //     promote: true,  // Checkbox for Promote
            //     suggest: true,  // Checkbox for Suggest
            //     description,
            //     size,
            //     version,
            //     versionUpdate: version_update
            // });

            const urlToFile = async (url, filename) => {
                const response = await fetch(`/api/fetchImage?imageUrl=${encodeURIComponent(url)}`);
                const blob = await response.blob();
                const fileType = blob.type;
                return new File([blob], filename, { type: fileType });
            };

            const imageOrigin = "https://cityminiapps.kobil.com/images/"

            const convertImages = async () => {
                // Convert URLs to File objects
                const iconFile = icon ? await urlToFile(`${imageOrigin}${icon}`, icon) : null;
                const bannerImgFile = banner_img ? await urlToFile(`${imageOrigin}${banner_img}`, banner_img) : null;
                const imageFiles = await Promise.all(images.map((img, index) => urlToFile(`${imageOrigin}${img}`, `image-${index}.png`)));

                // Update the appData state with these File objects
                setAppData({
                    name,
                    developerId: id,
                    summary,
                    summaryClr: summary_clr,
                    officialWebsite: official_website,
                    icon: iconFile,
                    images: imageFiles,
                    bannerImg: bannerImgFile,
                    status: Segments.map((segment) => { return { num: segment?.num, promote: segment?.promote } }),
                    suggest: true,
                    description,
                    size,
                    version,
                    versionUpdate: version_update,
                    id: initialAppData?.id
                });
                setIsDropdownOpen(false);
            };

            convertImages();
        }
    }, [updateApp, initialAppData]);

    const [developerOptions, setDeveloperOptions] = useState([]); // Dropdown options
    const [developerSearchTerm, setDeveloperSearchTerm] = useState(""); // Search term
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFileModalOpen, setFileModalOpen] = useState(false);
    const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
    const [fileType, setFileType] = useState('');


    console.log("Is confirmation box", isConfirmationModalOpen)

    /** Debounced developer search API call */
    const fetchDeveloperOptions = debounce(async (searchQuery) => {
        // if (!searchQuery) {
        //     setDeveloperOptions([]);
        //     return;
        // }

        try {
            const response = await fetchDevelopers(1, 10, searchQuery);
            setDeveloperOptions(response?.data?.result?.rows ?? []);
            setIsDropdownOpen(true); // Open dropdown after fetching data
        } catch (err) {
            console.error("Failed to fetch developers", err);
        }
    }, 300);


    useEffect(() => {
        fetchDeveloperOptions(developerSearchTerm);
    }, [developerSearchTerm]);


    const handleSelectDeveloper = (developerId) => {
        setAppData({ ...appData, developerId });
        setIsDropdownOpen(false); // close dropdown on selection
    };

    const handleSearchChange = (e) => {
        setAppData({ ...appData, developerId: null });
        setDeveloperSearchTerm(e.target.value);
    };


    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);

        if (fileType === 'images') {
            setAppData((prevData) => ({
                ...prevData,
                images: [...prevData.images, ...files]  // Add multiple files for images
            }));
        } else if (fileType === 'bannerImg') {
            setAppData({ ...appData, bannerImg: files[0] });
        } else if (fileType === 'icon') {
            setAppData({ ...appData, icon: files[0] });
        }

        // setFileModalOpen(false);
    };

    const removeImage = (index = 0) => {
        if (fileType === "images") {
            setAppData((prevData) => ({
                ...prevData,
                images: prevData.images.filter((_, i) => i !== index)
            }));
            return
        }
        if (fileType === "bannerImg") {
            setAppData((prevData) => ({
                ...prevData,
                bannerImg: null
            }))
        }
        if (fileType === "icon") {
            setAppData((prevData) => ({
                ...prevData,
                icon: null
            }))
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();

            formData.append('name', appData.name);
            formData.append('developerId', appData.developerId);
            formData.append('summary', appData.summary);
            formData.append('summaryClr', appData.summaryClr);
            formData.append('officialWebsite', appData.officialWebsite);

            formData.append('suggest', appData.suggest);
            formData.append('description', appData.description);
            formData.append('size', appData.size);
            formData.append('version', appData.version);
            formData.append('versionUpdate', appData.versionUpdate);

            //send status as multiple keys in the array
            appData.status.forEach(status => {
                formData.append('status[]', JSON.stringify(status));
            });

            if (appData.icon && !updateApp) {
                formData.append('icon', appData.icon);
            }

            if (appData.bannerImg && !updateApp) {
                formData.append('bannerImg', appData.bannerImg);
            }

            // appData.images.forEach((image, index) => {
            //     formData.append(`images[${index}]`, image);
            // });
            if (appData.images.length > 0 && !updateApp) {
                appData.images.forEach((image) => {
                    formData.append('images', image);
                });
            }
            if (updateApp) {
                // Call update APIs
                const formDataImages = new FormData();
                if (appData.icon) {
                    formDataImages.append('icon', appData.icon);
                }

                if (appData.bannerImg) {
                    formDataImages.append('bannerImg', appData.bannerImg);
                }

                // appData.images.forEach((image, index) => {
                //     formData.append(`images[${index}]`, image);
                // });
                if (appData.images.length > 0) {
                    appData.images.forEach((image) => {
                        formDataImages.append('images', image);
                    });
                }

                formDataImages.append('appId', initialAppData?.id)
                const updateAppObj = {
                    'name': appData.name,
                    'developerId': appData.developerId,
                    'summary': appData.summary,
                    'summaryClr': appData.summaryClr,
                    'officialWebsite': appData.officialWebsite,
                    'status': appData.status,
                    'promote': appData.promote,
                    'suggest': appData.suggest,
                    'description': appData.description,
                    'size': appData.size,
                    'version': appData.version,
                    'versionUpdate': appData.versionUpdate,
                    'appId': initialAppData?.id            //adding appid explicitly

                }
                setPosting(true);
                await Promise.all([updateAppDetails(updateAppObj), updateAppImages(formDataImages)]);
                setPosting(false);
                setIsConfirmationModalOpen(true);
            } else {
                // Call create API
                setPosting(true);
                await createApp(formData);
                setPosting(false);
                //open confirmation box
                setIsConfirmationModalOpen(true);
                //reset the state

            }

        } catch (err) {
            setPosting(false);
            console.error(err);
        }
    };

    const sectionArray = [
        { id: 1, sectionName: "Banner", promoteAvailable: false },
        { id: 2, sectionName: "Featured", promoteAvailable: true },
        { id: 3, sectionName: "Helpful1", promoteAvailable: true },
        { id: 4, sectionName: "Helpful2", promoteAvailable: false },
    ];



    const handleSectionSelect = (id, promoteAvailable) => {
        const isSelected = appData.status.some((section) => section.num === id);

        if (isSelected) {
            setAppData({
                ...appData,
                status: appData.status.filter((section) => section.num !== id),
            });
        } else {
            setAppData({
                ...appData,
                status: [
                    ...appData.status,
                    { num: id, promote: promoteAvailable ? false : true }, // Default promote
                ],
            });
        }
    };

    const handlePromoteChange = (id) => {
        setAppData({
            ...appData,
            status: appData.status.map((section) =>
                section.num === id ? { ...section, promote: !section.promote } : section
            ),
        });
    };


    return (

        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-lg text-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{updateApp ? 'Update App' : 'Create App'}</h1>

            <div className="grid grid-cols-2 gap-6 mb-6">
                {/* App Name */}
                <label className="block flex flex-col">
                    <span className="text-sm font-medium text-gray-700 mb-2">Name</span>
                    <input
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        placeholder="App Name"
                        value={appData.name}
                        onChange={(e) => setAppData({ ...appData, name: e.target.value })}
                    />
                </label>

                {/* App Summary */}
                <label className="block flex flex-col">
                    <span className="text-sm font-medium text-gray-700 mb-2">Summary</span>
                    <input
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        placeholder="App Summary"
                        value={appData.summary}
                        onChange={(e) => setAppData({ ...appData, summary: e.target.value })}
                    />
                </label>

                {/* Color Picker for Summary Color */}
                <label className="block flex flex-col">
                    <span className="text-sm font-medium text-gray-700 mb-2">Summary Color</span>
                    <input
                        type="color"
                        value={appData.summaryClr}
                        onChange={(e) => setAppData({ ...appData, summaryClr: e.target.value })}
                        className="h-10 w-full rounded-lg"
                    />
                </label>

                {/* Official Website */}
                <label className="block flex flex-col">
                    <span className="text-sm font-medium text-gray-700 mb-2">Official Website</span>
                    <input
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        placeholder="Official Website"
                        value={appData.officialWebsite}
                        onChange={(e) => setAppData({ ...appData, officialWebsite: e.target.value })}
                    />
                </label>

                {/* Developer ID Dropdown with Search */}
                <label className="block flex flex-col">
                    <span className="text-sm font-medium text-gray-700 mb-2">Developer</span>
                    <div className="relative">
                        <input
                            className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            type="text"
                            placeholder="Search Developer"
                            value={!appData?.developerId ? developerSearchTerm : developerOptions.find((developer) => { return developer.id === appData?.developerId })['name']}
                            onChange={handleSearchChange}
                        />
                        {isDropdownOpen && developerOptions.length > 0 && (
                            <ul className="absolute z-10 w-full bg-white border border-gray-300 mt-2 max-h-40 overflow-y-auto shadow-lg rounded-lg">
                                {developerOptions.map((developer) => (
                                    <li
                                        key={developer.id}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                        onClick={() => handleSelectDeveloper(developer.id)}
                                    >
                                        {developer.name}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </label>

                {/* App Description */}
                <label className="block flex flex-col col-span-2">
                    <span className="text-sm font-medium text-gray-700 mb-2">App Description</span>
                    <textarea
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="App Description"
                        value={appData.description}
                        onChange={(e) => setAppData({ ...appData, description: e.target.value })}
                    />
                </label>

                {/* App Version */}
                <label className="block flex flex-col">
                    <span className="text-sm font-medium text-gray-700 mb-2">App Version</span>
                    <input
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        placeholder="App Version"
                        value={appData.version}
                        onChange={(e) => setAppData({ ...appData, version: e.target.value })}
                    />
                </label>

                {/* Version Update */}
                <label className="block flex flex-col">
                    <span className="text-sm font-medium text-gray-700 mb-2">Version Update</span>
                    <input
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        placeholder="Version Update Info"
                        value={appData.versionUpdate}
                        onChange={(e) => setAppData({ ...appData, versionUpdate: e.target.value })}
                    />
                </label>

                {/* App Size */}
                <label className="block flex flex-col">
                    <span className="text-sm font-medium text-gray-700 mb-2">App Size</span>
                    <input
                        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        type="text"
                        placeholder="App Size"
                        value={appData.size}
                        onChange={(e) => setAppData({ ...appData, size: e.target.value })}
                    />
                </label>
            </div>

            {/* Status */}
            <label className="block mb-4">
                <span className="text-sm font-medium text-gray-700 mb-2">Appear in Section</span>
                <div className="grid grid-cols-4 gap-4">
                    {sectionArray.map((section) => {
                        const isSelected = appData?.status?.some((s) => s.num === section.id);
                        return (
                            <div
                                key={section.id}
                                className={`border p-4 cursor-pointer rounded-lg font-semibold text-sm ${isSelected ? "bg-indigo-500 text-white" : "bg-gray-100 text-gray-700"}`}
                                onClick={() => handleSectionSelect(section.id, section.promoteAvailable)}
                            >
                                <h3>{section.sectionName}</h3>
                                {isSelected && section.promoteAvailable && (
                                    <label className="flex items-center mt-2">
                                        <input
                                            type="checkbox"
                                            checked={
                                                appData?.status.find((s) => s.num === section.id)?.promote
                                            }
                                            onChange={(e) => {
                                                e.stopPropagation(); // Prevent card deselection on checkbox click
                                                handlePromoteChange(section.id);
                                            }}
                                        />
                                        <span className="ml-2 text-sm">Promote</span>
                                    </label>
                                )}
                            </div>
                        );
                    })}
                </div>
            </label>

            {/* Promote and Suggest Checkboxes */}
            <div className="mb-6 flex items-center">
                <label className="inline-flex items-center mr-6">
                    <input
                        type="checkbox"
                        checked={appData.promote}
                        onChange={(e) => setAppData({ ...appData, promote: e.target.checked })}
                        className="rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm">Promote</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                        type="checkbox"
                        checked={appData.suggest}
                        onChange={(e) => setAppData({ ...appData, suggest: e.target.checked })}
                        className="rounded focus:ring-2 focus:ring-indigo-500"
                    />
                    <span className="ml-2 text-sm">Appear as a suggested app?</span>
                </label>
            </div>

            {/* File Upload Buttons */}
            <div className="mb-6 flex space-x-4">
                <button
                    type="button"
                    onClick={() => { setFileType('icon'); setFileModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Upload Icon
                </button>
                <button
                    type="button"
                    onClick={() => { setFileType('images'); setFileModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Upload Images
                </button>
                <button
                    type="button"
                    onClick={() => { setFileType('bannerImg'); setFileModalOpen(true); }}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    Upload Banner Image
                </button>
            </div>
            {/* Modal for File Upload */}
            {isFileModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-md">
                        <h2 className="text-xl font-bold mb-4">{`${(fileType === 'icon' && appData.icon) || (fileType === 'bannerImg' && appData.bannerImg) ? "Replace" : "Upload"} ${fileType.toUpperCase()}`}</h2>
                        <input
                            type="file"
                            onChange={handleFileChange}
                            multiple={fileType === 'images'}  // Allow multiple file selection for images
                        />

                        {/* Display uploaded images */}
                        {/* {fileType === 'images' && appData.images.length > 0 && ( */}
                        <div className="mt-4">
                            <h3 className="font-semibold mb-2">Uploaded Images:</h3>
                            <div className="grid grid-cols-4 gap-3">
                                {fileType === 'images' && appData.images.length > 0 &&
                                    appData.images.map((image, index) => (
                                        <div key={index} className="relative">
                                            <div className={"border-[0.15rem] border-solid border-slate-400 p-[0.25rem]"}>
                                                <img
                                                    src={URL.createObjectURL(image)}
                                                    alt={`uploaded-${index}`}
                                                    className="w-full h-24 object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-[-0.5rem] right-[-0.5rem] bg-slate-600 text-white px-[0.35rem] pb-[0.05rem] text-[0.75rem] rounded-full"
                                            >
                                                x
                                            </button>
                                        </div>
                                    ))
                                }
                                {
                                    (fileType === 'bannerImg') && appData.bannerImg && (
                                        <div className="relative">
                                            <div className={"border-[0.15rem] border-solid border-slate-400 p-[0.25rem]"}>
                                                <img
                                                    src={URL.createObjectURL(appData[`${fileType}`])}
                                                    alt={`uploaded-${fileType}`}
                                                    className="w-full h-24 object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage()}
                                                className="absolute top-[-0.5rem] right-[-0.5rem] bg-slate-600 text-white px-[0.35rem] pb-[0.05rem] text-[0.75rem] rounded-full"
                                            >
                                                x
                                            </button>
                                        </div>
                                    )
                                }

                                {
                                    (fileType === 'icon') && appData.icon && (
                                        <div className="relative">
                                            <div className={"border-[0.15rem] border-solid border-slate-400 p-[0.25rem]"}>
                                                <img
                                                    src={URL.createObjectURL(appData[`${fileType}`])}
                                                    alt={`uploaded-${fileType}`}
                                                    className="w-full h-24 object-cover"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeImage()}
                                                className="absolute top-[-0.5rem] right-[-0.5rem] bg-slate-600 text-white px-[0.35rem] pb-[0.05rem] text-[0.75rem] rounded-full"
                                            >
                                                x
                                            </button>
                                        </div>
                                    )
                                }

                            </div>
                        </div>
                        {/* )} */}

                        <button onClick={() => setFileModalOpen(false)} className="bg-slate-600 text-white px-4 py-2 mt-4 rounded-md">Close</button>
                    </div>
                </div>
            )}

            {
                isConfirmationModalOpen && (
                    <div className="fixed inset-0 text-white bg-opacity-50 flex items-center justify-center">
                        <div className="bg-[#353f4d] p-6 rounded-md flex flex-col justify-center items-center">
                            <span> {`Successfully ${updateApp ? "updated the " : "created a new"} app !`} </span>
                            <button onClick={() => setIsConfirmationModalOpen(false)} className="bg-slate-600 text-white px-4 py-2 mt-4 rounded-md">Close</button>
                        </div>

                    </div>
                )
            }

            {/* Submit Button */}
            <button type="submit" className={`bg-green-500 text-white p-2 rounded ${posting && "disabled bg-red-500"}`}>
                {posting ? "Posting..." : (updateApp ? 'Update App' : 'Create App')}
            </button>
        </form>
    );
}
