'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const ReportPage = () => {
    const feedbackCategories = [
  { value: 'bug', label: 'Bug Report' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'suggestion', label: 'General Suggestion' },
  { value: 'other', label: 'Other' },
];

  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();
  
  const [form, setForm] = useState({
    type: 'suggestion',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [validationError, setValidationError] = useState('');

  // ✅ simple validity check for disabling button
  const isFormValid = form.message.trim().length >= 10;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // Clear validation error when user starts typing
    if (validationError) setValidationError('');
    if (status) setStatus(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isSignedIn) {
      setStatus('error');
      setErrorMsg('Please sign in to submit feedback');
      return;
    }

    // Extra safety validation (in case someone bypasses the UI)
    if (!form.message.trim()) {
      setValidationError('Please provide a detailed description of your feedback');
      return;
    }

    if (form.message.trim().length < 10) {
      setValidationError('Please provide at least 10 characters in your description');
      return;
    }

    setLoading(true);
    setStatus(null);
    setErrorMsg('');
    setValidationError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          name: user?.fullName || user?.firstName || 'Anonymous',
          email: user?.primaryEmailAddress?.emailAddress || '',
          userId: user?.id,
          pageUrl: window.location.href,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setForm({
        type: 'suggestion',
        message: '',
      });
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message || 'Failed to send feedback');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="border rounded-xl p-8 text-center">
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

  // If not signed in, show sign-in prompt
  if (!isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-20 ">
        <div className="w-full max-w-md">
          <div className="border  rounded-xl p-8  text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full  flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
transform hover:scale-105 transition-all duration-300

 text-white transition-colors"
            >
              Sign In to Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-30  ">
      <div className="w-full max-w-2xl bg-muted/10">
        <div className="border border-neutral-800 rounded-xl p-8 md:p-10">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full  flex items-center justify-center">
                <span className="text-sky-500 font-semibold text-sm">
                  {user?.firstName?.charAt(0) || user?.emailAddresses[0]?.emailAddress?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold text-white">
                  Submit Feedback
                </h1>
              </div>
            </div>
            <p className="text-neutral-400 leading-relaxed">
              Hello {user?.firstName || 'there'}! We value your input. Please share any issues you&quote;ve encountered or
              suggestions for improvement to help us enhance the AIspire platform.
            </p>
          </div>

          {/* ✅ Wrap fields in a real <form> so handleSubmit works */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Your Name
                </label>
                <div className="w-full rounded-lg px-4 py-2.5  border border-neutral-800 text-neutral-400 text-sm">
                  {user?.fullName || user?.firstName || 'Anonymous'}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-neutral-300">
                  Email Address
                </label>
                <div className="w-full rounded-lg px-4 py-2.5  border border-neutral-800 text-neutral-400 text-sm truncate">
                  {user?.primaryEmailAddress?.emailAddress || 'No email provided'}
                </div>
              </div>
            </div>

            <div>
  <label className="block text-sm font-medium mb-2 text-neutral-300">
    Feedback Category <span className="text-red-500">*</span>
  </label>

  <div className="flex flex-wrap gap-2">
    {feedbackCategories.map((cat) => {
      const isActive = form.type === cat.value;
      return (
        <button
          key={cat.value}
          type="button"
          onClick={() => setForm((prev) => ({ ...prev, type: cat.value }))}
          className={`px-3 py-1.5 rounded-full text-xs md:text-sm border transition-all
            ${isActive
              ? 'bg-sky-500/20 border-sky-500 text-sky-300 shadow-[0_0_0_1px_rgba(56,189,248,0.4)]'
              : 'bg-background border-neutral-800 text-neutral-400 hover:border-neutral-600 hover:text-neutral-200'
            }`}
        >
          {cat.label}
        </button>
      );
    })}
  </div>
</div>


            <div>
              <label className="block text-sm font-medium mb-2 text-neutral-300">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className={`w-full rounded-lg px-4 py-3  border placeholder:font-extralight ${
                  validationError
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-neutral-800 focus:border-sky-500 focus:ring-sky-500'
                } text-white text-sm focus:outline-none focus:ring-1 transition-colors min-h-[150px] resize-y`}
                placeholder="Please provide as much detail as possible to help us understand and address your feedback effectively..."
              />
              {validationError && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {validationError}
                </p>
              )}
              <p className="mt-1 text-xs text-neutral-500">
                Minimum 10 characters. ({form.message.trim().length}/10)
              </p>
            </div>

            {status === 'success' && (
              <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-4">
                <p className="text-sm text-emerald-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Thank you for your feedback. Your submission has been received and will be reviewed by our team.
                </p>
              </div>
            )}
            
            {status === 'error' && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-sm text-red-400 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  {errorMsg}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full rounded-lg px-6 py-3 text-sm font-semibold bg-gradient-to-br from-blue-400/80 to-purple-600/80
backdrop-blur-sm
hover:from-blue-500/90 hover:to-purple-700/90
shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
hover:shadow-[0_8px_40px_0_rgba(31,38,135,0.5)]
border border-white/20
transform hover:scale-105 transition-all duration-300 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
