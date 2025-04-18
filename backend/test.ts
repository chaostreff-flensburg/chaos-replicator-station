import { octoprintApi } from './octoprintApi'
import fs from 'fs'


const getAllFiles = async () => {
    try {
        const response = await octoprintApi.get(`/files`)
        console.log(response.data)
    } catch (error) {
        console.error(error);
        return null
    }
}
//getAllFiles()
//selectAndPrintfile('17_0.4n_0.2mm_PLA_MINIIS_18m.gcode')