import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/exivox');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`🔗 Connection state: ${conn.connection.readyState}`);
    
    // Test database write
    const testCollection = conn.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Database write test successful');
    
  } catch (error) {
    console.error(`❌ MongoDB Error: ${error.message}`);
    console.log('⚠️ Make sure MongoDB app is running on port 27017');
    throw error;
  }
};

export default connectDB;
