import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingCart, Stethoscope, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';
 
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
 
  const isAdmin = isLoggedIn && user.role === 'admin';
  const isPharmacist = isLoggedIn && user.role === 'pharmacist';
  const isDelivery = isLoggedIn && user.role === 'delivery';
  const isStaff = isAdmin || isPharmacist || isDelivery;
 
  const closeMenu = () => setMenuOpen(false);
 
  const handleLogout = () => {
    logout();
    closeMenu();
    navigate('/');
  };
 
  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <span className="navbar-logo-icon">
            <Stethoscope size={22} />
          </span>
          PharmaCare
        </Link>
 
        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" onClick={closeMenu} end>Home</NavLink>
          {!isStaff && <NavLink to="/medicines" onClick={closeMenu}>Medicines</NavLink>}
          {isLoggedIn && !isStaff && <NavLink to="/medicine-identification" onClick={closeMenu}>Identify Medicine</NavLink>}
          {isLoggedIn && !isStaff && <NavLink to="/prescriptions" onClick={closeMenu}>Prescriptions</NavLink>}
          {isLoggedIn && !isStaff && <NavLink to="/orders" onClick={closeMenu}>Orders</NavLink>}
          {isPharmacist && <NavLink to="/pharmacist/dashboard" onClick={closeMenu}>Pharmacist Dashboard</NavLink>}
          {isAdmin && <NavLink to="/admin/dashboard" onClick={closeMenu}>Admin Dashboard</NavLink>}
          {isDelivery && <NavLink to="/delivery/dashboard" onClick={closeMenu}>Delivery Dashboard</NavLink>}
 
          <div className="navbar-mobile-actions">
            {isLoggedIn ? (
              <>
                <span style={{ fontWeight: 600, color: 'var(--text)' }}>Hi, {user?.name}</span>
                <button className="btn btn-outline" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <NavLink to="/login" onClick={closeMenu} className="btn btn-primary">
                Login / Register
              </NavLink>
            )}
          </div>
        </nav>
 
        <div className="navbar-actions">
          {!isStaff && (
            <Link to="/cart" className="navbar-icon-btn" aria-label="Cart" onClick={closeMenu}>
              <ShoppingCart size={20} />
              {itemCount > 0 && <span className="navbar-badge">{itemCount}</span>}
            </Link>
          )}
 
          {isLoggedIn ? (
            <>
              <span className="navbar-desktop-only" style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                Hi, {user?.name}
              </span>
              <button className="btn btn-outline navbar-desktop-only" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary navbar-desktop-only">
              Login / Register
            </Link>
          )}
 
          <button
            className="navbar-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
 
export default Navbar;
