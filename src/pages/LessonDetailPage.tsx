import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import ReactMarkdown from 'react-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Initialize Supabase client
const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export function LessonDetailPage() {
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [quizAnswer, setQuizAnswer] = useState('');
  const [quizFeedback, setQuizFeedback] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    const fetchLesson = async () => {
      const { data } = await supabase.from('lessons').select('*').eq('id', lessonId).single();
      setLesson(data);
    };
    fetchLesson();
  }, [lessonId]);

  const markAsComplete = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    await supabase.from('user_lesson_progress').upsert({ user_id: user.id, lesson_id: lesson.id, status: 'completed' });
    alert('✅ Lesson marked as complete!');
  };

  const handleQuizSubmit = () => {
    if (quizAnswer.toLowerCase() === 'blockchain') {
      setQuizFeedback('✅ Correct! Blockchain is used to secure crypto transactions.');
    } else {
      setQuizFeedback('❌ Incorrect. Try again. The correct answer is Blockchain.');
    }
  };

  const askGPT = async () => {
    const res = await fetch(import.meta.env.VITE_GPT_QA_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ lesson_id: lesson.id, question }),
    });
    const data = await res.json();
    setAnswer(data.answer);
  };

  if (!lesson) return <p>Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-2">{lesson.title}</h1>
      <div className="prose prose-slate mb-4">
        <ReactMarkdown>{lesson.content}</ReactMarkdown>
      </div>

      {lesson.diagram_url && <img src={lesson.diagram_url} alt="Diagram" className="mb-4 rounded shadow" />}
      {lesson.video_url && <iframe src={lesson.video_url} title="Lesson Video" className="w-full aspect-video mb-4 rounded shadow" allowFullScreen></iframe>}

      <Button onClick={markAsComplete} className="mb-4">Mark as Complete</Button>

      {/* Mini Quiz Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Mini Quiz</h2>
        <p>Which technology is used to secure cryptocurrency transactions?</p>
        <Input placeholder="Your Answer" value={quizAnswer} onChange={(e) => setQuizAnswer(e.target.value)} className="mb-2" />
        <Button onClick={handleQuizSubmit}>Submit Answer</Button>
        {quizFeedback && <p className="mt-2">{quizFeedback}</p>}
      </div>

      {/* GPT Q&A Section */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Have a question?</h2>
        <Input placeholder="Ask a question about this lesson" value={question} onChange={(e) => setQuestion(e.target.value)} className="mb-2" />
        <Button onClick={askGPT}>Ask GPT</Button>
        {answer && <p className="mt-2 whitespace-pre-wrap">{answer}</p>}
      </div>
    </div>
  );
}

export default LessonDetailPage;
