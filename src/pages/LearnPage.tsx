import React, { useState, useEffect } from 'react';
import { Book, CheckCircle, Play, FileText, Shield, TrendingUp, Bitcoin } from 'lucide-react';

const LearnPage = () => {
  const [lessons, setLessons] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [userProgress, setUserProgress] = useState({});
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - replace with actual Supabase calls
  const mockLessons = [
    {
      id: 1,
      title: "What is Ethereum?",
      category: "Ethereum",
      order_index: 1,
      content: `# What is Ethereum?\n\n## Introduction\nEthereum is a decentralized platform that runs smart contracts - applications that run exactly as programmed without any possibility of downtime, censorship, fraud, or third-party interference.\n\n## Key Concepts\n- **Smart Contracts**: Self-executing contracts with terms directly written into code\n- **Ether (ETH)**: The native cryptocurrency that powers the network\n- **Gas**: The fee required to execute transactions and smart contracts\n- **Decentralized**: No single entity controls the network\n\n## Why Ethereum Matters\nEthereum enables:\n- Programmable money\n- Decentralized applications (dApps)\n- Decentralized finance (DeFi)\n- NFTs and digital ownership\n\n## Key Takeaways\n- Ethereum is programmable money\n- Smart contracts eliminate intermediaries\n- Gas fees power network security\n- Decentralization ensures no single point of failure`,
      image_url: null,
      completed: false
    },
    {
      id: 2,
      title: "Creating Your First Wallet",
      category: "Ethereum",
      order_index: 2,
      content: `# Creating Your First Ethereum Wallet\n\n## What is a Crypto Wallet?\nA crypto wallet is a digital tool that allows you to store, send, and receive cryptocurrencies.\n\n## Types of Wallets\n1. **Hot Wallets**: Connected to the internet (convenient but less secure)\n2. **Cold Wallets**: Offline storage (more secure but less convenient)\n3. **Software Wallets**: Apps on your phone or computer\n4. **Hardware Wallets**: Physical devices for maximum security\n\n## Setting Up MetaMask\n1. Visit metamask.io\n2. Download the browser extension\n3. Create a new wallet\n4. **CRITICAL**: Write down your seed phrase and store it safely\n\n## Key Takeaways\n- Your seed phrase is your ultimate backup\n- Security should always be your top priority\n- Start with small amounts while learning`,
      image_url: null,
      completed: true
    },
    {
      id: 3,
      title: "Avoiding Crypto Scams",
      category: "Safety",
      order_index: 1,
      content: `# Avoiding Crypto Scams\n\n## Common Scam Types\n### 1. Phishing Attacks\n- Fake websites that steal your login credentials\n- Always check URLs carefully\n\n### 2. Social Engineering\n- Impersonators on social media\n- Fake customer support\n\n## Red Flags to Watch For\n- Guaranteed returns or "risk-free" investments\n- Pressure to act quickly\n- Requests for private keys or seed phrases\n\n## Protection Strategies\n1. **Verify Everything**: Double-check URLs and contact information\n2. **Use Reputable Platforms**: Stick to well-known exchanges\n3. **Enable Security Features**: 2FA, withdrawal whitelisting\n\n## Key Takeaways\n- Scammers target both beginners and experienced users\n- Legitimate companies never ask for private keys\n- Education is your best defense`,
      image_url: null,
      completed: false
    }
  ];

  const categories = [
    { id: 'all', name: 'All Lessons', icon: Book, count: mockLessons.length },
    { id: 'Ethereum', name: 'Ethereum', icon: FileText, count: 2 },
    { id: 'Bitcoin', name: 'Bitcoin', icon: Bitcoin, count: 0 },
    { id: 'Safety', name: 'Safety', icon: Shield, count: 1 },
    { id: 'Portfolio', name: 'Portfolio', icon: TrendingUp, count: 0 }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLessons(mockLessons);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredLessons = activeCategory === 'all' 
    ? lessons 
    : lessons.filter(lesson => lesson.category === activeCategory);

  const completedCount = lessons.filter(lesson => lesson.completed).length;
  const progressPercentage = lessons.length > 0 ? (completedCount / lessons.length) * 100 : 0;

  const markAsComplete = (lessonId) => {
    setLessons(lessons.map(lesson => 
      lesson.id === lessonId ? { ...lesson, completed: true } : lesson
    ));
  };

  const getCategoryIcon = (category) => {
    const categoryData = categories.find(cat => cat.id === category);
    return categoryData ? categoryData.icon : Book;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lessons...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learn Crypto</h1>
          <p className="text-gray-600">Master cryptocurrency fundamentals step by step</p>
          {/* Progress Bar */}
          <div className="mt-6 bg-white rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-medium text-blue-600">{completedCount}/{lessons.length} lessons</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Categories</h2>
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        activeCategory === category.id
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        <Icon className="h-5 w-5 mr-3" />
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedLesson ? (
              /* Lesson Detail View */
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="text-blue-600 hover:text-blue-800 mb-4"
                  >
                    ← Back to lessons
                  </button>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{selectedLesson.title}</h1>
                  <div className="flex items-center text-sm text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {selectedLesson.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="prose max-w-none">
                    {selectedLesson.content.split('\n').map((line, index) => {
                      if (line.startsWith('# ')) {
                        return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.slice(2)}</h1>;
                      } else if (line.startsWith('## ')) {
                        return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{line.slice(3)}</h2>;
                      } else if (line.startsWith('### ')) {
                        return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{line.slice(4)}</h3>;
                      } else if (line.startsWith('- ')) {
                        return <li key={index} className="ml-4 mb-1">{line.slice(2)}</li>;
                      } else if (line.trim() === '') {
                        return <br key={index} />;
                      } else {
                        return <p key={index} className="mb-3">{line}</p>;
                      }
                    })}
                  </div>
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    {!selectedLesson.completed && (
                      <button
                        onClick={() => markAsComplete(selectedLesson.id)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Mark as Complete
                      </button>
                    )}
                    {selectedLesson.completed && (
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              /* Lessons List View */
              <div className="space-y-4">
                {filteredLessons.map(lesson => {
                  const Icon = getCategoryIcon(lesson.category);
                  return (
                    <div
                      key={lesson.id}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => setSelectedLesson(lesson)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4">
                          <div className={`p-2 rounded-lg ${
                            lesson.completed ? 'bg-green-100' : 'bg-blue-100'
                          }`}>
                            {lesson.completed ? (
                              <CheckCircle className="h-6 w-6 text-green-600" />
                            ) : (
                              <Icon className="h-6 w-6 text-blue-600" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-1">
                              {lesson.title}
                            </h3>
                            <p className="text-gray-600 text-sm mb-2">
                              {lesson.content.split('\n').find(line => line.startsWith('## Introduction'))?.slice(15) || 
                               lesson.content.split('\n').slice(0, 3).join(' ').slice(0, 100) + '...'}
                            </p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span className="bg-gray-100 px-2 py-1 rounded-full">
                                {lesson.category}
                              </span>
                              {lesson.completed && (
                                <span className="text-green-600 font-medium">
                                  ✓ Completed
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Play className="h-5 w-5 text-gray-400" />
                      </div>
                    </div>
                  );
                })}
                {filteredLessons.length === 0 && (
                  <div className="text-center py-12">
                    <Book className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No lessons in this category yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnPage;
