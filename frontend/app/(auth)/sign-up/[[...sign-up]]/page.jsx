'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Check, 
  X, 
  ArrowRight, 
  Shield,
  CheckCircle,
} from 'lucide-react'

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)
  const [errors, setErrors] = useState<any>({})
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    agreedToTerms: false,
  })

  const checkPasswordStrength = (password: string) => {
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

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value
    setFormData(prev => ({ ...prev, password }))
    const { score } = checkPasswordStrength(password)
    setPasswordStrength(score)

    if (errors.password) {
      setErrors((prev: any) => {
        const newErrors = { ...prev }
        delete newErrors.password
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: any = {}

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        'Username can only contain letters, numbers, and underscores'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim() || !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }

    if (!formData.agreedToTerms) {
      newErrors.terms = 'You must agree to the terms and privacy policy'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})
    setSuccess(false)

    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      })

      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Server returned non-JSON response')
        setErrors({
          general:
            'Server configuration error. Please contact support or try again later.',
        })
        setIsLoading(false)
        return
      }

      let data
      try {
        data = await response.json()
      } catch (parseError) {
        console.error('Failed to parse JSON:', parseError)
        setErrors({
          general: 'Invalid server response. Please try again later.',
        })
        setIsLoading(false)
        return
      }

      if (!response.ok) {
        if (response.status === 400) {
          if (data.errors) {
            setErrors(data.errors)
          } else {
            setErrors({
              general:
                data.message || 'Invalid input. Please check your details.',
            })
          }
        } else if (response.status === 409) {
          setErrors({
            email:
              data.message || 'An account with this email already exists.',
            ...(data.usernameExists && {
              username: 'This username is already taken.',
            }),
          })
        } else if (response.status === 404) {
          setErrors({
            general:
              'API endpoint not configured. Please ensure the backend is properly set up.',
          })
        } else if (response.status === 500) {
          setErrors({ general: 'Server error. Please try again later.' })
        } else {
          setErrors({
            general: data.message || 'Something went wrong. Please try again.',
          })
        }
        setIsLoading(false)
        return
      }

      console.log('Sign up successful:', data)
      setSuccess(true)
      setIsLoading(false)

      // Optional: redirect after short delay
      setTimeout(() => {
        window.location.href = '/sign-in'
      }, 1500)
    } catch (error: any) {
      console.error('Sign up error:', error)

      if (error instanceof TypeError && error.message.includes('fetch')) {
        setErrors({
          general:
            'Cannot connect to server. Please check your internet connection.',
        })
      } else if (error.message && error.message.includes('GET/HEAD')) {
        setErrors({
          general: 'Invalid request method. Please check the API configuration.',
        })
      } else {
        setErrors({
          general: 'An unexpected error occurred. Please try again.',
        })
      }
      setIsLoading(false)
    }
  }

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 1:
        return 'bg-red-500'
      case 2:
        return 'bg-orange-500'
      case 3:
        return 'bg-yellow-500'
      case 4:
        return 'bg-lime-500'
      case 5:
        return 'bg-green-500'
      default:
        return 'bg-slate-700'
    }
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 1:
        return 'Very weak'
      case 2:
        return 'Weak'
      case 3:
        return 'Fair'
      case 4:
        return 'Good'
      case 5:
        return 'Strong'
      default:
        return ''
    }
  }

  const passwordChecks = formData.password
    ? checkPasswordStrength(formData.password).requirements
    : null

  const handleFieldChange = (
    field,
    value
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev: any) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
    if (errors.general) {
      setErrors((prev: any) => {
        const newErrors = { ...prev }
        delete newErrors.general
        return newErrors
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#030712] relative overflow-hidden flex items-center justify-center px-4">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-500/20 blur-3xl rounded-full" />
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-indigo-500/20 blur-3xl rounded-full" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#1f293720,_transparent_60%)]" />
      </div>

      <div className="relative w-full max-w-5xl flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
        {/* Left side – branding */}
        <div className="hidden lg:flex flex-1 flex-col text-slate-100">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium mb-4">
            <div className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <User className="w-3 h-3 text-indigo-300" />
            </div>
            Create your InterviewPrep account
          </div>

          <h1 className="text-4xl xl:text-5xl font-semibold tracking-tight mb-4">
            Start your{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              career journey
            </span>{' '}
            with confidence
          </h1>

          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
            Get access to AI-powered interview prep, smart projects, and tools 
            that help you stand out in your job search.
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md text-xs text-slate-300">
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur">
              <p className="font-medium mb-1.5">Smart learning paths</p>
              <p className="text-slate-400 text-[11px]">
                Personalized growth roadmap tailored to your skills and goals.
              </p>
            </div>
            <div className="rounded-xl border border-white/5 bg-white/[0.03] p-3 backdrop-blur">
              <p className="font-medium mb-1.5">Interview-ready portfolio</p>
              <p className="text-slate-400 text-[11px]">
                Build projects, resumes, and profiles that impress recruiters.
              </p>
            </div>
          </div>
        </div>

        {/* Right side – sign up card */}
        <div className="flex-1 w-full max-w-md mx-auto">
          <div className="rounded-2xl border border-white/10 bg-[rgba(10,12,20,0.96)] backdrop-blur-xl shadow-[0_18px_60px_rgba(0,0,0,0.7)] p-7 sm:p-8">
            {/* Header */}
            <div className="mb-7 text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500/25 via-purple-500/20 to-sky-500/20 border border-white/10 mb-4 shadow-[0_0_40px_rgba(79,70,229,0.35)]">
                <User className="w-7 h-7 text-indigo-200" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-semibold text-white">
                Create your account
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-slate-400">
                It only takes a minute to get started.
              </p>
            </div>

            <div className="space-y-5">
              {/* ✅ Success message div */}
              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3.5 flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-300" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs sm:text-sm font-medium text-emerald-300">
                      Account created successfully!
                    </p>
                    <p className="text-[11px] text-emerald-300/80 mt-0.5">
                      Redirecting you to the sign-in page...
                    </p>
                  </div>
                </div>
              )}

              {/* General error */}
              {errors.general && (
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3.5">
                  <p className="text-xs sm:text-sm text-red-200">
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Username */}
              <div>
                <label
                  htmlFor="username"
                  className="block text-xs font-medium text-slate-200 mb-1.5"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={e =>
                      handleFieldChange('username', e.target.value)
                    }
                    className={`w-full pl-10 pr-3.5 py-2.75 bg-[rgba(8,10,18,0.96)] border text-sm rounded-lg outline-none transition-all
                      ${
                        errors.username
                          ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-500/40'
                          : 'border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/40'
                      } text-slate-100 placeholder-slate-500`}
                    placeholder="Choose a unique username"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1.5 text-[11px] text-red-300">
                    {errors.username}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-slate-200 mb-1.5"
                >
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={e => handleFieldChange('email', e.target.value)}
                    className={`w-full pl-10 pr-3.5 py-2.75 bg-[rgba(8,10,18,0.96)] border text-sm rounded-lg outline-none transition-all
                      ${
                        errors.email
                          ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-500/40'
                          : 'border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/40'
                      } text-slate-100 placeholder-slate-500`}
                    placeholder="you@example.com"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1.5 text-[11px] text-red-300">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-medium text-slate-200 mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handlePasswordChange}
                    className={`w-full pl-10 pr-11 py-2.75 bg-[rgba(8,10,18,0.96)] border text-sm rounded-lg outline-none transition-all
                      ${
                        errors.password
                          ? 'border-red-500/70 focus:border-red-400 focus:ring-1 focus:ring-red-500/40'
                          : 'border-white/10 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-500/40'
                      } text-slate-100 placeholder-slate-500`}
                    placeholder="Create a strong password"
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors disabled:opacity-50"
                    disabled={isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* Password strength + requirements */}
                {formData.password && (
                  <div className="mt-3 space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i < passwordStrength
                                ? getPasswordStrengthColor()
                                : 'bg-slate-700'
                            }`}
                          />
                        ))}
                      </div>
                      {passwordStrength > 0 && (
                        <span
                          className={`text-[11px] font-medium ${
                            passwordStrength <= 2
                              ? 'text-red-300'
                              : passwordStrength === 3
                              ? 'text-yellow-300'
                              : passwordStrength === 4
                              ? 'text-lime-300'
                              : 'text-emerald-300'
                          }`}
                        >
                          {getPasswordStrengthText()}
                        </span>
                      )}
                    </div>

                    {passwordChecks && (
                      <div className="space-y-1.5 bg-[rgba(5,7,14,0.9)] border border-white/5 rounded-lg p-3">
                        {[
                          { key: 'length', label: 'At least 8 characters' },
                          { key: 'uppercase', label: 'One uppercase letter' },
                          { key: 'lowercase', label: 'One lowercase letter' },
                          { key: 'number', label: 'One number' },
                          {
                            key: 'special',
                            label: 'One special character (e.g. !@#$%)',
                          },
                        ].map(({ key, label }) => (
                          <div key={key} className="flex items-center gap-2">
                            {passwordChecks[key] ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <X className="w-3.5 h-3.5 text-slate-600" />
                            )}
                            <span
                              className={`text-[11px] ${
                                passwordChecks[key]
                                  ? 'text-emerald-300'
                                  : 'text-slate-500'
                              }`}
                            >
                              {label}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {errors.password && (
                  <p className="mt-1.5 text-[11px] text-red-300">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="pt-1">
                <div className="flex items-start gap-2">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={formData.agreedToTerms}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        agreedToTerms: e.target.checked,
                      }))
                    }
                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-transparent text-indigo-500 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer"
                    disabled={isLoading}
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-slate-400 leading-relaxed"
                  >
                    I agree to the{' '}
                    <Link
                      href="/terms"
                      className="text-indigo-300 hover:text-indigo-200 hover:underline"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      href="/privacy"
                      className="text-indigo-300 hover:text-indigo-200 hover:underline"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>
                {errors.terms && (
                  <p className="mt-1.5 text-[11px] text-red-300">
                    {errors.terms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full mt-5 flex items-center justify-center gap-2 py-3 text-sm font-medium rounded-lg
                  bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500
                  hover:from-indigo-400 hover:via-purple-400 hover:to-fuchsia-400
                  text-white shadow-[0_15px_40px_rgba(79,70,229,0.45)]
                  transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Creating your account...</span>
                  </>
                ) : (
                  <>
                    <span>Create account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

            {/* Footer link */}
            <div className="mt-6 text-center">
              <p className="text-xs sm:text-sm text-slate-400">
                Already have an account?{' '}
                <Link
                  href="/sign-in"
                  className="text-indigo-300 hover:text-indigo-200 font-medium hover:underline underline-offset-2"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Security badge */}
          <div className="mt-5 flex items-center justify-center gap-2 text-[11px] text-slate-500">
            <Shield className="w-3.5 h-3.5" />
            <span>Your data is encrypted and handled securely</span>
          </div>
        </div>
      </div>
    </div>
  )
}
