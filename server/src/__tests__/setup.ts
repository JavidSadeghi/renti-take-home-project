import mongoose from 'mongoose';

beforeAll(async () => {
  // Connect to test database
  await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/checkpoint-test');
});

afterAll(async () => {
  // Close database connection
  await mongoose.connection.close();
});

afterEach(async () => {
  // Clean up database after each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
}); 