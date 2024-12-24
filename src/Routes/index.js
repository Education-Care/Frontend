import HomePage from "../Pages/HomePage/HomePage";
import AppointmentPage from "../Pages/AppointmentPage/AppointmentPage";
import Notfound from "../Pages/NotFoundPage/NotFound";
import SurveyPage from "../Pages/SurveyPage/SurveyPage";
import ProfilePage from "../Pages/ProfilePage/ProfilePage";
import ResultSurvey from "../Pages/ResultSurvey/ResultSurvey";
import Login from "../Components/Login/Login";
import DashboardPage from "../Components/Admin/DashboardPage";
import SurveyManagementPage from "../Components/Admin/SurveyManagementPage";
import UserManagementPage from "../Components/Admin/UserManagementPage";
import Layout from "../Components/Admin/Layout";
import EntertainmentPage from "../Pages/EntertainmentPage/EntertainmentPage";
import EntertainmentManagement from "../Components/Admin/EntertainmentManagement";
import MentalHealthBlog from "../Pages/BlogPage/BlogPage";

export const routes = [
  {
    path: "/",
    page: HomePage,
    isShowHeader: true,
  },
  {
    path: "/Appointment",
    page: AppointmentPage,
  },
  {
    path: "/Survey",
    page: SurveyPage,
    isShowHeader: true,
  },
  {
    path: "/profile",
    page: ProfilePage,
    isShowHeader: true,
  },
  {
    path: "/result-survey",
    page: ResultSurvey,
    isShowHeader: true,
  },
  {
    path: "/login",
    page: Login,
  },
  {
    path: "/Admin",
    page: Layout,
    isShowHeader: true,
  },
  {
    path: "/AdminDashboard",
    page: DashboardPage,
    isShowHeader: true,
  },
  {
    path: "/EntertainmentManagement",
    page: EntertainmentManagement,
    isShowHeader: true,
  },
  {
    path: "/SurveyManagement",
    page: SurveyManagementPage,
    isShowHeader: true,
  },
  {
    path: "/UserManagementPage",
    page: UserManagementPage,
    isShowHeader: true,
  },
  {
    path: "/entertainment",
    page: EntertainmentPage,
    isShowHeader: true,
  },
  {
    path: "/blog",
    page: MentalHealthBlog,
    isShowHeader: true,
  },
  {
    path: "*",
    page: Notfound,
  },
];
