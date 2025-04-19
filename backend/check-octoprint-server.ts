import { getPrinterStatus } from './helper'

const main = async () => {
    try {
        const printerStatus = await getPrinterStatus();
        console.log(printerStatus);
    } catch (error) {
        console.error(error);
    }
}
main();