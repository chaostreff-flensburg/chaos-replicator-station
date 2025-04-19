const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('crs.sqlite3');

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
  const insertSql = `INSERT INTO File (name, fileCreated, createdAt) VALUES(?, ?)`;
  try {
    await execute(db, insertSql, [name, 0, +new Date()]);
    const createdFile = await query('SELECT * FROM File ORDER BY id DESC LIMIT 1');
    console.log(createdFile[0])
    return createdFile[0];
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
        const filesWithoutJobs = await query('SELECT * FROM File WHERE jobId IS NULL AND fileCreated = 1');
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

export const createJobSetFiles = async(files: Array<any>) => {
    const insertSql = `INSERT INTO Jobs (status) VALUES(?)`;
  try {
    await execute(db, insertSql, ['created']);
    const JobsResponse = await query('SELECT * FROM Jobs ORDER BY id DESC LIMIT 1');
    const job = JobsResponse[0];
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

export const updateJobStatus = async(jobId, status) => {
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

export const updateFileStatus = async(fileId, status) => {
  try {
        const updateSql = `UPDATE File SET fileCreated = "${status}" WHERE id = ${fileId}`
        await execute(db, updateSql);
  } catch (err) {
    console.log(err);
  } finally {
    //db.close();
  }
}

export const getFirstPrintingJob = async () => {
    try {
        const firstPrintingJob = await query('SELECT * FROM Jobs WHERE status = "printing" ORDER BY id ASC');
        return firstPrintingJob[0];
      } catch (err) {
        console.log(err);
      } finally {
        //db.close();
      }
}

export const getFirstUploadedJob = async () => {
    try {
        const firstPrintingJob = await query('SELECT * FROM Jobs WHERE status = "uploaded" ORDER BY id ASC');
        return firstPrintingJob[0];
      } catch (err) {
        console.log(err);
      } finally {
        //db.close();
      }
}

export const getDBContent = async () => {
    try {
        const jobs = await query('SELECT * FROM Jobs ORDER BY id ASC');
        const files = await query('SELECT * FROM File ORDER BY id ASC');
        return {jobs, files};
      } catch (err) {
        console.log(err);
      } finally {
        //db.close();
      }
}

// --- helper
const query = (command, method = 'all') => {
    return new Promise((resolve, reject) => {
      db[method](command, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  };

const execute = async (db, sql, params = []) => {
    if (params && params.length > 0) {
      return new Promise((resolve, reject) => {
        db.run(sql, params, (err) => {
          if (err) reject(err);
          resolve();
        });
      });
    }
    return new Promise((resolve, reject) => {
      db.run(sql, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  };