'use client'
import React from 'react'
import { SignedOut, SignInButton, SignUpButton, SignedIn, UserButton } from '@clerk/nextjs'
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
  Route
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'

export const Header = () => {
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
                            <LayoutDashboard className='w-4 h-4' />
                            <span className='hidden sm:inline-block ml-2'>Dashboard</span>
                        </Button>
                    </Link>
                
                    {/* Growth Tools Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                              variant='outline' 
                              className='hover:bg-primary/10 hover:text-primary h-9 sm:h-10 px-2 sm:px-3 md:px-4 focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 hover:cursor-pointer'
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
                                <Link href={`learning-path`} className='flex items-center gap-3 cursor-pointer py-2.5'>
                                    <Route className='w-4 h-4 text-primary' />
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>Learning Path</span>
                                        <span className='text-xs text-muted-foreground'>Personalized roadmap</span>
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
                            <DropdownMenuItem asChild>
                                <Link href={`interview-prep`} className='flex items-center gap-3 cursor-pointer py-2.5'>
                                    <GraduationCap className='w-4 h-4 text-primary' />
                                    <div className='flex flex-col'>
                                        <span className='font-medium'>Interview Prep</span>
                                        <span className='text-xs text-muted-foreground'>Practice & improve</span>
                                    </div>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Feedback Dropdown */}
                    {/* <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button 
                              variant='ghost' 
                              size='icon'
                              className='hover:bg-primary/10 hover:text-primary h-9 w-9 sm:h-10 sm:w-10'
                            >
                                <MessageSquare className='w-4 h-4' />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className='w-52'>
                            <DropdownMenuLabel>Help Us Improve</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href={`/testimonial`} className='flex items-center gap-3 cursor-pointer py-2'>
                                    <MessageSquare className='w-4 h-4 text-green-600' />
                                    <span>Share Testimonial</span>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/report`} className='flex items-center gap-3 cursor-pointer py-2'>
                                    <Flag className='w-4 h-4 text-orange-600' />
                                    <span>Report an Issue</span>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu> */}

                    {/* User Profile */}
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
                    />
                </SignedIn>
                
                <SignedOut>
                    <SignInButton>
                        <Button variant='outline' className='h-9 sm:h-10 px-3 sm:px-4 hover:cursor-pointer'>
                            Sign In
                        </Button>
                    </SignInButton>
                    <SignUpButton>
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