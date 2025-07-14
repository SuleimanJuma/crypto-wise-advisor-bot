import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import { Card, CardContent } from '@/components/ui/card';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function LearnPage() {
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch all lessons
      const { data: lessonsData } = await supabase.from('lessons').select('*').order('order', { ascending: true });
      setLessons(lessonsData || []);
      // Fetch user progress
      const user = (await supabase.auth.getUser()).data.user;
      const { data: progressData } = await supabase.from('user_lesson_progress').select('*').eq('user_id', user.id);
      setProgress(progressData || []);
    };
    fetchData();
  }, []);

  const getStatus = (lessonId) => {
    const entry = progress.find((p) => p.lesson_id === lessonId);
    return entry ? entry.status : 'Not Started';
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Learn Crypto with Crypto-Wise Advisor</h1>
      <p className="mb-4">Master crypto from zero to advanced, interactively.</p>
      <div className="grid gap-4">
        {lessons.map((lesson) => (
          <Card key={lesson.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <Link to={`/learn/${lesson.id}`} className="text-lg font-semibold hover:underline">{lesson.title}</Link>
                <p className="text-sm text-gray-500">{lesson.level}</p>
              </div>
              <span className="text-xs bg-gray-200 rounded-full px-2 py-1">{getStatus(lesson.id)}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default LearnPage;
