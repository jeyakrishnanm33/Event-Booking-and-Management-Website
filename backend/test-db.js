import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully');
    
    // Check if database exists and can be accessed
    const dbs = await mongoose.connection.db.admin().listDatabases();
    console.log('Available databases:', dbs.databases.map(db => db.name));
    
    await mongoose.connection.close();
    console.log('✅ Connection test passed');
  } catch (error) {
    console.error('❌ Connection test failed:', error);
  }
}

testConnection();