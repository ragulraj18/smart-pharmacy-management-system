
import { useState, useEffect } from 'react';
import { ScanText, FileText } from 'lucide-react';
import prescriptionService from '../services/prescriptionService';
import LoadingSpinner from '../components/LoadingSpinner';
import './AdminTable.css';
import './PharmacistPrescriptions.css';

function PharmacistPrescriptions() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(null);
  const [results, setResults] = useState({});

  const fetchData = async () => {
    setLoading(true);
    const data = await prescriptionService.getPendingPrescriptions();
    setPrescriptions(data.prescriptions);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleReview = async (id, status) => {
    const notes = status === 'rejected' ? window.prompt('Reason for rejection (optional):') || '' : '';
    await prescriptionService.reviewPrescription(id, status, notes);
    fetchData();
  };

  const handleAnalyze = async (id) => {
    setAnalyzing(id);
    try {
      const data = await prescriptionService.analyzePrescription(id);
      setResults((prev) => ({ ...prev, [id]: data }));
    } catch (err) {
      setResults((prev) => ({
        ...prev,
        [id]: { error: err.response?.data?.message || 'Could not analyze this image.' },
      }));
    } finally {
      setAnalyzing(null);
    }
  };

  const openFile = (imagePath) => {
    window.open(`http://localhost:5000${imagePath}`, '_blank', 'noopener,noreferrer');
  };

  if (loading) return <LoadingSpinner message="Loading prescriptions..." />;

  return (
    <div className="container admin-table-page">
      <h1 className="section-title">Pending Prescriptions</h1>
      <p className="section-subtitle">
        Review and approve before orders can be processed. "Analyze Text" is a reading aid only —
        it never changes a prescription's status. You always make the final decision.
      </p>

      {prescriptions.length === 0 && <p className="dashboard-empty">No pending prescriptions.</p>}

      <div className="rx-review-list">
        {prescriptions.map((rx) => {
          const result = results[rx._id];
          return (
            <div className="rx-review-card card" key={rx._id}>
              <div className="rx-review-header">
                <div>
                  <strong>{rx.userId?.name}</strong>
                  <span className="rx-review-email">{rx.userId?.email}</span>
                </div>
                <span className="rx-review-date">
                  Uploaded {new Date(rx.uploadedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="rx-review-body">
                <button
                  type="button"
                  className="rx-review-filelink"
                  onClick={() => openFile(rx.image)}
                >
                  <FileText size={16} /> View Uploaded File
                </button>

                <button
                  className="btn btn-outline rx-analyze-btn"
                  onClick={() => handleAnalyze(rx._id)}
                  disabled={analyzing === rx._id}
                >
                  <ScanText size={15} />
                  {analyzing === rx._id ? 'Analyzing...' : 'Analyze Text (OCR)'}
                </button>

                {result?.error && <p className="rx-review-error">{result.error}</p>}

                {result && !result.error && (
                  <div className="rx-ocr-result">
                    {result.message ? (
                      <p className="rx-ocr-low-confidence">{result.message}</p>
                    ) : (
                      <>
                        <p className="rx-ocr-label">
                          Extracted text (confidence: {result.confidence}%):
                        </p>
                        <p className="rx-ocr-text">{result.ocrText || '(no text detected)'}</p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="rx-review-actions">
                <button className="btn btn-primary" onClick={() => handleReview(rx._id, 'approved')}>
                  Approve
                </button>
                <button className="btn btn-outline" onClick={() => handleReview(rx._id, 'rejected')}>
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default PharmacistPrescriptions;
