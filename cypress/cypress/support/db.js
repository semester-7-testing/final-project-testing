import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.DATABASE_URI;

const databaseName = process.env.DATABASE_NAME;

const client = new MongoClient(uri);

const connect = async () => {
  try {
    await client.connect();
    console.log('Connected to DB');
    return client.db(databaseName);
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

const disconnect = async () => {
  try {
    await client.close();
    console.log('Disconnected from DB');
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export { connect, disconnect };
