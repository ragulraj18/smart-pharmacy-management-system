import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import medicineService from '../services/medicineService';
import './MedicineFormModal.css';

const EMPTY_FORM = {
  name: '', genericName: '', brandName: '', strength: '', dosageForm: '',
  price: '', stock: '', minimumStock: '10', manufacturer: '', uses: '',
  prescriptionRequired: false, category: '',
};

// Pass `medicine` for edit mode, or null for create mode.
// Pass `categories` (array of {_id, name}) so the dropdown has real options.
function MedicineFormModal({ medicine, categories, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!medicine;

  useEffect(() => {
    if (medicine) {
      setForm({
        name: medicine.name || '',
        genericName: medicine.genericName || '',
        brandName: medicine.brandName || '',
        strength: medicine.strength || '',
        dosageForm: medicine.dosageForm || '',
        price: medicine.price ?? '',
        stock: medicine.stock ?? '',
        minimumStock: medicine.minimumStock ?? '10',
        manufacturer: medicine.manufacturer || '',
        uses: medicine.uses || '',
        prescriptionRequired: !!medicine.prescriptionRequired,
        category: medicine.category?._id || medicine.category || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
  }, [medicine]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.genericName || !form.price || form.stock === '' || !form.category) {
      setError('Name, generic name, price, stock and category are required.');
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      minimumStock: Number(form.minimumStock) || 10,
    };

    setSaving(true);
    try {
      if (isEdit) {
        await medicineService.updateMedicine(medicine._id, payload);
      } else {
        await medicineService.createMedicine(payload);
      }
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save medicine.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Medicine' : 'Add Medicine'}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-form-grid">
            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
            <label>
              Generic Name
              <input name="genericName" value={form.genericName} onChange={handleChange} required />
            </label>
            <label>
              Brand Name
              <input name="brandName" value={form.brandName} onChange={handleChange} />
            </label>
            <label>
              Strength
              <input name="strength" value={form.strength} onChange={handleChange} placeholder="e.g. 500mg" />
            </label>
            <label>
              Dosage Form
              <input name="dosageForm" value={form.dosageForm} onChange={handleChange} placeholder="Tablet, Syrup..." />
            </label>
            <label>
              Category
              <select name="category" value={form.category} onChange={handleChange} required>
                <option value="">-- Select --</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </label>
            <label>
              Price (₹)
              <input name="price" type="number" min="0" value={form.price} onChange={handleChange} required />
            </label>
            <label>
              Stock
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} required />
            </label>
            <label>
              Minimum Stock
              <input name="minimumStock" type="number" min="0" value={form.minimumStock} onChange={handleChange} />
            </label>
            <label>
              Manufacturer
              <input name="manufacturer" value={form.manufacturer} onChange={handleChange} />
            </label>
          </div>

          <label className="modal-checkbox-row">
            <input
              type="checkbox"
              name="prescriptionRequired"
              checked={form.prescriptionRequired}
              onChange={handleChange}
            />
            Prescription Required
          </label>

          <label>
            Uses
            <textarea name="uses" rows={3} value={form.uses} onChange={handleChange} />
          </label>

          <div className="modal-actions">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Medicine'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MedicineFormModal;