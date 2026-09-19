// Demo/test data seed script — NOT real pharmacy data.
// Run: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');
const Medicine = require('./models/Medicine');
const User = require('./models/User');

const categories = [
  { name: 'Pain Relief', slug: 'pain-relief' },
  { name: 'Cold & Allergy', slug: 'cold-allergy' },
  { name: 'Vitamins', slug: 'vitamins' },
  { name: 'Diabetes Care', slug: 'diabetes-care' },
  { name: 'Digestive Health', slug: 'digestive-health' },
  { name: 'Personal Care', slug: 'personal-care' },
];

const medicinesData = (catMap) => [
  {
    name: 'Paracetamol 500mg', genericName: 'Paracetamol', brandName: 'Crocin',
    category: catMap['pain-relief'], strength: '500mg', dosageForm: 'Tablet',
    price: 25, stock: 125, minimumStock: 20, prescriptionRequired: false,
    manufacturer: 'GSK', uses: 'Fever and mild to moderate pain relief.',
  },
  {
    name: 'Dolo 650', genericName: 'Paracetamol', brandName: 'Dolo',
    category: catMap['pain-relief'], strength: '650mg', dosageForm: 'Tablet',
    price: 30, stock: 200, minimumStock: 30, prescriptionRequired: false,
    manufacturer: 'Micro Labs', uses: 'Fever and pain relief.',
  },
  {
    name: 'Cetirizine 10mg', genericName: 'Cetirizine HCl', brandName: 'Cetrizine',
    category: catMap['cold-allergy'], strength: '10mg', dosageForm: 'Tablet',
    price: 25, stock: 80, minimumStock: 15, prescriptionRequired: false,
    manufacturer: 'Cipla', uses: 'Allergy relief — sneezing, runny nose, itching.',
  },
  {
    name: 'Azithromycin 500mg', genericName: 'Azithromycin', brandName: 'Azithral',
    category: catMap['cold-allergy'], strength: '500mg', dosageForm: 'Tablet',
    price: 95, stock: 0, minimumStock: 10, prescriptionRequired: true,
    manufacturer: 'Alembic', uses: 'Bacterial infections (antibiotic).',
  },
  {
    name: 'Omeprazole 20mg', genericName: 'Omeprazole', brandName: 'Omez',
    category: catMap['digestive-health'], strength: '20mg', dosageForm: 'Capsule',
    price: 60, stock: 45, minimumStock: 10, prescriptionRequired: false,
    manufacturer: "Dr Reddy's", uses: 'Acidity and acid reflux.',
  },
  {
    name: 'Vitamin C 500mg', genericName: 'Ascorbic Acid', brandName: 'Limcee',
    category: catMap['vitamins'], strength: '500mg', dosageForm: 'Tablet',
    price: 40, stock: 150, minimumStock: 20, prescriptionRequired: false,
    manufacturer: 'Abbott', uses: 'Immunity support.',
  },
  {
    name: 'ORS Powder', genericName: 'Oral Rehydration Salts', brandName: 'Electral',
    category: catMap['digestive-health'], strength: '21.8g', dosageForm: 'Sachet',
    price: 20, stock: 300, minimumStock: 40, prescriptionRequired: false,
    manufacturer: 'FDC Ltd', uses: 'Dehydration from diarrhea/vomiting.',
  },
  {
    name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', brandName: 'Brufen',
    category: catMap['pain-relief'], strength: '400mg', dosageForm: 'Tablet',
    price: 35, stock: 60, minimumStock: 10, prescriptionRequired: false,
    manufacturer: 'Abbott', uses: 'Pain, inflammation and fever.',
  },
];

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected for seeding:', mongoose.connection.name);

    await Category.deleteMany();
    await Medicine.deleteMany();

    const createdCategories = await Category.insertMany(categories);
    const catMap = {};
    createdCategories.forEach((c) => { catMap[c.slug] = c._id; });

    await Medicine.insertMany(medicinesData(catMap));
    console.log(`Seeded ${createdCategories.length} categories and ${medicinesData(catMap).length} medicines.`);

    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@pharmacare.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('Demo admin created: admin@pharmacare.com / Admin@123 (change this password)');
    }

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
};

run();