export default function SuggestionList({ results }) {
  return (
    <div className="mt-8 space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Garment Analysis</h2>
        <p className="text-gray-600">{results.caption}</p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Upcycling Ideas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {results.ideas.map((idea, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Idea {index + 1}</h3>
              <p className="text-gray-600">{idea}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Step-by-Step Instructions</h2>
        <ol className="list-decimal pl-6 space-y-2">
          {results.instructions.map((step, index) => (
            <li key={index} className="text-gray-600">{step}</li>
          ))}
        </ol>
      </div>
    </div>
  );
}
