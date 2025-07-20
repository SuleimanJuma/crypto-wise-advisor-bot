import React, { useState } from 'react';
import { contentManager, sampleLessons } from '../lib/contentManager';

const AdminPage: React.FC = () => {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeedLessons = async () => {
    setSeeding(true);
    setMessage('Checking if lessons table is empty...');
    try {
      // Check if lessons already exist
      const existing = await contentManager.getLessonsByCategory('Ethereum'); // Check one category
      if (existing.length > 0) {
        setMessage('Lessons table already has entries. Skipping seeding to prevent duplicates.');
        setSeeding(false);
        return;
      }
      // Seed all lessons
      for (const category in sampleLessons) {
        for (const lesson of sampleLessons[category]) {
          try {
            await contentManager.addLesson(lesson);
            setMessage(msg => msg + `\nInserted lesson: ${lesson.title}`);
          } catch (err) {
            setMessage(msg => msg + `\nError inserting lesson: ${lesson.title}`);
          }
        }
      }
      setMessage(msg => msg + '\nSeeding completed successfully.');
    } catch (err) {
      setMessage('Unexpected error during seeding: ' + (err instanceof Error ? err.message : JSON.stringify(err)));
    }
    setSeeding(false);
  };

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Page</h1>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        onClick={handleSeedLessons}
        disabled={seeding}
      >
        {seeding ? 'Seeding...' : 'Seed Lessons'}
      </button>
      <pre className="mt-4 bg-gray-100 p-2 rounded text-sm whitespace-pre-wrap">{message}</pre>
    </div>
  );
};

export default AdminPage;
