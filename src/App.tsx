import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { NotificationBanner } from './components/ui/NotificationBanner';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { Deposit } from './pages/Deposit';
import { Withdraw } from './pages/Withdraw';
import { Investment } from './pages/Investment';
import { Profile } from './pages/Profile';
import { Tasks } from './pages/Tasks';
import { History } from './pages/History';
import { Team } from './pages/Team';
import { BuyPoints } from './pages/BuyPoints';
import { ExchangePoints } from './pages/ExchangePoints';
import { FAQ } from './pages/FAQ';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006B76]"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NotificationBanner />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        <main className="flex-1 lg:ml-64 p-6 pb-20 lg:pb-6">
          {children}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <NotificationProvider>
            <AppLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/deposit" 
                  element={
                    <ProtectedRoute>
                      <Deposit />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/withdraw" 
                  element={
                    <ProtectedRoute>
                      <Withdraw />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/invest" 
                  element={
                    <ProtectedRoute>
                      <Investment />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/tasks" 
                  element={
                    <ProtectedRoute>
                      <Tasks />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/team" 
                  element={
                    <ProtectedRoute>
                      <Team />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/history" 
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/buy-points" 
                  element={
                    <ProtectedRoute>
                      <BuyPoints />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/exchange-points" 
                  element={
                    <ProtectedRoute>
                      <ExchangePoints />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/faq" 
                  element={
                    <ProtectedRoute>
                      <FAQ />
                    </ProtectedRoute>
                  } 
                />
                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </AppLayout>
          </NotificationProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
            }}
          />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;