import { useState } from 'react';
import axios from 'axios';

export default function ImageUpload({ onUploadStart, onUploadComplete }) {
  const [preview, setPreview] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    onUploadStart();
    setPreview(URL.createObjectURL(file));

    try {
      // Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_UPLOAD_PRESET);

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/upload`,
        formData
      );

      // Send to backend for analysis
      const analysisRes = await axios.post('/api/upload', {
        imageUrl: cloudinaryRes.data.secure_url
      });

      onUploadComplete(analysisRes.data);
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
      <input 
        type="file" 
        onChange={handleUpload}
        className="hidden"
        id="fileInput"
      />
      <label 
        htmlFor="fileInput"
        className="cursor-pointer text-gray-600"
      >
        {preview ? (
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-64 mx-auto mb-4 rounded-lg"
          />
        ) : (
          <div className="py-12">
            <p>Drag & drop your garment photo here</p>
            <p className="text-sm text-gray-500 mt-2">or click to select</p>
          </div>
        )}
      </label>
    </div>
  );
}
