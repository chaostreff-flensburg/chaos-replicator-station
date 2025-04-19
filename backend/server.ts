import express, { Request, Response } from 'express';
import cors from 'cors';
import { appExecute } from './helper'
import { getPrinterStatus } from './helper';
import { insertFile, getDBContent, updateFileStatus } from './db-fns';

const app = express();
const port = process.env.PORT || 3000;
app.use(cors({ origin: '*' }))
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript Express!');
})

app.post('/print-jobs', async (req: Request, res: Response) => {
  console.log(req.body)
  try {
    const name = req.body?.configuration?.name;

    const file = await insertFile(name)
    console.log(file);
    await appExecute(`cd ../../bottle-clip-name-tag && openscad -D name='"${name}"' examples.scad -o stls/${file?.id}.stl`);
    await updateFileStatus(file?.id, 1);
    res.send({
      message: "created",
      file,
      status: 200
    })
  } catch (error) {
    res.send({
      message: JSON.stringify(error),
      status: 500
    })
  }
})

app.get('/printer-status', async (req: Request, res: Response) => {
  try {
    const printerStatus = await getPrinterStatus();
    res.send({
      message: "created",
      printerStatus,
      status: 200
    })
  } catch (error) {
    res.send({
      message: JSON.stringify(error),
      status: 500
    })
  }
})

app.get('/job-file-status', async (req: Request, res: Response) => {
  try {
    const printerStatus = await getPrinterStatus();
    res.send({
      message: "created",
      printerStatus,
      status: 200
    })
  } catch (error) {
    res.send({
      message: JSON.stringify(error),
      status: 500
    })
  }
})

app.get('/db-content', async (req: Request, res: Response) => {
  try {
    const dbContent = await getDBContent();
    res.send({
      message: "created",
      dbContent,
      status: 200
    })
  } catch (error) {
    res.send({
      message: JSON.stringify(error),
      status: 500
    })
  }
})

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});