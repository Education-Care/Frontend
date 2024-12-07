import http from "../../lib/http";

const controller = new AbortController();

export const getQuestionRandomAsync = () => {
  return http.get(`/phq9-questions`, { signal: controller.signal });
};
