/**
 * Migration script: Copy all documents from local MongoDB to MongoDB Atlas.
 *
 * Usage:
 *   node migrateData.js
 *
 * Prerequisites:
 *   - Local MongoDB must be running (default: mongodb://localhost:27017)
 *   - MONGO_URI in .env must point to Atlas
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const LOCAL_URI = 'mongodb://localhost:27017/shree_paper_products';
const ATLAS_URI = process.env.MONGO_URI || process.env.MONGODB_URI;
const ATLAS_DB_NAME = 'shree-papers';

// Collections to migrate (add 'payments' if it exists locally)
const COLLECTIONS = ['users', 'products', 'orders', 'customorders', 'payments'];

async function migrateCollection(localDb, atlasDb, collectionName) {
  const localCollection = localDb.collection(collectionName);
  const count = await localCollection.countDocuments();

  if (count === 0) {
    console.log(`  [${collectionName}] No documents found locally — skipping.`);
    return;
  }

  const documents = await localCollection.find({}).toArray();
  const atlasCollection = atlasDb.collection(collectionName);

  // Drop existing Atlas collection to avoid duplicates on re-run
  try {
    await atlasCollection.drop();
    console.log(`  [${collectionName}] Dropped existing Atlas collection.`);
  } catch {
    // Collection doesn't exist yet — that's fine
  }

  await atlasCollection.insertMany(documents);
  console.log(`  [${collectionName}] Migrated ${documents.length} document(s).`);
}

async function migrate() {
  if (!ATLAS_URI) {
    console.error('ERROR: MONGO_URI is not set in your .env file.');
    process.exit(1);
  }

  console.log('Connecting to local MongoDB...');
  const localClient = new MongoClient(LOCAL_URI);
  await localClient.connect();
  const localDb = localClient.db(); // uses the db name from the URI
  console.log('Local MongoDB connected.');

  console.log('Connecting to MongoDB Atlas...');
  const atlasClient = new MongoClient(ATLAS_URI);
  await atlasClient.connect();
  const atlasDb = atlasClient.db(ATLAS_DB_NAME);
  console.log('MongoDB Atlas connected.\n');

  console.log('Starting migration...');
  for (const col of COLLECTIONS) {
    await migrateCollection(localDb, atlasDb, col);
  }

  await localClient.close();
  await atlasClient.close();
  console.log('\nMigration complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
