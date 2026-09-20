require('dotenv').config();

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

async function createUsers() {
  try {
    if (!MONGO_URI) {
      throw new Error('MONGO_URI is missing from .env');
    }

    await mongoose.connect(MONGO_URI);

    console.log('MongoDB connected');

    // ================================
    // ADMIN USER
    // ================================

    const adminEmail = 'admin@pharmacare.com';

    const existingAdmin = await User.findOne({
      email: adminEmail,
    });

    if (existingAdmin) {
      console.log('Admin already exists:', adminEmail);
    } else {
      const adminPassword = 'Admin@12345';

      const admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        phone: '',
        address: '',
        profileImage: '',
        isActive: true,
      });

      console.log('✅ Admin created:', admin.email);
    }

    // ================================
    // PHARMACIST USER
    // ================================

    const pharmacistEmail = 'pharmacist@pharmacare.com';

    const existingPharmacist = await User.findOne({
      email: pharmacistEmail,
    });

    if (existingPharmacist) {
      console.log('Pharmacist already exists:', pharmacistEmail);
    } else {
      const pharmacistPassword = 'Pharmacist@12345';

      const pharmacist = await User.create({
        name: 'Pharmacist',
        email: pharmacistEmail,
        password: pharmacistPassword,
        role: 'pharmacist',
        phone: '',
        address: '',
        profileImage: '',
        isActive: true,
      });

      console.log('✅ Pharmacist created:', pharmacist.email);
    }

    console.log('');
    console.log('======================================');
    console.log('Production users setup completed');
    console.log('======================================');
    console.log('');
    console.log('Admin:');
    console.log('Email: admin@pharmacare.com');
    console.log('Password: Admin@12345');
    console.log('');
    console.log('Pharmacist:');
    console.log('Email: pharmacist@pharmacare.com');
    console.log('Password: Pharmacist@12345');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
}

createUsers();