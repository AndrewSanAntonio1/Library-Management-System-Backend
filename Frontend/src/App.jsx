import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import BrowseBooksPage from './pages/BrowseBooksPage'
import BorrowedBooksPage from './pages/BorrowedBooksPage'
import ReservationsPage from './pages/ReservationsPage'
import FinesPage from './pages/FinesPage'
import BorrowHistoryPage from './pages/BorrowHistoryPage'
import ProfilePage from './pages/ProfilePage'
import LibrarianDashboardPage from './pages/librarian/LibrarianDashboardPage'
import { useAuthStore } from './store/authStore'
import toast from 'react-hot-toast'

// Protected Route Component
function ProtectedRoute({ children, allowedRoles }) {
  const { token, role } = useAuthStore()
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  if (allowedRoles && !allowedRoles.includes(role)) {
    toast.error('Access denied. You do not have permission to access this page.')
    // Redirect to appropriate dashboard based on role
    const redirectPath = role === 'LIBRARIAN' || role === 'ADMIN' ? '/librarian' : '/dashboard'
    return <Navigate to={redirectPath} replace />
  }
  
  return children
}

// Role-based redirect for login
function RoleBasedRedirect() {
  const { token, role } = useAuthStore()
  
  if (!token) {
    return <Navigate to="/login" replace />
  }
  
  const redirectPath = role === 'LIBRARIAN' || role === 'ADMIN' ? '/librarian' : '/dashboard'
  return <Navigate to={redirectPath} replace />
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#1f2937',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Root redirect based on role */}
        <Route path="/" element={<RoleBasedRedirect />} />
        
        {/* Member Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['MEMBER']}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/browse-books"
          element={
            <ProtectedRoute allowedRoles={['MEMBER']}>
              <BrowseBooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrowed-books"
          element={
            <ProtectedRoute allowedRoles={['MEMBER']}>
              <BorrowedBooksPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute allowedRoles={['MEMBER']}>
              <ReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fines"
          element={
            <ProtectedRoute allowedRoles={['MEMBER']}>
              <FinesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/borrow-history"
          element={
            <ProtectedRoute allowedRoles={['MEMBER']}>
              <BorrowHistoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['MEMBER']}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        
        {/* Librarian Routes */}
        <Route
          path="/librarian"
          element={
            <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
              <LibrarianDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/librarian/books"
          element={
            <ProtectedRoute allowedRoles={['LIBRARIAN', 'ADMIN']}>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-900 mb-4">Books Management</h1>
                  <p className="text-gray-600">Coming soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        
        {/* Catch all - redirect to role-based dashboard */}
        <Route path="*" element={<RoleBasedRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
