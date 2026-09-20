'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, formatRevenueInput, parseCurrencyInput, isValidRevenueInput } from '@/lib/formatting';
import { Save, Trash2 } from 'lucide-react';

interface RevenueInputProps {
  date: string;
  dayName: string;
  formattedDate: string;
  value: number;
  currency: string;
  onChange: (date: string, value: number) => void;
  onDelete: (date: string) => void;
  isToday?: boolean;
}

export function RevenueInput({ 
  date, 
  dayName, 
  formattedDate, 
  value, 
  currency, 
  onChange,
  onDelete,
  isToday = false 
}: RevenueInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  useEffect(() => {
    if (!isFocused && value > 0) {
      setInputValue(formatRevenueInput(value.toString()));
    } else if (!isFocused && value === 0) {
      setInputValue('');
    }
  }, [value, isFocused]);

  const handleFocus = () => {
    setIsFocused(true);
    if (value > 0) {
      setInputValue(value.toString());
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsedValue = parseCurrencyInput(inputValue);
    setInputValue(formatRevenueInput(parsedValue.toString()));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Allow any input while typing, only validate on blur
    setInputValue(newValue);
    
    // Parse and update value in real-time
    const parsedValue = parseCurrencyInput(newValue);
    onChange(date, parsedValue);
  };

  const handleSave = () => {
    const parsedValue = parseCurrencyInput(inputValue);
    onChange(date, parsedValue);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const handleDelete = () => {
    setInputValue('');
    onChange(date, 0);
    onDelete(date);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border ${
      isToday 
        ? 'border-emerald-500 dark:border-emerald-400 ring-2 ring-emerald-500/20' 
        : 'border-gray-100 dark:border-gray-700'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">
            {dayName}
            {isToday && (
              <span className="ml-2 text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full">
                TODAY
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formattedDate}
          </p>
        </div>
        {showSaved && (
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Saved!
          </span>
        )}
      </div>
      
      <div className="relative mb-3">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-medium">
          {currency}
        </span>
        <input
          type="text"
          inputMode="decimal"
          value={isFocused ? inputValue : (value > 0 ? formatRevenueInput(value.toString()) : '')}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="0.00"
          className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          aria-label={`Revenue for ${dayName} ${formattedDate}`}
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleSave}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Save revenue"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
        <button
          onClick={handleDelete}
          className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label="Delete revenue"
        >
          <Trash2 className="w-4 h-4" />
          Delete
        </button>
      </div>
    </div>
  );
}