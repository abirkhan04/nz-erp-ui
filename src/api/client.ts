import axios from "axios";

export const api = axios.create({
  baseURL: "http://175.29.147.115:5000/api/",
});