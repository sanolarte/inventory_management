import axios from "axios";
import endpoints from "./endpoints";

const getToken = async (params) => {
  try {
    const { data } = await axios.post(endpoints.users, params);
    return data
  } catch (error) {
    console.warn(error)
  }
}

export { getToken }
