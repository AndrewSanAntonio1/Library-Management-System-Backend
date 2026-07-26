import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Bookmark, Calendar, XCircle } from 'lucide-react'
import { reservationService } from '../services/reservationService'
import { bookService } from '../services/bookService'
import SpaceshipBackground from '../components/SpaceshipBackground'
import Sidebar, { MobileMenuButton } from '../components/Sidebar'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function ReservationsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [reservations, setReservations] = useState([])
  
  const headerRef = useRef()
  
  useEffect(() => {
    fetchReservations()
  }, [])
  
  const fetchReservations = async () => {
    try {
      setLoading(true)
      const data = await reservationService.getAllReservations()
      
      const activeReservations = Array.isArray(data)
        ? data.filter(r => r.status === 'ACTIVE')
        : []
      
      // Fetch book details
      const reservationsWithBooks = []
      for (const reservation of activeReservations) {
        try {
          const book = await bookService.getBookById(reservation.bookId)
          reservationsWithBooks.push({ ...reservation, book })
        } catch (err) {
          console.error(`Failed to fetch book ${reservation.bookId}:`, err)
        }
      }
      
      setReservations(reservationsWithBooks)
    } catch (error) {
      console.error('Error fetching reservations:', error)
      toast.error('Failed to load reservations')
      setReservations([])
    } finally {
      setLoading(false)
    }
  }
  
  const handleCancelReservation = async (id) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return
    
    try {
      await reservationService.cancelReservation(id)
      toast.success('Reservation cancelled successfully')
      fetchReservations()
    } catch (error) {
      toast.error('Failed to cancel reservation')
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpaceshipBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg drop-shadow-lg">Loading reservations...</p>
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
        <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 pb-20">
          <div ref={headerRef} className="mb-6 sm:mb-8 pt-16 lg:pt-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3 drop-shadow-xl">
              <Bookmark className="text-purple-400 flex-shrink-0 drop-shadow-lg" size={32} />
              My Reservations
            </h1>
            <p className="text-blue-200 drop-shadow-lg">
              You have {reservations.length} active reservation{reservations.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {reservations.length === 0 ? (
            <div className="text-center py-20 glass-dark rounded-2xl p-8 border-2 border-white/20 backdrop-blur-xl">
              <Bookmark className="mx-auto text-purple-300 mb-4 drop-shadow-lg" size={64} />
              <p className="text-white text-lg drop-shadow-lg">No active reservations</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reservations.map((reservation, index) => (
                <div
                  key={reservation.id}
                  className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-purple-400 transition-all shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-2 border-purple-200 flex-shrink-0 shadow-md">
                      <Bookmark className="text-purple-600" size={32} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-lg mb-2">
                        {reservation.book?.title || 'Book Title'}
                      </h3>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar size={16} />
                          <span>Reserved: {format(new Date(reservation.reservationDate), 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar size={16} />
                          <span>Expires: {format(new Date(reservation.expiryDate), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-purple-100 border border-purple-300 text-purple-700 text-xs rounded-lg font-medium">
                          {reservation.status}
                        </span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleCancelReservation(reservation.id)}
                      className="self-start px-4 py-2 rounded-lg bg-red-100 border-2 border-red-300 text-red-700 hover:bg-red-200 transition-all flex items-center gap-2 font-medium shadow-md"
                    >
                      <XCircle size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
