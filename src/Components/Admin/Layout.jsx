import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useRoutes } from 'react-router-dom';
import DashboardPage from './DashboardPage';
import SurveyManagementPage from './SurveyManagementPage';
import UserManagementPage from './UserManagementPage';

export default function Layout() {
  const routes = useRoutes([
    {
      path: '/',
      element: <DashboardPage />, // Replace with your Dashboard component
    },
    {
      path: '/SurveyManagement',
      element: <SurveyManagementPage />, // Replace with your Survey Management component
    },
    {
      path: '/UserManagementPage',
      element: <UserManagementPage />, // Replace with your User Management component
    },
    // Add more routes as needed
  ]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 p-4 bg-gray-100">
          {routes}
        </main>
      </div>
    </div>
  );
}