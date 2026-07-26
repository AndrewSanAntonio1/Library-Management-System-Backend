import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { History, Calendar, BookOpen } from 'lucide-react'
import { borrowService } from '../services/borrowService'
import { bookService } from '../services/bookService'
import SpaceshipBackground from '../components/SpaceshipBackground'
import Sidebar, { MobileMenuButton } from '../components/Sidebar'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function BorrowHistoryPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [history, setHistory] = useState([])
  
  const headerRef = useRef()
  
  useEffect(() => {
    fetchHistory()
  }, [])
  
  const fetchHistory = async () => {
    try {
      setLoading(true)
      const borrows = await borrowService.getAllBorrowRecords()
      
      const returnedBorrows = Array.isArray(borrows)
        ? borrows.filter(b => b.status === 'RETURNED')
        : []
      
      // Fetch book details
      const historyWithBooks = []
      for (const borrow of returnedBorrows) {
        try {
          const book = await bookService.getBookById(borrow.bookId)
          historyWithBooks.push({ record: borrow, book })
        } catch (err) {
          console.error(`Failed to fetch book ${borrow.bookId}:`, err)
        }
      }
      
      setHistory(historyWithBooks)
    } catch (error) {
      console.error('Error fetching history:', error)
      toast.error('Failed to load borrow history')
      setHistory([])
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
          <p className="text-white text-lg drop-shadow-lg">Loading history...</p>
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
              <History className="text-green-400 flex-shrink-0 drop-shadow-lg" size={32} />
              Borrow History
            </h1>
            <p className="text-blue-200 drop-shadow-lg">
              You've borrowed {history.length} book{history.length !== 1 ? 's' : ''} in total
            </p>
          </div>
          
          {history.length === 0 ? (
            <div className="text-center py-20 glass-dark rounded-2xl p-8 border-2 border-white/20 backdrop-blur-xl">
              <History className="mx-auto text-green-300 mb-4 drop-shadow-lg" size={64} />
              <p className="text-white text-lg drop-shadow-lg">No borrow history</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((item, index) => (
                <div
                  key={item.record.id}
                  className="bg-white rounded-xl p-5 border-2 border-gray-200 hover:border-green-400 transition-all shadow-lg"
                >
                  <div className="flex gap-4">
                    <div className="w-16 h-24 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center border-2 border-green-200 flex-shrink-0 shadow-md">
                      <BookOpen className="text-green-600" size={24} />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-gray-900 font-bold text-lg mb-2">
                        {item.book?.title || 'Book Title'}
                      </h3>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar size={14} />
                          <div>
                            <p className="text-xs text-gray-500">Borrowed</p>
                            <p>{format(new Date(item.record.borrowDate), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar size={14} />
                          <div>
                            <p className="text-xs text-gray-500">Due</p>
                            <p>{format(new Date(item.record.dueDate), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                          <Calendar size={14} />
                          <div>
                            <p className="text-xs text-gray-500">Returned</p>
                            <p>{format(new Date(item.record.returnDate), 'MMM dd, yyyy')}</p>
                          </div>
                        </div>
                      </div>
                      
                      <span className="px-3 py-1 bg-green-100 border border-green-300 text-green-700 text-xs rounded-lg inline-flex items-center gap-1.5 font-medium">
                        <Calendar size={12} />
                        {item.record.status}
                      </span>
                    </div>
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
