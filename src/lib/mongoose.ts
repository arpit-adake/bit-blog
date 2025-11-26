/**
 * @copyright 2025 ArpitAdake
 * @license Apache-2.0
 */

/**
 * Node Modules
 */
import mongoose from "mongoose";

/**
 * Custom modules
 */
import config from "../config";
import { logger } from "./winston";

/**
 * Types
 */
import type { ConnectOptions } from "mongoose";

/**
 * Client option
 */
const clientOptions: ConnectOptions = {
  dbName: 'blog-db',
  appName: 'Blog API',
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true
  }
};

/**
 * Establishes a connectionto the MongoDB database using mongoose.
 * If an error occurs during the connection process, it throws an error
 * with a descriptive message.
 * 
 * - Uses 'MONGO_URI' as the connection string.
 * - 'clientOptions' contaains additional configuration for Mongoose.
 * - Errors are properly handled and rethrown for better debugging.
 */
export const connectToDatabase = async (): Promise<void> => {
  if(!config.MONGO_URI) {
    throw new Error('MongoDB URI is not defined in the configuration.')
  }
  try {
    await mongoose.connect(config.MONGO_URI,clientOptions)
    logger.info('Connected to the database succesfully.', {
      uri: config.MONGO_URI,
      options: clientOptions
    })
  } catch (err) {
    if (err instanceof Error) {
      throw err
    }
    logger.error('Error connecting to the database',err)
  }
}

/**
 * Disconnect from the MongoDB database using Mongoose.
 * 
 * This function attempts to disconnect from the database asynchronously.
 * If the disconnection is succesful, a success message is logged.
 * If an error occurs, it is either re-thrown as a new Error (if it's am instance of error)
 * or logged to the console.
 */export const disconnectFromDatabase = async (): Promise<void> => {
  try {
    await mongoose.disconnect()

    logger.info('Disconnected from the database succesfully.', {
      uri: config.MONGO_URI,
      options: clientOptions
    })
  } catch (err) {
    if (err instanceof Error) {
      throw new Error(err.message)
    }
    logger.error('Error disconnecting from the database',err)
  }
 }