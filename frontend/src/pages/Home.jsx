import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, ShieldCheck, Truck, Lock, Stethoscope, Sparkles,
  Pill, Thermometer, Activity, Droplet, Baby, MessageCircle,
  UploadCloud, Heart,
} from 'lucide-react';
import MedicineCard from '../components/MedicineCard';
import medicineService from '../services/medicineService';
import './Home.css';
 
// Each category gets its own color so the section doesn't read as flat teal.
const categories = [
  { name: 'Pain Relief', icon: <Pill size={22} />, color: 'pop-1' },
  { name: 'Cold & Allergy', icon: <Thermometer size={22} />, color: 'pop-2' },
  { name: 'Vitamins', icon: <Sparkles size={22} />, color: 'pop-3' },
  { name: 'Diabetes Care', icon: <Activity size={22} />, color: 'pop-4' },
  { name: 'Digestive Health', icon: <Droplet size={22} />, color: 'pop-5' },
  { name: 'Personal Care', icon: <Baby size={22} />, color: 'pop-6' },
];
 
const whyChooseUs = [
  { icon: <ShieldCheck size={24} />, title: 'Verified Medicines', text: 'Every product is sourced and verified for authenticity.', color: 'pop-1' },
  { icon: <Truck size={24} />, title: 'Fast Delivery', text: 'Reliable delivery tracking from order to doorstep.', color: 'pop-2' },
  { icon: <Lock size={24} />, title: 'Secure Orders', text: 'Your data and payments are protected end-to-end.', color: 'pop-3' },
  { icon: <Stethoscope size={24} />, title: 'Pharmacist Verification', text: 'Licensed pharmacists review every prescription.', color: 'pop-4' },
  { icon: <Activity size={24} />, title: 'Smart Inventory', text: 'Real-time stock so you always know what is available.', color: 'pop-5' },
  { icon: <Sparkles size={24} />, title: 'AI Assistance', text: 'Ask our AI assistant about medicines and availability.', color: 'pop-6' },
];
 
function Home() {
  const [popularMedicines, setPopularMedicines] = useState([]);
 
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await medicineService.getMedicines({ limit: 4 });
        setPopularMedicines(data.medicines);
      } catch (err) {
        setPopularMedicines([]);
      }
    };
    fetchPopular();
  }, []);
 
  return (
    <div className="home">
      {/* HERO */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content">
            <span className="badge badge-secondary hero-tag">Smart Pharmacy Platform</span>
            <h1 className="hero-title">
              Your Smart Pharmacy, <span>Powered by Technology</span>
            </h1>
            <p className="hero-subtitle">
              Discover medicines, manage prescriptions, track your orders and
              get intelligent pharmacy assistance — all in one place.
            </p>
            <div className="hero-actions">
              <Link to="/medicines" className="btn btn-primary">
                Explore Medicines
              </Link>
              <Link to="/ai-assistant" className="btn btn-secondary-outline">
                <MessageCircle size={18} /> Ask AI Assistant
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-image-circle">
              <Heart size={64} />
            </div>
          </div>
        </div>
      </section>
 
      {/* SEARCH */}
      <section className="search-section">
        <div className="container">
          <div className="search-box">
            <Search size={20} className="search-icon" />
            <input type="text" placeholder="Search medicines, brands or categories..." />
            <button className="btn btn-primary search-btn">Search</button>
          </div>
        </div>
      </section>
 
      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Browse medicines organized by health need.</p>
          <div className="categories-grid">
            {categories.map((cat) => (
              <Link
                to={`/medicines?category=${cat.name.toLowerCase().replace(/ & | /g, '-')}`}
                key={cat.name}
                className="category-card card"
              >
                <div className={`category-icon icon-${cat.color}`}>{cat.icon}</div>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
 
      {/* POPULAR MEDICINES */}
      <section className="section popular-section">
        <div className="container">
          <div className="section-header-row">
            <div>
              <h2 className="section-title">Popular Medicines</h2>
              <p className="section-subtitle">Frequently ordered by our customers.</p>
            </div>
            <Link to="/medicines" className="btn btn-outline">View All</Link>
          </div>
          <div className="medicines-grid">
            {popularMedicines.map((med) => (
              <MedicineCard key={med._id} medicine={med} />
            ))}
          </div>
        </div>
      </section>
 
      {/* AI ASSISTANT PREVIEW */}
      <section className="section ai-section">
        <div className="container ai-inner">
          <div className="ai-content">
            <span className="badge badge-secondary">AI Powered</span>
            <h2 className="section-title">Meet Your Pharma AI Assistant</h2>
            <p className="section-subtitle">
              Ask about medicine availability, uses and general information.
              Backed by real-time inventory — never guessed, always verified.
            </p>
            <Link to="/ai-assistant" className="btn btn-primary">
              <MessageCircle size={18} /> Start Chatting
            </Link>
          </div>
          <div className="ai-preview card">
            <div className="ai-preview-header">
              <MessageCircle size={18} /> Pharma AI Assistant
              <span className="ai-online">● Online</span>
            </div>
            <div className="ai-preview-body">
              <div className="chat-bubble user">Is Paracetamol 500mg available?</div>
              <div className="chat-bubble bot">
                Yes, Paracetamol 500mg is currently available.<br />
                Stock: 125 &middot; Price: ₹25
              </div>
            </div>
          </div>
        </div>
      </section>
 
      {/* PRESCRIPTION UPLOAD PREVIEW */}
      <section className="section rx-section">
        <div className="container rx-inner card">
          <div className="rx-icon">
            <UploadCloud size={32} />
          </div>
          <div className="rx-text">
            <h3>Upload Your Prescription</h3>
            <p>Our pharmacists verify every prescription before your order is processed.</p>
          </div>
          <Link to="/prescriptions/upload" className="btn btn-primary">
            Upload Prescription
          </Link>
        </div>
      </section>
 
      {/* WHY CHOOSE US */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Why Choose PharmaCare</h2>
          <p className="section-subtitle">Built for trust, speed and accuracy.</p>
          <div className="why-grid">
            {whyChooseUs.map((item) => (
              <div className="why-card card" key={item.title}>
                <div className={`why-icon icon-${item.color}`}>{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
 
export default Home;
 
