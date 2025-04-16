import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-green-600">EcoStitch</h1>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Transform Your Old Clothes with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Upload a photo of your garment and discover creative upcycling ideas
          </p>
          <Link
            href="/upload"
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}
