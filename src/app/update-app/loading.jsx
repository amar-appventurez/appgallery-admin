import React from 'react'

const Loading = () => {

    const sectionArray = [
        { id: 1, sectionName: "Banner", promoteAvailable: false },
        { id: 2, sectionName: "Featured", promoteAvailable: true },
        { id: 3, sectionName: "Helpful1", promoteAvailable: true },
        { id: 4, sectionName: "Helpful2", promoteAvailable: false },
    ];

  return (
    <form className="bg-white p-6 shadow-md rounded-lg text-gray-700 bg-slate-100 animate-pulse">
    {/* <h1 className="text-3xl font-bold text-gray-900 mb-6">{updateApp ? 'Update App' : 'Create App'}</h1> */}

    <div className="grid grid-cols-2 gap-6 mb-6">
        {/* App Name */}
        <label className="block flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2 animate-pulse">Name</span>
            <input
                className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 animate-pulse`}
                type="text"
                placeholder="App Name"
            />
           
        </label>

        {/* App Summary */}
        <label className="block flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2 animate-pulse">Summary</span>
            <input
                className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 animate-pulse`}
                type="text"
                placeholder="App Summary"
          
            />
           
        </label>

        {/* Color Picker for Summary Color */}
        <label className="block flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2 animate-pulse">Summary Color</span>
            <input
                type="color"
                className="h-10 w-full rounded-lg animate-pulse"
            />
        </label>

        {/* Official Website */}
        <label className="block flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2">Official Website</span>
            <input
                className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 animate-pulse`}
                type="text"
                placeholder="Official Website"
            />
        </label>

        {/* Developer ID Dropdown with Search */}
        <label className="block flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2 animate-pulse">Developer</span>
            <div className="relative">
                <input
                    className={`border 'border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 animate-pulse`}
                    type="text"
                    placeholder="Search Developer"
                />
                
            </div>
        </label>

        {/* App Description */}
        <label className="block flex flex-col col-span-2">
            <span className="text-sm font-medium text-gray-700 mb-2 animate-pulse">App Description</span>
            <textarea
                className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 animate-pulse`}
                placeholder="App Description"
            />
           
        </label>

        {/* App Version */}
        <label className="block flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2 animante-pulse">App Version</span>
            <input
                className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 animate-pulse`}
                type="text"
                placeholder="App Version"
            />
        </label>

        {/* Version Update */}
        <label className="block flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2 animate-pulse">Version Update</span>
            <input
                className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 animate-pulse`}
                type="text"
                placeholder="Version Update Info"
             
            />
           
        </label>

        {/* App Size */}
        <label className="block flex flex-col">
            <span className="text-sm font-medium text-gray-700 mb-2 animate-pulse">App Size</span>
            <input
                className={`border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 animate-pulse`}
                type="text"
                placeholder="App Size"
             
            />
          
        </label>
    </div>

    {/* Status */}
    <label className="block mb-4">
        <span className="text-sm font-medium text-gray-700 mb-2 animate-pulse">Appear in Section</span>
    </label>
    <div className="grid grid-cols-4 gap-4">
        {sectionArray.map((sectionObj) => {
            return (
                <div
                    key={sectionObj.id}
                    className={`border p-4 rounded-lg font-semibold text-sm animate-pulse`}
                >
                    <h3>{sectionObj.sectionName}</h3>
                    <button
                        type="button"
                        className={`text-white rounded w-full clickable bg-red-500 animate-pulse`}
                    >
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </button>
                    {sectionObj.promoteAvailable && (
                        <div className="mt-2 flex items-center">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={false}
                                />
                                <span className="ml-2 text-sm">Promote</span>
                            </label>
                        </div>
                    )}
                </div>
            );
        })}
    </div>

    {/* Promote and Suggest Checkboxes */}
    <div className="mb-6 flex items-center">
        <label className="inline-flex items-center">
            <input
                type="checkbox"
                checked={false}
                className="rounded focus:ring-2 focus:ring-indigo-500 animate-pulse"
            />
            <span className="ml-2 text-sm">Appear as a suggested app?</span>
        </label>
    </div>

    {/* File Upload Buttons */}
    <div className="mb-6 flex space-x-4">
        <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 animate-pulse"
        >
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </button>
     
        <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 animate-pulse"
        >
           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </button>
        
        <button
            type="button"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 animate-pulse" 
        >
             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        </button>
      
    </div>

    <button type="submit" className={`bg-green-500 text-white p-2 rounded animate-pulse`}>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
    </button>
</form>
  )
}

export default Loading