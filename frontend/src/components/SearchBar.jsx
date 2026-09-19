import { useState } from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';
 
function SearchBar({ onSearch, placeholder = 'Search medicines, brands or categories...' }) {
  const [value, setValue] = useState('');
 
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };
 
  return (
    <form className="search-box" onSubmit={handleSubmit}>
      <Search size={20} className="search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="btn btn-primary search-btn">Search</button>
    </form>
  );
}
 
export default SearchBar;
