import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { gsap } from 'gsap'
import toast from 'react-hot-toast'
import { Mail, Lock, User, Phone, UserPlus, BookOpen, ArrowLeft, CheckCircle2, Shield } from 'lucide-react'
import SpaceshipBackground from '../components/SpaceshipBackground'
import Input from '../components/Input'
import Button from '../components/Button'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export default function RegisterPage() {
  const navigate = useNavigate()
  const token = useAuthStore((state) => state.token)
  const [loading, setLoading] = useState(false)
  
  const containerRef = useRef()
  const formRef = useRef()
  const titleRef = useRef()
  const iconRef = useRef()
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  // Redirect if already logged in
  useEffect(() => {
    if (token) {
      navigate('/dashboard', { replace: true })
    }
  }, [token, navigate])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate icon with bounce
      gsap.from(iconRef.current, {
        scale: 0,
        rotation: 180,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(2)',
      })
      
      // Animate title elements
      gsap.from(titleRef.current.children, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.3,
        ease: 'power3.out',
      })
      
      // Animate form container
      gsap.from(formRef.current, {
        scale: 0.95,
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.5,
        ease: 'power3.out',
      })
      
      // Animate form elements with stagger
      gsap.from(formRef.current.querySelectorAll('.form-element'), {
        x: -20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.08,
        delay: 0.8,
        ease: 'power2.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      // Remove confirmPassword, terms, and role before sending (backend doesn't accept role)
      const { confirmPassword, terms, role, ...registerData } = data
      
      const response = await authService.register(registerData)
      
      toast.success(
        (t) => (
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-green-500 mt-0.5" size={20} />
            <div>
              <p className="font-semibold">Account created successfully!</p>
              <p className="text-sm text-gray-300 mt-1">
                Welcome, {response.username}! Please sign in to continue.
              </p>
            </div>
          </div>
        ),
        { duration: 4000 }
      )
      
      // Smooth exit animation
      const tl = gsap.timeline({
        onComplete: () => navigate('/login', { replace: true }),
      })
      
      tl.to(formRef.current, {
        scale: 0.95,
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
      })
      
    } catch (error) {
      console.error('Registration error:', error)
      
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        'Registration failed. Please try again.'
      
      toast.error(errorMessage, {
        duration: 5000,
        icon: '❌',
      })
      
      // Enhanced shake animation on error
      gsap.timeline()
        .to(formRef.current, {
          x: -15,
          duration: 0.1,
        })
        .to(formRef.current, {
          x: 15,
          duration: 0.1,
        })
        .to(formRef.current, {
          x: -10,
          duration: 0.1,
        })
        .to(formRef.current, {
          x: 10,
          duration: 0.1,
        })
        .to(formRef.current, {
          x: 0,
          duration: 0.1,
        })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div 
      ref={containerRef} 
      className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden"
    >
      <SpaceshipBackground />
      
      {/* Main Content */}
      <div className="w-full max-w-2xl relative z-10">
        {/* Back Button */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Login</span>
        </Link>

        {/* Header */}
        <div ref={titleRef} className="text-center mb-10">
          <div 
            ref={iconRef}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-500/20 backdrop-blur-md border border-primary-500/30 mb-6 shadow-lg shadow-primary-500/20"
          >
            <BookOpen className="text-primary-400" size={40} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Create Account
          </h1>
          <p className="text-gray-400 text-lg">
            Join our library management system today
          </p>
        </div>

        {/* Form */}
        <div ref={formRef} className="glass-card rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Username */}
            <div className="form-element">
              <Input
                label="Username"
                type="text"
                icon={User}
                placeholder="Choose a unique username"
                error={errors.username?.message}
                helperText="This will be your display name"
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Username can only contain letters, numbers, and underscores',
                  },
                })}
              />
            </div>

            {/* Email */}
            <div className="form-element">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="your.email@example.com"
                error={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
            </div>

            {/* Role Selection */}
            <div className="form-element">
              <label className="block text-sm font-semibold text-gray-200 mb-2.5">
                Account Type
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className={`
                  relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${watch('role') === 'MEMBER' 
                    ? 'border-primary-500 bg-primary-500/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                  }
                `}>
                  <input
                    type="radio"
                    value="MEMBER"
                    className="sr-only"
                    {...register('role', { required: 'Please select an account type' })}
                  />
                  <User className={watch('role') === 'MEMBER' ? 'text-primary-400' : 'text-gray-400'} size={24} />
                  <div className="flex-1">
                    <p className={`font-semibold ${watch('role') === 'MEMBER' ? 'text-primary-400' : 'text-white'}`}>
                      Member
                    </p>
                    <p className="text-xs text-gray-400">Regular user</p>
                  </div>
                </label>

                <label className={`
                  relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${watch('role') === 'LIBRARIAN' 
                    ? 'border-purple-500 bg-purple-500/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                  }
                `}>
                  <input
                    type="radio"
                    value="LIBRARIAN"
                    className="sr-only"
                    {...register('role')}
                  />
                  <BookOpen className={watch('role') === 'LIBRARIAN' ? 'text-purple-400' : 'text-gray-400'} size={24} />
                  <div className="flex-1">
                    <p className={`font-semibold ${watch('role') === 'LIBRARIAN' ? 'text-purple-400' : 'text-white'}`}>
                      Librarian
                    </p>
                    <p className="text-xs text-gray-400">Staff access</p>
                  </div>
                </label>

                <label className={`
                  relative flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all
                  ${watch('role') === 'ADMIN' 
                    ? 'border-red-500 bg-red-500/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                  }
                `}>
                  <input
                    type="radio"
                    value="ADMIN"
                    className="sr-only"
                    {...register('role')}
                  />
                  <Shield className={watch('role') === 'ADMIN' ? 'text-red-400' : 'text-gray-400'} size={24} />
                  <div className="flex-1">
                    <p className={`font-semibold ${watch('role') === 'ADMIN' ? 'text-red-400' : 'text-white'}`}>
                      Admin
                    </p>
                    <p className="text-xs text-gray-400">Full control</p>
                  </div>
                </label>
              </div>
              {errors.role && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5 animate-fade-in">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.role.message}
                </p>
              )}
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="form-element">
                <Input
                  label="First Name"
                  type="text"
                  icon={User}
                  placeholder="John"
                  error={errors.firstname?.message}
                  {...register('firstname', {
                    required: 'First name is required',
                    minLength: {
                      value: 2,
                      message: 'First name must be at least 2 characters',
                    },
                  })}
                />
              </div>

              <div className="form-element">
                <Input
                  label="Last Name"
                  type="text"
                  icon={User}
                  placeholder="Doe"
                  error={errors.lastname?.message}
                  {...register('lastname', {
                    required: 'Last name is required',
                    minLength: {
                      value: 2,
                      message: 'Last name must be at least 2 characters',
                    },
                  })}
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="form-element">
              <Input
                label="Phone Number"
                type="tel"
                icon={Phone}
                placeholder="09123456789"
                error={errors.phonenumber?.message}
                helperText="Philippine mobile number format"
                {...register('phonenumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^09\d{9}$/,
                    message: 'Invalid Philippine phone number (must start with 09 and have 11 digits)',
                  },
                })}
              />
            </div>

            {/* Password */}
            <div className="form-element">
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="Create a strong password"
                error={errors.password?.message}
                helperText="Must contain uppercase, lowercase, number, and special character"
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: 'Password must contain uppercase, lowercase, number, and special character',
                  },
                })}
              />
            </div>

            {/* Confirm Password */}
            <div className="form-element">
              <Input
                label="Confirm Password"
                type="password"
                icon={Lock}
                placeholder="Re-enter your password"
                error={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: (value) =>
                    value === password || 'Passwords do not match',
                })}
              />
            </div>

            {/* Terms & Conditions */}
            <div className="form-element">
              <label className="flex items-start gap-3 text-sm text-gray-300 cursor-pointer hover:text-white transition-colors group">
                <input 
                  type="checkbox" 
                  className="mt-1 w-4 h-4 rounded text-primary-500 focus:ring-2 focus:ring-primary-500 transition-all"
                  {...register('terms', {
                    required: 'You must accept the terms and conditions',
                  })}
                />
                <span className="leading-relaxed">
                  I agree to the{' '}
                  <Link 
                    to="/terms" 
                    className="text-primary-400 hover:text-primary-300 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms and Conditions
                  </Link>
                  {' '}and{' '}
                  <Link 
                    to="/privacy" 
                    className="text-primary-400 hover:text-primary-300 hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                </span>
              </label>
              {errors.terms && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1.5 animate-fade-in">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.terms.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-element pt-2">
              <Button type="submit" loading={loading} icon={UserPlus}>
                Create Account
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center form-element">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 text-gray-400 bg-transparent">
                  Already have an account?
                </span>
              </div>
            </div>
            
            <Link 
              to="/login" 
              className="mt-6 inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold transition-colors group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Sign in instead
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2026 Library Management System. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
