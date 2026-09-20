'use client';

import { TrendingUp, Plus } from 'lucide-react';

interface EmptyStateProps {
  onAddRevenue: () => void;
}

export function EmptyState({ onAddRevenue }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
        <TrendingUp className="w-8 h-8 text-gray-400 dark:text-gray-500" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
        Start tracking your revenue
      </h2>
      
      <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
        Enter your daily revenue to see your weekly and monthly performance.
      </p>
      
      <button
        onClick={onAddRevenue}
        className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      >
        <Plus className="w-5 h-5" />
        Add Today's Revenue
      </button>
    </div>
  );
}