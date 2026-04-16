import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import './App.css'
import Instruction_profile from './Pages/instruction_profile'
import Course_video_content from './Pages/course_video_content'
import CourseManagement from './Pages/courseManagement'
import Login from './Pages/login'
import NotFound from './Pages/notFound'
import Dashboard from './Pages/dashboard'
import Sidebar from './Components/ui/sidebar'
import Navbar from './Components/ui/navbar'
import { AuthProvider } from './Context/AuthContext'
import { useState } from 'react'

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className='min-h-screen bg-[#0A0914] text-slate-200'>
      {/* Mobile + Tablet + Desktop Layout */}
      <div className='flex h-screen flex-col md:flex-row'>
        {/* Sidebar */}
        <div className={`fixed md:relative z-40 md:z-0 h-full md:h-auto transition-all duration-300 ${
          sidebarOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:translate-x-0'
        } md:w-64 border-r border-white/10 bg-[#0A0914]`}>
          <Sidebar onClose={() => setSidebarOpen(false)} />
        </div>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className='fixed inset-0 z-30 md:hidden bg-black/50' 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className='flex-1 flex flex-col overflow-hidden'>
          <Navbar onSidebarToggle={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <Dashboard /> },
        { path: 'dashboard', element: <Dashboard /> },
        { path: 'instruction_profile', element: <Instruction_profile /> },
        { path: 'course-video-content', element: <Course_video_content /> },
        { path: 'course-management', element: <CourseManagement /> },
      ]
    },
    { path: '/login', element: <Login /> },
    { path: '*', element: <NotFound /> }
  ])

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  )
}

export default App
