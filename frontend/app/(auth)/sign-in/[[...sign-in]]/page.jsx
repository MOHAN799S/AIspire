'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  ArrowRight, 
  Shield, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/components/auth/AuthContext'

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const API_URL = 'http://localhost:5000'

export default function SignInPage() {
  const router = useRouter()
  const { setUser } = useAuth()
  
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const validateForm = () => {
    const newErrors = {}
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    setSuccess(false)
    setErrors({})
    
    if (!validateForm()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          rememberMe: rememberMe,
        }),
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Server returned non-JSON response:', contentType)
        setErrors({ 
          general: 'Server configuration error. Please contact support.' 
        })
        toast.error('Server configuration error')
        setIsLoading(false)
        return
      }

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError)
        setErrors({ 
          general: 'Invalid server response. Please try again later.' 
        })
        toast.error('Invalid server response')
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        handleErrorResponse(response.status, data)
        setIsLoading(false)
        return
      }

      handleSuccessResponse(data)
      
    } catch (error) {
      console.error('Sign in error:', error)
      handleNetworkError(error)
      setIsLoading(false)
    }
  }

  const handleErrorResponse = (status, data) => {
    let errorMessage = ''
    
    switch (status) {
      case 400:
        if (data.errors && typeof data.errors === 'object') {
          setErrors(data.errors)
          errorMessage = data.message || 'Invalid input'
        } else {
          errorMessage = data.message || 'Invalid input. Please check your details.'
          setErrors({ general: errorMessage })
        }
        break

      case 401:
        errorMessage = data.message || 'Invalid email or password. Please try again.'
        setErrors({ general: errorMessage })
        break

      case 403:
        errorMessage = data.message || 'Access denied. Your account may be suspended.'
        setErrors({ general: errorMessage })
        break

      case 404:
        if (data.message && data.message.toLowerCase().includes('user')) {
          errorMessage = 'No account found with this email address.'
          setErrors({ email: errorMessage })
        } else {
          errorMessage = 'API endpoint not found. Please contact support.'
          setErrors({ general: errorMessage })
        }
        break

      case 429:
        errorMessage = 'Too many login attempts. Please try again in a few minutes.'
        setErrors({ general: errorMessage })
        break

      case 500:
      case 502:
      case 503:
        errorMessage = 'Server error. Please try again later.'
        setErrors({ general: errorMessage })
        break

      default:
        errorMessage = data.message || 'Something went wrong. Please try again.'
        setErrors({ general: errorMessage })
    }
    
    toast.error(errorMessage)
  }

  const handleSuccessResponse = (data) => {
    console.log('Sign in successful:', data)
    
    if (data.user) {
      setUser(data.user)
    }
    
    setSuccess(true)
    setIsLoading(false)
    toast.success('Welcome back!')
    
    setTimeout(() => {
      router.push('/dashboard')
    }, 1200)
  }

  const handleNetworkError = (error) => {
    let errorMessage = ''
    
    if (error instanceof TypeError && error.message.includes('fetch')) {
      errorMessage = 'Cannot connect to server. Please check your internet connection or try again later.'
    } else if (error.name === 'AbortError') {
      errorMessage = 'Request timeout. Please try again.'
    } else {
      errorMessage = 'An unexpected error occurred. Please try again.'
    }
    
    setErrors({ general: errorMessage })
    toast.error(errorMessage)
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    if (errors.general) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.general
        return newErrors
      })
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !isLoading && !success) {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex bg-black  px-4 lg:border mb-10 lg:px-30 rounded-2xl m-0">
      {/* Background glow / gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-32 w-80 h-80  blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80  blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1f293720,_transparent_60%)]" />
      </div>

      <div className="relative w-full max-w-5xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* Left side – branding / pitch */}
        <div className="hidden lg:flex flex-1 flex-col text-slate-100">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium mb-4">
            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
            </div>
            Secure AI-powered career assistant
          </div>

          <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight mb-4">
            Welcome back to{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AIspire
            </span>
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
            Continue your journey with personalized insights, smart interview practice, 
            and a focused space for your career growth.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md text-xs text-slate-300">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur">
              <p className="font-medium mb-1.5">Secure by design</p>
              <p className="text-slate-400 text-[11px]">
                Encrypted authentication & protected sessions for your account safety.
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur">
              <p className="font-medium mb-1.5">Pick up where you left</p>
              <p className="text-slate-400 text-[11px]">
                Resume your dashboard, learning paths, and projects instantly.
              </p>
            </div>
          </div>
        </div>

        {/* Right side – Sign-in card */}
        <div className="flex-1 w-full max-w-md mx-auto">
          <div className="rounded-2xl border border-white/10 bg-muted/15 backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.7)] p-7 sm:p-8">
            {/* Card header */}
            <div className="mb-7 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/25 via-purple-500/20 to-sky-500/20 border border-white/10 mb-4 shadow-[0_0_40px_rgba(79,70,229,0.35)]">
                <Shield className="w-7 h-7 text-indigo-300" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Sign in to your account
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                Use your email and password to access your dashboard.
              </p>
            </div>

            <div className="space-y-5">
              {/* Success message */}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3.5 flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-emerald-300">
                      Sign in successful!
                    </p>
                    <p className="text-[11px] text-emerald-300/80 mt-0.5">
                      Redirecting you to your dashboard...
                    </p>
                  </div>
                </div>
              )}

              {/* General error */}
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3.5 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm text-red-200">
                      {errors.general}
                    </p>
                  </div>
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-200 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white-500" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full pl-10 pr-3.5 py-2.75 bg-black/25 border text-sm rounded-lg outline-none transition-all
                      ${
                        errors.email
                          ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-500/40'
                          : 'border-white/10 focus:border-white-400 focus:ring-0 focus:ring-white'
                      } text-slate-100 placeholder-white/40`}
                    placeholder="you@example.com"
                    disabled={isLoading || success}
                    autoComplete="none"
                    aria-invalid={errors.email ? 'true' : 'false'}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-1.5 text-[11px] text-red-300 flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium text-white-200"
                  >
                    Password
                  </label>
                  <a
                    href="/forgot-password"
                    className="text-[11px] text-indigo-300 hover:text-indigo-200 hover:underline transition-colors"
                    tabIndex={isLoading ? -1 : 0}
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onKeyDown={handleKeyDown}
                    className={`w-full pl-10 pr-11 py-2.75 bg-black/25 border text-sm rounded-lg outline-none transition-all
                      ${
                        errors.password
                          ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-500/40'
                          : 'border-white/10 focus:border-white-400 focus:ring-0 focus:ring-white'
                      } text-slate-100 placeholder-white/40`}
                    placeholder="••••••••"
                    disabled={isLoading || success}
                    autoComplete="current-password"
                    aria-invalid={errors.password ? 'true' : 'false'}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 transition-colors disabled:opacity-40"
                    disabled={isLoading || success}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p
                    id="password-error"
                    className="mt-1.5 text-[11px] text-red-300 flex items-center gap-1.5"
                  >
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Remember me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    disabled={isLoading || success}
                    className="w-4 h-4 rounded border-white/20 bg-transparent text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer disabled:opacity-50"
                  />
                  <span>Remember me for 30 days</span>
                </label>
                <span className="text-[10px] text-slate-500">
                  Last login is securely stored
                </span>
              </div>

              {/* Submit button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading || success}
                className="w-full mt-4 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg
                  bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500
                  hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400
                  text-white shadow-[0_15px_40px_rgba(79,70,229,0.45)]
                  transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Signing you in...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Success</span>
                  </>
                ) : (
                  <>
                    <span>Sign in</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Divider + link */}
            <div className="mt-6 text-center">
              <p className="text-xs text-slate-400">
                Don&apos;t have an account?{' '}
                <a
                  href="/sign-up"
                  className="text-indigo-300 hover:text-indigo-200 font-medium hover:underline underline-offset-2 transition-colors"
                >
                  Create one now
                </a>
              </p>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  )
}
