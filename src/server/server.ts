import dotenv from 'dotenv';
dotenv.config({ path: './src/server/config/.env' });

import express from 'express';
import cors from 'cors';
import path from 'path';
import apiRoutes from './routes/api.ts';
import { logger } from './middleware/logger.ts';

const app = express();
const port = process.env.VITE_PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api', apiRoutes);

if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(process.cwd(), 'dist');
  app.use(express.static(buildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
