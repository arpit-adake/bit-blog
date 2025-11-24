/**
 * @copyright 2025 ArpitAdake
 * @license Apache-2.0
 */

/**
 * Node modules
 */
import { timeStamp } from 'console';
import { Router } from 'express'
const router = Router()

/**
 * Root route
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'API is live',
    status: 'ok',
    version: '1.0.0',
    timeStamp: new Date().toISOString()
  });
});

export default router