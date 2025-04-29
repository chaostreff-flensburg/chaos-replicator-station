import { exec } from "child_process";
import { octoprintApi } from './octoprintApi'
import fs from 'fs'
import type { AxiosResponse } from 'axios'

interface OctoPrintResponse {
  status: string;
}

interface PrinterState {
  text: string;
  flags: {
    operational: boolean;
  };
}

interface PrinterResponse {
  state: PrinterState;
  isAvailableForPrinting?: boolean;
}

interface FileResponse {
  files: {
    name: string;
    path: string;
  };
}

interface SelectAndPrintResponse {
  files: {
    name: string;
    path: string;
  };
}

export const uploadFileToOctoprint = async (filePath: string): Promise<OctoPrintResponse | null> => {
  try {
    const response: AxiosResponse<OctoPrintResponse> = await octoprintApi.post('/files/local', {
      file: fs.createReadStream(filePath)
    },
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    if (response.status === 201) {
      return response.data
    }
    return null
  } catch (error) {
    console.error(error);
    return null
  }
}

export const getPrinterStatus = async (): Promise<PrinterResponse | null> => {
  try {
    const response: AxiosResponse<PrinterResponse> = await octoprintApi.get('/printer')
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

export const selectAndPrintFile = async (fileName: string): Promise<SelectAndPrintResponse | null> => {
  try {
    const response: AxiosResponse<SelectAndPrintResponse> = await octoprintApi.post(`/files/local/${fileName}`, {
      command: "select",
      print: true
    })
    if (response.status === 204) {
      return response.data
    }
    return null
  } catch (error) {
    console.error(error);
    return null
  }
}

export const appExecute = async (command: string): Promise<string | null> => {
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