import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, FileText, MessageCircle } from 'lucide-react';
import medicineService from '../services/medicineService';
import { useCart } from '../context/CartContext';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import './MedicineDetails.css';
 
function MedicineDetails() {
  const { id } = useParams();
  const { addItem } = useCart();
  const [medicine, setMedicine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
 
  useEffect(() => {
    const fetchMedicine = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await medicineService.getMedicineById(id);
        setMedicine(data.medicine);
      } catch (err) {
        setError('Medicine not found.');
      } finally {
        setLoading(false);
      }
    };
    fetchMedicine();
  }, [id]);
 
  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addItem(medicine._id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } finally {
      setAdding(false);
    }
  };
 
  if (loading) return <LoadingSpinner message="Loading medicine details..." />;
  if (error) return <ErrorMessage message={error} />;
  if (!medicine) return null;
 
  const inStock = medicine.stock > 0;
 
  return (
    <div className="container details-page">
      <div className="details-grid">
        <div className="details-image card">
          <img src={medicine.image || 'https://via.placeholder.com/400x320?text=Medicine'} alt={medicine.name} />
        </div>
 
        <div className="details-info">
          {medicine.prescriptionRequired && (
            <span className="badge badge-accent"><FileText size={12} /> Prescription Required</span>
          )}
          <h1>{medicine.name}</h1>
          <p className="details-generic">{medicine.genericName} &middot; {medicine.strength} &middot; {medicine.dosageForm}</p>
          <p className="details-brand">Brand: {medicine.brandName || '—'} &middot; Manufacturer: {medicine.manufacturer || '—'}</p>
 
          <div className="details-price-row">
            <span className="details-price">₹{medicine.price}</span>
            <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'}`}>
              {inStock ? `In Stock (${medicine.stock})` : 'Out of Stock'}
            </span>
          </div>
 
          <div className="details-actions">
            <button className="btn btn-primary" disabled={!inStock || adding} onClick={handleAddToCart}>
              <ShoppingCart size={16} /> {adding ? 'Adding...' : added ? 'Added!' : 'Add to Cart'}
            </button>
            {medicine.prescriptionRequired && (
              <Link to="/prescriptions/upload" className="btn btn-outline">
                <FileText size={16} /> Upload Prescription
              </Link>
            )}
            <Link to="/ai-assistant" className="btn btn-outline">
              <MessageCircle size={16} /> Ask AI
            </Link>
          </div>
 
          <div className="details-section">
            <h3>Uses</h3>
            <p>{medicine.uses || 'No information available.'}</p>
          </div>
 
          {medicine.generalAdministrationInformation && (
            <div className="details-section">
              <h3>General Information</h3>
              <p>{medicine.generalAdministrationInformation}</p>
            </div>
          )}
 
          {medicine.warnings && (
            <div className="details-section">
              <h3>Warnings</h3>
              <p>{medicine.warnings}</p>
            </div>
          )}
 
          {medicine.storageInformation && (
            <div className="details-section">
              <h3>Storage</h3>
              <p>{medicine.storageInformation}</p>
            </div>
          )}
 
          <p className="details-disclaimer">
            This information is for general reference only and is not a substitute
            for professional medical advice, diagnosis or treatment.
          </p>
        </div>
      </div>
    </div>
  );
}
 
export default MedicineDetails;
 
