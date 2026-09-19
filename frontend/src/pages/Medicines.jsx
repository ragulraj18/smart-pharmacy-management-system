import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import MedicineCard from '../components/MedicineCard';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import medicineService from '../services/medicineService';
import './Medicines.css';
 
function Medicines() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sort, setSort] = useState('');
 
  const search = searchParams.get('search') || '';
 
  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (sort) params.sort = sort;
      const data = await medicineService.getMedicines(params);
      setMedicines(data.medicines);
    } catch (err) {
      setError('Could not load medicines. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, sort]);
 
  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);
 
  const handleSearch = (term) => {
    setSearchParams(term ? { search: term } : {});
  };
 
  return (
    <div className="container medicines-page">
      <h1 className="section-title">Medicines</h1>
      <p className="section-subtitle">Browse our full catalog of verified medicines.</p>
 
      <div className="medicines-toolbar">
        <SearchBar onSearch={handleSearch} />
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="name_asc">Name: A-Z</option>
        </select>
      </div>
 
      {loading && <LoadingSpinner message="Loading medicines..." />}
      {!loading && error && <ErrorMessage message={error} onRetry={fetchMedicines} />}
 
      {!loading && !error && medicines.length === 0 && (
        <div className="state-box">
          <h3>No medicines found</h3>
          <p>Try a different search term.</p>
        </div>
      )}
 
      {!loading && !error && medicines.length > 0 && (
        <div className="medicines-grid">
          {medicines.map((med) => <MedicineCard key={med._id} medicine={med} />)}
        </div>
      )}
    </div>
  );
}
 
export default Medicines;
 
