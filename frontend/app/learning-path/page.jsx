'use client'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { BookOpen, Code, Database, TrendingUp, ExternalLink, ChevronDown, ChevronUp, Loader2, Cpu, Brain, Camera, Server, Gamepad, ChartArea, ClipboardList } from 'lucide-react'

const LearningPathsCard = () => {
  const { isSignedIn, isLoaded } = useUser()
  const router = useRouter()
  const canvasRef = useRef(null)
  const [expandedCard, setExpandedCard] = useState(null)
  const [pageLoading, setPageLoading] = useState(true)
  const cardsRef = useRef([])
  const containerRef = useRef(null)

  useEffect(() => {
    if (isLoaded && !isSignedIn) router.push('/sign-in')

    if (isLoaded && isSignedIn) {
      const timer = setTimeout(() => setPageLoading(false), 1500)
      return () => clearTimeout(timer)
    }
  }, [isLoaded, isSignedIn, router])

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current || pageLoading) return

    const container = containerRef.current
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      alpha: true,
      antialias: true 
    })
    
    const updateSize = () => {
      const width = container.clientWidth
      const height = container.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }
    
    updateSize()
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    camera.position.z = 5

    // Create particle system
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1500
    const posArray = new Float32Array(particlesCount * 3)
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xffffff,
      transparent: true,
      opacity: 0.7
    })
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particlesMesh)

    // Create geometric objects
    const torusGeometry = new THREE.TorusGeometry(1, 0.3, 16, 100)
    const octahedronGeometry = new THREE.OctahedronGeometry(1.1)
    const icosahedronGeometry = new THREE.IcosahedronGeometry(0.9)
    
    const wireframeMaterial1 = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      wireframe: true,
      transparent: true,
      opacity: 0.35
    })
    const wireframeMaterial2 = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    })
    const wireframeMaterial3 = new THREE.MeshBasicMaterial({ 
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.25
    })

    const torus = new THREE.Mesh(torusGeometry, wireframeMaterial1)
    const octahedron = new THREE.Mesh(octahedronGeometry, wireframeMaterial2)
    const icosahedron = new THREE.Mesh(icosahedronGeometry, wireframeMaterial3)

    torus.position.set(-2.5, 2, 0)
    octahedron.position.set(2.5, -1.5, -1)
    icosahedron.position.set(0, -2.5, 0.5)

    scene.add(torus)
    scene.add(octahedron)
    scene.add(icosahedron)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    let mouseX = 0
    let mouseY = 0

    const handleMouseMove = (event) => {
      const rect = container.getBoundingClientRect()
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    container.addEventListener('mousemove', handleMouseMove)

    // Animation
    const clock = new THREE.Clock()
    
    const animate = () => {
      requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      particlesMesh.rotation.y = elapsedTime * 0.03
      particlesMesh.rotation.x = elapsedTime * 0.02
      
      torus.rotation.x = elapsedTime * 0.35
      torus.rotation.y = elapsedTime * 0.25
      
      octahedron.rotation.x = elapsedTime * 0.2
      octahedron.rotation.y = elapsedTime * 0.3
      
      icosahedron.rotation.x = elapsedTime * 0.25
      icosahedron.rotation.z = elapsedTime * 0.2

      camera.position.x += (mouseX * 0.2 - camera.position.x) * 0.05
      camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      updateSize()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('mousemove', handleMouseMove)
      renderer.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
      torusGeometry.dispose()
      octahedronGeometry.dispose()
      icosahedronGeometry.dispose()
      wireframeMaterial1.dispose()
      wireframeMaterial2.dispose()
      wireframeMaterial3.dispose()
    }
  }, [pageLoading])

  // Scroll Animation with Intersection Observer
  useEffect(() => {
    if (pageLoading) return

    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('card-visible')
        }
      })
    }, options)

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => observer.disconnect()
  }, [pageLoading])

  const learningPaths = [
    {
      id: 1,
      title: 'Software Engineer',
      icon: <Code className="w-6 h-6" />,
      description: 'Master full-stack development and software architecture',
      syllabus: [
        { module: 'Fundamentals', topics: ['Data Structures', 'Algorithms', 'System Design', 'OOP'] },
        { module: 'Frontend', topics: ['React/Vue', 'TypeScript', 'Tailwind CSS', 'State Management'] },
        { module: 'Backend', topics: ['Node.js/Python', 'REST APIs', 'GraphQL', 'Microservices'] },
        { module: 'Database', topics: ['SQL', 'NoSQL', 'Redis', 'Database Design'] },
        { module: 'DevOps', topics: ['Git', 'Docker', 'CI/CD', 'AWS/Azure'] }
      ],
      resources: [
        { name: 'LeetCode', url: '#', type: 'Practice' },
        { name: 'Frontend Masters', url: '#', type: 'Course' },
        { name: 'System Design Primer', url: '#', type: 'Guide' },
        { name: 'MDN Web Docs', url: '#', type: 'Documentation' }
      ],
      duration: '12-18 months',
      difficulty: 'Intermediate to Advanced'
    },
    {
      id: 2,
      title: 'Data Analyst',
      icon: <Database className="w-6 h-6" />,
      description: 'Transform data into actionable business insights',
      syllabus: [
        { module: 'Statistics', topics: ['Descriptive Stats', 'Inferential Stats', 'Probability', 'Hypothesis Testing'] },
        { module: 'SQL & Databases', topics: ['Advanced SQL', 'Query Optimization', 'Data Warehousing', 'ETL'] },
        { module: 'Python/R', topics: ['Pandas', 'NumPy', 'Matplotlib', 'Seaborn'] },
        { module: 'Visualization', topics: ['Tableau', 'Power BI', 'Excel', 'Dashboard Design'] },
        { module: 'Business Intelligence', topics: ['KPI Metrics', 'A/B Testing', 'Reporting', 'Storytelling'] }
      ],
      resources: [
        { name: 'Kaggle', url: '#', type: 'Practice' },
        { name: 'DataCamp', url: '#', type: 'Course' },
        { name: 'SQL Zoo', url: '#', type: 'Tutorial' },
        { name: 'Tableau Public', url: '#', type: 'Tool' }
      ],
      duration: '8-12 months',
      difficulty: 'Beginner to Intermediate'
    },
    {
      id: 3,
      title: 'Machine Learning Engineer',
      icon: <TrendingUp className="w-6 h-6" />,
      description: 'Build and deploy intelligent AI systems',
      syllabus: [
        { module: 'Mathematics', topics: ['Linear Algebra', 'Calculus', 'Statistics', 'Optimization'] },
        { module: 'ML Fundamentals', topics: ['Supervised Learning', 'Unsupervised Learning', 'Deep Learning', 'NLP'] },
        { module: 'Frameworks', topics: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras'] },
        { module: 'MLOps', topics: ['Model Deployment', 'ML Pipelines', 'Monitoring', 'Version Control'] },
        { module: 'Advanced Topics', topics: ['Computer Vision', 'Transformers', 'Reinforcement Learning', 'GANs'] }
      ],
      resources: [
        { name: 'Fast.ai', url: '#', type: 'Course' },
        { name: 'Papers with Code', url: '#', type: 'Research' },
        { name: 'Coursera ML', url: '#', type: 'Course' },
        { name: 'Hugging Face', url: '#', type: 'Platform' }
      ],
      duration: '15-24 months',
      difficulty: 'Advanced'
    },
    {
      id: 4,
      title: 'Cloud Architect',
      icon: <BookOpen className="w-6 h-6" />,
      description: 'Design scalable cloud infrastructure solutions',
      syllabus: [
        { module: 'Cloud Platforms', topics: ['AWS', 'Azure', 'GCP', 'Multi-cloud'] },
        { module: 'Infrastructure', topics: ['VPC', 'Load Balancers', 'Auto-scaling', 'CDN'] },
        { module: 'Security', topics: ['IAM', 'Encryption', 'Compliance', 'Network Security'] },
        { module: 'DevOps', topics: ['Terraform', 'Kubernetes', 'Ansible', 'Monitoring'] },
        { module: 'Architecture', topics: ['Microservices', 'Serverless', 'Event-driven', 'Cost Optimization'] }
      ],
      resources: [
        { name: 'AWS Training', url: '#', type: 'Course' },
        { name: 'A Cloud Guru', url: '#', type: 'Platform' },
        { name: 'Cloud Academy', url: '#', type: 'Course' },
        { name: 'Azure Docs', url: '#', type: 'Documentation' }
      ],
      duration: '12-18 months',
      difficulty: 'Advanced'
    },
    {
    id: 5,
    title: 'AI Engineer',
    icon: <Cpu className="w-6 h-6" />,
    description: 'Design and implement AI-powered applications and systems',
    syllabus: [
      { module: 'Mathematics', topics: ['Linear Algebra', 'Probability', 'Optimization'] },
      { module: 'AI Fundamentals', topics: ['Machine Learning', 'Deep Learning', 'Reinforcement Learning'] },
      { module: 'Programming & Frameworks', topics: ['Python', 'TensorFlow', 'PyTorch'] },
      { module: 'Deployment', topics: ['Cloud Services', 'APIs', 'MLOps'] },
      { module: 'Advanced Topics', topics: ['Computer Vision', 'NLP', 'Generative AI'] }
    ],
    resources: [
      { name: 'OpenAI', url: '#', type: 'Platform' },
      { name: 'DeepLearning.ai', url: '#', type: 'Course' },
      { name: 'Hugging Face', url: '#', type: 'Platform' },
      { name: 'ArXiv', url: '#', type: 'Research' }
    ],
    duration: '12-20 months',
    difficulty: 'Advanced'
  },
  {
    id: 6,
    title: 'Deep Learning Specialist',
    icon: <Brain className="w-6 h-6" />,
    description: 'Master neural networks and cutting-edge deep learning models',
    syllabus: [
      { module: 'Mathematics', topics: ['Linear Algebra', 'Calculus', 'Probability'] },
      { module: 'Neural Networks', topics: ['Feedforward Networks', 'CNNs', 'RNNs', 'Transformers'] },
      { module: 'Frameworks', topics: ['TensorFlow', 'PyTorch', 'Keras'] },
      { module: 'Advanced Topics', topics: ['GANs', 'Reinforcement Learning', 'Attention Mechanisms'] },
      { module: 'Optimization & Deployment', topics: ['Hyperparameter Tuning', 'Model Serving', 'MLOps'] }
    ],
    resources: [
      { name: 'DeepLearning.ai', url: '#', type: 'Course' },
      { name: 'Papers with Code', url: '#', type: 'Research' },
      { name: 'Fast.ai', url: '#', type: 'Course' },
      { name: 'TensorFlow Hub', url: '#', type: 'Platform' }
    ],
    duration: '12-18 months',
    difficulty: 'Advanced'
  },
  {
    id: 7,
    title: 'Natural Language Processing (NLP) Engineer',
    icon: <ChartArea className="w-6 h-6" />,
    description: 'Build systems that understand, interpret, and generate human language',
    syllabus: [
      { module: 'Mathematics & Linguistics', topics: ['Linear Algebra', 'Probability', 'Syntax', 'Semantics'] },
      { module: 'NLP Fundamentals', topics: ['Tokenization', 'Embeddings', 'Text Classification', 'Sequence Modeling'] },
      { module: 'Deep Learning for NLP', topics: ['RNNs', 'Transformers', 'BERT', 'GPT'] },
      { module: 'Tools & Libraries', topics: ['Hugging Face', 'NLTK', 'SpaCy', 'TensorFlow', 'PyTorch'] },
      { module: 'Applications', topics: ['Chatbots', 'Machine Translation', 'Text Summarization', 'Information Retrieval'] }
    ],
    resources: [
      { name: 'Hugging Face Course', url: '#', type: 'Course' },
      { name: 'Stanford NLP', url: '#', type: 'Course' },
      { name: 'Kaggle NLP Competitions', url: '#', type: 'Platform' },
      { name: 'ArXiv NLP Papers', url: '#', type: 'Research' }
    ],
    duration: '12-18 months',
    difficulty: 'Advanced'
  },
  {
    id: 8,
    title: 'Computer Vision Engineer',
    icon: <Camera className="w-6 h-6" />,
    description: 'Develop systems that understand and interpret visual data',
    syllabus: [
      { module: 'Mathematics', topics: ['Linear Algebra', 'Probability', 'Calculus', 'Optimization'] },
      { module: 'CV Fundamentals', topics: ['Image Processing', 'Feature Extraction', 'Object Detection', 'Segmentation'] },
      { module: 'Deep Learning', topics: ['CNNs', 'ResNet', 'YOLO', 'GANs'] },
      { module: 'Tools & Frameworks', topics: ['OpenCV', 'TensorFlow', 'PyTorch', 'Keras'] },
      { module: 'Advanced Topics', topics: ['3D Vision', 'Video Analysis', 'Augmented Reality', 'Reinforcement Learning'] }
    ],
    resources: [
      { name: 'OpenCV Tutorials', url: '#', type: 'Platform' },
      { name: 'Fast.ai CV Course', url: '#', type: 'Course' },
      { name: 'Papers with Code CV', url: '#', type: 'Research' },
      { name: 'DeepLearning.ai CV Specialization', url: '#', type: 'Course' }
    ],
    duration: '12-20 months',
    difficulty: 'Advanced'
  },
  {
    id: 9,
    title: 'MLOps Engineer',
    icon: <Server className="w-6 h-6" />,
    description: 'Manage, deploy, and monitor machine learning systems at scale',
    syllabus: [
      { module: 'ML Fundamentals', topics: ['Supervised Learning', 'Unsupervised Learning', 'Model Evaluation'] },
      { module: 'DevOps Basics', topics: ['CI/CD', 'Containers', 'Version Control', 'Cloud Platforms'] },
      { module: 'MLOps Tools', topics: ['Kubeflow', 'MLflow', 'TensorFlow Serving', 'Docker', 'Kubernetes'] },
      { module: 'Monitoring & Maintenance', topics: ['Model Drift', 'Performance Monitoring', 'Logging', 'Alerting'] },
      { module: 'Advanced Topics', topics: ['Pipeline Automation', 'A/B Testing', 'Scaling Models'] }
    ],
    resources: [
      { name: 'MLOps Community', url: '#', type: 'Platform' },
      { name: 'Google MLOps Guide', url: '#', type: 'Documentation' },
      { name: 'MLflow Docs', url: '#', type: 'Reference' },
      { name: 'Coursera MLOps', url: '#', type: 'Course' }
    ],
    duration: '12-18 months',
    difficulty: 'Advanced'
  },
  {
    id: 10,
    title: 'Reinforcement Learning (RL) Engineer',
    icon: <Gamepad className="w-6 h-6" />,
    description: 'Build intelligent agents that learn through interactions with environments',
    syllabus: [
      { module: 'Mathematics', topics: ['Probability', 'Linear Algebra', 'Calculus', 'Optimization'] },
      { module: 'RL Fundamentals', topics: ['Markov Decision Processes', 'Value Functions', 'Policy Gradients'] },
      { module: 'Deep RL', topics: ['DQN', 'A3C', 'PPO', 'Actor-Critic Methods'] },
      { module: 'Tools & Frameworks', topics: ['OpenAI Gym', 'RLlib', 'TensorFlow', 'PyTorch'] },
      { module: 'Applications', topics: ['Robotics', 'Games', 'Autonomous Systems', 'Simulation Environments'] }
    ],
    resources: [
      { name: 'OpenAI Gym', url: '#', type: 'Platform' },
      { name: 'Deep RL Bootcamp', url: '#', type: 'Course' },
      { name: 'Papers with Code RL', url: '#', type: 'Research' },
      { name: 'Spinning Up in Deep RL', url: '#', type: 'Tutorial' }
    ],
    duration: '12-24 months',
    difficulty: 'Advanced'
  },
  {
    id: 11,
    title: 'AI Product Manager',
    icon: <ClipboardList className="w-6 h-6" />,
    description: 'Lead AI product development and strategy bridging business and technology',
    syllabus: [
      { module: 'AI Fundamentals', topics: ['Machine Learning Basics', 'Deep Learning Overview', 'NLP & CV'] },
      { module: 'Product Management', topics: ['Roadmaps', 'Market Research', 'Stakeholder Management'] },
      { module: 'Data & Analytics', topics: ['Data-Driven Decision Making', 'Metrics', 'A/B Testing'] },
      { module: 'AI Strategy', topics: ['AI Ethics', 'Regulations', 'Responsible AI'] },
      { module: 'Tools', topics: ['JIRA', 'Trello', 'Notion', 'Analytics Platforms'] }
    ],
    resources: [
      { name: 'Coursera AI for PMs', url: '#', type: 'Course' },
      { name: 'Product School', url: '#', type: 'Course' },
      { name: 'Mind the Product', url: '#', type: 'Platform' },
      { name: 'Harvard AI Strategy', url: '#', type: 'Course' }
    ],
    duration: '9-15 months',
    difficulty: 'Intermediate-Advanced'
  }
  ]

  if (pageLoading || !isLoaded) {
    return (
      <section className="relative bg-black overflow-hidden py-16 sm:py-20 lg:py-24">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 mb-4 text-white animate-spin" />
          <p className="text-lg font-medium text-gray-400">Loading learning paths...</p>
        </div>
      </section>
    )
  }

  if (!isSignedIn) return null

  return (
    <section ref={containerRef} className="relative bg-black overflow-hidden py-12 sm:py-16 lg:py-20">
      {/* Three.js Background */}
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-12 header-animate">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 mt-20 gradient-title">
            Learning Paths
          </h2>
          <div className="w-20 sm:w-24 h-1 bg-white mx-auto mb-4"></div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto px-4">
            Choose your career path and start learning today
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 max-w-6xl mx-auto">
          {learningPaths.map((path, index) => (
            <div
              key={path.id}
              ref={(el) => (cardsRef.current[index] = el)}
              className="card-scroll-animate group relative bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 overflow-hidden"
            >
              {/* Card Header */}
              <div className="p-4 sm:p-5 border-b border-white/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg group-hover:bg-white/20 transition-all">
                    {path.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-white">
                    {path.title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-400">{path.description}</p>
              </div>

              {/* Card Body */}
              <div className="p-4 sm:p-5">
                {/* Duration & Difficulty */}
                <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
                  <div className="flex-1 bg-white/5 px-2 sm:px-3 py-2 rounded-lg border border-white/10">
                    <span className="text-xs text-gray-500 block">Duration</span>
                    <span className="text-xs sm:text-sm font-medium text-white">{path.duration}</span>
                  </div>
                  <div className="flex-1 bg-white/5 px-2 sm:px-3 py-2 rounded-lg border border-white/10">
                    <span className="text-xs text-gray-500 block">Level</span>
                    <span className="text-xs sm:text-sm font-medium text-white">{path.difficulty}</span>
                  </div>
                </div>

                {/* Expandable Syllabus */}
                <button
                  onClick={() => setExpandedCard(expandedCard === path.id ? null : path.id)}
                  className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg transition-colors mb-3 border border-white/10"
                >
                  <span className="text-white text-xs sm:text-sm font-medium">Syllabus</span>
                  {expandedCard === path.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {/* Syllabus Content */}
                {expandedCard === path.id && (
                  <div className="mb-3 sm:mb-4 space-y-2 animate-fadeIn">
                    {path.syllabus.map((module, idx) => (
                      <div key={idx} className="bg-white/5 p-2.5 sm:p-3 rounded-lg border border-white/10">
                        <h4 className="text-white text-xs sm:text-sm font-medium mb-2">{module.module}</h4>
                        <div className="flex flex-wrap gap-1 sm:gap-1.5">
                          {module.topics.map((topic, topicIdx) => (
                            <span
                              key={topicIdx}
                              className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Resources */}
                <div className="mb-3 sm:mb-4">
                  <h4 className="text-xs sm:text-sm font-semibold text-white mb-2">Resources</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {path.resources.map((resource, idx) => (
                      <a
                        key={idx}
                        href={resource.url}
                        className="flex items-center justify-between bg-white/5 hover:bg-white/10 p-2 sm:p-2.5 rounded-lg transition-colors group/resource border border-white/10"
                      >
                        <div className="min-w-0">
                          <p className="text-white text-xs font-medium truncate">{resource.name}</p>
                          <p className="text-gray-500 text-xs">{resource.type}</p>
                        </div>
                        <ExternalLink className="w-3 h-3 text-gray-500 group-hover/resource:text-white transition-colors flex-shrink-0 ml-2" />
                      </a>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button className="w-full bg-white text-black font-semibold py-2 sm:py-2.5 px-4 rounded-lg hover:bg-gray-200 transition-all duration-300 text-xs sm:text-sm">
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInHeader {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .header-animate {
          animation: fadeInHeader 1s ease-out;
        }

        .card-scroll-animate {
          opacity: 0;
          transform: translateY(50px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }

        .card-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .card-scroll-animate:nth-child(1) {
          transition-delay: 0.1s;
        }

        .card-scroll-animate:nth-child(2) {
          transition-delay: 0.2s;
        }

        .card-scroll-animate:nth-child(3) {
          transition-delay: 0.3s;
        }

        .card-scroll-animate:nth-child(4) {
          transition-delay: 0.4s;
        }
      `}</style>
    </section>
  )
}

export default LearningPathsCard