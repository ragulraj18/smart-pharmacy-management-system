import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, FileText, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './MedicineCard.css';

function MedicineCard({ medicine }) {
  const { addItem } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const {
    _id,
    name,
    genericName,
    strength,
    price,
    stock,
    image,
    prescriptionRequired,
  } = medicine;

  const inStock = stock > 0;

  const handleAdd = async (e) => {
    e.preventDefault(); // prevents the card from navigating if wrapped in a link
    setError('');
    setAdding(true);
    try {
      await addItem(_id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not add to cart');
      setTimeout(() => setError(''), 2500);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="medicine-card card">
      <div className="medicine-card-image">
        <img
          src={image || 'https://via.placeholder.com/300x220?text=Medicine'}
          alt={name}
        />
        {prescriptionRequired && (
          <span className="badge badge-accent medicine-rx-badge">
            <FileText size={12} /> Rx Required
          </span>
        )}
      </div>

      <div className="medicine-card-body">
        <h3 className="medicine-card-name">{name}</h3>
        <p className="medicine-card-generic">{genericName} {strength}</p>

        <div className="medicine-card-meta">
          <span className="medicine-card-price">₹{price}</span>
          <span className={`badge ${inStock ? 'badge-success' : 'badge-danger'}`}>
            {inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>

        {error && <p style={{ color: 'var(--danger)', fontSize: '0.78rem', marginBottom: 6 }}>{error}</p>}

        <div className="medicine-card-actions">
          <Link to={`/medicines/${_id}`} className="btn btn-outline medicine-card-btn">
            View Details
          </Link>
          <button
            className="btn btn-primary medicine-card-btn"
            disabled={!inStock || adding}
            onClick={handleAdd}
          >
            {added ? <Check size={16} /> : <ShoppingCart size={16} />}
            {adding ? 'Adding...' : added ? 'Added' : 'Add'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MedicineCard;