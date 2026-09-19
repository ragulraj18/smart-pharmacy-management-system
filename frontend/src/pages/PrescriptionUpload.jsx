import { useState, useRef } from 'react';
import { UploadCloud, FileText, X, CheckCircle } from 'lucide-react';
import prescriptionService from '../services/prescriptionService';
import './PrescriptionUpload.css';

function PrescriptionUpload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

  const handleFile = (selected) => {
    if (!selected) return;
    if (!allowedTypes.includes(selected.type)) {
      setError('Only JPG, JPEG, PNG and PDF files are allowed.');
      return;
    }
    setError('');
    setFile(selected);
    if (selected.type.startsWith('image/')) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      await prescriptionService.uploadPrescription(file);
      setSuccess(true);
      setFile(null);
      setPreview(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
  };

  if (success) {
    return (
      <div className="container rx-upload-page">
        <div className="rx-success card">
          <CheckCircle size={48} className="rx-success-icon" />
          <h2>Prescription Uploaded</h2>
          <p>Our pharmacist will review it shortly. You can check the status under My Prescriptions.</p>
          <button className="btn btn-primary" onClick={() => setSuccess(false)}>Upload Another</button>
        </div>
      </div>
    );
  }

  return (
    <div className="container rx-upload-page">
      <h1 className="section-title">Upload Prescription</h1>
      <p className="section-subtitle">
        A licensed pharmacist reviews every prescription before your order is processed.
      </p>

      <div
        className={`rx-dropzone card ${dragActive ? 'active' : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.pdf"
          hidden
          onChange={(e) => handleFile(e.target.files[0])}
        />

        {!file && (
          <>
            <UploadCloud size={36} />
            <p>Drag &amp; drop your prescription here, or click to browse</p>
            <span className="rx-dropzone-hint">Supports JPG, JPEG, PNG, PDF (max 5MB)</span>
          </>
        )}

        {file && (
          <div className="rx-file-preview" onClick={(e) => e.stopPropagation()}>
            {preview ? (
              <img src={preview} alt="Prescription preview" />
            ) : (
              <FileText size={40} />
            )}
            <div>
              <p className="rx-filename">{file.name}</p>
              <button className="rx-remove" onClick={removeFile}><X size={14} /> Remove</button>
            </div>
          </div>
        )}
      </div>

      {error && <div className="auth-error">{error}</div>}

      <button className="btn btn-primary rx-analyze-btn" disabled={!file || uploading} onClick={handleUpload}>
        {uploading ? 'Uploading...' : 'Submit Prescription'}
      </button>
    </div>
  );
}

export default PrescriptionUpload;