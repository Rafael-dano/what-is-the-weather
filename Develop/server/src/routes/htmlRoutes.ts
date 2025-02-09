import path from 'path'; // Use 'path' instead of 'node:path'
import { fileURLToPath } from 'url'; // Use 'url' instead of 'node:url'
import { Router, Request, Response } from 'express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// Define route to serve index.html
app.get('*', (_, res) => { // Use _ to indicate 'req' is not used
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  });
  

export default router;
