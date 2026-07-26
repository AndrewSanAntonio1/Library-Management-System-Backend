import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { BookMarked, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'

export default function BorrowedBookCard({ record, book, index = 0 }) {
  const cardRef = useRef()
  
  useEffect(() => {
    gsap.from(cardRef.current, {
      x: -30,
      opacity: 0,
      duration: 0.5,
      delay: index * 0.08,
      ease: 'power2.out',
    })
  }, [index])
  
  const dueDate = new Date(record.dueDate)
  const today = new Date()
  const daysRemaining = differenceInDays(dueDate, today)
  const isOverdue = daysRemaining < 0
  const isDueSoon = daysRemaining <= 3 && daysRemaining >= 0
  
  const statusColor = isOverdue ? 'red' : isDueSoon ? 'orange' : 'green'
  const statusText = isOverdue 
    ? `Overdue by ${Math.abs(daysRemaining)} days` 
    : isDueSoon 
    ? `Due in ${daysRemaining} days`
    : 'On time'
  
  return (
    <div
      ref={cardRef}
      className="
        relative overflow-hidden
        bg-white rounded-xl p-5 border-2 border-gray-200
        hover:border-blue-500 hover:shadow-2xl
        transition-all duration-300 group
      "
    >
      {/* Gradient shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -translate-x-full group-hover:translate-x-full" style={{ transition: 'all 0.7s ease' }}></div>
      
      <div className="relative z-10 flex gap-4">
        {/* Enhanced Book Icon */}
        <div className="relative flex-shrink-0">
          <div className="w-20 h-28 rounded-lg bg-gradient-to-br from-blue-100 via-purple-100 to-blue-100 flex items-center justify-center border-2 border-gray-200 group-hover:border-blue-400 transition-all shadow-md group-hover:shadow-xl">
            <BookMarked className="text-blue-600 group-hover:scale-110 transition-transform" size={32} />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-md">
            {index + 1}
          </div>
        </div>
        
        {/* Book Details */}
        <div className="flex-1 space-y-3">
          <div>
            <h3 className="text-gray-900 font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
              {book?.title || 'Book Title'}
            </h3>
            <p className="text-gray-600 text-sm">
              ISBN: {book?.isbn || 'N/A'}
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
              <Calendar size={16} className="text-blue-500" />
              <span className="font-medium">Borrowed:</span>
              <span>{format(new Date(record.borrowDate), 'MMM dd, yyyy')}</span>
            </div>
            
            <div className="flex items-center gap-2 text-gray-700 text-sm group-hover:text-gray-900 transition-colors">
              <Clock size={16} className="text-purple-500" />
              <span className="font-medium">Due:</span>
              <span>{format(dueDate, 'MMM dd, yyyy')}</span>
            </div>
          </div>
          
          {/* Enhanced Status Badge */}
          <div className="flex items-center gap-2 flex-wrap">
            {isOverdue ? (
              <span className="px-3 py-1.5 bg-red-100 border-2 border-red-300 text-red-700 text-xs rounded-lg flex items-center gap-2 font-bold shadow-sm">
                <AlertCircle size={14} className="animate-pulse" />
                {statusText}
              </span>
            ) : isDueSoon ? (
              <span className="px-3 py-1.5 bg-orange-100 border-2 border-orange-300 text-orange-700 text-xs rounded-lg flex items-center gap-2 font-bold shadow-sm">
                <AlertCircle size={14} className="animate-bounce" />
                {statusText}
              </span>
            ) : (
              <span className="px-3 py-1.5 bg-green-100 border-2 border-green-300 text-green-700 text-xs rounded-lg flex items-center gap-2 font-bold shadow-sm">
                <CheckCircle size={14} />
                {statusText}
              </span>
            )}
            
            <span className={`
              px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm
              ${record.status === 'BORROWED' 
                ? 'bg-gradient-to-r from-blue-100 to-blue-200 border-2 border-blue-300 text-blue-700' 
                : 'bg-gradient-to-r from-gray-100 to-gray-200 border-2 border-gray-300 text-gray-700'
              }
            `}>
              {record.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
