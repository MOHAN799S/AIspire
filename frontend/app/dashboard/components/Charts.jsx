'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
  RadialBarChart,
  RadialBar,
  AreaChart,
  Area,
  ComposedChart,
} from 'recharts'
import StarBackground from '@/components/StartBackground'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const lineData = [
  { month: 'Jan', progress: 40 },
  { month: 'Feb', progress: 55 },
  { month: 'Mar', progress: 65 },
  { month: 'Apr', progress: 80 },
  { month: 'May', progress: 90 },
]

const pieData = [
  { name: 'Learning Path', value: 40 },
  { name: 'Interview Prep', value: 25 },
  { name: 'Resume Builder', value: 20 },
  { name: 'Mock Tests', value: 15 },
]

const barData = [
  { feature: 'AI Chat', usage: 85 },
  { feature: 'Resume Tool', usage: 60 },
  { feature: 'Mock Interview', usage: 75 },
  { feature: 'Analytics', usage: 50 },
]

const radialData = [{ name: 'Profile Completion', value: 78, fill: '#6366F1' }]

const skillsData = [
  { skill: 'JavaScript', level: 85 },
  { skill: 'React', level: 75 },
  { skill: 'Python', level: 65 },
  { skill: 'Node.js', level: 70 },
  { skill: 'SQL', level: 60 },
]

const activityData = [
  { day: 'Mon', hours: 4 },
  { day: 'Tue', hours: 6 },
  { day: 'Wed', hours: 5 },
  { day: 'Thu', hours: 8 },
  { day: 'Fri', hours: 7 },
  { day: 'Sat', hours: 3 },
  { day: 'Sun', hours: 2 },
]

const performanceData = [
  { month: 'Jan', tests: 12, passed: 10 },
  { month: 'Feb', tests: 15, passed: 13 },
  { month: 'Mar', tests: 18, passed: 16 },
  { month: 'Apr', tests: 20, passed: 18 },
  { month: 'May', tests: 22, passed: 21 },
]

const COLORS = ['#6366F1', '#A855F7', '#EC4899', '#F59E0B']

