'use client'

import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from '@/components/ui/card'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from '@/components/ui/accordion'
import { Learningpaths } from '@/components/data'
import { BookOpen, FileText, Loader2, ChevronLeft, ChevronRight, Search, X, Award, TrendingUp, Clock } from 'lucide-react'

const LearningPathsCard = () => {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [visibleCards, setVisibleCards] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const itemsPerPage = 4

  const paths = Learningpaths

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query)
    
    if (query.trim() === '') {
      setSearchResults([])
      setShowSearchResults(false)
      return
    }

    const lowerQuery = query.toLowerCase()
    const results = paths
      .map((path, index) => {
        // Search in title, description, difficulty, and syllabus topics
        const titleMatch = path.title.toLowerCase().includes(lowerQuery)
        const descMatch = path.description.toLowerCase().includes(lowerQuery)
        const difficultyMatch = path.difficulty.toLowerCase().includes(lowerQuery)
        const topicsMatch = path.syllabus.some(module => 
          module.module.toLowerCase().includes(lowerQuery) ||
          module.topics.some(topic => topic.toLowerCase().includes(lowerQuery))
        )

        if (titleMatch || descMatch || difficultyMatch || topicsMatch) {
          const pageNumber = Math.floor(index / itemsPerPage) + 1
          const cardNumber = (index % itemsPerPage) + 1
          return {
            ...path,
            pageNumber,
            cardNumber,
            absoluteIndex: index
          }
        }
        return null
      })
      .filter(Boolean)

    setSearchResults(results)
    setShowSearchResults(true)
  }

  const navigateToPath = (pageNumber) => {
    setSearchQuery('')
    setShowSearchResults(false)
    handlePageChange(pageNumber)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setShowSearchResults(false)
  }

  // Calculate pagination
  const totalPages = Math.ceil(paths.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentPaths = paths.slice(startIndex, endIndex)

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in')

    if (isLoaded && isSignedIn) {
      const timer = setTimeout(() => setPageLoading(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isLoaded, isSignedIn, router])

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (pageLoading) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-card-id')
            setVisibleCards((prev) => new Set([...prev, id]))
          }
        })
      },
      { threshold: 0.2, rootMargin: '0px 0px -100px 0px' }
    )

    const cards = document.querySelectorAll('[data-card-id]')
    cards.forEach((card) => observer.observe(card))

    return () => observer.disconnect()
  }, [pageLoading, currentPage])

  // Handle page change with smooth transition
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || isTransitioning) return
    
    setIsTransitioning(true)
    setVisibleCards(new Set())
    
    setTimeout(() => {
      setCurrentPage(newPage)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      
      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, 300)
  }

  if (pageLoading || !isLoaded) {
    return (
      <section className="relative bg-black h-screen flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
        <p className="text-gray-400 text-lg">Loading learning paths...</p>
      </section>
    )
  }

  if (!isSignedIn) return null

  return (
    <section className="relative bg-black text-white min-h-screen overflow-hidden py-16">
      <div className="relative z-10 container mx-auto px-4 max-w-7xl">
        <div className="text-center mb-8">
          <h2 className="gradient-title text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 mt-20 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            Learning Paths
          </h2>
          <p className="text-gray-400 text-lg sm:text-xl lg:text-2xl">Choose your path and start learning today</p>
          <div className="hidden lg:flex items-center justify-center gap-8 mt-8 text-sm">
            <div className="flex items-center gap-2 text-gray-400">
              <Award className="w-5 h-5 text-blue-400" />
              <span>{paths.length} Expert-Curated Paths</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-gray-400">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span>Page {currentPage} of {totalPages}</span>
            </div>
            <div className="w-px h-4 bg-white/20"></div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="w-5 h-5 text-pink-400" />
              <span>Self-Paced Learning</span>
            </div>
          </div>
          <div className="lg:hidden mt-4 text-sm text-gray-500">
            Page {currentPage} of {totalPages} • {paths.length} total paths
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search learning paths by title, topic, or difficulty..."
              className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:black focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Search Results Dropdown */}
          {showSearchResults && (
            <div className="absolute w-full mt-2 bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg shadow-2xl max-h-96 overflow-y-auto z-50">
              {searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => navigateToPath(result.pageNumber)}
                      className="w-full text-left p-4 hover:bg-white/10 rounded-lg transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors mb-1">
                            {result.title}
                          </h3>
                          <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                            {result.description}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs">
                            <span className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                              {result.difficulty}
                            </span>
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded">
                              {result.duration}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1 text-xs text-gray-400 flex-shrink-0">
                          <span className="bg-white/10 px-2 py-1 rounded">
                            Page {result.pageNumber}
                          </span>
                          <span className="bg-white/10 px-2 py-1 rounded">
                            Card {result.cardNumber}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400 font-medium mb-1">No learning paths found</p>
                  <p className="text-sm text-gray-500">
                   Try searching with different keywords like &quot;Python&quot;, &quot;Beginner&quot;, or &quot;Web Development&quot;.

                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className={`
          grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8 mb-12
          transition-opacity duration-300
          ${isTransitioning ? 'opacity-0' : 'opacity-100'}
        `}>
          {currentPaths.map((path, index) => {
            const isVisible = visibleCards.has(path.id.toString())
            const isEven = index % 2 === 0
            
            return (
              <div
                key={path.id}
                data-card-id={path.id}
                className={`
                  relative flex items-center justify-center ${isEven ? 'lg:justify-start' : 'lg:justify-end'}
                  transition-all duration-1000 ease-out
                  ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}
                `}
                style={{
                  transitionDelay: `${(index % 6) * 100}ms`
                }}
              >
                <div className={`
                  w-full lg:w-[48%]
                  ${isEven ? 'lg:pr-12' : 'lg:pl-12'}
                `}>
                  <Card
  className={`
    bg-white/5 backdrop-blur-md border border-white/10
    hover:scale-[1.02] hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/10
    transition-all duration-200 ease-out
    group h-full
    ${isVisible ? 'scale-100' : 'scale-95'}
  `}
  style={{
    transitionDelay: `${300 + (index % 6) * 100}ms`
  }}
>
  <CardHeader className="border-b border-white/10">
    <div className="flex items-center gap-3 mb-2">
      <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-colors duration-200">
        {path.icon}
      </div>
      <CardTitle className="text-lg sm:text-xl">{path.title}</CardTitle>
    </div>
    <p className="text-sm text-gray-400">{path.description}</p>
  </CardHeader>

  <CardContent className="p-4 sm:p-5 space-y-4">
    <div className="flex gap-3">
      <div className="flex-1 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors duration-150">
        <p className="text-xs text-gray-500">Duration</p>
        <p className="text-sm font-medium">{path.duration}</p>
      </div>
      <div className="flex-1 bg-white/5 p-3 rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors duration-150">
        <p className="text-xs text-gray-500">Level</p>
        <p className="text-sm font-medium">{path.difficulty}</p>
      </div>
    </div>

    <Accordion type="single" collapsible className="space-y-3">
      <AccordionItem
        value={`syllabus-${path.id}`}
        className="border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 hover:border-white/20 transition-colors duration-150"
      >
        <AccordionTrigger className="px-4 py-2 text-sm font-medium">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-gray-400" />
            <span>Syllabus</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-3 space-y-3">
          {path.syllabus.map((module, idx) => (
            <Accordion key={idx} type="single" collapsible>
              <AccordionItem
                value={`module-${path.id}-${idx}`}
                className="bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:border-white/20 transition-colors duration-150"
              >
                <AccordionTrigger className="px-3 py-2 text-xs font-medium">
                  {module.module}
                </AccordionTrigger>
                <AccordionContent className="p-3">
                  <div className="flex flex-wrap gap-2">
                    {module.topics.map((topic, tIdx) => (
                      <span key={tIdx} className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors duration-150">
                        {topic}
                      </span>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          ))}
        </AccordionContent>
      </AccordionItem>

      <AccordionItem
        value={`resources-${path.id}`}
        className="border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 hover:border-white/20 transition-colors duration-150"
      >
        <AccordionTrigger className="px-4 py-2 text-sm font-medium">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span>Resources</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="p-3 space-y-2">
          {path.resources.map((res, idx) => (
            <a
              key={idx}
              href={res.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs text-gray-300 bg-white/10 hover:bg-white/20 hover:border-white/20 px-3 py-2 rounded transition-colors duration-150"
            >
              <span className="font-medium">{res.name}</span>
              <span className="text-gray-500 ml-2">• {res.type}</span>
            </a>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </CardContent>
</Card>
                </div>
              </div>
            )
          })}
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 mt-12 mb-8 px-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isTransitioning}
            className={`
              flex items-center justify-center gap-2 px-3 sm:px-6 py-3 rounded-lg font-medium
              transition-all duration-300 transform flex-shrink-0
              ${currentPage === 1 || isTransitioning
                ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50'
              }
            `}
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            {totalPages <= 7 ? (
              Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={isTransitioning}
                  className={`
                    w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base
                    ${page === currentPage
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-110 shadow-lg shadow-blue-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }
                    ${isTransitioning ? 'cursor-not-allowed opacity-50' : ''}
                  `}
                >
                  {page}
                </button>
              ))
            ) : (
              <>
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={isTransitioning}
                  className={`
                    w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base
                    ${currentPage === 1
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-110 shadow-lg shadow-blue-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }
                    ${isTransitioning ? 'cursor-not-allowed opacity-50' : ''}
                  `}
                >
                  1
                </button>

                {currentPage > 3 && (
                  <span className="text-gray-500 px-1">...</span>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    if (page === 1 || page === totalPages) return false
                    return Math.abs(page - currentPage) <= 1
                  })
                  .map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      disabled={isTransitioning}
                      className={`
                        w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base
                        ${page === currentPage
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-110 shadow-lg shadow-blue-500/50'
                          : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                        }
                        ${isTransitioning ? 'cursor-not-allowed opacity-50' : ''}
                      `}
                    >
                      {page}
                    </button>
                  ))
                }

                {currentPage < totalPages - 2 && (
                  <span className="text-gray-500 px-1">...</span>
                )}

                <button
                  onClick={() => handlePageChange(totalPages)}
                  disabled={isTransitioning}
                  className={`
                    w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-medium transition-all duration-300 text-sm sm:text-base
                    ${currentPage === totalPages
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white scale-110 shadow-lg shadow-blue-500/50'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }
                    ${isTransitioning ? 'cursor-not-allowed opacity-50' : ''}
                  `}
                >
                  {totalPages}
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isTransitioning}
            className={`
              flex items-center justify-center gap-2 px-3 sm:px-6 py-3 rounded-lg font-medium
              transition-all duration-300 transform flex-shrink-0
              ${currentPage === totalPages || isTransitioning
                ? 'bg-white/5 text-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white hover:scale-105 hover:shadow-lg hover:shadow-blue-500/50'
              }
            `}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  )
}

export default LearningPathsCard