const { MongoClient, ObjectId } = require('mongodb');

const url = process.env.MONGO_URL || 'mongodb://mongo:27017';
const dbName = process.env.MONGO_DB || 'esempio';
let db;

function toObjectId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

async function connect() {
  const client = new MongoClient(url);
  await client.connect();
  db = client.db(dbName);
}

async function seedIfEmpty() {
  const count = await db.collection('items').countDocuments();
  if (count === 0) {
    await db.collection('items').insertOne({
      title: 'Item di esempio',
      note: 'Inserito automaticamente al primo avvio',
    });
  }
}

async function getAll() {
  return db.collection('items').find().toArray();
}

async function get(id) {
  const oid = toObjectId(id);
  if (!oid) return null;
  return db.collection('items').findOne({ _id: oid });
}

async function create(title, note) {
  const result = await db.collection('items').insertOne({ title, note });
  return db.collection('items').findOne({ _id: result.insertedId });
}

async function update(id, title, note) {
  const oid = toObjectId(id);
  if (!oid) return null;
  const result = await db.collection('items').updateOne({ _id: oid }, { $set: { title, note } });
  if (result.matchedCount === 0) return null;
  return db.collection('items').findOne({ _id: oid });
}

async function remove(id) {
  const oid = toObjectId(id);
  if (!oid) return;
  await db.collection('items').deleteOne({ _id: oid });
}

module.exports = { connect, seedIfEmpty, getAll, get, create, update, remove };