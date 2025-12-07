'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { 
  ChevronDown, 
  FileText, 
  GraduationCap, 
  Mail, 
  Sparkles, 
  TrendingUp,
  Route,
  BarChart3,
  BookOpen,
  AlertTriangle,
} from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from './ui/dropdown-menu'
import { toast } from 'sonner'
import { useAuth } from './auth/AuthContext'

export const Header = () => {
  const { user, loading, logout } = useAuth()
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)

  const handleConfirmLogout = () => {
    logout()
    toast.success('Logged out successfully')
    setShowLogoutDialog(false)
  }

  return (
    <>
      <header className='fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-50 supports-[backdrop-filter]:bg-background/60'>
        <nav className='mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 max-w-full h-16 flex items-center justify-between gap-4'>
          
          {/* Logo */}
          <Link href="/" className='flex-shrink-0'>
            <Image 
              src="/myylogo.png" 
              alt="InterviewPrep" 
              width={80} 
              height={80} 
              className='h-28 py-2 w-auto object-contain md:left-0'
              priority
            />
          </Link>

          {/* Navigation Items */}
          <div className='flex items-center gap-1 sm:gap-2 md:gap-3 ml-auto'>
            
            {/* ✅ Signed-in section */}
            {!loading && user && (
              <>
                {/* Dashboard Button */}
                <Link href="/dashboard">
                  <Button 
                    variant='outline' 
                    className='hover:bg-primary/10 hover:text-primary h-9 sm:h-10 px-1.5 sm:px-2 md:px-4 hover:cursor-pointer'
                  >
                    <BarChart3 className='w-4 h-4' />
                    <span className='hidden sm:inline-block ml-2'>Dashboard</span>
                  </Button>
                </Link>

                {/* Growth Tools Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant='outline' 
                      className='hover:bg-primary/10 hover:text-primary h-9 sm:h-10 px-2 sm:px-3 md:px-4 focus:outline-none hover:cursor-pointer'
                    >
                      <Sparkles className='w-4 h-4' />
                      <span className='hidden sm:inline-block ml-1'>Growth Tools</span>
                      <ChevronDown className='w-4 h-4 ml-1' />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className='w-56'>
                    <DropdownMenuLabel className='text-xs text-muted-foreground'>
                      Career Development
                    </DropdownMenuLabel>

                    <DropdownMenuItem asChild>
                      <Link href="/industry-insights" className='flex items-center gap-3 cursor-pointer py-2.5'>
                        <TrendingUp className='w-4 h-4 text-primary' />
                        <div className='flex flex-col'>
                          <span className='font-medium'>Industry Insights</span>
                          <span className='text-xs text-muted-foreground'>Trends & analytics</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/learning-path" className='flex items-center gap-3 cursor-pointer py-2.5'>
                        <Route className='w-4 h-4 text-primary' />
                        <div className='flex flex-col'>
                          <span className='font-medium'>Learning Path</span>
                          <span className='text-xs text-muted-foreground'>Personalized roadmap</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/projects" className='flex items-center gap-3 cursor-pointer py-2.5'>
                        <BookOpen className='w-4 h-4 text-primary' />
                        <div className='flex flex-col'>
                          <span className='font-medium'>Projects</span>
                          <span className='text-xs text-muted-foreground'>AI-driven projects</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/resume" className='flex items-center gap-3 cursor-pointer py-2.5'>
                        <FileText className='w-4 h-4 text-primary' />
                        <div className='flex flex-col'>
                          <span className='font-medium'>Resume Builder</span>
                          <span className='text-xs text-muted-foreground'>Create ATS-friendly resumes</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/cover-letter" className='flex items-center gap-3 cursor-pointer py-2.5'>
                        <Mail className='w-4 h-4 text-primary' />
                        <div className='flex flex-col'>
                          <span className='font-medium'>Cover Letter</span>
                          <span className='text-xs text-muted-foreground'>Generate custom letters</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem asChild>
                      <Link href="/interview-prep" className='flex items-center gap-3 cursor-pointer py-3 bg-primary/[0.03] hover:bg-primary/[0.08] border-l-[3px] border-primary'>
                        <GraduationCap className='w-4 h-4 text-primary' />
                        <div className='flex flex-col flex-1'>
                          <div className='flex items-center gap-2'>
                            <span className='font-semibold text-[15px]'>Interview Prep</span>
                            <span className='px-2 py-0.5 text-[9px] font-semibold tracking-wide bg-primary text-primary-foreground rounded uppercase'>
                              Pro Feature
                            </span>
                          </div>
                          <span className='text-xs text-muted-foreground'>AI-powered practice sessions</span>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Avatar Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 sm:gap-2 h-9 sm:h-10 px-1.5 sm:px-2.5 rounded-lg hover:bg-accent transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
                      <div className="relative">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                      </div>
                      {/* 🔹 Removed name from trigger – only icon + chevron */}
                      <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex items-center gap-3 py-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center text-white font-semibold shadow-md">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">
                          {user.email?.split('@')[0] || 'User'}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[160px]">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {/* Logout Button */}
                    <DropdownMenuItem
                      className="flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 focus:bg-red-50 dark:focus:bg-red-950/30 focus:text-red-600 dark:focus:text-red-400 transition-colors"
                      onClick={() => setShowLogoutDialog(true)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/40 flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" strokeWidth="2" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold text-sm">Log out</span>
                        <span className="text-xs text-red-500/70 dark:text-red-400/70">Sign out of your account</span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}

            {/* ✅ Signed-out section */}
            {!loading && !user && (
              <>
                <Link href="/sign-in">
                  <Button variant='outline' className='h-9 sm:h-10 px-3 sm:px-4 hover:cursor-pointer'>
                    Sign In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className='h-9 sm:h-10 px-3 sm:px-4 hidden sm:inline-flex hover:cursor-pointer'>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* 🔔 Logout Confirmation Modal */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40">
          <div className="bg-background rounded-xl shadow-xl p-6 w-full max-w-sm border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h2 className="text-base font-semibold">Log out</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  You can always sign back in anytime.
                </p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-5">
              Are you sure you want to log out from your account?
            </p>

            <div className="flex justify-end gap-2">
              <Button 
                variant="outline" 
                className="h-8 px-3 text-sm"
                onClick={() => setShowLogoutDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                className="h-8 px-3 text-sm"
                onClick={handleConfirmLogout}
              >
                Yes, log out
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
