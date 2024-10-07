import axios from 'axios';

const username = 'admin-gallery'
const password = 'mG7!vB3@tL2pX4'

const API_URL = 'https://cityminiapps.kobil.com/app3/v1/admin';

export const createApp = async (appData) => {
  return await axios.post(`${API_URL}/app`, appData, {
    auth: {
      username,
      password,
    },
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const updateAppDetails = async (appData) => {
  return await axios.patch(`${API_URL}/app`, appData, {
    auth: {
      username,
      password,
    }
  });
};


export const updateAppImages = async (appData) => {
  return await axios.patch(`${API_URL}/images`, appData, {
    auth: {
      username,
      password,
    }
  });
};
export const fetchApps = async (page = 1, limit = 10) => {
  return await axios.get(`${API_URL}/applist`, {
    params: { page, limit }, 
    auth: {
      username,
      password,
    }
  });
};

export const fetchApp = async (appId) => {
  return await axios.get(`${API_URL}/applist`, {
    params: { appId },
    auth: {
      username,
      password,
    },
  });
};

export const deleteApp = async (appId) => {
  // const params= new URLSearchParams({
  //   appId
  // })
  return await axios.delete(`${API_URL}/app`, {
    params: { appId },
    auth: {
      username,
      password,
    },
  });

  // if (!response.ok) {
  //   throw new Error('Failed to delete app');
  // }

  // return response.json(); // Or handle response as needed
};

export const uploadImage = async (formData) => {
  return await axios.patch(`${API_URL}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
