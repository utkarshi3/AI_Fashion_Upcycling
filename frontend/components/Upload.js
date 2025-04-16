import { useState } from 'react';
import axios from 'axios';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Step 1: Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'upcycle-preset');

      const cloudinaryRes = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUD_NAME}/upload`,
        formData
      );

      // Step 2: Send to Backend for AI Processing
      const analysisRes = await axios.post('/api/upload', {
        imageUrl: cloudinaryRes.data.secure_url
      });

      setResults(analysisRes.data);
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleUpload}>
        <input 
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          className="border p-2 rounded"
        />
        <button 
          type="submit"
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded ml-2"
        >
          {loading ? 'Processing...' : 'Upload'}
        </button>
      </form>

      {results && (
        <div className="mt-8">
          <h3 className="text-xl font-bold">Analysis Results</h3>
          <p className="mt-2">Identified: {results.caption}</p>
          
          <div className="mt-4">
            <h4 className="font-bold">Upcycling Ideas</h4>
            <ul className="list-disc pl-6">
              {results.ideas.map((idea, i) => (
                <li key={i} className="my-2">{idea}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <h4 className="font-bold">Instructions</h4>
            <ol className="list-decimal pl-6">
              {results.instructions.map((step, i) => (
                <li key={i} className="my-2">{step}</li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}
