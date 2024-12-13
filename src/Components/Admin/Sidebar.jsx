import { Link } from "react-router-dom";
import { Home, Users, FileText, BarChart2 } from 'lucide-react'

export function Sidebar() {
  return (
    <div className="bg-blue-600 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <nav>
        <Link href="/" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white">
          <Home className="inline-block mr-2" size={20} />
          Dashboard
        </Link>
        <Link href="/UserManagementPage" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white">
          <Users className="inline-block mr-2" size={20} />
          User Management
        </Link>
        <Link href="/SurveyManagement" className="block py-2.5 px-4 rounded transition duration-200 hover:bg-blue-700 hover:text-white">
          <FileText className="inline-block mr-2" size={20} />
          Survey Management
        </Link>
      </nav>
    </div>
  )
}

