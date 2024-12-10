import http from "../../lib/http";

const controller = new AbortController();

export const getSurveysByUser = async (userId) => {
  return http.get(`/surveys/user/${userId}`, { signal: controller.signal });
};
export const getSurveysById = async (Id) => {
  return http.get(`/surveys/${Id}`, { signal: controller.signal });
};