import { exec } from "child_process"; import { octoprintApi } from './octoprintApi'
import { File, Job, PrismaClient } from './generated/prisma'
const prisma = new PrismaClient()
import fs from 'fs'

export const uploadFileToOctoprint = async (filePath: string) => {
  try {
    const response = await octoprintApi.post('/files/local', {
      file: fs.createReadStream(filePath)
    },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    if (response.status === 201) {
      return true
      console.log(response.data)
    }
  } catch (error) {
    console.error(error);
  }
}

export const getPrinterStatus = async () => {
  try {
    const response = await octoprintApi.get('/printer')
    console.log(response.data.state)
    if (!response.data.state) return null
    return {
      isAvailableForPrinting: response.data.state.text === 'Operational' && response.data.state.flags.operational,
      ...response.data
    }
  } catch (error) {
    console.error(error);
    return null
  }
}

export const selectAndPrintFile = async (fileName: string) => {
  try {
    const response = await octoprintApi.post(`/files/local/${fileName}`, {
      command: "select",
      print: true
    })
    if (response.status === 204) {
      return response.data
    }
  } catch (error) {
    console.error(error);
    return null
  }
}

export const appExecute = async (command: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (!!stdout) {
        console.log(stdout);
      }

      if (!!stderr) {
        console.error(stderr);
      }

      if (!!error) {
        reject(error.message);
        return;
      }

      resolve(stdout);
    });
  });
}