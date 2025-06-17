import React, { useState } from "react"
import Header from "./Header"
import Sidebar from "./Sidebar"
import Dashboard from "../../pages/Dashboard"

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [currentPage, setCurrentPage] = useState("dashboard")

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />
      default:
        return (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {currentPage.charAt(0).toUpperCase() + currentPage.slice(1)}
              </h2>
              <p className="text-muted-foreground">This page is under development</p>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-0"
        } transition-all duration-300 ease-in-out overflow-hidden border-r bg-white border-border shadow-sm`}
      >
        <Sidebar
          isOpen={sidebarOpen}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </aside>

      {/* Main Area */}
      <div className="flex flex-1 flex-col min-w-0">
        <Header onToggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />

        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-full">{renderCurrentPage()}</div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
    </div>
  )
}

export default Layout
