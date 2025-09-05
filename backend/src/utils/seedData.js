const mongoose = require('mongoose');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Alert = require('../models/Alert');
const SuspiciousDomain = require('../models/SuspiciousDomain');

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/cyberguard');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

// Load JSON data from file
const loadJSONData = async (filePath) => {
  try {
    const fullPath = path.join(__dirname, '..', '..', filePath);
    const data = await fs.readFile(fullPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading ${filePath}:`, error.message);
    return [];
  }
};

// Create demo admin user
const createDemoUser = async () => {
  try {
    // Check if demo user already exists
    const existingUser = await User.findOne({ email: process.env.DEMO_EMAIL || 'admin@cyberguard.com' });
    
    if (existingUser) {
      console.log('Demo user already exists');
      return existingUser;
    }

    const demoUser = new User({
      email: process.env.DEMO_EMAIL || 'admin@cyberguard.com',
      password: process.env.DEMO_PASSWORD || 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });

    await demoUser.save();
    console.log('Demo admin user created:', demoUser.email);
    return demoUser;
  } catch (error) {
    console.error('Error creating demo user:', error.message);
    return null;
  }
};

// Seed alerts
const seedAlerts = async (demoUser) => {
  try {
    // Clear existing alerts
    await Alert.deleteMany({});
    console.log('Cleared existing alerts');

    // Load alert data
    const alertData = await loadJSONData('data/alerts.json');
    
    if (alertData.length === 0) {
      console.log('No alert data to seed');
      return;
    }

    // Create alerts with demo user as creator
    const alerts = alertData.map(alert => ({
      ...alert,
      createdBy: demoUser._id
    }));

    await Alert.insertMany(alerts);
    console.log(`Seeded ${alerts.length} alerts`);
  } catch (error) {
    console.error('Error seeding alerts:', error.message);
  }
};

// Seed suspicious domains
const seedSuspiciousDomains = async () => {
  try {
    // Clear existing domains
    await SuspiciousDomain.deleteMany({});
    console.log('Cleared existing suspicious domains');

    // Load domain data
    const domainData = await loadJSONData('data/suspiciousDomains.json');
    
    if (domainData.length === 0) {
      console.log('No domain data to seed');
      return;
    }

    await SuspiciousDomain.insertMany(domainData);
    console.log(`Seeded ${domainData.length} suspicious domains`);
  } catch (error) {
    console.error('Error seeding suspicious domains:', error.message);
  }
};

// Main seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');
    
    await connectDB();
    
    // Create demo user
    const demoUser = await createDemoUser();
    
    if (!demoUser) {
      console.error('Failed to create demo user');
      process.exit(1);
    }
    
    // Seed data
    await seedAlerts(demoUser);
    await seedSuspiciousDomains();
    
    console.log('Database seeding completed successfully!');
    console.log('\nDemo credentials:');
    console.log(`Email: ${demoUser.email}`);
    console.log(`Password: ${process.env.DEMO_PASSWORD || 'admin123'}`);
    console.log('\nYou can now start the server and login with these credentials.');
    
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
