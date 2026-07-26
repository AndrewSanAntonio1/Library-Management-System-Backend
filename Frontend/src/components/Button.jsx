import { Loader2 } from 'lucide-react'

export default function Button({ 
  children, 
  loading = false, 
  variant = 'primary', 
  icon: Icon,
  className = '',
  disabled = false,
  ...props 
}) {
  const baseStyles = `
    w-full px-6 py-3.5 rounded-xl font-semibold 
    transition-all duration-300 ease-out
    flex items-center justify-center gap-2.5
    disabled:opacity-50 disabled:cursor-not-allowed
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    relative overflow-hidden group
  `
  
  const variants = {
    primary: `
      bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 
      hover:from-primary-600 hover:via-primary-700 hover:to-primary-800 
      text-white shadow-xl shadow-primary-500/40 
      hover:shadow-2xl hover:shadow-primary-600/60
      hover:scale-[1.02] active:scale-[0.98]
      focus:ring-primary-500
      before:absolute before:inset-0 before:bg-gradient-to-r 
      before:from-transparent before:via-white/20 before:to-transparent
      before:translate-x-[-200%] hover:before:translate-x-[200%]
      before:transition-transform before:duration-700
    `,
    secondary: `
      bg-white/10 hover:bg-white/20 
      text-white border-2 border-white/20 
      backdrop-blur-md hover:border-white/30
      hover:scale-[1.02] active:scale-[0.98]
      focus:ring-white/50
    `,
    outline: `
      border-2 border-primary-500 
      text-primary-400 hover:text-white
      hover:bg-primary-500/20 hover:border-primary-400
      hover:scale-[1.02] active:scale-[0.98]
      focus:ring-primary-500
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 
      hover:from-red-600 hover:to-red-700 
      text-white shadow-xl shadow-red-500/40 
      hover:shadow-2xl hover:shadow-red-600/60
      hover:scale-[1.02] active:scale-[0.98]
      focus:ring-red-500
    `,
  }
  
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Loading...</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={20} className="transition-transform group-hover:scale-110" />}
          <span>{children}</span>
        </>
      )}
    </button>
  )
}
