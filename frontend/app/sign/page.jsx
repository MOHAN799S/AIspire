'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, User, Github, Check, X, ArrowRight, Shield } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })

  // Enhanced Password strength checker with requirements
  const checkPasswordStrength = (password) => {
    const requirements = {
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^a-zA-Z0-9]/.test(password),
    }
    
    const score = Object.values(requirements).filter(Boolean).length
    return { score, requirements }
  }

  const handlePasswordChange = (e) => {
    const password = e.target.value
    setFormData({ ...formData, password })
    const { score } = checkPasswordStrength(password)
    setPasswordStrength(score)
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    
    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      console.log('Sign up with:', formData)
      setIsLoading(false)
      // router.push('/dashboard')
    }, 2000)
  }

  const handleSocialSignUp = (provider) => {
    setIsLoading(true)
    console.log('Sign up with:', provider)
    setTimeout(() => setIsLoading(false), 2000)
  }

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 1: return 'bg-red-500'
      case 2: return 'bg-orange-500'
      case 3: return 'bg-yellow-500'
      case 4: return 'bg-lime-500'
      case 5: return 'bg-green-500'
      default: return 'bg-gray-700'
    }
  }

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 1: return 'Very Weak'
      case 2: return 'Weak'
      case 3: return 'Fair'
      case 4: return 'Good'
      case 5: return 'Strong'
      default: return ''
    }
  }

  const passwordChecks = formData.password ? checkPasswordStrength(formData.password).requirements : null

  return (
    <div className="min-h-screen bg-black flex items-center py-30 justify-center p-4 ">
      <div className="w-full max-w-md">
        {/* Logo */}


        {/* Card */}
        <div className="bg-[#0f0f0f] border border-[#1f1f1f] rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white">
                Create Your Account
              </h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Join thousands of professionals already using our secure platform. Get started in less than 2 minutes.
            </p>
          </div>

          {/* Social Sign Up Buttons */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button
              onClick={() => handleSocialSignUp('google')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] hover:border-[#333333] rounded-lg text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>

            <button
              onClick={() => handleSocialSignUp('github')}
              disabled={isLoading}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-[#1a1a1a] hover:bg-[#222222] border border-[#2a2a2a] hover:border-[#333333] rounded-lg text-white text-sm font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Github className="w-4 h-4" />
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a2a]"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-[#0f0f0f] text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1.5">
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className={`w-full px-3.5 py-2.5 bg-[#0a0a0a] border ${errors.firstName ? 'border-red-500' : 'border-[#2a2a2a]'} focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-white text-sm placeholder-gray-500 outline-none transition-all`}
                  placeholder="Enter your firstname"
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="mt-1 text-xs text-red-400">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  className={`w-full px-3.5 py-2.5 bg-[#0a0a0a] border ${errors.lastName ? 'border-red-500' : 'border-[#2a2a2a]'} focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-white text-sm placeholder-gray-500 outline-none transition-all`}
                  placeholder="Enter your lastname"
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="mt-1 text-xs text-red-400">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className={`w-full pl-10 pr-3.5 py-2.5 bg-[#0a0a0a] border ${errors.email ? 'border-red-500' : 'border-[#2a2a2a]'} focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-white text-sm placeholder-gray-500 outline-none transition-all`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  autoComplete='off'
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className={`w-full pl-10 pr-12 py-2.5 bg-[#0a0a0a] border ${errors.password ? 'border-red-500' : 'border-[#2a2a2a]'} focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 rounded-lg text-white text-sm placeholder-gray-500 outline-none transition-all`}
                  placeholder="Create a strong password"
                  disabled={isLoading}
                  autoComplete='new-password'
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              
              {/* Enhanced Password Strength Indicator */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  {/* Strength Bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                            i < passwordStrength ? getPasswordStrengthColor() : 'bg-[#2a2a2a]'
                          }`}
                        />
                      ))}
                    </div>
                    {passwordStrength > 0 && (
                      <span className={`text-xs font-medium ${
                        passwordStrength <= 2 ? 'text-red-400' : 
                        passwordStrength === 3 ? 'text-yellow-400' : 
                        passwordStrength === 4 ? 'text-lime-400' : 'text-green-400'
                      }`}>
                        {getPasswordStrengthText()}
                      </span>
                    )}
                  </div>
                  
                  {/* Password Requirements */}
                  {passwordChecks && (
                    <div className="space-y-1.5 bg-[#0a0a0a] border border-[#1f1f1f] rounded-lg p-3">
                      {[
                        { key: 'length', label: 'At least 8 characters' },
                        { key: 'uppercase', label: 'One uppercase letter' },
                        { key: 'lowercase', label: 'One lowercase letter' },
                        { key: 'number', label: 'One number' },
                        { key: 'special', label: 'One special character' },
                      ].map(({ key, label }) => (
                        <div key={key} className="flex items-center gap-2">
                          {passwordChecks[key] ? (
                            <Check className="w-3.5 h-3.5 text-green-500" />
                          ) : (
                            <X className="w-3.5 h-3.5 text-gray-600" />
                          )}
                          <span className={`text-xs ${passwordChecks[key] ? 'text-green-400' : 'text-gray-500'}`}>
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              
              {errors.password && (
                <p className="mt-1 text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start pt-2">
              <input
                id="terms"
                type="checkbox"
                className="mt-0.5 w-4 h-4 text-indigo-600 bg-[#0a0a0a] border-[#2a2a2a] rounded focus:ring-indigo-500 focus:ring-offset-0"
                required
              />
              <label htmlFor="terms" className="ml-2.5 text-sm text-gray-400">
                I agree to the{' '}
                <Link href="/terms" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-indigo-400 hover:text-indigo-300 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Create account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-400">
              Already have an account?{' '}
              <Link href="/sign-in" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        
      </div>
    </div>
  )
}