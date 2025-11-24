/**
 * @copyright 2025 ArpitAdake
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import helmet from 'helmet';

/**
 * Custom modules
 */
import config from './config';
import limiter from './lib/express_rate_limit';

/**
 * Router
 */
import v1Routes from './routes/v1';

/**
 * Types
 */
import type { CorsOptions } from 'cors';


/**
 * Express app initial
 */
const app = express();

// Configure CORS operations
const corsOptions: CorsOptions = {
  origin(origin,callback){
    if(config.NODE_ENV == 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)){
      callback(null,true)
    } else {
      // Reject request from non-whitelisted origins
      callback(new Error(`CORS error: ${origin} is not allowed by CORS`), false)
      console.log(`CORS error: ${origin} is not allowed by CORS`)
    }
  }
}

// Apply cors middlewear
app.use(cors(corsOptions));

// Enable JSON requested body parsing
app.use(express.json())

// Enable URL-encoded request body parsing with extended mode 
// allows rich objects and arrays via querystring library
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())

// Enable response compression to reduce payload size and performance
app.use(
  compression({
    threshold: 1024 // Only compress responses larger than 1KB
  })
)

// Use Helmet to enhance security by setting various HTTP headers
app.use(helmet())

// Apply rate limiting middleware to prevent excessive requests and enhance security 
app.use(limiter);

/**
 * Immediately Invoked Async Function Expression (IIFE) to start the server
 * 
 * - Tries to connect to the database before initializing the server.
 * - Defines the API route ('/api/v1').
 * - Starts the server on the specified PORT and logs the running URL.
 * - If an error occurs during startup, it is logged, and the process
 *   exits with status 1.
 */
(async () => {
  try{
    app.use('/api/v1',v1Routes);

    app.listen(config.PORT,() => {
      console.log(`Server running: http://localhost:${config.PORT} running`);
    });
  } catch (err) {
    console.log('Failed to start the server', err)

    if (config.NODE_ENV === 'production') {
      process.exit(1)
    }
  }
})();

/**
 * Handle server shutdown gracefully by disconnecting from the database.
 * - Attempts to disconnect from the database before shutting down the server.
 * - Logs a succes message if the disconnection is succesful. 
 * - If an error occurs during disconnection, it is logged to the console.
 * - Exits the process with status code `0` (indicating a succesful shutdown).
 */
const handleServerShutdown = async () => {
  try {
    console.log('Server SHUTDOWN')
    process.exit(0)
  } catch (err) {
    console.log('Error during server shutdown', err)
  }
}

/**
 * Listens for termination signals ('SIGTERM' and 'SIGINT')
 * 
 * - 'SIGTERM' is typically sent when a stopping process (e.g. 'kill' command 
 *    or container shutdown)
 * - 'SIGINT' is triggered when the user interrupts the process (e.g. pressing
 *   'Ctrl + C')
 * - When either signal is recieved, `handleSerevrShutdown` is executed
 *   to ensure proper cleanup.
 */
process.on('SIGTERM',handleServerShutdown)
process.on('SIGINT',handleServerShutdown)