import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange }) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    const debounceTimer = window.setTimeout(() => {
      onChange(inputValue);
    }, 300);

    return () => window.clearTimeout(debounceTimer);
  }, [inputValue, onChange]);

  const handleClear = () => {
    setInputValue('');
    onChange('');
  };

  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
        placeholder="Search by name, company, or email..."
        aria-label="Search leads by name, company, or email"
        className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-10 text-sm text-gray-900 transition-all duration-200 placeholder:text-gray-400 focus:border-primary focus:outline-hidden focus:ring-2 focus:ring-primary/20"
      />
      {inputValue && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 transition-all duration-200 hover:bg-gray-100 hover:text-gray-700 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
