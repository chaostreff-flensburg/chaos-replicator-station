import axios from "axios";
import 'dotenv/config'

console.log(process.env.OCTOPRINT_API_URL)
const octoprintApi = axios.create({ baseURL: `${process.env.OCTOPRINT_API_URL}` })
octoprintApi.defaults.headers.common['Authorization'] = `Bearer ${process.env.OCTOPRINT_API_KEY}`;

export { octoprintApi }
