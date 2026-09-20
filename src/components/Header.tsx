'use client';

import { Calendar } from 'lucide-react';
import { formatFullDate } from '@/lib/formatting';

interface HeaderProps {
  currentDate?: Date;
}

export function Header({ currentDate }: HeaderProps) {
  const displayDate = currentDate || new Date();
  
  // Create a date string that's consistent between server and client
  const dateString = displayDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
        TEO
      </h1>
      <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
        Track. Calculate. Grow.
      </p>
      <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
        <Calendar className="w-4 h-4" />
        <time>{dateString}</time>
      </div>
    </header>
  );
}