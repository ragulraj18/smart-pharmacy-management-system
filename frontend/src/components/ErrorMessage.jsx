import { AlertTriangle } from 'lucide-react';
import './ErrorMessage.css';
 
function ErrorMessage({ message = 'Something went wrong. Please try again.', onRetry }) {
  return (
    <div className="error-box">
      <AlertTriangle size={28} />
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-outline" onClick={onRetry}>Try Again</button>
      )}
    </div>
  );
}
 
export default ErrorMessage;
