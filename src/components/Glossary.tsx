import React, { useState } from "react";
import { searchGlossary, GlossaryEntry } from "../glossary";

export default function Glossary() {
  const [query, setQuery] = useState("");
  const results: GlossaryEntry[] = searchGlossary(query);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Crypto Glossary</h2>
      <input
        type="text"
        placeholder="Search for a term..."
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:text-white"
      />
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {results.length === 0 && (
          <li className="py-4 text-center text-gray-500 dark:text-gray-400">No results found.</li>
        )}
        {results.map(entry => (
          <li key={entry.term} className="py-4">
            <span className="font-semibold text-blue-700 dark:text-blue-300">{entry.term}</span>
            <div className="text-gray-700 dark:text-gray-200 mt-1">{entry.definition}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
