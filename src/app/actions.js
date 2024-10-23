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
export const fetchApps = async (page = 1, limit = 10, searchWithName, searchDate=null, promoted=null, suggested=null, section=null) => {
  return await axios.get(`${API_URL}/applist`, {
    params: { 
      page, 
      limit,  
      ...(searchWithName ? { search: searchWithName } : {}),
      ...(promoted ? { promote: promoted } : {}) ,
      ...(suggested ? { suggest: suggested } : {}),
      ...(section ? { status: section } : {}),
    },
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
};

export const uploadImage = async (formData) => {
  return await axios.patch(`${API_URL}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};


/** Developer Actions */

export const createDeveloper = async (appData) => {
  return await axios.post(`${API_URL}/developer`, appData, {
    auth: {
      username,
      password,
    }
  });
};

export const fetchDevelopers = async (page = 1, limit = 10, searchWithName) => {
  return await axios.get(`${API_URL}/developer`, {
    params: { page, limit,
      ...(searchWithName ? { search: searchWithName } : {}),
     },
    auth: {
      username,
      password,
    }
  });
};

export const fetchDeveloper = async (developerId) => {
  return await axios.get(`${API_URL}/developer`, {
    params: { developerId },
    auth: {
      username,
      password,
    },
  });
};

export const updateDeveloper = async (developerDetails) => {
  return await axios.patch(`${API_URL}/developer`, developerDetails, {
    auth: {
      username,
      password,
    }
  });
};

export const deleteDeveloper = async (developerId) => {
  return await axios.delete(`${API_URL}/developer`, {
    params: { developerId },
    auth: {
      username,
      password,
    }
  });
};