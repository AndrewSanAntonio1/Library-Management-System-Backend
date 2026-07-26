import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'

export default function StatCard({ icon: Icon, title, value, subtitle, color = 'blue', delay = 0 }) {
  const cardRef = useRef()
  const valueRef = useRef()
  
  const colors = {
    blue: 'from-blue-500 to-blue-600',
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-green-600',
    red: 'from-red-500 to-red-600',
    orange: 'from-orange-500 to-orange-600',
    pink: 'from-pink-500 to-pink-600',
  }
  
  useEffect(() => {
    const tl = gsap.timeline()
    
    // Entrance animation with bounce
    tl.from(cardRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 30,
      duration: 0.7,
      delay,
      ease: 'back.out(2)',
    })
    
    // Counter animation
    tl.from(valueRef.current, {
      textContent: 0,
      duration: 1.5,
      ease: 'power1.out',
      snap: { textContent: 1 },
      onUpdate: function() {
        const val = Math.ceil(valueRef.current.textContent)
        valueRef.current.textContent = val
      },
    }, '-=0.8')
    
    // Add floating animation on hover
    cardRef.current.addEventListener('mouseenter', () => {
      gsap.to(cardRef.current, {
        y: -8,
        duration: 0.3,
        ease: 'power2.out',
      })
    })
    
    cardRef.current.addEventListener('mouseleave', () => {
      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      })
    })
  }, [delay, value])
  
  return (
    <div
      ref={cardRef}
      className={`
        relative overflow-hidden
        bg-gradient-to-br ${colors[color]} rounded-2xl p-6
        border-2 border-white shadow-2xl
        hover:shadow-3xl
        transition-all duration-300
        group cursor-pointer
      `}
    >
      {/* Decorative Circle */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/20 group-hover:bg-white/30 transition-all duration-300"></div>
      
      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-white text-sm font-bold mb-2 drop-shadow-md">{title}</p>
          <h3
            ref={valueRef}
            className="text-5xl font-bold text-white mb-1 drop-shadow-lg"
          >
            {value}
          </h3>
          {subtitle && (
            <p className="text-white/90 text-xs font-medium drop-shadow-sm">{subtitle}</p>
          )}
        </div>
        
        <div
          className="
            w-16 h-16 rounded-xl bg-white/20 backdrop-blur-sm
            border-2 border-white/50 flex items-center justify-center
            transition-all duration-300
            group-hover:scale-110 group-hover:rotate-12
            shadow-lg group-hover:shadow-2xl text-white
          "
        >
          <Icon size={32} className="group-hover:scale-110 transition-transform drop-shadow-lg" />
        </div>
      </div>
      
      {/* Bottom shine effect */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  )
}
