import { createJob } from "./db-fns";

const test = async () => {
    console.log("test");
    console.log(await createJob([
        {
            name: 'scammo, 1745065690619',
            jobId: null,
            createdAt: null,
            updatedAt: null,
            id: 1
          },
          {
            name: 'scammo',
            jobId: null,
            createdAt: 1745065716626,
            updatedAt: null,
            id: 2
          }
    ]));
}
test();