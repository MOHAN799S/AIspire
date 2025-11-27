'use client'
import React, { useEffect } from 'react'
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton, useUser } from '@clerk/nextjs'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from './ui/button'
import { 
  ChevronDown, 
  FileText, 
  GraduationCap, 
  LayoutDashboard, 
  Mail, 
  Sparkles, 
  TrendingUp,
  MessageSquare,
  Flag,
  Route,
  ChartNoAxesCombined,
  BookOpen
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'
import { toast } from 'sonner'

export const Header = () => {
  const { isSignedIn, user } = useUser()

  return (
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
          
          <SignedIn>

            {/* Dashboard Button */}
            <Link href={`dashboard`}>
              <Button 
                variant='outline' 
                className='hover:bg-primary/10 hover:text-primary h-9 sm:h-10 px-1.5 sm:px-2 md:px-4 hover:cursor-pointer'
              >
                <ChartNoAxesCombined className='w-4 h-4' />
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
                  <Link href={`industry-insights`} className='flex items-center gap-3 cursor-pointer py-2.5'>
                    <TrendingUp className='w-4 h-4 text-primary' />
                    <div className='flex flex-col'>
                      <span className='font-medium'>Industry Insights</span>
                      <span className='text-xs text-muted-foreground'>Trends & analytics</span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`learning-path`} className='flex items-center gap-3 cursor-pointer py-2.5'>
                    <Route className='w-4 h-4 text-primary' />
                    <div className='flex flex-col'>
                      <span className='font-medium'>Learning Path</span>
                      <span className='text-xs text-muted-foreground'>Personalized roadmap</span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`projects`} className='flex items-center gap-3 cursor-pointer py-2.5'>
                    <BookOpen className='w-4 h-4 text-primary' />
                    <div className='flex flex-col'>
                      <span className='font-medium'>Projects</span>
                      <span className='text-xs text-muted-foreground'>AI-driven projects</span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`resume`} className='flex items-center gap-3 cursor-pointer py-2.5'>
                    <FileText className='w-4 h-4 text-primary' />
                    <div className='flex flex-col'>
                      <span className='font-medium'>Resume Builder</span>
                      <span className='text-xs text-muted-foreground'>Create ATS-friendly resumes</span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild>
                  <Link href={`cover-letter`} className='flex items-center gap-3 cursor-pointer py-2.5'>
                    <Mail className='w-4 h-4 text-primary' />
                    <div className='flex flex-col'>
                      <span className='font-medium'>Cover Letter</span>
                      <span className='text-xs text-muted-foreground'>Generate custom letters</span>
                    </div>
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />
                
                <DropdownMenuItem asChild>
                  <Link href={`interview-prep`} className='flex items-center gap-3 cursor-pointer py-3 bg-primary/[0.03] hover:bg-primary/[0.08] border-l-[3px] border-primary'>
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

            {/* User Profile Button */}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 sm:w-10 sm:h-10',
                  avatarImage: 'w-9 h-9 sm:w-10 sm:h-10',
                  userButtonAvatarBox: 'w-9 h-9 sm:w-10 sm:h-10',
                  userButtonAvatarImage: 'w-9 h-9 sm:w-10 sm:h-10',
                  userButtonPopoverCard: 'shadow-xl',
                  userButtonPopoverActionButton: 'hover:bg-primary/10',
                  userButtonPopoverActionButtonText: 'text-sm',
                  userButtonPopoverFooter: 'hidden',
                  userPreviewMainIdentifier: 'font-bold',
                  modalBackdrop: 'backdrop-blur-sm',
                  modalContent: 'shadow-2xl'
                }
              }}
              afterSwitchSessionUrl='/'
              afterSignOutUrl='/'
                // <--- ✔️ FIX
            />
          </SignedIn>

          <SignedOut>
            <SignInButton mode="modal">
              <Button variant='outline' className='h-9 sm:h-10 px-3 sm:px-4 hover:cursor-pointer'>
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className='h-9 sm:h-10 px-3 sm:px-4 hidden sm:inline-flex hover:cursor-pointer'>
                Get Started
              </Button>
            </SignUpButton>
          </SignedOut>
        </div>
      </nav>
    </header>
  )
}

export default Header
