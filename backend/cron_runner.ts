import { appExecute, uploadFileToOctoprint, getPrinterStatus, selectAndPrintFile } from './helper'
import { getFilesWithoutJobs, createJobSetFiles, updateJobStatus, getFirstPrintingJob, getFirstUploadedJob } from './db-fns'
const flags = {
    startPrint: process.env.START_PRINT || true,
}
const main = async () => {
    while (true) {
        const loopStart: number = +Date.now();
        console.log(`=== New Loop at ${loopStart} ===`)
        // count how many files are their without a print job
        try {

            // Start: Sliced files to Job gcode
            const files = await getFilesWithoutJobs();
            console.log(`Found ${files.length} files without a print job`)
            // if count of file sis larger or equal to 1
            if (!files.length) {
            }
            else if (files.length >= 6) {
                await createJob(files);
            }
            // if last element of file created_at to now() difference is bigger then 120 seconds, if shoud be true
            else if (true || (+Date.now() - files.at(-1)?.created_at) >= 120 * 1000) {
                await createJob(files);
            }

            // Job gcode to printer (if printer is not busy)

            // check printer status - and create new print status
            const printerStatus = await getPrinterStatus();
            const jobPrinting = await getFirstPrintingJob();
            console.log('printerStatus', printerStatus, 'jobPrinting', jobPrinting)
            if (printerStatus?.isAvailableForPrinting && !jobPrinting) {

                //prisma get the job with the smallest id and the status "uploaded"
                const jobToPrint = await getFirstUploadedJob()
                console.log('jobToPrint', jobToPrint)
                if (jobToPrint.id) {
                    if (flags.startPrint) {
                        await selectAndPrintFile(`${jobToPrint.id}.gcode`);
                        await updateJobStatus(jobToPrint.id, "printing");
                    }
                }
            }
            // If printer is done with job, update job
        } catch (error) {
            console.error(error);
        }
        const loopEnd = +Date.now();
        const loopDuration = loopEnd - loopStart;
        if (loopDuration < 15000) {
            console.log(`Waiting for ${15000 - loopDuration}ms`)
            await new Promise(resolve => setTimeout(resolve, 15000 - loopDuration));
            console.log('')
        }
    }
}

const createJob = async (files: Array<any>) => {
    try {
        console.log(`Creating new job from files`)
        // slice files to max first 6 element in array
        const slicedFiles = files.slice(0, 6);
        // create new Print
        const job = await createJobSetFiles(files)

        console.log(`Created job ${job.id} with ${slicedFiles.length} files`)
        const slicedFilesName: string = slicedFiles.map(file => `"./stls/${file.id}.stl"`).join(' ')
        console.log(slicedFilesName)
        await appExecute(`cd ../../bottle-clip-name-tag && prusa-slicer --bed-temperature 60 --first-layer-bed-temperature 60 --first-layer-temperature 215 --temperature 215 --load="./PrusaSlicer_config_bundle.ini" -m -g ${slicedFilesName} -o="./gcodes/${job.id}.gcode"`);
        // update job status to sliced
        await updateJobStatus(job.id, "sliced");
        console.log(`Updated job ${job.id} to sliced`)
        await uploadFileToOctoprint(`../../bottle-clip-name-tag/gcodes/${job.id}.gcode`);

        await updateJobStatus(job.id, "uploaded");

        console.log(`Job ${job.id} is not started, because START_PRINT is set to false`)

        console.log(`Updated job ${job.id} to uploaded`)
    } catch (error) {
        console.error(error);
    }
}

main()
