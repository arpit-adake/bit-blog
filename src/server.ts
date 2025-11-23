/**
 * @copyright 2025 ArpitAdake
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import express from 'express';

/**
 * Custom modules
 */
import config from './config';

/**
 * Express app initial
 */
const app = express();

app.get('/', (req, res) => {
  res.json({
    message: "Hello World"
  })
})

app.listen(config.PORT,() => {
  console.log(`Server running: http://localhost:${config.PORT} running`);
})