import express from 'express';
import type { Request, Response } from 'express';
import {} from 'node-firebird-driver-native';
const app = express();
const PORT = 3000;

app.use(express.json());

    // Connection options
    const options = {
      host: '127.0.0.1',
      port: 3050, // Default Firebird port
      database: '/home/mozilla/firebird-app/data', // Use an absolute path or alias
      user: 'maria', // Default username
      password: 'mariita', // Default password
    };

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'TypeScript API is humming along!' });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});