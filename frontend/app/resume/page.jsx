'use client';
import React, { useState, useEffect } from 'react';
import { Download, Plus, X, User, Briefcase, GraduationCap, Code, Share2, Loader2, FileText, Sparkles, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';


const ResumePage = () => {
  const [resumes, setResumes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [errors, setErrors] = useState({});
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [aiFieldType, setAiFieldType] = useState('');
  const [aiFieldIndex, setAiFieldIndex] = useState(null);
  const [formData, setFormData] = useState({
    personal: { name: '', email: '', phone: '', location: '', summary: '' },
    education: [{ degree: '', institution: '', year: '', gpa: '' }],
    experience: [{ title: '', company: '', duration: '', description: '' }],
    projects: [{ name: '', description: '', technologies: '', link: '' }],
    social: { linkedin: '', github: '', portfolio: '', twitter: '' }
  });

  // Lock body scroll when form is open
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showForm]);
  useEffect(() => {
  if (showForm) {
    // Prevent background scrolling when modal is open
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
  } else {
    // Restore scrolling when modal closes
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  }
  
  // Cleanup function
  return () => {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.width = '';
  };
}, [showForm]);

  const validatePersonalInfo = () => {
    const newErrors = {};
    if (!formData.personal.name.trim()) newErrors.name = 'Name is required';
    if (!formData.personal.email.trim()) newErrors.email = 'Email is required';
    if (!formData.personal.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.personal.location.trim()) newErrors.location = 'Location is required';
    if (!formData.personal.summary.trim()) newErrors.summary = 'Summary is required';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.personal.email && !emailRegex.test(formData.personal.email)) {
      newErrors.email = 'Invalid email format';
    }
    
    return newErrors;
  };

  const validateEducation = () => {
    const newErrors = {};
    formData.education.forEach((edu, index) => {
      if (!edu.degree.trim()) newErrors[`degree_${index}`] = 'Degree is required';
      if (!edu.institution.trim()) newErrors[`institution_${index}`] = 'Institution is required';
      if (!edu.year.trim()) newErrors[`year_${index}`] = 'Year is required';
    });
    return newErrors;
  };

  const validateExperience = () => {
    const newErrors = {};
    formData.experience.forEach((exp, index) => {
      if (!exp.title.trim()) newErrors[`title_${index}`] = 'Job title is required';
      if (!exp.company.trim()) newErrors[`company_${index}`] = 'Company is required';
      if (!exp.duration.trim()) newErrors[`duration_${index}`] = 'Duration is required';
      if (!exp.description.trim()) newErrors[`description_${index}`] = 'Description is required';
    });
    return newErrors;
  };

  const validateProjects = () => {
    const newErrors = {};
    formData.projects.forEach((proj, index) => {
      if (!proj.name.trim()) newErrors[`name_${index}`] = 'Project name is required';
      if (!proj.description.trim()) newErrors[`description_${index}`] = 'Description is required';
      if (!proj.technologies.trim()) newErrors[`technologies_${index}`] = 'Technologies are required';
    });
    return newErrors;
  };

  const validateSocialLinks = () => {
    const newErrors = {};
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    
    if (formData.social.linkedin && !urlRegex.test(formData.social.linkedin)) {
      newErrors.linkedin = 'Invalid URL format';
    }
    if (formData.social.github && !urlRegex.test(formData.social.github)) {
      newErrors.github = 'Invalid URL format';
    }
    if (formData.social.portfolio && !urlRegex.test(formData.social.portfolio)) {
      newErrors.portfolio = 'Invalid URL format';
    }
    if (formData.social.twitter && !urlRegex.test(formData.social.twitter)) {
      newErrors.twitter = 'Invalid URL format';
    }
    
    return newErrors;
  };

  const validateCurrentStep = () => {
    let newErrors = {};
    
    switch (currentStep) {
      case 0:
        newErrors = validatePersonalInfo();
        break;
      case 1:
        newErrors = validateEducation();
        break;
      case 2:
        newErrors = validateExperience();
        break;
      case 3:
        newErrors = validateProjects();
        break;
      case 4:
        newErrors = validateSocialLinks();
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (section, field, value, index = null) => {
    setFormData(prev => {
      if (index !== null) {
        const sectionData = prev[section];
        const newArray = [...sectionData];
        newArray[index][field] = value;
        return { ...prev, [section]: newArray };
      }
      return { ...prev, [section]: { ...prev[section], [field]: value } };
    });
    
    if (index !== null) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${field}_${index}`];
        return newErrors;
      });
    } else {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addArrayItem = (section) => {
    const templates = {
      education: { degree: '', institution: '', year: '', gpa: '' },
      experience: { title: '', company: '', duration: '', description: '' },
      projects: { name: '', description: '', technologies: '', link: '' }
    };
    setFormData(prev => ({
      ...prev,
      [section]: [...prev[section], templates[section]]
    }));
  };

  const removeArrayItem = (section, index) => {
    if (formData[section].length > 1) {
      setFormData(prev => ({
        ...prev,
        [section]: prev[section].filter((_, i) => i !== index)
      }));
    }
  };

  const openAIModal = (fieldType, index = null) => {
    setAiFieldType(fieldType);
    setAiFieldIndex(index);
    setShowAIModal(true);
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for AI generation",
        variant: "destructive",
      });
      return;
    }

    setGeneratingAI(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let generatedContent = '';
      
      if (aiFieldType === 'summary') {
        generatedContent = `Experienced professional with ${aiPrompt}. Proven track record of delivering high-quality results and driving innovation. Passionate about leveraging technology to solve complex problems and create meaningful impact.`;
      } else if (aiFieldType === 'experience') {
        generatedContent = `• ${aiPrompt}\n• Collaborated with cross-functional teams to deliver projects on time and within budget\n• Implemented best practices and contributed to continuous improvement initiatives\n• Mentored junior team members and fostered a culture of learning`;
      } else if (aiFieldType === 'project') {
        generatedContent = `Developed and deployed ${aiPrompt}. This project showcases technical expertise and problem-solving abilities, resulting in improved efficiency and user satisfaction.`;
      }

      if (aiFieldType === 'summary') {
        setFormData(prev => ({
          ...prev,
          personal: { ...prev.personal, summary: generatedContent }
        }));
      } else if (aiFieldType === 'experience' && aiFieldIndex !== null) {
        setFormData(prev => {
          const newExperience = [...prev.experience];
          newExperience[aiFieldIndex].description = generatedContent;
          return { ...prev, experience: newExperience };
        });
      } else if (aiFieldType === 'project' && aiFieldIndex !== null) {
        setFormData(prev => {
          const newProjects = [...prev.projects];
          newProjects[aiFieldIndex].description = generatedContent;
          return { ...prev, projects: newProjects };
        });
      }
      
      setShowAIModal(false);
      setAiPrompt('');
      setAiFieldType('');
      setAiFieldIndex(null);
      
      toast({
        title: "Success",
        description: "AI content generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingAI(false);
    }
  };

  const saveResume = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newResume = {
        ...formData,
        _id: Date.now().toString(),
        atsScore: Math.floor(Math.random() * 20) + 80
      };
      
      setResumes(prev => [...prev, newResume]);
      
      setShowForm(false);
      setCurrentStep(0);
      setErrors({});
      setFormData({
        personal: { name: '', email: '', phone: '', location: '', summary: '' },
        education: [{ degree: '', institution: '', year: '', gpa: '' }],
        experience: [{ title: '', company: '', duration: '', description: '' }],
        projects: [{ name: '', description: '', technologies: '', link: '' }],
        social: { linkedin: '', github: '', portfolio: '', twitter: '' }
      });
      
      toast({
        title: "Success",
        description: "Resume created successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadResume = async (resume) => {
    toast({
      title: "Downloading",
      description: "Preparing your resume for download...",
    });
    
    // Simulate download
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Success",
      description: "Resume downloaded successfully!",
    });
  };

  const formSteps = [
    { title: 'Personal', icon: User, shortTitle: 'Info' },
    { title: 'Education', icon: GraduationCap, shortTitle: 'Edu' },
    { title: 'Experience', icon: Briefcase, shortTitle: 'Exp' },
    { title: 'Projects', icon: Code, shortTitle: 'Proj' },
    { title: 'Social', icon: Share2, shortTitle: 'Link' }
  ];

  return (
   <div className="relative min-h-screen bg-black overflow-hidden pt-30 px-4 sm:px-6 lg:px-8"> 
      {/* Animated background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-white/5 via-black to-black pointer-events-none" />
      
      <div className="relative z-10 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        {/* Header */}
        <header className="glass rounded-2xl p-6 sm:p-8 mb-6 sm:mb-8 glass-hover">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 bg-gradient-to-r from-white via-white to-white/60 bg-clip-text text-transparent animate-shimmer">
                Resume Builder
              </h1>
              <p className="text-sm sm:text-base text-white/60">Create ATS-optimized professional resumes</p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="w-full sm:w-auto bg-white hover:bg-white/90 text-black font-semibold shadow-lg hover:shadow-white/20 transition-all hover:scale-105 active:scale-95"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              <span className="hidden sm:inline">Create Resume</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </header>

        {/* Resume Cards */}
        {resumes.length === 0 ? (
          <div className="glass rounded-2xl p-12 sm:p-16 text-center glass-hover">
            <div className="animate-float mb-6">
              <FileText className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-white/30" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">No Resumes Yet</h2>
            <p className="text-white/60 mb-8 max-w-md mx-auto">
              Start building your professional resume with our AI-powered builder
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-white hover:bg-white/90 text-black font-semibold shadow-lg hover:shadow-white/20 transition-all hover:scale-105"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Resume
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {resumes.map((resume) => (
              <div 
                key={resume._id}
                className="glass rounded-2xl p-6 glass-hover group"
              >
                <h3 className="text-xl font-bold mb-2 text-white group-hover:text-white/90">{resume.personal.name}</h3>
                <p className="text-white/60 text-sm mb-3">{resume.personal.email}</p>
                <p className="text-white/80 text-sm mb-4 line-clamp-2">{resume.personal.summary}</p>
                <div className="flex gap-2 text-xs text-white/50 mb-4 flex-wrap">
                  <span className="glass px-2 py-1 rounded-lg">{resume.education?.length || 0} Education</span>
                  <span className="glass px-2 py-1 rounded-lg">{resume.experience?.length || 0} Experience</span>
                  <span className="glass px-2 py-1 rounded-lg">{resume.projects?.length || 0} Projects</span>
                </div>
                {resume.atsScore && (
                  <div className="mb-4">
                    <span className="text-sm font-semibold bg-white text-black px-3 py-1 rounded-full">
                      ATS Score: {resume.atsScore}%
                    </span>
                  </div>
                )}
                <Button
                  onClick={() => downloadResume(resume)}
                  className="w-full bg-white hover:bg-white/90 text-black font-semibold shadow-lg hover:shadow-white/20 transition-all hover:scale-105"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal - Full Screen Responsive */}
 {showForm && (
  <div className="fixed inset-0 bg-black backdrop-blur-2xl flex items-start justify-center p-0 sm:p-4 z-[9999] overflow-y-auto pt-16 sm:pt-4 lg:pt-30 md:pt-30">
    <div className="bg-black backdrop-blur-2xl rounded-none sm:rounded-2xl w-full sm:max-w-5xl min-h-[calc(100vh-4rem)] sm:min-h-0 sm:max-h-[95vh] overflow-hidden border-0 sm:border border-white/30 shadow-2xl sm:my-4 relative flex flex-col">
      {/* Glassy overlay effect */}
      <div className="absolute inset-0 pointer-events-none"></div>
      
      {/* Modal Header - Fixed */}
      <div className="flex-shrink-0 backdrop-blur-2xl border-b border-white/10 p-4 sm:p-6 bg-black/95">
        <div className="flex justify-between items-start gap-3 sm:gap-4">
          <div className="flex-1 min-w-0"> 
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
              Create Resume
            </h2>
            <p className="text-white/60 text-xs sm:text-sm">
              Build your professional resume
            </p>
          </div>
          <button 
            onClick={() => {
              setShowForm(false);
              setCurrentStep(0);
              setErrors({});
            }}
            className="text-white/60 hover:text-white hover:bg-white/5 p-2 rounded-xl transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>
      </div>

      {/* Step Indicator - Fixed */}
      <div className="flex-shrink-0 px-4 sm:px-6 py-4 sm:py-5 border-b border-white/10 backdrop-blur-2xl bg-black/95 overflow-x-auto">
        <div className="flex justify-between items-center gap-2 sm:gap-4 min-w-max sm:min-w-0 mx-auto max-w-3xl">
          {formSteps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center gap-2 relative flex-1 min-w-[60px] sm:min-w-[80px]">
                {index < formSteps.length - 1 && (
                  <div 
                    className={`hidden sm:block absolute top-5 left-1/2 w-full h-0.5 transition-all duration-300 ${
                      isCompleted ? 'bg-white' : 'bg-white/10'
                    }`} 
                    style={{ zIndex: 0 }} 
                  />
                )}
                <div 
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center relative z-10 transition-all duration-300 ${
                    isActive 
                      ? 'bg-white text-black shadow-lg shadow-white/20 scale-110' 
                      : isCompleted 
                      ? 'bg-white/20 text-white border border-white/20' 
                      : 'bg-white/5 text-white/40 border border-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span 
                  className={`text-xs font-medium text-center transition-all hidden sm:block ${
                    isActive ? 'text-white' : isCompleted ? 'text-white/60' : 'text-white/40'
                  }`}
                >
                  {step.title}
                </span>
                <span 
                  className={`text-xs font-medium text-center transition-all sm:hidden ${
                    isActive ? 'text-white' : isCompleted ? 'text-white/60' : 'text-white/40'
                  }`}
                >
                  {step.shortTitle}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Form Content - Scrollable */}
      <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto overflow-x-hidden">
        <div className="max-w-3xl mx-auto">
          {/* Personal Info Step */}
          {currentStep === 0 && (
            <div className="space-y-4 sm:space-y-5 animate-fade-in">
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">Full Name *</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={formData.personal.name}
                  onChange={(e) => handleInputChange('personal', 'name', e.target.value)}
                  className={`w-full bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 sm:py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                />
                {errors.name && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Email *</label>
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={formData.personal.email}
                    onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                    className={`w-full bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 sm:py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.email}</p>}
                </div>
                <div>
                  <label className="text-sm font-medium text-white/80 mb-2 block">Phone *</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={formData.personal.phone}
                    onChange={(e) => handleInputChange('personal', 'phone', e.target.value)}
                    className={`w-full bg-white/5 border ${errors.phone ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 sm:py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                  />
                  {errors.phone && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.phone}</p>}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">Location *</label>
                <input
                  type="text"
                  placeholder="San Francisco, CA"
                  value={formData.personal.location}
                  onChange={(e) => handleInputChange('personal', 'location', e.target.value)}
                  className={`w-full bg-white/5 border ${errors.location ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 sm:py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                />
                {errors.location && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.location}</p>}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-white/80">Professional Summary *</label>
                  <button
                    onClick={() => openAIModal('summary')}
                    className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-white text-xs rounded-lg hover:bg-white/10 hover:border-white/20 transition-all font-medium group"
                  >
                    <Sparkles className="w-3.5 h-3.5 group-hover:animate-pulse" />
                    <span className="hidden sm:inline">AI Generate</span>
                    <span className="sm:hidden">AI</span>
                  </button>
                </div>
                <textarea
                  placeholder="A brief overview of your professional background..."
                  value={formData.personal.summary}
                  onChange={(e) => handleInputChange('personal', 'summary', e.target.value)}
                  className={`w-full bg-white/5 border ${errors.summary ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/40 h-32 sm:h-36 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all resize-none text-base`}
                />
                {errors.summary && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.summary}</p>}
              </div>
            </div>
          )}

          {/* Education Step */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-5 animate-fade-in">
              {formData.education.map((edu, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-white bg-white/10 px-3 py-1 rounded-full border border-white/10">Education {index + 1}</span>
                    {formData.education.length > 1 && (
                      <button onClick={() => removeArrayItem('education', index)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">Degree *</label>
                    <input
                      type="text"
                      placeholder="Bachelor of Science in Computer Science"
                      value={edu.degree}
                      onChange={(e) => handleInputChange('education', 'degree', e.target.value, index)}
                      className={`w-full bg-white/5 border ${errors[`degree_${index}`] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                    />
                    {errors[`degree_${index}`] && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[`degree_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">Institution *</label>
                    <input
                      type="text"
                      placeholder="Stanford University"
                      value={edu.institution}
                      onChange={(e) => handleInputChange('education', 'institution', e.target.value, index)}
                      className={`w-full bg-white/5 border ${errors[`institution_${index}`] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                    />
                    {errors[`institution_${index}`] && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[`institution_${index}`]}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-white/70 mb-2 block">Year *</label>
                      <input
                        type="text"
                        placeholder="2020 - 2024"
                        value={edu.year}
                        onChange={(e) => handleInputChange('education', 'year', e.target.value, index)}
                        className={`w-full bg-white/5 border ${errors[`year_${index}`] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                      />
                      {errors[`year_${index}`] && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[`year_${index}`]}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white/70 mb-2 block">GPA (Optional)</label>
                      <input
                        type="text"
                        placeholder="3.8/4.0"
                        value={edu.gpa}
                        onChange={(e) => handleInputChange('education', 'gpa', e.target.value, index)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('education')}
                className="w-full border-2 border-dashed border-white/20 rounded-xl py-4 text-white/60 hover:border-white/40 hover:text-white hover:bg-white/5 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Another Education
              </button>
            </div>
          )}

          {/* Experience Step */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-5 animate-fade-in">
              {formData.experience.map((exp, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-white bg-white/10 px-3 py-1 rounded-full border border-white/10">Experience {index + 1}</span>
                    {formData.experience.length > 1 && (
                      <button onClick={() => removeArrayItem('experience', index)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">Job Title *</label>
                    <input
                      type="text"
                      placeholder="Senior Software Engineer"
                      value={exp.title}
                      onChange={(e) => handleInputChange('experience', 'title', e.target.value, index)}
                      className={`w-full bg-white/5 border ${errors[`title_${index}`] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                    />
                    {errors[`title_${index}`] && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[`title_${index}`]}</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-white/70 mb-2 block">Company *</label>
                      <input
                        type="text"
                        placeholder="Tech Corp"
                        value={exp.company}
                        onChange={(e) => handleInputChange('experience', 'company', e.target.value, index)}
                        className={`w-full bg-white/5 border ${errors[`company_${index}`] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                      />
                      {errors[`company_${index}`] && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[`company_${index}`]}</p>}
                    </div>
                    <div>
                      <label className="text-sm font-medium text-white/70 mb-2 block">Duration *</label>
                      <input
                        type="text"
                        placeholder="Jan 2020 - Present"
                        value={exp.duration}
                        onChange={(e) => handleInputChange('experience', 'duration', e.target.value, index)}
                        className={`w-full bg-white/5 border ${errors[`duration_${index}`] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                      />
                      {errors[`duration_${index}`] && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[`duration_${index}`]}</p>}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-white/70">Description *</label>
                      <button
                        onClick={() => openAIModal('experience', index)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-white text-xs rounded-lg hover:bg-white/10 hover:border-white/20 transition-all font-medium group"
                      >
                        <Sparkles className="w-3.5 h-3.5 group-hover:animate-pulse" />
                        <span className="hidden sm:inline">AI</span>
                      </button>
                    </div>
                    <textarea
                      placeholder="Describe your responsibilities and achievements..."
                      value={exp.description}
                      onChange={(e) => handleInputChange('experience', 'description', e.target.value, index)}
                      className={`w-full bg-white/5 border ${errors[`description_${index}`] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/40 h-28 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all resize-none text-base`}
                    />
                    {errors[`description_${index}`] && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[`description_${index}`]}</p>}
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('experience')}
                className="w-full border-2 border-dashed border-white/20 rounded-xl py-4 text-white/60 hover:border-white/40 hover:text-white hover:bg-white/5 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Another Experience
              </button>
            </div>
          )}

          {/* Projects Step */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-5 animate-fade-in">
              {formData.projects.map((proj, index) => (
                <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 sm:p-5 space-y-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-semibold text-white bg-white/10 px-3 py-1 rounded-full border border-white/10">Project {index + 1}</span>
                    {formData.projects.length > 1 && (
                      <button onClick={() => removeArrayItem('projects', index)} className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-lg transition-all">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">Project Name *</label>
                    <input
                      type="text"
                      placeholder="E-commerce Platform"
                      value={proj.name}
                      onChange={(e) => handleInputChange('projects', 'name', e.target.value, index)}
                      className={`w-full bg-white/5 border ${errors[`name_${index}`] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                    />
                    {errors[`name_${index}`] && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[`name_${index}`]}</p>}
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-white/70">Description *</label>
                      <button
                        onClick={() => openAIModal('project', index)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 text-white text-xs rounded-lg hover:bg-white/10 hover:border-white/20 transition-all font-medium group"
                      >
                        <Sparkles className="w-3.5 h-3.5 group-hover:animate-pulse" />
                        <span className="hidden sm:inline">AI</span>
                      </button>
                    </div>
                    <textarea
                      placeholder="Describe your project..."
                      value={proj.description}
                      onChange={(e) => handleInputChange('projects', 'description', e.target.value, index)}
                      className={`w-full bg-white/5 border ${errors[`description_${index}`] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/40 h-28 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all resize-none text-base`}
                    />
                    {errors[`description_${index}`] && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[`description_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">Technologies *</label>
                    <input
                      type="text"
                      placeholder="React, Node.js, MongoDB"
                      value={proj.technologies}
                      onChange={(e) => handleInputChange('projects', 'technologies', e.target.value, index)}
                      className={`w-full bg-white/5 border ${errors[`technologies_${index}`] ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                    />
                    {errors[`technologies_${index}`] && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors[`technologies_${index}`]}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-white/70 mb-2 block">Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="https://github.com/..."
                      value={proj.link}
                      onChange={(e) => handleInputChange('projects', 'link', e.target.value, index)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base"
                    />
                  </div>
                </div>
              ))}
              <button
                onClick={() => addArrayItem('projects')}
                className="w-full border-2 border-dashed border-white/20 rounded-xl py-4 text-white/60 hover:border-white/40 hover:text-white hover:bg-white/5 transition-all font-medium flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Another Project
              </button>
            </div>
          )}

          {/* Social Links Step */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-5 animate-fade-in">
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">LinkedIn</label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/..."
                  value={formData.social.linkedin}
                  onChange={(e) => handleInputChange('social', 'linkedin', e.target.value)}
                  className={`w-full bg-white/5 border ${errors.linkedin ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 sm:py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                />
                {errors.linkedin && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.linkedin}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">GitHub</label>
                <input
                  type="text"
                  placeholder="https://github.com/..."
                  value={formData.social.github}
                  onChange={(e) => handleInputChange('social', 'github', e.target.value)}
                  className={`w-full bg-white/5 border ${errors.github ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 sm:py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                />
                {errors.github && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.github}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">Portfolio</label>
                <input
                  type="text"
                  placeholder="https://yourportfolio.com"
                  value={formData.social.portfolio}
                  onChange={(e) => handleInputChange('social', 'portfolio', e.target.value)}
                  className={`w-full bg-white/5 border ${errors.portfolio ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 sm:py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                />
                {errors.portfolio && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.portfolio}</p>}
              </div>
              <div>
                <label className="text-sm font-medium text-white/80 mb-2 block">Twitter</label>
                <input
                  type="text"
                  placeholder="https://twitter.com/..."
                  value={formData.social.twitter}
                  onChange={(e) => handleInputChange('social', 'twitter', e.target.value)}
                  className={`w-full bg-white/5 border ${errors.twitter ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 sm:py-3.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all text-base`}
                />
                {errors.twitter && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3" />{errors.twitter}</p>}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Footer - Fixed at bottom */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-t border-white/10 backdrop-blur-2xl bg-black/95">
        <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between items-stretch sm:items-center">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-white/30 text-white text-sm sm:text-base rounded-lg sm:rounded-xl hover:border-white hover:bg-white/10 transition-all font-medium disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {currentStep < formSteps.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-white/90 transition-all font-semibold shadow-lg shadow-white/20"
            >
              Next
            </button>
          ) : (
            <button
              onClick={saveResume}
              disabled={isLoading}
              className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-white/90 transition-all font-semibold shadow-lg shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                'Create Resume'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
)}

        {/* AI Modal */}
         {showAIModal && (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-[10000] flex items-center justify-center p-4 overflow-hidden">
        <div className="bg-black border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
          <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                <Sparkles className="w-6 h-6" />
                AI Assistant
              </h3>
              <button 
                onClick={() => {
                  setShowAIModal(false);
                  setAiPrompt('');
                }}
                className="text-white/60 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-white/60 text-sm">
              Describe what you want to generate and AI will create professional content for you.
            </p>
            
            <textarea
              placeholder="E.g., 5 years of experience in full-stack development..."
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/40 h-32 focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 transition-all resize-none"
            />
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowAIModal(false);
                  setAiPrompt('');
                }}
                className="flex-1 px-4 py-3 border border-white/20 text-white hover:bg-white/10 rounded-xl transition-all font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerateAI}
                disabled={generatingAI}
                className="flex-1 px-4 py-3 bg-white hover:bg-white/90 text-black font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {generatingAI ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
)}
      </div>

    </div>
  );
};

export default ResumePage;