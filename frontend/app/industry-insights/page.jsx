'use client'

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrendingUp, DollarSign, Users, Briefcase } from 'lucide-react'
import axios from 'axios'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const IndustryInsights = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const headerRef = useRef(null)
  const metricsRef = useRef(null)
  const chartsRef = useRef([])
  const skillsRef = useRef(null)

  const userMessage = useMemo(() => `
Provide ONLY valid JSON (no commentary). Replace every "YourResponse" in the template below with realistic, current values (date in YYYY-MM-DD; numeric fields as numbers, percentages expressed as numeric values e.g. 3.5 for 3.5%). Round percentages to one decimal where appropriate. Do not include any extra fields or text.

{
  "date": "YourResponse",
  "summary": {
    "overall_tech_growth": "YourResponse",
    "global_tech_workforce": "YourResponse",
    "average_tech_salary": "YourResponse",
    "job_openings": "YourResponse"
  },
  "employment_trends": {
    "tech_hiring_rate_change": "YourResponse",
    "unemployment_rate": "YourResponse",
    "remote_work_percentage": "YourResponse",
    "top_hiring_domains": [
      { "domain": "YourResponse", "growth_percent": "YourResponse", "openings": "YourResponse" },
      { "domain": "YourResponse", "growth_percent": "YourResponse", "openings": "YourResponse" },
      { "domain": "YourResponse", "growth_percent": "YourResponse", "openings": "YourResponse" },
      { "domain": "YourResponse", "growth_percent": "YourResponse", "openings": "YourResponse" },
      { "domain": "YourResponse", "growth_percent": "YourResponse", "openings": "YourResponse" }
    ]
  },
  "salary_updates": {
    "average_salary_change": "YourResponse",
    "median_salary": "YourResponse",
    "top_salary_roles": [
      { "role": "YourResponse", "salary": "YourResponse", "increase_percent": "YourResponse" },
      { "role": "YourResponse", "salary": "YourResponse", "increase_percent": "YourResponse" },
      { "role": "YourResponse", "salary": "YourResponse", "increase_percent": "YourResponse" },
      { "role": "YourResponse", "salary": "YourResponse", "increase_percent": "YourResponse" },
      { "role": "YourResponse", "salary": "YourResponse", "increase_percent": "YourResponse" }
    ]
  },
  "technology_trends": {
    "emerging_technologies": [
      { "tech": "YourResponse", "trend_score": "YourResponse", "adoption_rate": "YourResponse" },
      { "tech": "YourResponse", "trend_score": "YourResponse", "adoption_rate": "YourResponse" },
      { "tech": "YourResponse", "trend_score": "YourResponse", "adoption_rate": "YourResponse" },
      { "tech": "YourResponse", "trend_score": "YourResponse", "adoption_rate": "YourResponse" },
      { "tech": "YourResponse", "trend_score": "YourResponse", "adoption_rate": "YourResponse" }
    ],
    "declining_technologies": [
      { "tech": "YourResponse", "trend_score": "YourResponse", "usage_rate": "YourResponse" },
      { "tech": "YourResponse", "trend_score": "YourResponse", "usage_rate": "YourResponse" },
      { "tech": "YourResponse", "trend_score": "YourResponse", "usage_rate": "YourResponse" }
    ]
  },
  "market_overview": {
    "global_it_spending_change": "YourResponse",
    "ai_investment_growth": "YourResponse",
    "cloud_spending_growth": "YourResponse",
    "cybersecurity_spending_growth": "YourResponse",
    "startups_funding_change": "YourResponse",
    "tech_ipo_activity": "YourResponse"
  },
  "skills_demand": [
    { "skill": "YourResponse", "demand_score": "YourResponse", "salary_impact": "YourResponse" },
    { "skill": "YourResponse", "demand_score": "YourResponse", "salary_impact": "YourResponse" },
    { "skill": "YourResponse", "demand_score": "YourResponse", "salary_impact": "YourResponse" },
    { "skill": "YourResponse", "demand_score": "YourResponse", "salary_impact": "YourResponse" },
    { "skill": "YourResponse", "demand_score": "YourResponse", "salary_impact": "YourResponse" },
    { "skill": "YourResponse", "demand_score": "YourResponse", "salary_impact": "YourResponse" }
  ],
  "regional_data": [
    { "region": "YourResponse", "growth": "YourResponse", "avg_salary": "YourResponse" },
    { "region": "YourResponse", "growth": "YourResponse", "avg_salary": "YourResponse" },
    { "region": "YourResponse", "growth": "YourResponse", "avg_salary": "YourResponse" },
    { "region": "YourResponse", "growth": "YourResponse", "avg_salary": "YourResponse" }
  ],
  "monthly_trends": [
    { "month": "YourResponse", "hiring": "YourResponse", "salary": "YourResponse", "investment": "YourResponse" },
    { "month": "YourResponse", "hiring": "YourResponse", "salary": "YourResponse", "investment": "YourResponse" },
    { "month": "YourResponse", "hiring": "YourResponse", "salary": "YourResponse", "investment": "YourResponse" },
    { "month": "YourResponse", "hiring": "YourResponse", "salary": "YourResponse", "investment": "YourResponse" },
    { "month": "YourResponse", "hiring": "YourResponse", "salary": "YourResponse", "investment": "YourResponse" },
    { "month": "YourResponse", "hiring": "YourResponse", "salary": "YourResponse", "investment": "YourResponse" }
  ]
}
`, [])

  const mockData = useMemo(() => ({
    "date": "2025-10-24",
    "summary": {
      "overall_tech_growth": 8.5,
      "global_tech_workforce": 75000000,
      "average_tech_salary": 105000,
      "job_openings": 2500000
    },
    "employment_trends": {
      "tech_hiring_rate_change": 12.3,
      "unemployment_rate": 2.1,
      "remote_work_percentage": 68.5,
      "top_hiring_domains": [
        { "domain": "AI/ML", "growth_percent": 45.2, "openings": 450000 },
        { "domain": "Cloud", "growth_percent": 38.7, "openings": 380000 },
        { "domain": "Security", "growth_percent": 35.4, "openings": 320000 },
        { "domain": "DevOps", "growth_percent": 28.9, "openings": 290000 },
        { "domain": "Data Sci", "growth_percent": 26.5, "openings": 270000 }
      ]
    },
    "salary_updates": {
      "average_salary_change": 7.8,
      "median_salary": 98000,
      "top_salary_roles": [
        { "role": "ML Engineer", "salary": 165000, "increase_percent": 15.2 },
        { "role": "DevOps Arch", "salary": 155000, "increase_percent": 12.8 },
        { "role": "Sec Engineer", "salary": 148000, "increase_percent": 11.5 },
        { "role": "Cloud Arch", "salary": 145000, "increase_percent": 10.9 },
        { "role": "Full Stack", "salary": 125000, "increase_percent": 8.7 }
      ]
    },
    "technology_trends": {
      "emerging_technologies": [
        { "tech": "Gen AI", "trend_score": 95, "adoption_rate": 67 },
        { "tech": "Edge", "trend_score": 88, "adoption_rate": 54 },
        { "tech": "Quantum", "trend_score": 82, "adoption_rate": 23 },
        { "tech": "Web3", "trend_score": 75, "adoption_rate": 41 },
        { "tech": "5G", "trend_score": 72, "adoption_rate": 58 }
      ],
      "declining_technologies": [
        { "tech": "jQuery", "trend_score": -45, "usage_rate": 32 },
        { "tech": "AngularJS", "trend_score": -38, "usage_rate": 18 },
        { "tech": "PHP 5.x", "trend_score": -35, "usage_rate": 12 }
      ]
    },
    "market_overview": {
      "global_it_spending_change": 9.2,
      "ai_investment_growth": 45.6,
      "cloud_spending_growth": 22.3,
      "cybersecurity_spending_growth": 18.7,
      "startups_funding_change": 15.4,
      "tech_ipo_activity": 8.9
    },
    "skills_demand": [
      { "skill": "Python", "demand_score": 92, "salary_impact": 15 },
      { "skill": "JavaScript", "demand_score": 89, "salary_impact": 12 },
      { "skill": "AWS", "demand_score": 85, "salary_impact": 18 },
      { "skill": "React", "demand_score": 82, "salary_impact": 14 },
      { "skill": "Docker", "demand_score": 78, "salary_impact": 16 },
      { "skill": "Kubernetes", "demand_score": 75, "salary_impact": 20 }
    ],
    "regional_data": [
      { "region": "N. America", "growth": 10.5, "avg_salary": 125000 },
      { "region": "Europe", "growth": 8.2, "avg_salary": 95000 },
      { "region": "Asia Pac", "growth": 15.8, "avg_salary": 68000 },
      { "region": "Lat America", "growth": 12.3, "avg_salary": 45000 }
    ],
    "monthly_trends": [
      { "month": "Apr", "hiring": 2200, "salary": 103000, "investment": 42 },
      { "month": "May", "hiring": 2350, "salary": 103500, "investment": 43 },
      { "month": "Jun", "hiring": 2400, "salary": 104000, "investment": 44 },
      { "month": "Jul", "hiring": 2450, "salary": 104200, "investment": 44.5 },
      { "month": "Aug", "hiring": 2480, "salary": 104800, "investment": 45 },
      { "month": "Sep", "hiring": 2500, "salary": 105000, "investment": 45.6 }
    ]
  }), [])

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE}/api/industry-insights`,
          { message: userMessage },
          { timeout: 30000, headers: { 'Content-Type': 'application/json' } }
        )
        
        const newData = response.data?.reply || response.data || mockData;
        
        if (isMounted) {
          setData(newData);
          setLoading(false);
          setError(null);
        }
        
      } catch (err) {
        if (isMounted) {
          setData(mockData);
          setLoading(false);
          setError(null);
        }
      }
    }

    fetchData()
    
    return () => {
      isMounted = false;
    }
  }, [mockData, userMessage])

  useEffect(() => {
    if (!data || typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: -80,
        duration: 1.5,
        ease: 'power4.out',
      })

      gsap.from('.subtitle', {
        opacity: 1,
        y: 30,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out',
      })

      if (metricsRef.current) {
        const metricCards = gsap.utils.toArray(metricsRef.current.children)
        
        metricCards.forEach((card, i) => {
          gsap.from(card, {
            opacity: 0,
            y: 60,
            scale: 0.8,
            rotation: -5,
            duration: 1,
            delay: 0.5 + i * 0.1,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            }
          })

          gsap.from(card.querySelector('svg'), {
            rotation: 360,
            scale: 0,
            duration: 1.2,
            delay: 0.7 + i * 0.1,
            ease: 'elastic.out(1, 0.5)',
          })
        })
      }

      chartsRef.current.forEach((chart) => {
        if (chart) {
          gsap.from(chart, {
            opacity: 0,
            y: 100,
            scale: 0.9,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: chart,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          })

          gsap.from(chart.querySelectorAll('.recharts-surface'), {
            opacity: 0,
            scale: 0.95,
            duration: 0.8,
            delay: 0.3,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: chart,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            }
          })
        }
      })

      if (skillsRef.current) {
        const skillCards = gsap.utils.toArray(skillsRef.current.children)
        
        skillCards.forEach((card, i) => {
          gsap.from(card, {
            opacity: 0,
            x: -60,
            rotation: -3,
            duration: 0.8,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: skillsRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            }
          })

          const progressBar = card.querySelector('.progress-bar')
          if (progressBar) {
            gsap.from(progressBar, {
              width: 0,
              duration: 1.5,
              delay: 0.5 + i * 0.08,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: skillsRef.current,
                start: 'top 80%',
                toggleActions: 'play none none reverse',
              }
            })
          }
        })
      }

      gsap.to('.hover-float', {
        y: -10,
        duration: 2,
        ease: 'power1.inOut',
        yoyo: true,
        repeat: -1,
        stagger: {
          each: 0.2,
          from: 'random'
        }
      })
    })

    return () => ctx.revert()
  }, [data])

  const COLORS = ['#ffffff', '#e5e5e5', '#cccccc', '#b3b3b3', '#999999', '#808080']
  console.log('Rendering with data:', data);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Loading industry insights...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">Error: {error}</p>
          <p className="text-sm text-gray-400 mt-2">Displaying mock data instead</p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-yellow-400">
          <p>No data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white py-8 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12 mt-8 sm:mt-16 lg:mt-20">
          <h1
  ref={headerRef}
  className="text-5xl md:text-6xl font-bold lg:text-7xl xl:text-8xl gradient-title mt-20"
>
  Industry Insights Dashboard
</h1>
<p className="mt-3 mb-10 text-xl sm:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 subtitle">
  Real-time technology industry trends and analytics
</p>
        </div>
        <div className="w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

        <div ref={metricsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 hover-float">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Tech Growth</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {data?.summary?.overall_tech_growth ? `+${data.summary.overall_tech_growth}%` : 'No data'}
                  </p>
                </div>
                <TrendingUp className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 hover-float">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Avg Salary</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    ${data?.summary?.average_tech_salary ? `${((data.summary.average_tech_salary) / 1000).toFixed(0)}K` : 'No data'}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 hover-float">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Job Openings</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {data?.summary?.job_openings ? `${((data.summary.job_openings) / 1000000).toFixed(1)}M` : 'No data'}
                  </p>
                </div>
                <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500 hover-float">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-xs sm:text-sm">Workforce</p>
                  <p className="text-2xl sm:text-3xl font-bold text-white">
                    {data?.summary?.global_tech_workforce ? `${((data.summary.global_tech_workforce) / 1000000).toFixed(0)}M` : 'No data'}
                  </p>
                </div>
                <Users className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500" ref={el => chartsRef.current[0] = el}>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Monthly Hiring Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.monthly_trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="month" stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="hiring" stroke="#ffffff" strokeWidth={3} dot={{ fill: '#ffffff', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="lg:hidden sm:w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500" ref={el => chartsRef.current[1] = el}>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Average Salary Progression</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data?.monthly_trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="month" stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Area type="monotone" dataKey="salary" stroke="#ffffff" fill="#ffffff" fillOpacity={0.3} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          

          <div className="lg:hidden sm:w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500" ref={el => chartsRef.current[2] = el}>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Top Hiring Domains</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.employment_trends?.top_hiring_domains || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="domain" stroke="#ffffff" angle={-30} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Bar dataKey="growth_percent" fill="#ffffff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="lg:hidden sm:w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500" ref={el => chartsRef.current[3] = el}>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Top Salary Roles</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.salary_updates?.top_salary_roles || []} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis type="number" stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="role" type="category" stroke="#ffffff" width={100} tick={{ fontSize: 11 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Bar dataKey="salary" fill="#ffffff" radius={[0, 8, 8, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="lg:hidden sm:w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500" ref={el => chartsRef.current[4] = el}>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">AI Investment Growth</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.monthly_trends || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="month" stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Line type="monotone" dataKey="investment" stroke="#ffffff" strokeWidth={3} dot={{ fill: '#ffffff', r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="lg:hidden sm:w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500" ref={el => chartsRef.current[5] = el}>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Market Growth Indicators</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'IT', value: data?.market_overview?.global_it_spending_change || 0 },
                  { name: 'AI', value: data?.market_overview?.ai_investment_growth || 0 },
                  { name: 'Cloud', value: data?.market_overview?.cloud_spending_growth || 0 },
                  { name: 'Security', value: data?.market_overview?.cybersecurity_spending_growth || 0 },
                  { name: 'Startups', value: data?.market_overview?.startups_funding_change || 0 },
                  { name: 'IPOs', value: data?.market_overview?.tech_ipo_activity || 0 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="name" stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Bar dataKey="value" fill="#ffffff" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="lg:hidden sm:w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500" ref={el => chartsRef.current[6] = el}>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Emerging Technologies</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={data?.technology_trends?.emerging_technologies || []}>
                  <PolarGrid stroke="#404040" />
                  <PolarAngleAxis dataKey="tech" stroke="#ffffff" tick={{ fontSize: 11 }} />
                  <PolarRadiusAxis stroke="#ffffff" tick={{ fontSize: 11 }} />
                  <Radar name="Trend Score" dataKey="trend_score" stroke="#ffffff" fill="#ffffff" fillOpacity={0.6} />
                  <Radar name="Adoption" dataKey="adoption_rate" stroke="#cccccc" fill="#cccccc" fillOpacity={0.3} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="lg:hidden sm:w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500" ref={el => chartsRef.current[7] = el}>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Regional Growth & Salaries</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data?.regional_data || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="region" stroke="#ffffff" tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <YAxis yAxisId="right" orientation="right" stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Bar yAxisId="left" dataKey="growth" fill="#ffffff" name="Growth %" radius={[8, 8, 0, 0]} />
                  <Bar yAxisId="right" dataKey="avg_salary" fill="#cccccc" name="Avg Salary" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="lg:hidden sm:w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500" ref={el => chartsRef.current[8] = el}>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Skills in Demand</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={data?.skills_demand || []}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ skill, demand_score }) => `${skill}: ${demand_score}`}
                    outerRadius={80}
                    fill="#ffffff"
                    dataKey="demand_score"
                  >
                    {(data?.skills_demand || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="lg:hidden sm:w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

          <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500" ref={el => chartsRef.current[9] = el}>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Skills Demand Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data?.skills_demand || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="skill" stroke="#ffffff" angle={-30} textAnchor="end" height={80} tick={{ fontSize: 11 }} />
                  <YAxis stroke="#ffffff" tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#000000', border: '1px solid #ffffff', borderRadius: '8px', fontSize: '12px' }}
                    labelStyle={{ color: '#ffffff' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px' }} />
                  <Line type="monotone" dataKey="demand_score" stroke="#ffffff" strokeWidth={2} dot={{ fill: '#ffffff', r: 5 }} name="Demand" />
                  <Line type="monotone" dataKey="salary_impact" stroke="#cccccc" strokeWidth={2} dot={{ fill: '#cccccc', r: 5 }} name="Salary Impact" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
<div className=" sm:w-full flex justify-center py-12 bg-black">
        <div className="w-3/4 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      </div>

       
        <Card className="bg-zinc-900 border-zinc-800 backdrop-blur hover:border-white hover:shadow-2xl hover:shadow-white/10 transition-all duration-500">
          <CardContent className="p-4 sm:p-6">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 text-white">In-Demand Skills Analysis</h3>
            <div ref={skillsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {(data?.skills_demand || []).map((skill, index) => (
                <div key={index} className="bg-zinc-800 p-3 sm:p-4 rounded-lg border border-zinc-700 hover:border-white hover:scale-105 transition-all duration-300">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-base sm:text-lg font-semibold text-white">{skill.skill}</h4>
                    <span className="text-xs sm:text-sm text-gray-400">+{skill.salary_impact}%</span>
                  </div>
                  <div className="w-full bg-zinc-700 rounded-full h-2 sm:h-3 overflow-hidden">
                    <div
                      className="progress-bar h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${skill.demand_score}%` }}
                    ></div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mt-2">Demand Score: {skill.demand_score}/100</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default IndustryInsights