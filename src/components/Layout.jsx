import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import DemoBanner from './DemoBanner'

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="flex min-h-screen">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(c => !c)} />
      <div className="flex-1 flex flex-col min-w-0">
        <DemoBanner />
        <Navbar onToggleSidebar={() => setCollapsed(c => !c)} />
        <main className="flex-1 p-6 animate-fade-in">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
