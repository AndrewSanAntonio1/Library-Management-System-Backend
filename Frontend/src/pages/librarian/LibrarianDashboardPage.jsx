import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import {
  BookOpen,
  Users,
  BookMarked,
  Calendar,
  DollarSign,
  TrendingUp,
  UserPlus,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react'
import { bookService } from '../../services/bookService'
import { borrowService } from '../../services/borrowService'
import { memberService } from '../../services/memberService'
import { reservationService } from '../../services/reservationService'
import { fineService } from '../../services/fineService'
import SpaceshipBackground from '../../components/SpaceshipBackground'
import Sidebar, { MobileMenuButton } from '../../components/Sidebar'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function LibrarianDashboardPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    totalMembers: 0,
    activeReservations: 0,
    unpaidFines: 0,
  })
  const [recentActivity, setRecentActivity] = useState({
    recentBorrows: [],
    recentReturns: [],
    newMembers: [],
  })

  const headerRef = useRef()
  const statsRef = useRef()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  useEffect(() => {
    if (!loading && headerRef.current && statsRef.current) {
      gsap.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })

      gsap.from(statsRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        delay: 0.3,
        ease: 'power2.out',
      })
    }
  }, [loading])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)

      const [books, borrows, members, reservations, fines] = await Promise.all([
        bookService.getAllBooks().catch(() => []),
        borrowService.getAllBorrowRecords().catch(() => []),
        memberService.getAllMembers().catch(() => []),
        reservationService.getAllReservations().catch(() => []),
        fineService.getAllFines().catch(() => []),
      ])

      // Calculate stats
      const totalBooks = Array.isArray(books) ? books.length : 0
      const availableBooks = Array.isArray(books)
        ? books.filter((b) => b.availableCopies > 0).length
        : 0
      const borrowedBooks = Array.isArray(borrows)
        ? borrows.filter((b) => b.status === 'BORROWED').length
        : 0
      const totalMembers = Array.isArray(members) ? members.length : 0
      const activeReservations = Array.isArray(reservations)
        ? reservations.filter((r) => r.status === 'ACTIVE').length
        : 0
      const unpaidFines = Array.isArray(fines)
        ? fines
            .filter((f) => f.status === 'UNPAID')
            .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0)
        : 0

      setStats({
        totalBooks,
        availableBooks,
        borrowedBooks,
        totalMembers,
        activeReservations,
        unpaidFines,
      })

      // Recent activity
      const sortedBorrows = Array.isArray(borrows)
        ? [...borrows].sort(
            (a, b) => new Date(b.borrowDate) - new Date(a.borrowDate)
          )
        : []

      const recentBorrows = sortedBorrows
        .filter((b) => b.status === 'BORROWED')
        .slice(0, 5)
      const recentReturns = sortedBorrows
        .filter((b) => b.status === 'RETURNED')
        .slice(0, 5)

      const newMembers = Array.isArray(members)
        ? [...members]
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5)
        : []

      setRecentActivity({
        recentBorrows,
        recentReturns,
        newMembers,
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpaceshipBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg drop-shadow-lg">
            Loading dashboard...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex overflow-hidden">
      <SpaceshipBackground />
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <MobileMenuButton onClick={() => setSidebarOpen(true)} />

      <main className="flex-1 relative z-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 pb-20">
          {/* Header */}
          <div ref={headerRef} className="mb-8 pt-16 lg:pt-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2 drop-shadow-xl">
              Librarian Dashboard
            </h1>
            <p className="text-blue-200 drop-shadow-lg">
              Overview of library operations
            </p>
          </div>

          {/* Stats Cards */}
          <div
            ref={statsRef}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8"
          >
            {/* Total Books */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <TrendingUp className="text-green-500" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                Total Books
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalBooks}
              </p>
            </div>

            {/* Available Books */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                  <BookOpen className="text-green-600" size={24} />
                </div>
                <ArrowUpRight className="text-green-500" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                Available
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats.availableBooks}
              </p>
            </div>

            {/* Borrowed Books */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-orange-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                  <BookMarked className="text-orange-600" size={24} />
                </div>
                <ArrowDownRight className="text-orange-500" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                Borrowed
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats.borrowedBooks}
              </p>
            </div>

            {/* Total Members */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                  <Users className="text-purple-600" size={24} />
                </div>
                <UserPlus className="text-purple-500" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                Total Members
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalMembers}
              </p>
            </div>

            {/* Active Reservations */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-indigo-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Calendar className="text-indigo-600" size={24} />
                </div>
                <Clock className="text-indigo-500" size={20} />
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                Reservations
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                {stats.activeReservations}
              </p>
            </div>

            {/* Unpaid Fines */}
            <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                  <DollarSign className="text-red-600" size={24} />
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">
                Unpaid Fines
              </h3>
              <p className="text-3xl font-bold text-gray-900">
                ₱{stats.unpaidFines.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recently Borrowed */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookMarked className="text-blue-600" size={20} />
                Recently Borrowed
              </h3>
              <div className="space-y-3">
                {recentActivity.recentBorrows.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No recent borrows
                  </p>
                ) : (
                  recentActivity.recentBorrows.map((borrow) => (
                    <div
                      key={borrow.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 border border-blue-200"
                    >
                      <BookOpen className="text-blue-600 mt-1" size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Book ID: {borrow.bookId}
                        </p>
                        <p className="text-xs text-gray-600">
                          {format(new Date(borrow.borrowDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Recently Returned */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="text-green-600" size={20} />
                Recently Returned
              </h3>
              <div className="space-y-3">
                {recentActivity.recentReturns.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No recent returns
                  </p>
                ) : (
                  recentActivity.recentReturns.map((borrow) => (
                    <div
                      key={borrow.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-green-50 border border-green-200"
                    >
                      <BookOpen className="text-green-600 mt-1" size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Book ID: {borrow.bookId}
                        </p>
                        <p className="text-xs text-gray-600">
                          {format(new Date(borrow.returnDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* New Members */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserPlus className="text-purple-600" size={20} />
                New Members
              </h3>
              <div className="space-y-3">
                {recentActivity.newMembers.length === 0 ? (
                  <p className="text-gray-500 text-sm text-center py-4">
                    No new members
                  </p>
                ) : (
                  recentActivity.newMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200"
                    >
                      <Users className="text-purple-600 mt-1" size={16} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.firstname} {member.lastname}
                        </p>
                        <p className="text-xs text-gray-600 truncate">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
