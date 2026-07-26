import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { BookMarked, AlertCircle } from 'lucide-react'
import { borrowService } from '../services/borrowService'
import { bookService } from '../services/bookService'
import SpaceshipBackground from '../components/SpaceshipBackground'
import Sidebar, { MobileMenuButton } from '../components/Sidebar'
import BorrowedBookCard from '../components/BorrowedBookCard'
import toast from 'react-hot-toast'

export default function BorrowedBooksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [borrowedBooks, setBorrowedBooks] = useState([])
  
  const headerRef = useRef()
  const contentRef = useRef()
  
  useEffect(() => {
    fetchBorrowedBooks()
  }, [])
  
  useEffect(() => {
    if (!loading && headerRef.current) {
      gsap.from(headerRef.current, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    }
  }, [loading])
  
  const fetchBorrowedBooks = async () => {
    try {
      setLoading(true)
      const borrows = await borrowService.getAllBorrowRecords()
      
      const activeBorrows = Array.isArray(borrows) 
        ? borrows.filter(b => b.status === 'BORROWED')
        : []
      
      // Fetch book details for each borrow
      const borrowedWithBooks = []
      for (const borrow of activeBorrows) {
        try {
          const book = await bookService.getBookById(borrow.bookId)
          borrowedWithBooks.push({ record: borrow, book })
        } catch (err) {
          console.error(`Failed to fetch book ${borrow.bookId}:`, err)
        }
      }
      
      setBorrowedBooks(borrowedWithBooks)
    } catch (error) {
      console.error('Error fetching borrowed books:', error)
      toast.error('Failed to load borrowed books')
      setBorrowedBooks([])
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
          <p className="text-white text-lg drop-shadow-lg">Loading borrowed books...</p>
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
          {/* Header */}
          <div ref={headerRef} className="mb-6 sm:mb-8 pt-16 lg:pt-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 flex items-center gap-3 drop-shadow-xl">
              <BookMarked className="text-blue-400 flex-shrink-0 drop-shadow-lg" size={32} />
              Borrowed Books
            </h1>
            <p className="text-blue-200 drop-shadow-lg">
              You currently have {borrowedBooks.length} borrowed book{borrowedBooks.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          {/* Borrowed Books List */}
          {borrowedBooks.length === 0 ? (
            <div className="text-center py-20 glass-dark rounded-2xl p-8 border-2 border-white/20 backdrop-blur-xl">
              <BookMarked className="mx-auto text-blue-300 mb-4 drop-shadow-lg" size={64} />
              <p className="text-white text-lg mb-2 drop-shadow-lg">No borrowed books</p>
              <p className="text-blue-200 text-sm drop-shadow-md">Browse our collection to borrow books</p>
            </div>
          ) : (
            <div ref={contentRef} className="space-y-4">
              {borrowedBooks.map((item, index) => (
                <BorrowedBookCard
                  key={item.record.id}
                  record={item.record}
                  book={item.book}
                  index={index}
                />
              ))}
            </div>
          )}
          
          {/* Return Instructions */}
          {borrowedBooks.length > 0 && (
            <div className="mt-8 bg-white rounded-xl p-6 border-2 border-blue-300 shadow-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="text-gray-900 font-semibold mb-2">Return Instructions</h3>
                  <p className="text-gray-600 text-sm">
                    Please return books before the due date to avoid late fees. 
                    Visit the library during operating hours to return your books.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
