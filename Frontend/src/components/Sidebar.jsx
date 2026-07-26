import { useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import {
  LayoutDashboard,
  BookOpen,
  BookMarked,
  Bookmark,
  DollarSign,
  History,
  User,
  LogOut,
  Menu,
  X,
  BookOpenCheck,
  Users,
  Calendar,
  Tag,
  Building,
  FileText,
} from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

// Member navigation items
const memberMenuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/browse-books', icon: BookOpen, label: 'Browse Books' },
  { path: '/borrowed-books', icon: BookMarked, label: 'Borrowed Books' },
  { path: '/reservations', icon: Bookmark, label: 'Reservations' },
  { path: '/fines', icon: DollarSign, label: 'Fines' },
  { path: '/borrow-history', icon: History, label: 'Borrow History' },
  { path: '/profile', icon: User, label: 'Profile' },
]

// Librarian/Admin navigation items
const librarianMenuItems = [
  { path: '/librarian', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/librarian/books', icon: BookOpen, label: 'Books' },
  { path: '/librarian/authors', icon: FileText, label: 'Authors' },
  { path: '/librarian/categories', icon: Tag, label: 'Categories' },
  { path: '/librarian/publishers', icon: Building, label: 'Publishers' },
  { path: '/librarian/members', icon: Users, label: 'Members' },
  { path: '/librarian/borrow-records', icon: BookMarked, label: 'Borrow Records' },
  { path: '/librarian/reservations', icon: Calendar, label: 'Reservations' },
  { path: '/librarian/fines', icon: DollarSign, label: 'Fines' },
  { path: '/librarian/profile', icon: User, label: 'Profile' },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const navigate = useNavigate()
  const sidebarRef = useRef()
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const refreshToken = useAuthStore((state) => state.refreshToken)
  const user = useAuthStore((state) => state.user)
  const role = useAuthStore((state) => state.role)
  
  // Determine which menu items to show based on role
  const menuItems = role === 'LIBRARIAN' || role === 'ADMIN' 
    ? librarianMenuItems 
    : memberMenuItems
  
  const roleLabel = role === 'LIBRARIAN' ? 'Librarian' : role === 'ADMIN' ? 'Admin' : 'Member'
  
  useEffect(() => {
    if (isOpen && sidebarRef.current) {
      gsap.from(sidebarRef.current.querySelectorAll('.menu-item'), {
        x: -30,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
      })
    }
  }, [isOpen])
  
  const handleLogout = async () => {
    try {
      await authService.logout(refreshToken)
      clearAuth()
      toast.success('Logged out successfully')
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      clearAuth()
      navigate('/login')
    }
  }
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-screen w-64 
          sidebar-solid border-r-2 border-gray-700
          transform transition-transform duration-300 ease-out
          z-50 flex flex-col
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/30 to-purple-500/30 flex items-center justify-center border border-blue-400/30 backdrop-blur-sm">
                <BookOpenCheck className="text-blue-400 drop-shadow-lg" size={24} />
              </div>
              <div>
                <h2 className="text-white font-bold text-lg drop-shadow-lg">Library</h2>
                <p className="text-blue-200 text-xs">Management</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close menu"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* User Info */}
          <div className="mt-4 p-3 rounded-lg glass-card border border-white/10 backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
                role === 'LIBRARIAN' || role === 'ADMIN' 
                  ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
                  : 'bg-gradient-to-br from-blue-500 to-purple-600'
              }`}>
                <span className="text-white font-bold text-sm drop-shadow-md">
                  {user?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium text-sm truncate drop-shadow-md">{user}</p>
                <p className="text-blue-200 text-xs">{roleLabel}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 scrollbar-thin">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => onClose()}
                className={`
                  menu-item flex items-center gap-3 px-4 py-3 rounded-xl
                  transition-all duration-200
                  ${
                    isActive
                      ? 'glass-card border-2 border-blue-400/50 text-blue-300 shadow-lg backdrop-blur-xl'
                      : 'text-gray-300 hover:glass-card hover:text-white hover:border hover:border-white/20'
                  }
                `}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        {/* Logout Button */}
        <div className="p-4 border-t border-white/10 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="
              w-full flex items-center gap-3 px-4 py-3 rounded-xl
              text-red-400 hover:glass-card hover:text-red-300
              transition-all duration-200 border border-transparent
              hover:border-red-500/30 backdrop-blur-xl
            "
          >
            <LogOut size={20} className="flex-shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export function MobileMenuButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        lg:hidden fixed top-4 left-4 z-30
        w-12 h-12 rounded-xl
        glass-card border-2 border-blue-400/30
        flex items-center justify-center
        text-white hover:text-blue-300
        transition-all duration-200
        shadow-lg hover:shadow-2xl hover:scale-105
        backdrop-blur-xl
      "
      aria-label="Open menu"
    >
      <Menu size={24} />
    </button>
  )
}
