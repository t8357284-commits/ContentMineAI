import axios from "axios";

const api = axios.create({
  baseURL: "https://contentmineai-1.onrender.com/api/v1",
});

export default api;
