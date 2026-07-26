import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { BookOpen, User, Calendar, CheckCircle, XCircle } from 'lucide-react'

export default function BookCard({ book, onClick, index = 0 }) {
  const cardRef = useRef()
  
  useEffect(() => {
    gsap.from(cardRef.current, {
      scale: 0.9,
      opacity: 0,
      y: 30,
      duration: 0.5,
      delay: index * 0.05,
      ease: 'back.out(1.5)',
    })
  }, [index])
  
  const isAvailable = book.availableCopies > 0
  
  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className="
        relative overflow-hidden
        bg-white rounded-xl p-5 border-2 border-gray-200
        hover:border-blue-500 hover:shadow-2xl
        transition-all duration-300 cursor-pointer
        hover:-translate-y-2 group
      "
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative z-10">
        {/* Enhanced Book Cover */}
        <div className="relative mb-4 h-48 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center border-2 border-gray-200 group-hover:border-blue-400 transition-all shadow-md">
          <BookOpen className="text-blue-600 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" size={64} />
          
          {/* Availability Badge with Animation */}
          <div className="absolute top-2 right-2">
            {isAvailable ? (
              <span className="px-2 py-1 bg-green-500 border-2 border-green-600 text-white text-xs rounded-lg flex items-center gap-1 font-bold shadow-lg">
                <CheckCircle size={12} />
                Available
              </span>
            ) : (
              <span className="px-2 py-1 bg-red-500 border-2 border-red-600 text-white text-xs rounded-lg flex items-center gap-1 font-bold shadow-lg">
                <XCircle size={12} />
                Unavailable
              </span>
            )}
          </div>
          
          {/* Shimmer effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
        </div>
      
        {/* Enhanced Book Info */}
        <div className="space-y-2">
          <h3 className="text-gray-900 font-bold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors min-h-[3.5rem]">
            {book.title}
          </h3>
          
          <p className="text-gray-700 text-sm line-clamp-2 min-h-[2.5rem] group-hover:text-gray-900 transition-colors">
            {book.description || 'No description available'}
          </p>
          
          <div className="flex items-center gap-2 text-gray-600 text-sm pt-2">
            <Calendar size={14} className="text-blue-500" />
            <span className="font-medium">{book.publicationYear}</span>
          </div>
          
          <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200 group-hover:border-blue-300 transition-colors">
            <span className="text-gray-600 text-xs font-medium">ISBN: {book.isbn}</span>
            <span className={`
              font-bold text-sm px-2 py-1 rounded-lg
              ${isAvailable 
                ? 'text-white bg-green-500 border border-green-600 shadow-md' 
                : 'text-white bg-red-500 border border-red-600 shadow-md'
              }
            `}>
              {book.availableCopies}/{book.totalCopies}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
