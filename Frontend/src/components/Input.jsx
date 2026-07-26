import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

const Input = forwardRef(({ 
  label, 
  error, 
  icon: Icon, 
  type = 'text',
  className = '',
  helperText,
  ...props 
}, ref) => {
  const [showPassword, setShowPassword] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  const isPassword = type === 'password'
  const inputType = isPassword && showPassword ? 'text' : type
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-semibold text-gray-200 mb-2.5 transition-colors">
          {label}
        </label>
      )}
      
      <div className={`
        relative transition-all duration-300
        ${isFocused ? 'scale-[1.01]' : 'scale-100'}
      `}>
        {Icon && (
          <div className={`
            absolute left-4 top-1/2 -translate-y-1/2 
            transition-colors duration-300
            ${isFocused ? 'text-primary-400' : 'text-gray-400'}
          `}>
            <Icon size={20} />
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={`
            w-full px-4 py-3.5 ${Icon ? 'pl-12' : ''} ${isPassword ? 'pr-12' : ''}
            bg-white/5 backdrop-blur-md
            border-2 ${error ? 'border-red-500' : isFocused ? 'border-primary-500' : 'border-white/10'}
            rounded-xl
            text-white placeholder-gray-400
            focus:outline-none focus:ring-2 
            ${error ? 'focus:ring-red-500/50' : 'focus:ring-primary-500/50'}
            transition-all duration-300
            ${error ? 'animate-shake' : ''}
            hover:border-white/20
          `}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="
              absolute right-4 top-1/2 -translate-y-1/2
              text-gray-400 hover:text-primary-400
              transition-colors duration-200
              focus:outline-none
            "
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5 animate-fade-in">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-2 text-sm text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export default Input
