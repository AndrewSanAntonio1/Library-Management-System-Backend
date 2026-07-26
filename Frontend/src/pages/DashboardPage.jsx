import { useState, useEffect } from 'react'
import { useAuthStore } from '../store/authStore'
import { bookService } from '../services/bookService'
import { borrowService } from '../services/borrowService'
import { fineService } from '../services/fineService'
import SpaceshipBackground from '../components/SpaceshipBackground'
import Sidebar, { MobileMenuButton } from '../components/Sidebar'
import {
  BookMarked,
  BookOpen,
  Calendar,
  TrendingUp,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { format, differenceInDays } from 'date-fns'

// Mock data for when backend is unavailable
const MOCK_BOOKS = [
  {
    id: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Classic Fiction',
    isbn: '978-0-7432-7356-5',
    coverImage: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    availableCopies: 3,
    totalCopies: 5
  },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Classic Literature',
    isbn: '978-0-06-112008-4',
    coverImage: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
    dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    availableCopies: 2,
    totalCopies: 4
  },
  {
    id: 3,
    title: '1984',
    author: 'George Orwell',
    category: 'Dystopian Fiction',
    isbn: '978-0-452-28423-4',
    coverImage: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    dateAdded: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    availableCopies: 0,
    totalCopies: 3
  },
  {
    id: 4,
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    category: 'Romance',
    isbn: '978-0-14-143951-8',
    coverImage: 'https://covers.openlibrary.org/b/id/8235657-L.jpg',
    dateAdded: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    availableCopies: 4,
    totalCopies: 6
  },
  {
    id: 5,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    category: 'Coming-of-age Fiction',
    isbn: '978-0-316-76948-0',
    coverImage: 'https://covers.openlibrary.org/b/id/8235657-L.jpg',
    dateAdded: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    availableCopies: 1,
    totalCopies: 3
  }
]

