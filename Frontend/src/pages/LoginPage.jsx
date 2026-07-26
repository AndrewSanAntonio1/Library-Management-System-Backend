import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { gsap } from 'gsap'
import toast from 'react-hot-toast'
import { Mail, Lock, LogIn, BookOpen, ArrowRight } from 'lucide-react'
import SpaceshipBackground from '../components/SpaceshipBackground'
import Input from '../components/Input'
import Button from '../components/Button'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const token = useAuthStore((state) => state.token)
  const [loading, setLoading] = useState(false)
  
  const containerRef = useRef()
  const formRef = useRef()
  const titleRef = useRef()
  const iconRef = useRef()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

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
        rotation: -180,
        opacity: 0,
        duration: 0.8,
        ease: 'back.out(2)',
      })
      
      // Animate title
      gsap.from(titleRef.current.children, {
        y: -30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.3,
        ease: 'power3.out',
      })
      
      // Animate form container with scale and fade
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
        stagger: 0.1,
        delay: 0.8,
        ease: 'power2.out',
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const onSubmit = async (data) => {
    setLoading(true)
    
    try {
      const response = await authService.login(data)
      setAuth(response)
      
      toast.success(`Welcome back, ${response.username}! 🚀`, {
        duration: 3000,
        icon: '👋',
      })
      
      // Determine redirect path based on role
      const redirectPath = response.role === 'LIBRARIAN' || response.role === 'ADMIN'
        ? '/librarian'
        : '/dashboard'
      
      // Smooth exit animation
      const tl = gsap.timeline({
        onComplete: () => navigate(redirectPath, { replace: true }),
      })
      
      tl.to(formRef.current, {
        scale: 0.95,
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: 'power2.in',
      })
      
    } catch (error) {
      console.error('Login error:', error)
      
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.error ||
        'Login failed. Please check your credentials and try again.'
      
      toast.error(errorMessage, {
        duration: 4000,
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
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
    >
      <SpaceshipBackground />
      
      {/* Main Content */}
      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div ref={titleRef} className="text-center mb-10">
          <div 
            ref={iconRef}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary-500/20 backdrop-blur-md border border-primary-500/30 mb-6 shadow-lg shadow-primary-500/20"
          >
            <BookOpen className="text-primary-400" size={40} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-3 tracking-tight">
            Welcome Back
          </h1>
          <p className="text-gray-400 text-lg">
            Sign in to access your library
          </p>
        </div>

        {/* Form */}
        <div ref={formRef} className="glass-card rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-element">
              <Input
                label="Email Address"
                type="email"
                icon={Mail}
                placeholder="your.email@example.com"
                error={errors.email?.message}
                helperText="Enter your registered email address"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Please enter a valid email address',
                  },
                })}
              />
            </div>

            <div className="form-element">
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="Enter your password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                })}
              />
            </div>

            <div className="form-element flex items-center justify-between text-sm">
              <label className="flex items-center text-gray-300 cursor-pointer hover:text-white transition-colors group">
                <input 
                  type="checkbox" 
                  className="mr-2.5 rounded w-4 h-4 text-primary-500 focus:ring-2 focus:ring-primary-500 transition-all" 
                />
                <span className="group-hover:translate-x-0.5 transition-transform">
                  Remember me
                </span>
              </label>
              <Link 
                to="/forgot-password" 
                className="text-primary-400 hover:text-primary-300 transition-colors hover:underline flex items-center gap-1"
              >
                Forgot password?
                <ArrowRight size={14} />
              </Link>
            </div>

            <div className="form-element pt-2">
              <Button type="submit" loading={loading} icon={LogIn}>
                Sign In
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
                  New to Library System?
                </span>
              </div>
            </div>
            
            <Link 
              to="/register" 
              className="mt-6 inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold transition-colors group"
            >
              Create an account
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
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
