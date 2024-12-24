import http from "../../lib/http";

const controller = new AbortController();

export const getBlogAsync = () => {
  return http.get(`/blog`, { signal: controller.signal });
};
