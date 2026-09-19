import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Camera, UploadCloud, X, CheckCircle } from 'lucide-react';
import api from '../services/api';
import './MedicineIdentification.css';
 
function MedicineIdentification() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const inputRef = useRef(null);
 
  const handleFile = (selected) => {
    if (!selected) return;
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setResult(null);
    setError('');
  };
 
  const handleAnalyze = async () => {
    setAnalyzing(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { data } = await api.post('/ai/identify-medicine', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong analyzing this image.');
    } finally {
      setAnalyzing(false);
    }
  };
 
  const clear = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };
 
  return (
    <div className="container medid-page">
      <h1 className="section-title">Medicine Identification</h1>
      <p className="section-subtitle">
        Upload a photo of a medicine strip or package for an AI-assisted possible match against our catalog.
      </p>
 
      <div className="medid-upload card" onClick={() => !file && inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files[0])} />
        {!preview && (
          <>
            <UploadCloud size={36} />
            <p>Click to upload a medicine strip or package photo</p>
            <span className="medid-hint"><Camera size={14} /> Camera capture supported on mobile</span>
          </>
        )}
        {preview && (
          <div className="medid-preview" onClick={(e) => e.stopPropagation()}>
            <img src={preview} alt="Uploaded medicine" />
            <button className="medid-remove" onClick={clear}><X size={16} /></button>
          </div>
        )}
      </div>
 
      {file && !result && (
        <button className="btn btn-primary medid-analyze" disabled={analyzing} onClick={handleAnalyze}>
          {analyzing ? 'Analyzing image...' : 'Analyze Image'}
        </button>
      )}
 
      {error && <div className="auth-error">{error}</div>}
 
      {result && result.match && (
        <div className="medid-result card">
          <h3>Possible Match</h3>
          <p className="medid-result-name">{result.match.name}</p>
          <p>Generic: {result.match.genericName}</p>
          <p>Strength: {result.match.strength}</p>
          <p>Confidence: {result.confidence}%</p>
          <span className={`badge ${result.match.available ? 'badge-success' : 'badge-danger'}`}>
            {result.match.available ? `Available (Stock: ${result.match.stock})` : 'Not Available'}
          </span>
 
          <div className="medid-actions">
            <Link to={`/medicines/${result.match._id}`} className="btn btn-outline">
              View Full Details
            </Link>
          </div>
 
          <p className="medid-disclaimer">
            This is an AI-assisted possible match, not a certain identification.
            Please verify the packaging or consult a pharmacist before use.
          </p>
        </div>
      )}
 
      {result && !result.match && (
        <div className="medid-result card medid-no-match">
          <h3>{result.confidence < 40 ? 'Unable to Identify' : 'No Match Found'}</h3>
          <p>{result.message}</p>
          {result.extractedText && (
            <p className="medid-raw-text">Detected text: "{result.extractedText}"</p>
          )}
        </div>
      )}
    </div>
  );
}
 
export default MedicineIdentification;
 
