import http from "../../lib/http";

const controller = new AbortController();

export const getEntertainmentItem = async ({
  searchTerm = "",
  currentPage = 1,
  type = "",
  isUser = false,
} = {}) => {
  // get current user
  const currentUser = JSON.parse(localStorage.getItem("user_login"));
  let depressionLevel = "";
  if (isUser && !currentUser.isAdmin) {
    depressionLevel = await http.get(
      `surveys/user/${currentUser.userId}/last`,
      {
        signal: controller.signal,
      }
    );
  }

  return http.get(
    `/entertainment?s=${searchTerm}&page=${currentPage}&type=${type}&depressionLevel=${depressionLevel}`,
    {
      signal: controller.signal,
    }
  );
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