const MOCK_BORROWED_BOOKS = [
  {
    id: 1,
    bookId: 1,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverImage: 'https://covers.openlibrary.org/b/id/7222246-L.jpg',
    borrowDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'BORROWED'
  },
  {
    id: 2,
    bookId: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverImage: 'https://covers.openlibrary.org/b/id/8228691-L.jpg',
    borrowDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'BORROWED'
  },
  {
    id: 3,
    bookId: 5,
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    coverImage: 'https://covers.openlibrary.org/b/id/8235657-L.jpg',
    borrowDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    dueDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'OVERDUE'
  }
]

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [stats, setStats] = useState({
    currentlyBorrowed: 3,
    totalBorrowed: 15,
    totalReturned: 12,
    activeReservations: 2,
    pendingFines: 150.00
  })
  const [recentBooks, setRecentBooks] = useState(MOCK_BOOKS)
  const [borrowedBooks, setBorrowedBooks] = useState(MOCK_BORROWED_BOOKS)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Try to fetch real data
      const [books, borrows, fines] = await Promise.all([
        bookService.getAllBooks().catch(() => null),
        borrowService.getAllBorrowRecords().catch(() => null),
        fineService.getAllFines().catch(() => null)
      ])

      if (books && Array.isArray(books)) {
        setRecentBooks(books.slice(0, 5))
      }

      if (borrows && Array.isArray(borrows)) {
        const activeBorrows = borrows.filter(b => b.status === 'BORROWED')
        const returned = borrows.filter(b => b.status === 'RETURNED')
        
        setStats(prev => ({
          ...prev,
          currentlyBorrowed: activeBorrows.length,
          totalBorrowed: borrows.length,
          totalReturned: returned.length
        }))
      }

      if (fines && Array.isArray(fines)) {
        const unpaid = fines.filter(f => f.status === 'UNPAID')
        const total = unpaid.reduce((sum, f) => sum + parseFloat(f.amount || 0), 0)
        setStats(prev => ({ ...prev, pendingFines: total }))
      }
    } catch (error) {
      console.log('Using mock data')
    }
  }

  const getStatusBadge = (status, dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const daysRemaining = differenceInDays(due, today)

    if (status === 'OVERDUE' || daysRemaining < 0) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-300 flex items-center gap-1">
          <AlertCircle size={14} />
          Overdue
        </span>
      )
    } else if (daysRemaining <= 3) {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-300 flex items-center gap-1">
          <Clock size={14} />
          Due Soon
        </span>
      )
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-300 flex items-center gap-1">
          <CheckCircle size={14} />
          Borrowed
        </span>
      )
    }
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      <SpaceshipBackground />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileMenuButton onClick={() => setSidebarOpen(true)} />

      <main className="flex-1 relative z-10 overflow-y-auto lg:ml-0">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-20">
          {/* Header */}
          <div className="mb-8 pt-16 lg:pt-6">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="text-blue-600 drop-shadow-lg" size={32} />
              <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-xl">
                Welcome back, {user}!
              </h1>
            </div>
            <p className="text-blue-100 drop-shadow-lg">Here's your library overview</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookMarked className="text-blue-600" size={24} />
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Currently Borrowed</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.currentlyBorrowed}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <BookOpen className="text-indigo-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Borrowed</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalBorrowed}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Total Returned</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.totalReturned}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Calendar className="text-purple-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Active Reservations</h3>
              <p className="text-3xl font-bold text-gray-900">{stats.activeReservations}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <DollarSign className="text-red-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">Pending Fines</h3>
              <p className="text-3xl font-bold text-gray-900">₱{stats.pendingFines.toFixed(2)}</p>
            </div>
          </div>

          {/* Currently Borrowed Books */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <BookMarked className="text-blue-600" size={28} />
                Currently Borrowed Books
                <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                  {borrowedBooks.length}
                </span>
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 text-sm">
                View All
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="space-y-4">
              {borrowedBooks.map((book) => {
                const dueDate = new Date(book.dueDate)
                const daysRemaining = differenceInDays(dueDate, new Date())
                
                return (
                  <div
                    key={book.id}
                    className="flex gap-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all bg-gradient-to-r from-white to-blue-50/30"
                  >
                    <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 flex-shrink-0 shadow-md border border-gray-200 overflow-hidden">
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center"><svg class="text-blue-600" width="32" height="32" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v16h12V4H6zm2 2h8v2H8V6zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg></div>`
                        }}
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{book.title}</h3>
                      <p className="text-gray-600 text-sm mb-3">{book.author}</p>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Calendar size={16} className="text-blue-500" />
                          <span>Borrowed: {format(new Date(book.borrowDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Clock size={16} className="text-purple-500" />
                          <span>Due: {format(dueDate, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 font-semibold">
                          {daysRemaining >= 0 ? (
                            <span className="text-green-600">{daysRemaining} days remaining</span>
                          ) : (
                            <span className="text-red-600">{Math.abs(daysRemaining)} days overdue</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center">
                      {getStatusBadge(book.status, book.dueDate)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Recently Added Books */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="text-purple-600" size={28} />
                Recently Added Books
              </h2>
              <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2 text-sm">
                Browse All
                <ArrowRight size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {recentBooks.map((book) => (
                <div
                  key={book.id}
                  className="group cursor-pointer"
                >
                  <div className="relative mb-4 rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all transform group-hover:scale-105 border-2 border-gray-200 group-hover:border-blue-400">
                    <div className="aspect-[2/3] bg-gradient-to-br from-blue-100 to-indigo-100">
                      <img 
                        src={book.coverImage} 
                        alt={book.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none'
                          e.target.parentElement.innerHTML = `<div class="w-full h-full flex items-center justify-center"><svg class="text-blue-600" width="64" height="64" fill="currentColor" viewBox="0 0 24 24"><path d="M6 2h12a2 2 0 012 2v16a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2zm0 2v16h12V4H6zm2 2h8v2H8V6zm0 4h8v2H8v-2zm0 4h5v2H8v-2z"/></svg></div>`
                        }}
                      />
                    </div>
                    <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-semibold ${
                      book.availableCopies > 0 
                        ? 'bg-green-500 text-white' 
                        : 'bg-red-500 text-white'
                    }`}>
                      {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                    </div>
                  </div>

                  <h3 className="font-bold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {book.title}
                  </h3>
                  <p className="text-gray-600 text-xs mb-2">{book.author}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {book.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {format(new Date(book.dateAdded), 'MMM dd')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
