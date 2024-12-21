import http from "../../lib/http";

const controller = new AbortController();

export const getEntertainmentItem = async ({ searchTerm, currentPage }) => {
  return http.get(`/entertainment?s=${searchTerm}&page=${currentPage}`, {
    signal: controller.signal,
  });
};

export const getEntertainmentItemById = async (id) => {
  return http.get(`/entertainment/${id}`, { signal: controller.signal });
};

export const createEntertainmentItem = async (data) => {
  return http.post(`/entertainment`, data, { signal: controller.signal });
};

export const updateEntertainmentItem = async (id, data) => {
  return http.put(`/entertainment/${id}`, data, { signal: controller.signal });
};

export const deleteEntertainmentItem = async (id) => {
  return http.delete(`/entertainment/${id}`, { signal: controller.signal });
};
