import http from "../../lib/http";

export const getUser = async () => {
  try {
    const res = await http.get("/users");
    return res;
  } catch (error) {
    throw error;
  }
};
