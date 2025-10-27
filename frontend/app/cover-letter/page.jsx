'use client';
import React, { useState, useEffect } from 'react';
import { Plus, FileText, Calendar, Trash2, Edit, X, Sparkles } from 'lucide-react';

const CoverLetterBuilder = () => {
  const [coverLetters, setCoverLetters] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [generatingAI, setGeneratingAI] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    position: '',
    hiringManager: '',
    content: '',
    contactEmail: '',
    contactPhone: '',
    jobUrl: '',
    linkedinUrl: ''
  });

  const userId = 'USER_ID_HERE';

  useEffect(() => {
    fetchCoverLetters();
  }, []);

  const fetchCoverLetters = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/cover-letters?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cover letters');
      }

      const data = await response.json();
      setCoverLetters(data.coverLetters || []);
    } catch (err) {
      console.error('Error fetching cover letters:', err);
      setError(err.message);
      setCoverLetters([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.companyName || !formData.position || !formData.content) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const response = await fetch('/api/cover-letters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          ...formData
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create cover letter');
      }

      await fetchCoverLetters();
      
      setShowForm(false);
      setFormData({
        companyName: '',
        position: '',
        hiringManager: '',
        content: '',
        contactEmail: '',
        contactPhone: '',
        jobUrl: '',
        linkedinUrl: ''
      });
    } catch (error) {
      console.error('Error creating cover letter:', error);
      alert('Failed to create cover letter. Please try again.');
    }
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) {
      alert('Please enter a prompt for AI generation');
      return;
    }

    setGeneratingAI(true);
    try {
      // Simulate AI generation - replace with your actual AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedContent = `Dear ${formData.hiringManager || 'Hiring Manager'},

I am writing to express my strong interest in the ${formData.position || '[Position]'} role at ${formData.companyName || '[Company]'}. With my background and experience, I am confident I would be a valuable addition to your team.

${aiPrompt}

Thank you for considering my application. I look forward to the opportunity to discuss how my skills align with your team's needs.

Best regards,
[Your Name]`;

      setFormData(prev => ({ ...prev, content: generatedContent }));
      setShowAIModal(false);
      setAiPrompt('');
    } catch (error) {
      console.error('Error generating AI content:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this cover letter?')) {
      return;
    }

    try {
      const response = await fetch(`/api/cover-letters/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete cover letter');
      }

      setCoverLetters(prev => prev.filter(letter => letter.id !== id));
    } catch (error) {
      console.error('Error deleting cover letter:', error);
      alert('Failed to delete cover letter. Please try again.');
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden pt-30 px-4 sm:px-6 lg:px-8"> 
      <div className="max-w-7xl mx-auto pb-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 md:mb-12">
          <div className="flex-1">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">Cover Letters</h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white/70">Manage and create your professional cover letters</p>
          </div>
          
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-white text-black px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl hover:bg-white/90 transition-all font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl whitespace-nowrap"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">New Cover Letter</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="border border-white/10 rounded-xl p-6 animate-pulse bg-white/5 backdrop-blur-xl">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2 mb-6"></div>
                <div className="h-20 bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="text-center py-12 md:py-20 px-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-xl p-6 md:p-8 max-w-md mx-auto">
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Error Loading Cover Letters</h3>
              <p className="text-white/80 mb-6 text-sm md:text-base">{error}</p>
              <button
                onClick={fetchCoverLetters}
                className="bg-white text-black px-6 py-3 rounded-xl hover:bg-white/90 transition-all font-semibold text-sm md:text-base shadow-lg"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && coverLetters.length === 0 && (
          <div className="text-center py-12 md:py-20 px-4">
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-8 md:p-12 max-w-lg mx-auto">
              <FileText size={56} className="mx-auto mb-6 text-white/60" />
              <h3 className="text-xl md:text-2xl font-semibold text-white mb-3">No cover letters found</h3>
              <p className="text-white/80 mb-8 text-sm md:text-base max-w-md mx-auto">You haven't created any cover letters yet. Click the button to create your first one!</p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-white text-black px-8 py-3.5 rounded-xl hover:bg-white/90 transition-all font-semibold text-sm md:text-base shadow-lg"
              >
                Create Your First Cover Letter
              </button>
            </div>
          </div>
        )}

        {/* Cover Letters Grid */}
        {!loading && !error && coverLetters.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {coverLetters.map(letter => (
              <div
                key={letter.id}
                className="border border-white/20 bg-white/5 backdrop-blur-xl rounded-xl p-5 md:p-6 hover:border-white/40 hover:bg-white/10 hover:shadow-xl hover:shadow-white/10 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <FileText size={24} className="text-white" />
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      className="p-2 hover:bg-white/10 backdrop-blur-xl rounded-lg transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Edit size={16} className="text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(letter.id);
                      }}
                      className="p-2 hover:bg-white/10 backdrop-blur-xl rounded-lg transition-colors"
                    >
                      <Trash2 size={16} className="text-white" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg md:text-xl font-bold text-white mb-2">{letter.companyName}</h3>
                <p className="text-sm md:text-base text-white/80 mb-4">{letter.position}</p>
                {letter.date && (
                  <div className="flex items-center gap-2 text-xs md:text-sm text-white/60 mb-4">
                    <Calendar size={14} />
                    {new Date(letter.date).toLocaleDateString()}
                  </div>
                )}
                <p className="text-sm text-white/70 line-clamp-3">{letter.content || letter.preview}</p>
              </div>
            ))}
          </div>
        )}

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-start justify-center p-0 sm:p-4 z-50 overflow-y-auto">
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-none sm:rounded-2xl w-full max-w-5xl min-h-screen sm:min-h-0 sm:max-h-[95vh] overflow-hidden border-0 sm:border border-white/30 shadow-2xl sm:my-4 relative">
              {/* Glassy overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none"></div>
              
              {/* Header */}
              <div className="sticky top-0 z-10 bg-black/60 backdrop-blur-2xl border-b border-white/30 p-4 sm:p-6">
                <div className="flex justify-between items-start gap-3 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 sm:mb-2 tracking-tight">
                      Create Cover Letter
                    </h2>
                    <p className="text-white/80 text-xs sm:text-sm">
                      Craft a compelling cover letter tailored to your target position
                    </p>
                  </div>
                  <button
                    onClick={() => setShowForm(false)}
                    className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-xl p-1.5 sm:p-2 rounded-lg transition-all shrink-0"
                  >
                    <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-4 sm:p-6 md:p-8 overflow-y-auto max-h-[calc(100vh-200px)] sm:max-h-[calc(95vh-200px)] relative">
                {/* Position Details Section */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shrink-0 shadow-lg">
                      <span className="text-black font-bold text-base sm:text-lg">1</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">Position Details</h3>
                      <p className="text-white/80 text-xs sm:text-sm hidden sm:block">Information about the role you're applying for</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-white flex items-center gap-1.5 sm:gap-2">
                        Company Name
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white text-sm sm:text-base rounded-lg sm:rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 placeholder-white/40 transition-all shadow-inner"
                        placeholder="e.g., Google, Microsoft, Amazon"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-white flex items-center gap-1.5 sm:gap-2">
                        Position Title
                        <span className="text-red-400">*</span>
                      </label>
                      <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white text-sm sm:text-base rounded-lg sm:rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 placeholder-white/40 transition-all shadow-inner"
                        placeholder="e.g., Senior Software Engineer"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-white">
                        Hiring Manager Name
                      </label>
                      <input
                        type="text"
                        name="hiringManager"
                        value={formData.hiringManager}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white text-sm sm:text-base rounded-lg sm:rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 placeholder-white/40 transition-all shadow-inner"
                        placeholder="e.g., John Smith (Optional)"
                      />
                      <p className="text-xs text-white/60 mt-1">Leave blank if unknown</p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-white">
                        Job Posting URL
                      </label>
                      <input
                        type="url"
                        name="jobUrl"
                        value={formData.jobUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white text-sm sm:text-base rounded-lg sm:rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 placeholder-white/40 transition-all shadow-inner"
                        placeholder="https://careers.company.com/job-id"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Section */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shrink-0 shadow-lg">
                      <span className="text-black font-bold text-base sm:text-lg">2</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">Your Contact Information</h3>
                      <p className="text-white/80 text-xs sm:text-sm hidden sm:block">How employers can reach you</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-white">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white text-sm sm:text-base rounded-lg sm:rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 placeholder-white/40 transition-all shadow-inner"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <label className="text-xs sm:text-sm font-medium text-white">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="contactPhone"
                        value={formData.contactPhone}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white text-sm sm:text-base rounded-lg sm:rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 placeholder-white/40 transition-all shadow-inner"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                      <label className="text-xs sm:text-sm font-medium text-white">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        name="linkedinUrl"
                        value={formData.linkedinUrl}
                        onChange={handleInputChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white text-sm sm:text-base rounded-lg sm:rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 placeholder-white/40 transition-all shadow-inner"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Letter Content Section */}
                <div className="mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shrink-0 shadow-lg">
                      <span className="text-black font-bold text-base sm:text-lg">3</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-lg md:text-xl font-semibold text-white">Cover Letter Content</h3>
                      <p className="text-white/80 text-xs sm:text-sm hidden sm:block">Write your compelling story</p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs sm:text-sm font-medium text-white flex items-center gap-1.5 sm:gap-2">
                        Letter Body
                        <span className="text-red-400">*</span>
                      </label>
                      <button
                        onClick={() => setShowAIModal(true)}
                        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 backdrop-blur-xl border border-white/30 text-white text-xs sm:text-sm rounded-lg hover:bg-white/20 hover:border-white/50 transition-all font-medium group shadow-lg"
                      >
                        <Sparkles size={14} className="sm:w-4 sm:h-4 group-hover:animate-pulse" />
                        <span className="hidden sm:inline">Ask AI</span>
                        <span className="sm:hidden">AI</span>
                      </button>
                    </div>
                    <div className="relative">
                      <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        rows={10}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white text-xs sm:text-sm rounded-lg sm:rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 resize-none placeholder-white/40 transition-all font-mono leading-relaxed shadow-inner"
                        placeholder="Dear [Hiring Manager],

I am writing to express my strong interest in the [Position] role at [Company]. With my background in...

In my previous role at [Previous Company], I successfully...

I am particularly drawn to [Company] because...

Thank you for considering my application. I look forward to discussing how my skills and experience align with your team's needs.

Sincerely,
[Your Name]"
                      />
                      <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 text-xs text-white/50 bg-black/60 backdrop-blur-xl px-2 py-1 rounded">
                        {formData.content?.length || 0} chars
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/30 rounded-lg sm:rounded-xl shadow-lg">
                      <span className="text-base sm:text-lg shrink-0">💡</span>
                      <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                        <strong className="text-white">Pro Tip:</strong> Personalize your cover letter by researching the company's values, recent achievements, and culture. Highlight specific examples of how your experience aligns with their needs.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="sticky bottom-0 p-4 sm:p-6 border-t border-white/30 bg-black/60 backdrop-blur-2xl">
                <div className="flex flex-col-reverse sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                  <button
                    onClick={() => setShowForm(false)}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-white/30 text-white text-sm sm:text-base rounded-lg sm:rounded-xl hover:border-white hover:bg-white/10 backdrop-blur-xl transition-all font-medium"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleSubmit}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-white/90 transition-all font-semibold shadow-lg shadow-white/20"
                  >
                    Create Cover Letter
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AI Generation Modal */}
        {showAIModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-[60]">
            <div className="bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-2xl rounded-xl sm:rounded-2xl w-full max-w-2xl border border-white/30 shadow-2xl overflow-hidden relative">
              {/* Glassy overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/20 pointer-events-none"></div>
              
              {/* AI Modal Header */}
              <div className="bg-white/10 backdrop-blur-xl border-b border-white/30 p-4 sm:p-6 relative z-10">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-white to-white/80 flex items-center justify-center shrink-0 shadow-lg">
                      <Sparkles size={20} className="sm:w-6 sm:h-6 text-black" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base sm:text-xl font-bold text-white truncate">AI Cover Letter Assistant</h3>
                      <p className="text-xs sm:text-sm text-white/80 hidden sm:block">Let AI help you craft the perfect cover letter</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAIModal(false)}
                    className="text-white/70 hover:text-white hover:bg-white/10 backdrop-blur-xl p-1.5 sm:p-2 rounded-lg transition-all shrink-0"
                  >
                    <X size={18} className="sm:w-5 sm:h-5" />
                  </button>
                </div>
              </div>

              {/* AI Modal Content */}
              <div className="p-4 sm:p-6 relative z-10">
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-white mb-2 block">
                      Tell AI about your experience and what to highlight
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={6}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 bg-white/10 backdrop-blur-xl border border-white/30 text-white text-xs sm:text-sm rounded-lg sm:rounded-xl focus:outline-none focus:border-white focus:ring-2 focus:ring-white/30 resize-none placeholder-white/40 transition-all leading-relaxed shadow-inner"
                      placeholder="Example: I have 5 years of experience in full-stack development, specializing in React and Node.js. I led a team of 4 developers and increased application performance by 40%. I'm passionate about creating scalable solutions and mentoring junior developers."
                    />
                  </div>

                  <div className="flex items-start gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/30 rounded-lg sm:rounded-xl">
                    <span className="text-base sm:text-lg shrink-0">✨</span>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      <strong className="text-white">Tip:</strong> Be specific about your achievements, skills, and what makes you unique. The more details you provide, the better AI can tailor your cover letter.
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Modal Actions */}
              <div className="p-4 sm:p-6 border-t border-white/30 bg-black/40 backdrop-blur-xl relative z-10">
                <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => {
                      setShowAIModal(false);
                      setAiPrompt('');
                    }}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-white/30 text-white text-sm sm:text-base rounded-lg sm:rounded-xl hover:border-white hover:bg-white/10 backdrop-blur-xl transition-all font-medium"
                  >
                    Cancel
                  </button>
                  
                  <button
                    onClick={handleGenerateAI}
                    disabled={generatingAI || !aiPrompt.trim()}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black text-sm sm:text-base rounded-lg sm:rounded-xl hover:bg-white/90 transition-all font-semibold shadow-lg shadow-white/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {generatingAI ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        <span>Generate Cover Letter</span>
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

export default CoverLetterBuilder;