import { useState } from 'react';
import type { KeyboardEvent } from 'react';

export interface SearchFilters {
  type?: 'student' | 'teacher' | 'payment' | 'attendance' | string;
  dateFrom?: string;
  dateTo?: string;
  status?: 'paid' | 'unpaid' | 'all' | string;
}

export interface SearchFilterOption {
  value: string;
  label: string;
}

interface Props {
  onSearch: (query: string, filters: SearchFilters) => void;
  placeholder?: string;
  filters?: SearchFilterOption[];
}

export default function SearchBar({ onSearch, placeholder = 'بحث...', filters }: Props) {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<SearchFilters>({});

  const handleSearch = () => {
    onSearch(query.trim(), selectedFilters);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4" dir="rtl">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            className="w-full pr-10 pl-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-orange-500 outline-none transition-all text-sm text-slate-800"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </div>
        </div>
        <button
          type="button"
          onClick={handleSearch}
          className="px-5 py-2.5 bg-orange-600 text-white text-sm rounded-xl font-bold hover:bg-orange-700 transition-colors cursor-pointer shadow-2xs"
        >
          بحث
        </button>
        {filters && filters.length > 0 && (
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-2.5 rounded-xl font-bold text-sm transition-colors cursor-pointer ${
              showFilters
                ? 'bg-orange-100 text-orange-700 border border-orange-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            فلاتر
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && filters && filters.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-2.5">
          {filters.map((filter) => (
            <select
              key={filter.value}
              value={selectedFilters[filter.value as keyof SearchFilters] || ''}
              onChange={(e) =>
                setSelectedFilters({
                  ...selectedFilters,
                  [filter.value]: e.target.value,
                })
              }
              className="px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 outline-none text-xs text-slate-700 bg-white"
            >
              <option value="">{filter.label} (الكل)</option>
              <option value="paid">مدفوع</option>
              <option value="unpaid">غير مدفوع</option>
            </select>
          ))}
        </div>
      )}
    </div>
  );
}
