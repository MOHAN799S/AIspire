'use client';

import { useEffect, useState } from 'react';
import { ChevronDown, Search, X, Filter, Edit2, Trash2, Eye, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '@/components/auth/AuthContext';

type FeedbackItem = {
  _id: string;
  name: string;
  email: string;
  type: 'bug' | 'feature' | 'suggestion' | 'other';
  message: string;
  pageUrl?: string;
  userId?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'archived';
  priority?: 'low' | 'medium' | 'high' | 'critical';
  adminNotes?: string;
  emailSent?: boolean;
  emailSentAt?: string;
  userAgent?: string;
  ipAddress?: string;
  createdAt: string;
  updatedAt: string;
};

type FilterType = 'all' | 'bug' | 'feature' | 'suggestion' | 'other';
type FilterStatus = 'all' | 'open' | 'in_progress' | 'resolved' | 'archived';

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL ;

const CustomSelect = ({ value, onChange, options, label, icon }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedOption = options.find((opt: any) => opt.value === value);
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 flex items-center justify-between hover:bg-neutral-800/50 transition-colors"
      >
        <span className="flex items-center gap-2">
          {icon}
          <span className="text-neutral-400 text-xs mr-2">{label}:</span>
          {selectedOption?.label}
        </span>
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl z-20 overflow-hidden">
            {options.map((option: any) => (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                  value === option.value
                    ? 'bg-sky-500/20 text-sky-400'
                    : 'text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const FeedbackAdminPage = () => {
  const { user, loading: authLoading } = useAuth();
  
    const isSignedIn = !!user;

  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackItem | null>(null);
  const [editMode, setEditMode] = useState(false);
  
  const [editForm, setEditForm] = useState({
    status: 'open' as FeedbackItem['status'],
    priority: 'medium' as FeedbackItem['priority'],
    adminNotes: '',
  });
  
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [actionStatus, setActionStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);


const isAdmin = user?.email === ADMIN_EMAIL;


  const fetchFeedback = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/feedback`);
      if (!res.ok) {
        throw new Error('Failed to fetch feedback');
      }
      const data = await res.json();
      setFeedbacks(data);
      setFilteredFeedbacks(data);
    } catch (err: any) {
      setError(err.message || 'Error fetching feedback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn && isAdmin) {
      fetchFeedback();
    }
  }, [isSignedIn, isAdmin]);

  useEffect(() => {
    let filtered = [...feedbacks];

    if (typeFilter !== 'all') {
      filtered = filtered.filter(fb => fb.type === typeFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(fb => fb.status === statusFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(fb =>
        fb.name.toLowerCase().includes(query) ||
        fb.email.toLowerCase().includes(query) ||
        fb.message.toLowerCase().includes(query)
      );
    }

    setFilteredFeedbacks(filtered);
  }, [typeFilter, statusFilter, searchQuery, feedbacks]);

  const handleUpdateFeedback = async () => {
    if (!selectedFeedback) return;
    setUpdating(true);
    setActionStatus(null);
    setShowUpdateConfirm(false);

    try {
      const res = await fetch(`http://localhost:5000/api/feedback/${selectedFeedback._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to update feedback');
      }

      setActionStatus({ type: 'success', message: 'Feedback updated successfully!' });
      
      // Update local state
      setFeedbacks(prev => prev.map(fb => 
        fb._id === selectedFeedback._id ? data.feedback : fb
      ));
      setSelectedFeedback(data.feedback);
      setEditMode(false);

      // Clear success message after 3 seconds
      setTimeout(() => setActionStatus(null), 3000);
    } catch (err: any) {
      setActionStatus({ type: 'error', message: err.message || 'Failed to update feedback' });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteFeedback = async () => {
    if (!selectedFeedback) return;

    setDeleting(true);
    setActionStatus(null);
    setShowDeleteConfirm(false);

    try {
      const res = await fetch(`http://localhost:5000/api/feedback/${selectedFeedback._id}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete feedback');
      }

      setActionStatus({ type: 'success', message: 'Feedback deleted successfully!' });
      
      // Remove from local state
      setFeedbacks(prev => prev.filter(fb => fb._id !== selectedFeedback._id));
      
      // Close modal after brief delay
      setTimeout(() => {
        setSelectedFeedback(null);
        setActionStatus(null);
      }, 1500);
    } catch (err: any) {
      setActionStatus({ type: 'error', message: err.message || 'Failed to delete feedback' });
    } finally {
      setDeleting(false);
    }
  };

  const openEditMode = (feedback: FeedbackItem) => {
    setSelectedFeedback(feedback);
    setEditForm({
      status: feedback.status,
      priority: feedback.priority || 'medium',
      adminNotes: feedback.adminNotes || '',
    });
    setEditMode(true);
    setActionStatus(null);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      bug: 'bg-red-500/10 border-red-500/30 text-red-400',
      feature: 'bg-green-500/10 border-green-500/30 text-green-400',
      suggestion: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      other: 'bg-neutral-500/10 border-neutral-500/30 text-neutral-400',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
      in_progress: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
      resolved: 'bg-green-500/10 border-green-500/30 text-green-400',
      archived: 'bg-neutral-500/10 border-neutral-500/30 text-neutral-400',
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

  const getPriorityColor = (priority?: string) => {
    const colors = {
      low: 'text-neutral-400',
      medium: 'text-yellow-400',
      high: 'text-orange-400',
      critical: 'text-red-400',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const stats = {
    total: feedbacks.length,
    open: feedbacks.filter(f => f.status === 'open').length,
    bugs: feedbacks.filter(f => f.type === 'bug').length,
    features: feedbacks.filter(f => f.type === 'feature').length,
  };

  const typeOptions = [
    { value: 'all', label: 'All Types' },
    { value: 'bug', label: 'Bug' },
    { value: 'feature', label: 'Feature' },
    { value: 'suggestion', label: 'Suggestion' },
    { value: 'other', label: 'Other' },
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'archived', label: 'Archived' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' },
  ];
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    "Verifying credentials...",
    "Establishing secure connection...",
    "Checking access permissions...",
    "Loading encrypted modules...",
    "Initializing secure session..."
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) return prev + 1;
        return prev;
      });
    }, 1200);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 100) return prev + 2;
        return prev;
      });
    }, 60);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  if (authLoading) {
   return (
  <div className="min-h-screen flex items-center justify-center bg-black px-4">
    <div className="bg-muted/20 border border-neutral-800 rounded-2xl px-12 py-10 w-full max-w-xl">
      {/* Lock icon */}
      <div className="flex justify-center mb-6">
        <div className="bg-neutral-800 p-4 rounded-full">
          <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h1 className="text-neutral-100 text-2xl font-semibold text-center mb-2">
        Secure Access
      </h1>
      
      {/* Current step */}
      <div className="min-h-[50px] flex items-center justify-center">
        <p className="text-neutral-400 text-sm text-center">
          Checking access permissions...
        </p>
      </div>

      {/* Loader */}
      <div className="flex justify-center mt-6">
        <div className="w-8 h-8 border-2 border-neutral-700 border-t-neutral-400 rounded-full animate-spin"></div>
      </div>

      {/* Security badge */}
      <div className="flex items-center justify-center gap-2 mt-6 text-neutral-600 text-xs">
        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-mono">Encrypted connection</span>
      </div>
    </div>
  </div>
);

  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black px-4">
        <div className="bg-muted/10 border border-neutral-800 rounded-2xl px-12 py-10 max-w-md text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-neutral-800 p-4 rounded-full">
              <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-semibold text-neutral-100 mb-2">
            Sign in required
          </h2>
          <p className="text-neutral-400 text-sm">
            Please sign in to view feedback dashboard.
          </p>
        </div>
      </div>
    );
  }
if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-black">
        <div 
          className="border rounded-xl p-8 max-w-md text-center border-red-500 bg-red-500/5 animate-pulse"
        >
          <div className="mb-4 flex justify-center">
            <svg 
              className="w-16 h-16 text-red-500"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
              />
            </svg>
          </div>
          
          <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
          <p className="text-neutral-400 text-sm mb-4">
            This page is only accessible to the AIspire admin.
          </p>
          <p className="text-neutral-500 text-xs">
            You do not have the required permissions to view this content. 
            Please contact your administrator if you believe this is an error.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 py-30 bg-black">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="lg:text-6xl md:text-5xl text-5xl font-semibold text-white mb-2 gradient-title">Feedback Dashboard</h1>
          <p className="text-neutral-400 text-sm">
            Manage and track user feedback from the AIspire platform
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/40 hover:bg-neutral-900/60 transition-colors">
            <p className="text-neutral-400 text-xs mb-1">Total Feedback</p>
            <p className="text-white text-xl sm:text-2xl font-semibold">{stats.total}</p>
          </div>
          <div className="border border-yellow-500/30 rounded-xl p-4 bg-yellow-500/5 hover:bg-yellow-500/10 transition-colors">
            <p className="text-neutral-400 text-xs mb-1">Open Items</p>
            <p className="text-yellow-400 text-xl sm:text-2xl font-semibold">{stats.open}</p>
          </div>
          <div className="border border-red-500/30 rounded-xl p-4 bg-red-500/5 hover:bg-red-500/10 transition-colors">
            <p className="text-neutral-400 text-xs mb-1">Bug Reports</p>
            <p className="text-red-400 text-xl sm:text-2xl font-semibold">{stats.bugs}</p>
          </div>
          <div className="border border-green-500/30 rounded-xl p-4 bg-green-500/5 hover:bg-green-500/10 transition-colors">
            <p className="text-neutral-400 text-xs mb-1">Feature Requests</p>
            <p className="text-green-400 text-xl sm:text-2xl font-semibold">{stats.features}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="border border-neutral-800 rounded-xl p-4 sm:p-5 mb-6 bg-neutral-900/40">
          <div className="flex flex-col gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                placeholder="Search by name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 placeholder:text-neutral-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Filter Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <CustomSelect
                value={typeFilter}
                onChange={setTypeFilter}
                options={typeOptions}
                label="Type"
                icon={<Filter className="w-4 h-4 text-neutral-500" />}
              />
              
              <CustomSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={statusOptions}
                label="Status"
                icon={<Filter className="w-4 h-4 text-neutral-500" />}
              />
            </div>
          </div>
          
          {(typeFilter !== 'all' || statusFilter !== 'all' || searchQuery) && (
            <div className="mt-4 pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <p className="text-neutral-400 text-sm">
                Showing {filteredFeedbacks.length} of {feedbacks.length} items
              </p>
              <button
                onClick={() => {
                  setTypeFilter('all');
                  setStatusFilter('all');
                  setSearchQuery('');
                }}
                className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                Clear filters
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="border border-neutral-800 rounded-xl p-6 text-center bg-neutral-900/40">
            <div className="animate-pulse">
              <div className="h-4 bg-neutral-800 rounded w-32 mx-auto"></div>
            </div>
          </div>
        ) : error ? (
          <div className="border border-red-500/30 bg-red-500/5 rounded-xl p-6">
            <p className="text-red-400 text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Error: {error}
            </p>
          </div>
        ) : filteredFeedbacks.length === 0 ? (
          <div className="border border-neutral-800 rounded-xl p-8 text-center bg-neutral-900/40">
            <p className="text-neutral-400 text-sm">
              {feedbacks.length === 0 ? 'No feedback submitted yet.' : 'No feedback matches your filters.'}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile Cards View */}
            <div className="lg:hidden space-y-3">
              {filteredFeedbacks.map((fb) => (
                <div key={fb._id} className="border border-neutral-800 rounded-xl p-4 bg-neutral-900/40 hover:bg-neutral-900/60 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium truncate">{fb.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{fb.email}</p>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <button
                        onClick={() => {
                          setSelectedFeedback(fb);
                          setEditMode(false);
                        }}
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4 text-sky-400" />
                      </button>
                      <button
                        onClick={() => openEditMode(fb)}
                        className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-yellow-400" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getTypeColor(fb.type)}`}>
                      {fb.type}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(fb.status)}`}>
                      {fb.status.replace('_', ' ')}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium ${getPriorityColor(fb.priority)}`}>
                      {fb.priority || 'medium'}
                    </span>
                  </div>
                  
                  <p className="text-neutral-300 text-sm line-clamp-2 mb-2">{fb.message}</p>
                  <p className="text-xs text-neutral-500">
                    {new Date(fb.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block border border-neutral-800 rounded-xl overflow-hidden bg-neutral-900/40">
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-neutral-900/80 border-b border-neutral-800">
                    <tr>
                      <th className="px-4 py-3 text-left text-neutral-400 font-medium">User</th>
                      <th className="px-4 py-3 text-left text-neutral-400 font-medium">Type</th>
                      <th className="px-4 py-3 text-left text-neutral-400 font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-neutral-400 font-medium">Priority</th>
                      <th className="px-4 py-3 text-left text-neutral-400 font-medium">Message</th>
                      <th className="px-4 py-3 text-left text-neutral-400 font-medium">Date</th>
                      <th className="px-4 py-3 text-left text-neutral-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {filteredFeedbacks.map((fb) => (
                      <tr key={fb._id} className="hover:bg-neutral-900/60 transition-colors">
                        <td className="px-4 py-3 align-top">
                          <div className="flex flex-col">
                            <span className="text-white font-medium truncate max-w-[150px]">
                              {fb.name}
                            </span>
                            <span className="text-xs text-neutral-500 truncate max-w-[150px]">
                              {fb.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getTypeColor(fb.type)}`}>
                            {fb.type}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(fb.status)}`}>
                            {fb.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span className={`text-xs font-medium ${getPriorityColor(fb.priority)}`}>
                            {fb.priority || 'medium'}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top max-w-xs">
                          <p className="text-neutral-200 text-xs line-clamp-2">
                            {fb.message}
                          </p>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <span className="text-xs text-neutral-400">
                            {new Date(fb.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td className="px-4 py-3 align-top">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setSelectedFeedback(fb);
                                setEditMode(false);
                              }}
                              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                              title="View"
                            >
                              <Eye className="w-4 h-4 text-sky-400" />
                            </button>
                            <button
                              onClick={() => openEditMode(fb)}
                              className="p-2 hover:bg-neutral-800 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4 text-yellow-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Modal */}
        {selectedFeedback && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-50 overflow-y-auto" onClick={() => {
            setSelectedFeedback(null);
            setEditMode(false);
            setActionStatus(null);
          }}>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 sm:p-6 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between sticky top-0  bg-neutral-900 py-4 border-b border-neutral-800 z-10">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-3xl font-extrabold text-white mb-3 mt-3">
                      {editMode ? 'Edit Feedback' : 'Feedback Details'}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getTypeColor(selectedFeedback.type)}`}>
                        {selectedFeedback.type}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getStatusColor(editMode ? editForm.status : selectedFeedback.status)}`}>
                        {editMode ? editForm.status.replace('_', ' ') : selectedFeedback.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFeedback(null);
                      setEditMode(false);
                      setActionStatus(null);
                    }}
                    className="ml-4 p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex-shrink-0"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Messages */}
                {actionStatus && (
                  <div className={`p-3 rounded-lg border flex items-center gap-2 ${
                    actionStatus.type === 'success' 
                      ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                      : 'bg-red-500/10 border-red-500/30 text-red-400'
                  }`}>
                    {actionStatus.type === 'success' ? <Check className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                    {actionStatus.message}
                  </div>
                )}

                <div className="space-y-4 pb-4">
                  {/* User Info */}
                  <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
                    <p className="text-neutral-400 text-xs uppercase tracking-wider mb-2">From</p>
                    <p className="text-white font-medium text-lg">{selectedFeedback.name}</p>
                    <p className="text-neutral-400 text-sm">{selectedFeedback.email}</p>
                    {selectedFeedback.userId && (
                      <p className="text-neutral-600 text-xs mt-1">User ID: {selectedFeedback.userId}</p>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <p className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Message</p>
                    <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
                      <p className="text-neutral-200 text-sm whitespace-pre-wrap leading-relaxed">{selectedFeedback.message}</p>
                    </div>
                  </div>

                  {editMode ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-neutral-400 text-xs uppercase tracking-wider mb-2">Status</label>
                          <CustomSelect
                            value={editForm.status}
                            onChange={(value: any) => setEditForm({...editForm, status: value})}
                            options={statusOptions.filter(opt => opt.value !== 'all')}
                            label=""
                          />
                        </div>
                        <div>
                          <label className="block text-neutral-400 text-xs uppercase tracking-wider mb-2">Priority</label>
                          <CustomSelect
                            value={editForm.priority}
                            onChange={(value: any) => setEditForm({...editForm, priority: value})}
                            options={priorityOptions}
                            label=""
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-neutral-400 text-xs uppercase tracking-wider mb-2">Admin Notes</label>
                        <textarea
                          value={editForm.adminNotes}
                          onChange={(e) => setEditForm({...editForm, adminNotes: e.target.value})}
                          className="w-full px-4 py-3 bg-neutral-950 border border-neutral-800 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 min-h-[120px] resize-y"
                          placeholder="Add internal notes about this feedback..."
                          maxLength={2000}
                        />
                        <p className="text-xs text-neutral-600 mt-1">{editForm.adminNotes.length}/2000</p>
                      </div>
                    </>
                  ) : (
                    <>
                      {selectedFeedback.pageUrl && (
                        <div>
                          <p className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Page URL</p>
                          <a href={selectedFeedback.pageUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline text-sm break-all">
                            {selectedFeedback.pageUrl}
                          </a>
                        </div>
                      )}

                      <div className="grid grid-cols-2 gap-4">
                        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3">
                          <p className="text-neutral-400 text-xs uppercase tracking-wider mb-1">Priority</p>
                          <p className={`text-sm font-medium ${getPriorityColor(selectedFeedback.priority)}`}>
                            {selectedFeedback.priority || 'medium'}
                          </p>
                        </div>
                        <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3">
                          <p className="text-neutral-400 text-xs uppercase tracking-wider mb-1">Email Status</p>
                          <p className="text-sm text-white flex items-center gap-1">
                            {selectedFeedback.emailSent ? (
                              <>
                                <Check className="w-4 h-4 text-green-400" />
                                Sent
                              </>
                            ) : (
                              'Not sent'
                            )}
                          </p>
                        </div>
                      </div>

                      {selectedFeedback.adminNotes && (
                        <div>
                          <p className="text-neutral-400 text-xs uppercase tracking-wider mb-2">Admin Notes</p>
                          <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-4">
                            <p className="text-neutral-300 text-sm whitespace-pre-wrap leading-relaxed">{selectedFeedback.adminNotes}</p>
                          </div>
                        </div>
                      )}

                      <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3">
                        <p className="text-neutral-400 text-xs uppercase tracking-wider mb-1">Submitted</p>
                        <p className="text-white text-sm">
                          {new Date(selectedFeedback.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-800 sticky bottom-0 bg-neutral-900 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-4 mt-6">
                    {editMode ? (
                      <>
                        <button
                          onClick={() => setShowUpdateConfirm(true)}
                          disabled={updating}
                          className="flex-1 px-4 py-3 bg-sky-500 hover:bg-sky-600 disabled:bg-neutral-700 disabled:text-neutral-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          {updating ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Save Changes
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditMode(false);
                            setActionStatus(null);
                          }}
                          className="px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => openEditMode(selectedFeedback)}
                          className="flex-1 px-4 py-3 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/30 text-yellow-400 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Edit2 className="w-4 h-4" />
                          Edit Feedback
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(true)}
                          disabled={deleting}
                          className="px-4 py-3 bg-red-500/20 hover:bg-red-500/30 disabled:bg-neutral-800 border border-red-500/30 disabled:border-neutral-700 text-red-400 disabled:text-neutral-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          {deleting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedFeedback && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60]" onClick={(e) => {
            if (e.target === e.currentTarget) setShowDeleteConfirm(false);
          }}>
            <div className="bg-neutral-900 border border-red-500/30 rounded-xl max-w-md w-full p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Delete Feedback</h3>
                  <p className="text-sm text-neutral-400">This action cannot be undone</p>
                </div>
              </div>
              
              <p className="text-neutral-300 text-sm mb-6">
                Are you sure you want to delete this feedback from <span className="font-medium text-white">{selectedFeedback.name}</span>? All associated data will be permanently removed.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteFeedback}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Update Confirmation Modal */}
        {showUpdateConfirm && selectedFeedback && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[60] overflow-y-auto" onClick={(e) => {
            if (e.target === e.currentTarget) setShowUpdateConfirm(false);
          }}>
            <div className="bg-neutral-900 border border-sky-500/30 rounded-xl max-w-md w-full p-6 my-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-sky-500/20 border border-sky-500/30 flex items-center justify-center flex-shrink-0">
                  <Check className="w-6 h-6 text-sky-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Save Changes</h3>
                  <p className="text-sm text-neutral-400">Confirm feedback update</p>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                <p className="text-neutral-300 text-sm">
                  You are about to update the feedback from <span className="font-medium text-white">{selectedFeedback.name}</span> with the following changes:
                </p>
                
                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Status:</span>
                    <span className="text-white font-medium">{editForm.status.replace('_', ' ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Priority:</span>
                    <span className={`font-medium ${getPriorityColor(editForm.priority)}`}>{editForm.priority}</span>
                  </div>
                  {editForm.adminNotes && (
                    <div className="pt-2 border-t border-neutral-800">
                      <span className="text-neutral-400">Admin Notes:</span>
                      <p className="text-white mt-1 line-clamp-3">{editForm.adminNotes}</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowUpdateConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateFeedback}
                  className="flex-1 px-4 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-medium transition-colors"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackAdminPage;