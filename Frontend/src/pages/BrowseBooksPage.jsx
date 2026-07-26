import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { Search, Filter, X, BookOpen } from 'lucide-react'
import { bookService } from '../services/bookService'
import SpaceshipBackground from '../components/SpaceshipBackground'
import Sidebar, { MobileMenuButton } from '../components/Sidebar'
import BookCard from '../components/BookCard'
import Input from '../components/Input'
import toast from 'react-hot-toast'

export default function BrowseBooksPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  const headerRef = useRef()
  const contentRef = useRef()
  
  useEffect(() => {
    fetchBooks()
  }, [])
  
  useEffect(() => {
    if (!loading && contentRef.current) {
      gsap.from(contentRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        stagger: 0.05,
        ease: 'power2.out',
      })
    }
  }, [loading, filteredBooks])
  
  const fetchBooks = async () => {
    try {
      setLoading(true)
      const data = await bookService.getAllBooks()
      setBooks(Array.isArray(data) ? data : [])
      setFilteredBooks(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching books:', error)
      toast.error('Failed to load books')
      setBooks([])
      setFilteredBooks([])
    } finally {
      setLoading(false)
    }
  }
  
  const handleSearch = (value) => {
    setSearchTerm(value)
    if (!value.trim()) {
      setFilteredBooks(books)
      return
    }
    
    const filtered = books.filter(book =>
      book.title?.toLowerCase().includes(value.toLowerCase()) ||
      book.isbn?.toLowerCase().includes(value.toLowerCase()) ||
      book.description?.toLowerCase().includes(value.toLowerCase())
    )
    setFilteredBooks(filtered)
  }
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <SpaceshipBackground />
        <div className="relative z-10 text-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white text-lg drop-shadow-lg">Loading books...</p>
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
          <div ref={headerRef} className="mb-6 sm:mb-8 pt-16 lg:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2 drop-shadow-xl">
                  Browse Books
                </h1>
                <p className="text-blue-200 drop-shadow-lg">
                  Explore our collection of {books.length} books
                </p>
              </div>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="self-start sm:self-auto px-4 py-2 rounded-xl glass-card border-2 border-blue-400/30 text-white hover:border-blue-400 transition-all flex items-center gap-2 backdrop-blur-xl shadow-lg"
              >
                <Filter size={20} />
                Filters
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-300">
                <Search size={20} />
              </div>
              <input
                type="text"
                placeholder="Search by title, ISBN, or description..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-12 pr-12 py-4 glass-card border-2 border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:border-blue-400 transition-all backdrop-blur-xl shadow-lg"
              />
              {searchTerm && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-300 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              )}
            </div>
          </div>
          
          {/* Books Grid */}
          {filteredBooks.length === 0 ? (
            <div className="text-center py-20 glass-dark rounded-2xl p-8 border-2 border-white/20 backdrop-blur-xl">
              <BookOpen className="mx-auto text-blue-300 mb-4 drop-shadow-lg" size={64} />
              <p className="text-white text-lg drop-shadow-lg">
                {searchTerm ? 'No books found matching your search' : 'No books available'}
              </p>
            </div>
          ) : (
            <div ref={contentRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredBooks.map((book, index) => (
                <BookCard
                  key={book.id}
                  book={book}
                  index={index}
                  onClick={() => toast.info('Book details coming soon!')}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
