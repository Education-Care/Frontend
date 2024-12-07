import http from "../../lib/http";

const controller = new AbortController();

export const createPhq9Response = (responseData) => {
  return http.post(`/phq9-responses`, responseData, {
    signal: controller.signal,  // Thêm tín hiệu hủy yêu cầu
  });
};
// export const getQuestionRandomAsync = () => {
//   return http.get(`/phq9-questions`, { signal: controller.signal });
// };
// export const updateInfoUserAsync = (id, body) => {
//   return http.patch(`/users/${id}`, body, { signal: controller.signal });
// };