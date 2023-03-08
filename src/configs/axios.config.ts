import Axios from 'axios';
import { configure } from 'axios-hooks';
import LRU from 'lru-cache';
import { AppConfig } from 'src/configs/app.config';
import { getSession } from 'next-auth/react';

const axios = Axios.create({
  baseURL: AppConfig.apiBase,
});

const cache = new LRU({ max: 10 });

// request interceptor to add token to request headers
axios.interceptors.request.use(
  async (config) => {
    // Implement function to get token
    const session = await getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session?.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor intercepting 401 responses, refreshing token and retrying the request
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Implement logic here

    return Promise.reject(error);
  }
);

configure({ axios, cache });
