import { Check } from 'lucide-react';
import './OrderStatus.css';
 
const STEPS = ['placed', 'confirmed', 'processing', 'ready', 'out_for_delivery', 'delivered'];
 
const LABELS = {
  placed: 'Order Placed',
  confirmed: 'Confirmed',
  processing: 'Processing',
  ready: 'Ready',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
};
 
function OrderStatus({ status }) {
  if (status === 'cancelled') {
    return <div className="order-status-cancelled">This order was cancelled.</div>;
  }
 
  const currentIndex = STEPS.indexOf(status);
 
  return (
    <div className="order-timeline">
      {STEPS.map((step, index) => {
        const done = index <= currentIndex;
        return (
          <div className={`timeline-step ${done ? 'done' : ''}`} key={step}>
            <div className="timeline-dot">{done && <Check size={14} />}</div>
            <span>{LABELS[step]}</span>
          </div>
        );
      })}
    </div>
  );
}
 
export default OrderStatus;
