import express from 'express'
import type { Request, Response } from 'express';
import {createNativeClient,getDefaultLibraryFilename} from 'node-firebird-driver-native';
const app = express();
const PORT = 3000;

app.use(express.json());

  const client=createNativeClient(getDefaultLibraryFilename());
    // Connection options
    const options = {
      username: 'maria', // Default username
      password: 'mariita', // Default password
    };

  client.connect("localhost/3050:/var/lib/firebird/data/mirror.fdb",options)

  

app.get('/', (req: Request, res: Response) => {
  res.send({ message: 'TypeScript API is humming along!' });
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});