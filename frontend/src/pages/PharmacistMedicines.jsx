import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus } from 'lucide-react';
import medicineService from '../services/medicineService';
import LoadingSpinner from '../components/LoadingSpinner';
import MedicineFormModal from '../components/MedicineFormModal';
import './AdminTable.css';

function PharmacistMedicines() {
  const [medicines, setMedicines] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const [medsData, catsData] = await Promise.all([
      medicineService.getMedicines({ limit: 100 }),
      medicineService.getCategories(),
    ]);
    setMedicines(medsData.medicines);
    setCategories(catsData.categories);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this medicine?')) return;
    await medicineService.deleteMedicine(id);
    fetchData();
  };

  const openAddModal = () => {
    setEditingMedicine(null);
    setModalOpen(true);
  };

  const openEditModal = (medicine) => {
    setEditingMedicine(medicine);
    setModalOpen(true);
  };

  const handleSaved = () => {
    setModalOpen(false);
    setEditingMedicine(null);
    fetchData();
  };

  if (loading) return <LoadingSpinner message="Loading medicines..." />;

  return (
    <div className="container admin-table-page">
      <div className="admin-table-header">
        <h1 className="section-title">Manage Medicines</h1>
        <button className="btn btn-primary" onClick={openAddModal}>
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      <div className="admin-table-wrap card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th><th>Generic</th><th>Price</th><th>Stock</th><th>Rx Required</th><th></th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m._id}>
                <td>{m.name}</td>
                <td>{m.genericName}</td>
                <td>₹{m.price}</td>
                <td className={m.stock <= m.minimumStock ? 'low-stock-cell' : ''}>{m.stock}</td>
                <td>{m.prescriptionRequired ? 'Yes' : 'No'}</td>
                <td className="admin-table-actions">
                  <button aria-label="Edit" onClick={() => openEditModal(m)}><Edit size={15} /></button>
                  <button aria-label="Delete" onClick={() => handleDelete(m._id)}><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <MedicineFormModal
          medicine={editingMedicine}
          categories={categories}
          onClose={() => setModalOpen(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}

export default PharmacistMedicines;