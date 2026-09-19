import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBox from './components/ChatBox';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Medicines from './pages/Medicines';
import MedicineDetails from './pages/MedicineDetails';
import MedicineIdentification from './pages/MedicineIdentification';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import OrderDetails from './pages/OrderDetails';
import PrescriptionUpload from './pages/PrescriptionUpload';
import MyPrescriptions from './pages/MyPrescriptions';
import PharmacistDashboard from './pages/PharmacistDashboard';
import PharmacistPrescriptions from './pages/PharmacistPrescriptions';
import Inventory from './pages/Inventory';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import AdminMedicines from './pages/AdminMedicines';
import AdminOrders from './pages/AdminOrders';
import AdminPrescriptions from './pages/AdminPrescriptions';
import Analytics from './pages/Analytics';
import DeliveryDashboard from './pages/DeliveryDashboard';
import DeliveryDetails from './pages/DeliveryDetails';
import './styles/global.css';
 
function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/medicines" element={<Medicines />} />
          <Route path="/medicines/:id" element={<MedicineDetails />} />
          <Route path="/medicine-identification" element={<ProtectedRoute><MedicineIdentification /></ProtectedRoute>} />
          <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/orders/:id" element={<ProtectedRoute><OrderDetails /></ProtectedRoute>} />
          <Route path="/prescriptions/upload" element={<ProtectedRoute><PrescriptionUpload /></ProtectedRoute>} />
          <Route path="/prescriptions" element={<ProtectedRoute><MyPrescriptions /></ProtectedRoute>} />
 
          {/* Pharmacist */}
          <Route path="/pharmacist/dashboard" element={<RoleRoute roles={['pharmacist', 'admin']}><PharmacistDashboard /></RoleRoute>} />
          <Route path="/pharmacist/prescriptions" element={<RoleRoute roles={['pharmacist', 'admin']}><PharmacistPrescriptions /></RoleRoute>} />
          <Route path="/pharmacist/inventory" element={<RoleRoute roles={['pharmacist', 'admin']}><Inventory /></RoleRoute>} />
 
          {/* Admin */}
          <Route path="/admin/dashboard" element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
          <Route path="/admin/users" element={<RoleRoute roles={['admin']}><UserManagement /></RoleRoute>} />
          <Route path="/admin/medicines" element={<RoleRoute roles={['admin']}><AdminMedicines /></RoleRoute>} />
          <Route path="/admin/orders" element={<RoleRoute roles={['admin']}><AdminOrders /></RoleRoute>} />
          <Route path="/admin/prescriptions" element={<RoleRoute roles={['admin']}><AdminPrescriptions /></RoleRoute>} />
          <Route path="/admin/analytics" element={<RoleRoute roles={['admin']}><Analytics /></RoleRoute>} />
 
          {/* Delivery */}
          <Route path="/delivery/dashboard" element={<RoleRoute roles={['delivery', 'admin']}><DeliveryDashboard /></RoleRoute>} />
          <Route path="/delivery/orders/:id" element={<RoleRoute roles={['delivery', 'admin']}><DeliveryDetails /></RoleRoute>} />
 
          {/* More routes (Demand Forecasting, Socket.IO real-time) are added in later phases */}
        </Routes>
      </main>
      <Footer />
      <ChatBox />
    </>
  );
}
 
export default App;
 
