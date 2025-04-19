import { createTables } from "./db-fns";

const test = async () => {
   await(createTables());
}
test();