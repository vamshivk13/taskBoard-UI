import axios from "axios";
import { BASE_URL } from "../constants/api";

const config = {
  baseURL: BASE_URL,
};
const axiosInstance = axios.create(config);
async function fetchRequest(url, payload = {}, method = "POST", options = {}) {
  try {
    const data = await axiosInstance({
      method: method.toUpperCase(),
      url: url,
      data: payload,
      ...options,
    });
    return data;
  } catch (err) {
    throw err;
  }
}

export default fetchRequest;
