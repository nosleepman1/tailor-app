import Navbar from './Navbar'

export default function Layout({ children, title, action }) {
  return (
    <div className="min-h-screen bg-dark-950 bg-mesh-pattern">
      <Navbar />

      {/* Content area — offset for sidebar on md+ and bottom nav on mobile */}
      <main className="md:ml-64 pb-24 md:pb-0 min-h-screen">
        {(title || action) && (
          <header className="sticky top-0 z-20 bg-dark-950/80 backdrop-blur-md border-b border-dark-700/30 px-5 py-4">
            <div className="flex items-center justify-between max-w-5xl mx-auto">
              {title && (
                <h1 className="font-display text-lg font-semibold text-white">{title}</h1>
              )}
              {action && <div>{action}</div>}
            </div>
          </header>
        )}

        <div className="max-w-5xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
    </div>
  )
}
