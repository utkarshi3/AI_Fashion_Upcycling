import { useState } from 'react';
import ImageUpload from '../components/ImageUpload';
import SuggestionList from '../components/SuggestionList';

export default function UploadPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Upload Your Garment</h1>
        
        <ImageUpload 
          onUploadStart={() => setLoading(true)}
          onUploadComplete={(data) => {
            setResults(data);
            setLoading(false);
          }}
        />

        {loading && <p className="mt-4 text-gray-600">Analyzing your garment...</p>}
        
        {results && <SuggestionList results={results} />}
      </div>
    </div>
  );
}
