import axios from 'axios';
import endpoints from './endpoints';

const token = localStorage.getItem("access_token");

const listProducts = async () => {
  try {

    const { data } = await axios.get(endpoints.products, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.warn(error)
  }
}

const createProduct = async (body) => {
  try {
    const { data } = await axios.post(endpoints.products, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.warn(error)
  }
}

const getProduct = async (id) => {
  try {
    const { data } = await axios.get(`${endpoints.products}${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.warn(error)
  }
}

const patchProduct = async (id, changes) => {
  try {
    const { data } = await axios.patch(`${endpoints.products}${id}/`, changes, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.warn(error)
  }
}

const deleteProduct = async (id) => {
  try {
    const { data } = await axios.delete(`${endpoints.products}${id}/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.warn(error)
  }
}

export { listProducts, createProduct, getProduct, patchProduct, deleteProduct }