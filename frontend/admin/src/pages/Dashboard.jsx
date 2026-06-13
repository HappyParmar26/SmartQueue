import React from "react";
import { Link } from "react-router-dom"; // Assumes you'll use this later

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* <DashboardNavbar /> */}
      
      <main className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, Alex</h1>
            <p className="text-gray-500 mt-1">Here is your current queue status.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors shadow-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Book New Token
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Active Tokens & History */}
          <div className="lg:col-span-2 space-y-8">
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                Active Tokens
              </h2>
              
              {/* Active Token Card */}
              <div className="bg-white border-2 border-blue-100 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                {/* Decorative background shape */}
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-blue-50 rounded-full opacity-50 pointer-events-none"></div>
                
                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-6">
                  
                  {/* Left Side: Office & Token Info */}
                  <div className="flex-1">
                    <div className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold uppercase tracking-wider rounded-lg mb-3">
                      Transport / RTO
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">Regional Transport Office</h3>
                    <p className="text-gray-500 text-sm mb-6">Driving License Renewal</p>
                    
                    {/* Live Queue Progress */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex justify-between items-end mb-2">
                        <div>
                          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Currently Serving</p>
                          <p className="text-2xl font-bold text-gray-900">B-139</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-blue-600 font-medium uppercase tracking-wider">Your Token</p>
                          <p className="text-2xl font-black text-blue-600">B-142</p>
                        </div>
                      </div>
                      
                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 mt-4">
                        <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                      <p className="text-xs text-gray-500 text-center font-medium">3 people ahead of you</p>
                    </div>
                  </div>

                  {/* Right Side: Timing & Actions */}
                  <div className="flex flex-col items-center justify-center w-full sm:w-auto min-w-[140px] p-4 bg-blue-600 rounded-2xl text-white shadow-md">
                    <p className="text-blue-100 text-xs font-medium uppercase tracking-wider mb-1">Est. Time</p>
                    <p className="text-3xl font-black tracking-tighter mb-1">15</p>
                    <p className="text-sm font-medium mb-4">Minutes</p>
                    <button className="w-full py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg text-sm font-semibold transition-colors">
                      Cancel
                    </button>
                  </div>
                  
                </div>
              </div>
            </section>

            {/* Quick Stats or Next Steps */}
            <section className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-gray-500">Total Hours Saved</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">4.5 hrs</p>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-sm font-semibold text-gray-500">Completed Visits</h4>
                <p className="text-2xl font-bold text-gray-900 mt-1">3</p>
              </div>
            </section>
          </div>

          {/* Right Column: Notifications */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full max-h-[600px]">
              
              <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-800">Mark all read</button>
              </div>

              <div className="overflow-y-auto p-4 space-y-3 flex-grow bg-gray-50/50">
                
                {/* Notification 1: Urgent/Actionable */}
                <div className="bg-white border border-blue-100 p-4 rounded-xl shadow-sm relative">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-l-xl"></div>
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Your turn is approaching!</p>
                      <p className="text-sm text-gray-500 mt-0.5">Only 3 people ahead of you at the RTO. Please start heading to Counter 4.</p>
                      <p className="text-xs text-gray-400 mt-2 font-medium">Just now</p>
                    </div>
                  </div>
                </div>

                {/* Notification 2: Success */}
                <div className="bg-white border border-gray-100 p-4 rounded-xl">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Token Confirmed</p>
                      <p className="text-sm text-gray-500 mt-0.5">Token B-142 has been successfully booked for today at 10:30 AM.</p>
                      <p className="text-xs text-gray-400 mt-2 font-medium">2 hours ago</p>
                    </div>
                  </div>
                </div>

                {/* Notification 3: Info */}
                <div className="bg-white border border-gray-100 p-4 rounded-xl">
                  <div className="flex gap-3">
                    <div className="mt-0.5">
                      <div className="w-8 h-8 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Document Reminder</p>
                      <p className="text-sm text-gray-500 mt-0.5">Don't forget to bring your original Aadhar card for your driving license renewal.</p>
                      <p className="text-xs text-gray-400 mt-2 font-medium">Yesterday</p>
                    </div>
                  </div>
                </div>

              </div>
              
              <div className="p-4 border-t border-gray-100 bg-white text-center">
                <button className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">
                  View all notifications
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

// --- Sub Components ---

function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 hidden sm:block">
            SmartQueue <span className="text-blue-600">AI</span>
          </span>
        </div>

        {/* Right Side Nav */}
        <div className="flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#" className="text-blue-600">Dashboard</a>
            <a href="#" className="hover:text-blue-600 transition-colors">History</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Settings</a>
          </nav>

          {/* Divider */}
          <div className="hidden md:block w-px h-6 bg-gray-200"></div>

          {/* User Profile Dropdown Placeholder */}
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 bg-blue-100 text-blue-700 font-bold rounded-full flex items-center justify-center border border-blue-200">
              AL
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-gray-900 leading-tight">Alex L.</p>
              <p className="text-xs text-gray-500 leading-tight">Citizen</p>
            </div>
            <svg className="w-4 h-4 text-gray-400 hidden sm:block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
      </div>
    </header>
  );
}