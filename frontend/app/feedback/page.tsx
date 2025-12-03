'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const ReportPage = () => {
  const feedbackCategories = [
    { value: 'bug', label: 'Bug Report', icon: '🐛', description: 'Report a technical issue' },
    { value: 'feature', label: 'Feature Request', icon: '✨', description: 'Suggest a new feature' },
    { value: 'suggestion', label: 'Suggestion', icon: '💡', description: 'Share improvement ideas' },
    { value: 'other', label: 'Other', icon: '📝', description: 'General feedback' },
  ];

  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  
  const [form, setForm] = useState({
    name: '',
    email: '',
    type: 'suggestion',
    message: '',
    pageUrl: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Populate form when user loads
  useEffect(() => {
    if (isSignedIn && user) {
      setForm(prev => ({
        ...prev,
        name: user.fullName || user.firstName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
      }));
    }
  }, [isSignedIn, user]);

  // Validation logic
  const validateForm = () => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!form.name.trim()) {
      errors.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (form.name.trim().length > 100) {
      errors.name = 'Name must be less than 100 characters';
    }

    // Email validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!form.email.trim()) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(form.email)) {
      errors.email = 'Please enter a valid email address';
    } else if (form.email.length > 160) {
      errors.email = 'Email must be less than 160 characters';
    }

    // Message validation
    if (!form.message.trim()) {
      errors.message = 'Message is required';
    } else if (form.message.trim().length < 20) {
      errors.message = 'Message must be at least 20 characters';
    } else if (form.message.trim().length > 5000) {
      errors.message = 'Message must be less than 5000 characters';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const isFormValid = 
    form.name.trim().length >= 2 && 
    form.email.trim().length > 0 && 
    /^\S+@\S+\.\S+$/.test(form.email) &&
    form.message.trim().length >= 20;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (status) setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      setStatus('error');
      setErrorMsg('Please sign in to submit feedback');
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setStatus(null);
    setErrorMsg('');

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        type: form.type,
        message: form.message.trim(),
        pageUrl: form.pageUrl || window.location.href,
        userId: user?.id,
      };
//`${process.env.NEXT_PUBLIC_API_BASE}/api/feedback`
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        // Handle server-side validation errors
        if (data.errors && Array.isArray(data.errors)) {
          setErrorMsg(data.errors.join(', '));
        } else {
          setErrorMsg(data.message || 'Something went wrong');
        }
        setStatus('error');
        return;
      }

      setStatus('success');
      
      // Reset form after successful submission
      setTimeout(() => {
        setForm({
          name: user?.fullName || user?.firstName || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
          type: 'suggestion',
          message: '',
          pageUrl: window.location.href,
        });
        setStatus(null);
      }, 3000);
      
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10 ">
        <div className="w-full max-w-md ">
          <div className="border border-neutral-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
            <p className="text-neutral-400">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not signed in
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="border border-neutral-800 rounded-xl p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-sky-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 " fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-white">Authentication Required</h2>
            <p className="text-neutral-400 mb-6">
              Please sign in to submit feedback. This helps us follow up on your suggestions and keep you informed.
            </p>
            <button
              onClick={() => router.push('/sign-in')}
              className="w-full rounded-lg px-6 py-3 text-sm font-semibold bg-gradient-to-br from-blue-400/80 to-purple-600/80
backdrop-blur-sm
hover:from-blue-500/90 hover:to-purple-700/90
shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.5)]
border border-white/20
transform hover:scale-105 transition-all duration-300 text-white transition-colors"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-30 bg-black">
      <div className="w-full max-w-2xl">
        <div className="border border-neutral-800 rounded-xl p-8 md:p-10 bg-neutral-900/40">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-sky-500/10 flex items-center justify-center">
                <span className="text-sky-400 font-semibold text-lg">
                  {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-white ">
                  Submit Feedback
                </h1>
              </div>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Hello {user?.firstName || 'there'}! We value your input. Please share any issues you&ve encountered or suggestions for improvement to help us enhance the AIspire platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" name='feedback_form'>
            
            {/* Name and Email Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Your Name <span className="text-red-400">*</span>
                </label>
                <div className="w-full rounded-lg px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 text-neutral-400 text-sm">
                  {form.name || 'Loading...'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Email Address <span className="text-red-400">*</span>
                </label>
                <div className="w-full rounded-lg px-4 py-2.5 bg-neutral-900/50 border border-neutral-800 text-neutral-400 text-sm truncate">
                  {form.email || 'Loading...'}
                </div>
              </div>
            </div>

            {/* Feedback Category */}
            <div>
              <label className="block text-sm font-medium mb-3 text-neutral-300">
                Feedback Category <span className="text-red-400">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {feedbackCategories.map((cat) => {
                  const isActive = form.type === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, type: cat.value }))}
                      className={`p-4 rounded-lg border transition-all text-left ${
                        isActive
                          ? 'bg-sky-500/10 border-sky-500 shadow-[0_0_0_1px_rgba(56,189,248,0.4)]'
                          : 'bg-neutral-950 border-neutral-800 hover:border-neutral-600'
                      }`}
                    >
                      <div className={`text-sm font-medium ${isActive ? 'text-sky-300' : 'text-white'}`}>
                        {cat.label}
                      </div>
                      <div className="text-xs text-neutral-500 mt-1">
                        {cat.description}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Page URL (Optional) */}
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Page URL <span className="text-neutral-500 text-xs">(Optional)</span>
              </label>
              <input
                type="url"
                name="pageUrl"
                value={form.pageUrl}
                onChange={handleChange}
                className="w-full rounded-lg px-4 py-2.5 bg-neutral-950 border border-neutral-800 focus:border-sky-500 text-white text-sm focus:outline-none focus:ring-1 transition-colors"
                placeholder="https://example.com/page"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Where did you encounter this issue or have this idea?
              </p>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Detailed Description <span className="text-red-400">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className={`w-full rounded-lg px-4 py-3 bg-neutral-950 border placeholder:font-extralight ${
                  validationErrors.message
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-neutral-800 focus:border-sky-500'
                } text-white text-sm focus:outline-none focus:ring-1 transition-colors min-h-[150px] resize-y`}
                placeholder="Please provide as much detail as possible to help us understand and address your feedback effectively..."
                maxLength={5000}
              />
              {validationErrors.message && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {validationErrors.message}
                </p>
              )}
              <p className="mt-1 text-xs text-neutral-500">
                {form.message.trim().length}/5000 characters (minimum 20)
              </p>
            </div>

            {/* Success Message */}
            {status === 'success' && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
                <p className="text-sm text-emerald-400 flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Thank you for your feedback! We&quote;ve received your submission and sent you a confirmation email. Our team will review it shortly.
                </p>
              </div>
            )}
            
            {/* Error Message */}
            {status === 'error' && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {errorMsg}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full rounded-lg px-6 py-3 text-sm font-extrabold bg-gradient-to-br from-blue-400/80 to-purple-600/80
backdrop-blur-sm
hover:from-blue-500/90 hover:to-purple-700/90
shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.5)]
border border-white/20
transform hover:scale-105 transition-all duration-300 disabled:bg-neutral-700 disabled:text-neutral-500 text-white transition-all disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Feedback'
              )}
            </button>

            <p className="text-xs text-center text-neutral-500">
              By submitting this form, you agree to let us contact you about your feedback.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;