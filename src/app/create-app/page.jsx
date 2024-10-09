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
        promote: true,  // Checkbox for Promote
        suggest: true,  // Checkbox for Suggest
        description: '',
        size: '',
        version: '',
        versionUpdate: '',
        id: null,
    });

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
                    status: Segments.map((segment) => { return {num: segment?.num, promote: segment?.promote} }),
                    promote: true,
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
    const [fileType, setFileType] = useState('');

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

            formData.append('promote', appData.promote);
            formData.append('suggest', appData.suggest);
            formData.append('description', appData.description);
            formData.append('size', appData.size);
            formData.append('version', appData.version);
            formData.append('versionUpdate', appData.versionUpdate);

            //send status as multiple keys in the array
            console.log("Status in handleSubmit", appData?.status)
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

                await Promise.all([updateAppDetails(updateAppObj), updateAppImages(formDataImages)]);
            } else {
                // Call create API
                await createApp(formData);
            }

        } catch (err) {
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
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md text-[black]">
            <h1 className="text-2xl font-bold mb-4">{updateApp ? 'Update App' : 'Create App'}</h1>

            {/* App Name */}
            <input
                className="border p-2 w-full mb-4"
                type="text"
                placeholder="App Name"
                value={appData.name}
                onChange={(e) => setAppData({ ...appData, name: e.target.value })}
            />

            {/* App Summary */}
            <input
                className="border p-2 w-full mb-4"
                type="text"
                placeholder="App Summary"
                value={appData.summary}
                onChange={(e) => setAppData({ ...appData, summary: e.target.value })}
            />

            {/* Color Picker for Summary Color */}
            <label className="block mb-2">Summary Color</label>
            <input
                type="color"
                value={appData.summaryClr}
                onChange={(e) => setAppData({ ...appData, summaryClr: e.target.value })}
                className="mb-4"
            />

            {/* Official Website */}
            <input
                className="border p-2 w-full mb-4"
                type="text"
                placeholder="Official Website"
                value={appData.officialWebsite}
                onChange={(e) => setAppData({ ...appData, officialWebsite: e.target.value })}
            />


            {/* Developer ID Dropdown with Search */}
            <label className="block mb-2">Developer</label>

            <div className="mb-4 relative">
                <input
                    className="border p-2 w-full"
                    type="text"
                    placeholder="Search Developer"
                    value={!appData?.developerId ? developerSearchTerm : developerOptions.find((developer) => { return developer.id === appData?.developerId })['name']}
                    onChange={handleSearchChange}
                />

                {isDropdownOpen && developerOptions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border mt-2 max-h-40 overflow-y-auto shadow-md">
                        {developerOptions.map((developer) => (
                            <li
                                key={developer.id}
                                className="p-2 hover:bg-gray-200 cursor-pointer"
                                onClick={() => handleSelectDeveloper(developer.id)}
                            >
                                {developer.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>



            {/* App Description */}
            <textarea
                className="border p-2 w-full mb-4"
                placeholder="App Description"
                value={appData.description}
                onChange={(e) => setAppData({ ...appData, description: e.target.value })}
            />

            {/* App Version */}
            <input
                className="border p-2 w-full mb-4"
                type="text"
                placeholder="App Version"
                value={appData.version}
                onChange={(e) => setAppData({ ...appData, version: e.target.value })}
            />

            {/* Version Update */}
            <input
                className="border p-2 w-full mb-4"
                type="text"
                placeholder="Version Update Info"
                value={appData.versionUpdate}
                onChange={(e) => setAppData({ ...appData, versionUpdate: e.target.value })}
            />

            {/* App Size */}
            <input
                className="border p-2 w-full mb-4"
                type="text"
                placeholder="App Size"
                value={appData.size}
                onChange={(e) => setAppData({ ...appData, size: e.target.value })}
            />

            {/* Status */}



            <label className="block mb-2">Appear in Section</label>

            <div className="grid grid-cols-4 gap-4 mb-4">
                {sectionArray.map((section) => {
                    const isSelected = appData?.status?.some((s) => s.num === section.id);
                    return (
                        <div
                            key={section.id}
                            className={`border p-4 cursor-pointer rounded-xl font-semibold ${isSelected ? " text-white bg-slate-500" : "bg-slate-200"
                                }`}
                            onClick={() => handleSectionSelect(section.id, section.promoteAvailable)}
                        >
                            <h3>{section.sectionName}</h3>

                            {/* Show checkbox only if the card is selected and promoteAvailable is true */}
                            {isSelected && section.promoteAvailable && (
                                <label className="flex items-center mt-2 font-normal">
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
                                    <span className="ml-2">Promote</span>
                                </label>
                            )}
                        </div>
                    );
                })}
            </div>



            {/* <select
                className="border p-2 w-full mb-4"
                value={appData.status}
                onChange={(e) => {
                    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
                    setAppData({ ...appData, status: selectedOptions });
                }}
                multiple
            >
                <option value={1}>Banner</option>
                <option value={2}>Featured</option>
                <option value={3}>Helpful1</option>
                <option value={4}>Helpful2</option>
            </select> */}

            {/* Promote and Suggest Checkboxes */}
            <div className="mb-4">
                <label className="mr-4">
                    <input
                        type="checkbox"
                        checked={appData.promote}
                        onChange={(e) => setAppData({ ...appData, promote: e.target.checked })}
                    />
                    {" "}Promote
                </label>
                <label className="ml-4">
                    <input
                        type="checkbox"
                        checked={appData.suggest}
                        onChange={(e) => setAppData({ ...appData, suggest: e.target.checked })}
                    />
                    {" "}Apper as a suggested app ?
                </label>
            </div>

            {/* File Upload Buttons */}
            <div className="mb-4">
                <button type="button" onClick={() => { setFileType('icon'); setFileModalOpen(true); }} className="bg-blue-500 text-white px-4 py-2 mr-2">Upload Icon</button>
                <button type="button" onClick={() => { setFileType('images'); setFileModalOpen(true); }} className="bg-blue-500 text-white px-4 py-2 mr-2">Upload Images</button>
                <button type="button" onClick={() => { setFileType('bannerImg'); setFileModalOpen(true); }} className="bg-blue-500 text-white px-4 py-2">Upload Banner Image</button>
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

            {/* Submit Button */}
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                {updateApp ? 'Update App' : 'Create App'}
            </button>
        </form>
    );
}
