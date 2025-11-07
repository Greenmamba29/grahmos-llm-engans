'use client';

import { useState } from 'react';
import { ArrowRight, MagnifyingGlass, Sparkle, Lightning, Globe } from '@phosphor-icons/react';

interface HeroProps {
  onSearch?: (query: string) => void;
}

export default function Hero({ onSearch }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearch) {
      onSearch(searchQuery.trim());
    }
  };

  const quickSearches = [
    'Find restaurants near me',
    'Latest tech news',
    'Best coding practices 2024',
    'Weather forecast this week'
  ];

  const features = [
    {
      icon: <Sparkle size={24} weight="duotone" />,
      title: 'AI-Powered Answers',
      description: 'Get intelligent responses powered by advanced AI'
    },
    {
      icon: <Lightning size={24} weight="duotone" />,
      title: 'Lightning Fast',
      description: 'Instant results from multiple sources'
    },
    {
      icon: <Globe size={24} weight="duotone" />,
      title: 'Global Search',
      description: 'Search across the entire web in real-time'
    }
  ];

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-800/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="w-full max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
        {/* Logo/Brand */}
        <div className="space-y-3">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-400 dark:to-blue-600 bg-clip-text text-transparent animate-slide-up">
            GrahmOS Directory
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 animate-slide-up animation-delay-200">
            Search smarter, discover faster
          </p>
        </div>

        {/* Search bar - Perplexity/Google style */}
        <form onSubmit={handleSearch} className="w-full max-w-2xl mx-auto animate-slide-up animation-delay-400">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-200"></div>
            <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-blue-500/10">
              <div className="pl-6 pr-3">
                <MagnifyingGlass size={24} className="text-gray-400" weight="bold" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ask me anything..."
                className="flex-1 py-5 pr-4 bg-transparent text-lg outline-none text-gray-900 dark:text-white placeholder-gray-400"
                autoFocus
              />
              <button
                type="submit"
                disabled={!searchQuery.trim()}
                className="m-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Search
                <ArrowRight size={20} weight="bold" />
              </button>
            </div>
          </div>
        </form>

        {/* Quick search suggestions */}
        <div className="flex flex-wrap justify-center gap-2 animate-slide-up animation-delay-600">
          {quickSearches.map((query, index) => (
            <button
              key={index}
              onClick={() => {
                setSearchQuery(query);
                if (onSearch) onSearch(query);
              }}
              className="px-4 py-2 text-sm bg-white/50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full transition-all duration-200 hover:shadow-md hover:scale-105 text-gray-700 dark:text-gray-300"
            >
              {query}
            </button>
          ))}
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 pt-12 animate-slide-up animation-delay-800">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full p-1">
          <div className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
