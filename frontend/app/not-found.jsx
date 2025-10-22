'use client';
import React from 'react';
import { Home, Search, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-center p-6 relative overflow-hidden">
      
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-black"></div>
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gray-500/5 rounded-full blur-3xl"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-2xl">
        
        {/* Error Code */}
        <div className="relative mb-8">
          <h1 className="text-9xl md:text-[12rem] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500 tracking-tight">
            404
          </h1>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white px-6 py-2 text-sm font-semibold rounded-lg rotate-3 text-black shadow-lg border border-gray-300">
              Page Not Found
            </div>
          </div>
        </div>
        
        {/* Message */}
        <h2 className="text-2xl md:text-3xl font-semibold text-white mb-4">
          Oops! This page doesn't exist
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => window.history.back()}
            className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-white bg-gray-900 border border-gray-700 rounded-lg hover:bg-gray-800 hover:border-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Go Back
          </button>
          
          <a 
            href="/" 
            className="group flex items-center gap-2 px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105">
            <Home className="w-4 h-4" />
            Return Home
          </a>
        </div>

        {/* Additional Help */}
        {/* <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific?
          </p>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search our site..."
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 focus:ring-2 focus:ring-gray-800 transition-all"
            />
          </div>
        </div> */}
      </div>
    </div>
  );
}