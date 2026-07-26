import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { DollarSign, AlertCircle, CheckCircle, Calendar } from 'lucide-react'
import { fineService } from '../services/fineService'
import SpaceshipBackground from '../components/SpaceshipBackground'
import Sidebar, { MobileMenuButton } from '../components/Sidebar'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function FinesPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [fines, setFines] = useState([])
  const [totalUnpaid, setTotalUnpaid] = useState(0)
  
  const headerRef = useRef()
  
  useEffect(() => {
    fetchFines()
  }, [])
  
  const fetchFines = async () => {
    try {
      setLoading(true)
      const data = await fineService.getAllFines()
      const finesList = Array.isArray(data) ? data : []
      setFines(finesList)
      
      const unpaid = finesList
        .filter(f => f.status === 'UNPAID')
        .reduce((sum, f) => sum + parseFloat(f.amount || 0), 0)
      setTotalUnpaid(unpaid)
    } catch (error) {
      console.error('Error fetching fines:', error)
      toast.error('Failed to load fines')
      setFines([])
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
          <p className="text-white text-lg drop-shadow-lg">Loading fines...</p>
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
              <DollarSign className="text-red-400 flex-shrink-0 drop-shadow-lg" size={32} />
              My Fines
            </h1>
            <p className="text-blue-200 drop-shadow-lg">
              Total unpaid: <span className="text-red-400 font-bold">₱{totalUnpaid.toFixed(2)}</span>
            </p>
          </div>
          
          {/* Total Summary */}
          {totalUnpaid > 0 && (
            <div className="mb-6 bg-white rounded-xl p-6 border-l-4 border-red-500 shadow-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-gray-900 font-bold mb-2">Outstanding Balance</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    You have unpaid fines totaling ₱{totalUnpaid.toFixed(2)}. 
                    Please settle your fines at the library counter.
                  </p>
                  <button className="px-4 py-2 rounded-lg bg-red-100 border-2 border-red-300 text-red-700 hover:bg-red-200 transition-all text-sm font-medium shadow-md">
                    Pay Now
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {fines.length === 0 ? (
            <div className="text-center py-20 glass-dark rounded-2xl p-8 border-2 border-white/20 backdrop-blur-xl">
              <CheckCircle className="mx-auto text-green-400 mb-4 drop-shadow-lg" size={64} />
              <p className="text-white text-lg drop-shadow-lg">No fines</p>
              <p className="text-blue-200 text-sm drop-shadow-md">You're all clear!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {fines.map((fine, index) => (
                <div
                  key={fine.id}
                  className={`bg-white rounded-xl p-5 border-2 shadow-lg ${
                    fine.status === 'UNPAID' 
                      ? 'border-red-300' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-gray-900 font-bold text-lg">
                          ₱{parseFloat(fine.amount).toFixed(2)}
                        </h3>
                        <span className={`
                          px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5
                          ${fine.status === 'PAID' 
                            ? 'bg-green-100 border border-green-300 text-green-700' 
                            : 'bg-red-100 border border-red-300 text-red-700'
                          }
                        `}>
                          {fine.status === 'PAID' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                          {fine.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{fine.reason || 'Late return fee'}</p>
                      
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} />
                          <span>Created: {format(new Date(fine.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                        {fine.paymentDate && (
                          <div className="flex items-center gap-2 text-green-600">
                            <CheckCircle size={14} />
                            <span>Paid: {format(new Date(fine.paymentDate), 'MMM dd, yyyy')}</span>
                          </div>
                        )}
                      </div>
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
