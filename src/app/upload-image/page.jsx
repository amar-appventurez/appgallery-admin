"use client"
import { useState } from 'react';
import { uploadImage } from '@/app/actions';

export default function UploadImage() {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    try {
      await uploadImage(formData);
      alert('Image uploaded successfully!');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded-md">
      <h1 className="text-2xl font-bold mb-4">Upload Image</h1>
      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
      />
      <button className="bg-blue-500 text-white px-4 py-2">Upload Image</button>
    </form>
  );
}
