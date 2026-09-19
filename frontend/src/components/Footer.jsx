import { Link } from 'react-router-dom';
import { Stethoscope, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';
 
function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">
            <Stethoscope size={22} />
            PharmaCare
          </div>
          <p className="footer-text">
            Your trusted smart pharmacy platform for medicines, prescriptions
            and AI-assisted pharmacy support.
          </p>
        </div>
 
        <div>
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/medicines">Medicines</Link></li>
            <li><Link to="/prescriptions">Prescriptions</Link></li>
            <li><Link to="/orders">Orders</Link></li>
            <li><Link to="/ai-assistant">AI Assistant</Link></li>
          </ul>
        </div>
 
        <div>
          <h4 className="footer-heading">Categories</h4>
          <ul className="footer-links">
            <li><Link to="/medicines?category=pain-relief">Pain Relief</Link></li>
            <li><Link to="/medicines?category=cold-allergy">Cold &amp; Allergy</Link></li>
            <li><Link to="/medicines?category=vitamins">Vitamins</Link></li>
            <li><Link to="/medicines?category=diabetes-care">Diabetes Care</Link></li>
          </ul>
        </div>
 
        <div>
          <h4 className="footer-heading">Contact</h4>
          <ul className="footer-contact">
            <li><Phone size={16} /> +91 90000 00000</li>
            <li><Mail size={16} /> support@pharmacare.com</li>
            <li><MapPin size={16} /> Tamil Nadu, India</li>
          </ul>
        </div>
      </div>
 
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PharmaCare. All rights reserved.</p>
        <p className="footer-disclaimer">
          Medicine information shown is for reference only and is not a
          substitute for professional medical advice.
        </p>
      </div>
    </footer>
  );
}
 
export default Footer;
 
