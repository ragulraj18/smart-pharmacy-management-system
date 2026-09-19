import PharmacistMedicines from './PharmacistMedicines';
 
// Admin uses the same medicine management table as the pharmacist —
// route-level RoleRoute already restricts who can reach this page.
function AdminMedicines() {
  return <PharmacistMedicines />;
}
 
export default AdminMedicines;
 
