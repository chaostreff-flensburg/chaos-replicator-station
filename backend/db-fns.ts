import sqlite3 from 'sqlite3';
import { Database } from 'sqlite3';
const db: Database = new sqlite3.Database('crs.sqlite3');

export interface Job {
    id: number;
    status: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface File {
    id: number;
    name: string;
    jobId: number | null;
    fileCreated: number;
    createdAt?: number;
    updatedAt?: number;
}

export const createTables = () => {
    db.serialize(() => {
        // fileCreated = 0 : not created
        // fileCreated = 1 : created
        db.run("CREATE TABLE File (name TEXT, jobId INT, fileCreated INT, createdAt INT, updatedAt INT, id INTEGER PRIMARY KEY AUTOINCREMENT)");
        db.run("CREATE TABLE Jobs (status TEXT, createdAt INT, updatedAt INT, id INTEGER PRIMARY KEY AUTOINCREMENT)");
    });
    //db.close();
}
export const insertFile = async (name: String) => {
  const insertSql = `INSERT INTO File (name, fileCreated, createdAt) VALUES(?, ?, ?)`;
  try {
    await execute(db, insertSql, [name, 0, +new Date()]);
    const createdFile = await query<File>('SELECT * FROM File ORDER BY id DESC LIMIT 1', 'get');
    console.log(createdFile)
    return createdFile;
  } catch (err) {
    console.log(err);
  } finally {
    //db.close();
  }
    /*
    const file = await prisma.file.create({
          data: {
              name,
              phonenumber: "1234567890"            
          }});
          */
}
export const getFilesWithoutJobs = async () => {
    try {
        const filesWithoutJobs = await query<File>('SELECT * FROM File WHERE jobId IS NULL AND fileCreated = 1', 'all');
        return filesWithoutJobs;
      } catch (err) {
        console.log(err);
      } finally {
        //db.close();
      }
      /*
      await prisma.file.findMany({
                where: {
                    jobId: null
                }
            });
            */
}

export const createJobSetFiles = async(files: Array<File>) => {
    const insertSql = `INSERT INTO Jobs (status) VALUES(?)`;
  try {
    await execute(db, insertSql, ['created']);
    const JobsResponse = await query<Job>('SELECT * FROM Jobs ORDER BY id DESC LIMIT 1', 'get');
    const job = JobsResponse as Job;
    //console.log(job)
    //console.log('files', files)
    for (const file of files){
        //console.log('jobId', job.id, 'file.id', file.id)
        const updateFileSql = `UPDATE File SET jobId = ${job.id} WHERE id = ${file.id}`
        await execute(db, updateFileSql);
    }
    return job
    /*
    await prisma.job.create({
            data: {
                status: "created",
            }
        });
        // updated all sliced files with the new job id
        await prisma.file.updateMany({
            where: {
                id: {
                    in: slicedFiles.map(file => file.id)
                }
            },
            data: {
                jobId: job.id
            }
        });
        */
  } catch (err) {
    console.log(err);
  } finally {
    //db.close();
  }
}

export const updateJobStatus = async(jobId: number, status: string) => {
  try {
        const updateSql = `UPDATE Jobs SET status = "${status}" WHERE id = ${jobId}`
        await execute(db, updateSql);
    /*
    await prisma.job.update({
      where: {
        id: jobId
      },
      data: {
        status
      }
    });
        */
  } catch (err) {
    console.log(err);
  } finally {
    //db.close();
  }
}

export const updateFileStatus = async(fileId: number, status: number) => {
  try {
        const updateSql = `UPDATE File SET fileCreated = "${status}" WHERE id = ${fileId}`
        await execute(db, updateSql);
  } catch (err) {
    console.log(err);
  } finally {
    //db.close();
  }
}

export const getFirstPrintingJob = async (all = false) => {
    try {
        const firstPrintingJob = await query<Job>('SELECT * FROM Jobs WHERE status = "printing" ORDER BY id ASC', all ? 'all' : 'get');
        if(all){
            return firstPrintingJob;
        }
        return firstPrintingJob;
      } catch (err) {
        console.log(err);
      } finally {
        //db.close();
      }
}

export const getFirstUploadedJob = async () => {
    try {
        const firstPrintingJob = await query<Job>('SELECT * FROM Jobs WHERE status = "uploaded" ORDER BY id ASC', 'get');
        return firstPrintingJob;
      } catch (err) {
        console.log(err);
      } finally {
        //db.close();
      }
}

export const getDBContent = async () => {
    try {
        const jobs = await query<Job>('SELECT * FROM Jobs ORDER BY id ASC', 'all');
        const files = await query<File>('SELECT * FROM File ORDER BY id ASC', 'all');
        return {jobs, files};
      } catch (err) {
        console.log(err);
      } finally {
        //db.close();
      }
}

// --- helper
const query = <T>(command: string, method: 'all' | 'get' | 'run' = 'all') => {
    return new Promise<T>((resolve, reject) => {
      if (method === 'all') {
        db.all(command, (error: Error | null, result: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      } else if (method === 'get') {
        db.get(command, (error: Error | null, result: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      } else {
        db.run(command, (error: Error | null, result: any) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        });
      }
    });
  };

const execute = async (db: Database, sql: string, params: any[] = []): Promise<void> => {
    if (params && params.length > 0) {
      return new Promise<void>((resolve, reject) => {
        db.run(sql, params, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }
    return new Promise<void>((resolve, reject) => {
      db.run(sql, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  };