export default function Charts() {
  const sectionRef = useRef(null)
  const chartRefs = useRef([])
  const dividerRefs = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      const isMobile = window.innerWidth < 1024
      const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024
      const isDesktop = window.innerWidth >= 1024

      // Group charts by rows for desktop/tablet
      const chartsPerRow = isDesktop ? 3 : isTablet ? 2 : 1
      const chartGroups = []
      
      for (let i = 0; i < chartRefs.current.length; i += chartsPerRow) {
        chartGroups.push(chartRefs.current.slice(i, i + chartsPerRow))
      }

      // Animate each group of charts
      chartGroups.forEach((group, groupIndex) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: group[0],
            start: isMobile ? 'top 85%' : 'top 75%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
            once: false,
          }
        })

        // Animate charts in the group with stagger
        tl.fromTo(
          group,
          {
            opacity: 0,
            y: isMobile ? 40 : 80,
            scale: 0.9,
            rotationX: isMobile ? 0 : 15,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            rotationX: 0,
            duration: isMobile ? 0.6 : 1,
            ease: 'power3.out',
            stagger: {
              amount: isMobile ? 0.2 : 0.4,
              from: 'start',
              ease: 'power2.out'
            }
          }
        )

        // Add subtle bounce at the end
        if (!isMobile) {
          tl.to(group, {
            y: -10,
            duration: 0.3,
            ease: 'power2.out',
            stagger: 0.05
          }).to(group, {
            y: 0,
            duration: 0.3,
            ease: 'bounce.out',
            stagger: 0.05
          })
        }
      })

      // Animate dividers separately
      dividerRefs.current.forEach((divider, index) => {
        if (divider) {
          const line = divider.querySelector('.divider-line')
          if (line) {
            gsap.fromTo(
              line,
              {
                scaleX: 0,
                opacity: 0,
              },
              {
                scaleX: 1,
                opacity: 1,
                duration: isMobile ? 0.8 : 1.2,
                ease: 'power2.inOut',
                scrollTrigger: {
                  trigger: divider,
                  start: 'top 90%',
                  toggleActions: 'play none none reverse',
                }
              }
            )
          }
        }
      })

      // Add hover animations for desktop
      if (isDesktop) {
        chartRefs.current.forEach((chart) => {
          if (chart) {
            chart.addEventListener('mouseenter', () => {
              gsap.to(chart, {
                scale: 1.03,
                y: -5,
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                duration: 0.3,
                ease: 'power2.out'
              })
            })
            
            chart.addEventListener('mouseleave', () => {
              gsap.to(chart, {
                scale: 1,
                y: 0,
                boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                duration: 0.3,
                ease: 'power2.out'
              })
            })
          }
        })
      }
    }, sectionRef)

    return () => {
      ctx.revert()
    }
  }, [])

  const addChartRef = (el) => {
    if (el && !chartRefs.current.includes(el)) {
      chartRefs.current.push(el)
    }
  }

  const addDividerRef = (el) => {
    if (el && !dividerRefs.current.includes(el)) {
      dividerRefs.current.push(el)
    }
  }

  return (
    <section ref={sectionRef} className="py-8 sm:py-12 lg:py-16 dark:bg-black">
        {/* <StarBackground className='z-999'/> */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* GRID WRAPPER */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* LINE CHART */}
          <div 
            ref={addChartRef}
            className="bg-muted/40 border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
              Monthly Progress
            </h2>
            <div className="h-64 sm:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Line type="monotone" dataKey="progress" stroke="#6366F1" strokeWidth={3} dot={{ fill: '#6366F1', r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Divider for mobile only */}
          <div ref={addDividerRef} className="lg:hidden w-full flex justify-center py-12 bg-black col-span-1">
            <div className="divider-line w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* PIE CHART */}
          <div 
            ref={addChartRef}
            className="bg-muted/40 border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
              Feature Usage
            </h2>
            <div className="h-64 sm:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius="60%" label={(entry) => `${entry.value}%`} labelLine={false}>
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend wrapperStyle={{ fontSize: '12px' }} iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Divider for mobile only */}
          <div ref={addDividerRef} className="lg:hidden w-full flex justify-center py-12 bg-black col-span-1">
            <div className="divider-line w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* BAR CHART */}
          <div 
            ref={addChartRef}
            className="bg-muted/40 border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
              Feature Engagement
            </h2>
            <div className="h-64 sm:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="feature" stroke="#9ca3af" tick={{ fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Bar dataKey="usage" fill="#A855F7" radius={[10, 10, 0, 0]} maxBarSize={60} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Horizontal Divider for larger screens only */}
          <div ref={addDividerRef} className="hidden lg:flex w-full justify-center py-8 bg-black lg:col-span-2 xl:col-span-3">
            <div className="divider-line w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Divider for mobile only */}
          <div ref={addDividerRef} className="lg:hidden w-full flex justify-center py-12 bg-black col-span-1">
            <div className="divider-line w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* SKILLS CHART */}
          <div 
            ref={addChartRef}
            className="bg-muted/40 border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
              Skill Levels
            </h2>
            <div className="h-64 sm:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData} layout="vertical" margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="skill" type="category" stroke="#9ca3af" tick={{ fontSize: 12 }} width={80} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Bar dataKey="level" fill="#10B981" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Divider for mobile only */}
          <div ref={addDividerRef} className="lg:hidden w-full flex justify-center py-12 bg-black col-span-1">
            <div className="divider-line w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* AREA CHART */}
          <div 
            ref={addChartRef}
            className="bg-muted/40 border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
              Weekly Activity
            </h2>
            <div className="h-64 sm:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Area type="monotone" dataKey="hours" stroke="#F59E0B" fillOpacity={1} fill="url(#colorHours)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Divider for mobile only */}
          <div ref={addDividerRef} className="lg:hidden w-full flex justify-center py-12 bg-black col-span-1">
            <div className="divider-line w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* COMPOSED CHART */}
          <div 
            ref={addChartRef}
            className="bg-muted/40 border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200">
              Test Performance
            </h2>
            <div className="h-64 sm:h-72 lg:h-80">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={performanceData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#9ca3af" tick={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #e5e7eb', borderRadius: '8px' }} />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar dataKey="tests" fill="#6366F1" radius={[10, 10, 0, 0]} name="Total Tests" />
                  <Line type="monotone" dataKey="passed" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', r: 4 }} name="Passed" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Horizontal Divider for larger screens only */}
          <div ref={addDividerRef} className="hidden lg:flex w-full justify-center py-8 bg-black lg:col-span-2 xl:col-span-3">
            <div className="divider-line w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* Divider for mobile only */}
          <div ref={addDividerRef} className="lg:hidden w-full flex justify-center py-12 bg-black col-span-1">
            <div className="divider-line w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          {/* RADIAL BAR CHART */}
          <div 
            ref={addChartRef}
            className="bg-muted/40 border rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center lg:col-span-2 xl:col-span-3"
          >
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-800 dark:text-gray-200 text-center">
              Profile Completion
            </h2>
            <div className="h-64 sm:h-72 w-full max-w-md active:border-0 border-0">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" barSize={20} data={radialData} startAngle={90} endAngle={-270}>
                  <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} />
                  <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-4xl sm:text-5xl font-bold fill-indigo-600 dark:fill-indigo-400">
                    {radialData[0].value}%
                  </text>
                  <Tooltip />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
            <p className="text-sm sm:text-base font-medium mt-2 text-gray-600 dark:text-gray-400">
              Complete your profile to unlock all features
            </p>
          </div>
        </div>
      </div>

      {/* Final divider */}
      <div  className="w-full flex justify-center py-12 bg-black">
        <div className="divider-line w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>
    </section>
  )
}