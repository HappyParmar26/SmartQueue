// import React from "react";

// const Home = () => {
//     const openAuthModal = () => {
//         // setAuthOpen(true)
//         console.log("Open Login/Register Modal");
//     };

//     return (
//         <div className="min-h-screen bg-white">
//             {/* Navbar */}
//             <nav className="sticky top-0 z-50 border-b border-white/10 bg-primary/95 text-white backdrop-blur-md">
//                 <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-12">
//                     <div className="flex items-center gap-2 text-2xl font-bold">
//                         <i className="ph ph-waves text-secondary"></i>
//                         SmartQueue AI
//                     </div>

//                     <div className="hidden items-center gap-8 md:flex">
//                         <a
//                             href="#features"
//                             className="hover:text-secondary transition"
//                         >
//                             Features
//                         </a>

//                         <a
//                             href="#how-it-works"
//                             className="hover:text-secondary transition"
//                         >
//                             How It Works
//                         </a>

//                         <a
//                             href="#contact"
//                             className="hover:text-secondary transition"
//                         >
//                             Contact
//                         </a>
//                     </div>

//                     <button
//                         onClick={openAuthModal}
//                         className="rounded-full bg-secondary px-6 py-2 font-medium text-black shadow-lg transition hover:bg-teal-300"
//                     >
//                         Login / Register
//                     </button>
//                 </div>
//             </nav>

//             {/* Hero */}
//             <section className="bg-gradient-to-b from-blue-50 via-white to-white">
//                 <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-16 px-6 py-20 lg:flex-row lg:px-12">
//                     <div className="lg:w-1/2">
//                         <span className="inline-block rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-600">
//                             Government of India Initiative
//                         </span>

//                         <h1 className="mt-6 text-5xl font-bold leading-tight text-gray-900 lg:text-7xl">
//                             Skip The Queue.
//                             <br />
//                             <span className="text-primary">
//                                 Save Hours.
//                             </span>
//                         </h1>

//                         <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
//                             AI-powered queue management for
//                             government offices, hospitals,
//                             municipal corporations, and RTOs.
//                             Book digital tokens, receive
//                             real-time updates, and arrive only
//                             when it's your turn.
//                         </p>

//                         <div className="mt-8 flex flex-wrap gap-4">
//                             <button
//                                 onClick={openAuthModal}
//                                 className="flex items-center gap-2 rounded-xl bg-primary px-8 py-4 font-semibold text-white shadow-xl shadow-blue-900/20 transition hover:bg-blue-800"
//                             >
//                                 Get Started
//                                 <i className="ph ph-arrow-right"></i>
//                             </button>

//                             <button className="rounded-xl border border-gray-300 px-8 py-4 font-semibold text-gray-700 transition hover:bg-gray-100">
//                                 Learn More
//                             </button>
//                         </div>
//                     </div>

//                     <div className="relative lg:w-1/2">
//                         <div className="absolute inset-0 rounded-full bg-secondary blur-3xl opacity-20"></div>

//                         <img
//                             src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80"
//                             alt="SmartQueue Dashboard"
//                             className="relative z-10 rounded-3xl border-4 border-white shadow-2xl"
//                         />
//                     </div>
//                 </div>
//             </section>

//             {/* Stats */}
//             <section className="px-6 py-16 lg:px-12">
//                 <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2 lg:grid-cols-4">
//                     <div className="rounded-3xl bg-white p-8 shadow-lg">
//                         <h3 className="text-4xl font-bold text-primary">
//                             85%
//                         </h3>
//                         <p className="mt-2 text-gray-600">
//                             Reduced Waiting Time
//                         </p>
//                     </div>

//                     <div className="rounded-3xl bg-white p-8 shadow-lg">
//                         <h3 className="text-4xl font-bold text-primary">
//                             500K+
//                         </h3>
//                         <p className="mt-2 text-gray-600">
//                             Citizens Served
//                         </p>
//                     </div>

//                     <div className="rounded-3xl bg-white p-8 shadow-lg">
//                         <h3 className="text-4xl font-bold text-primary">
//                             200+
//                         </h3>
//                         <p className="mt-2 text-gray-600">
//                             Government Offices
//                         </p>
//                     </div>

//                     <div className="rounded-3xl bg-white p-8 shadow-lg">
//                         <h3 className="text-4xl font-bold text-primary">
//                             24/7
//                         </h3>
//                         <p className="mt-2 text-gray-600">
//                             Queue Monitoring
//                         </p>
//                     </div>
//                 </div>
//             </section>

//             {/* Features */}
//             <section
//                 id="features"
//                 className="bg-gray-50 px-6 py-24 lg:px-12"
//             >
//                 <div className="mx-auto max-w-7xl">
//                     <h2 className="text-center text-4xl font-bold text-gray-900">
//                         Why SmartQueue AI?
//                     </h2>

//                     <p className="mx-auto mt-4 max-w-2xl text-center text-gray-600">
//                         Leveraging AI and real-time analytics
//                         to transform public service delivery.
//                     </p>

//                     <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
//                         <div className="rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <i className="ph ph-brain text-5xl text-primary"></i>

//                             <h3 className="mt-4 text-xl font-bold">
//                                 AI Predictions
//                             </h3>

//                             <p className="mt-3 text-gray-600">
//                                 Predict queue durations and
//                                 optimize arrival times with AI.
//                             </p>
//                         </div>

//                         <div className="rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <i className="ph ph-bell-ringing text-5xl text-primary"></i>

//                             <h3 className="mt-4 text-xl font-bold">
//                                 Real-Time Alerts
//                             </h3>

//                             <p className="mt-3 text-gray-600">
//                                 Get notifications when your turn
//                                 is approaching.
//                             </p>
//                         </div>

//                         <div className="rounded-3xl bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2">
//                             <i className="ph ph-users-three text-5xl text-primary"></i>

//                             <h3 className="mt-4 text-xl font-bold">
//                                 Crowd Management
//                             </h3>

//                             <p className="mt-3 text-gray-600">
//                                 Reduce overcrowding and improve
//                                 citizen experience.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* How It Works */}
//             <section
//                 id="how-it-works"
//                 className="px-6 py-24 lg:px-12"
//             >
//                 <div className="mx-auto max-w-7xl">
//                     <h2 className="text-center text-4xl font-bold">
//                         How It Works
//                     </h2>

//                     <div className="mt-16 grid gap-12 md:grid-cols-3">
//                         <div className="text-center">
//                             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
//                                 1
//                             </div>

//                             <h3 className="mt-6 text-xl font-bold">
//                                 Book a Token
//                             </h3>

//                             <p className="mt-2 text-gray-600">
//                                 Select office, service, and
//                                 preferred time slot.
//                             </p>
//                         </div>

//                         <div className="text-center">
//                             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
//                                 2
//                             </div>

//                             <h3 className="mt-6 text-xl font-bold">
//                                 Track Queue
//                             </h3>

//                             <p className="mt-2 text-gray-600">
//                                 Monitor live queue status from
//                                 anywhere.
//                             </p>
//                         </div>

//                         <div className="text-center">
//                             <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-white">
//                                 3
//                             </div>

//                             <h3 className="mt-6 text-xl font-bold">
//                                 Arrive On Time
//                             </h3>

//                             <p className="mt-2 text-gray-600">
//                                 Visit only when your turn is near.
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </section>

//             {/* CTA */}
//             <section className="bg-primary px-6 py-24 text-center text-white">
//                 <h2 className="text-4xl font-bold lg:text-5xl">
//                     Ready to Skip the Queue?
//                 </h2>

//                 <p className="mx-auto mt-4 max-w-2xl text-lg text-blue-100">
//                     Join the future of public service
//                     management and experience hassle-free
//                     appointments.
//                 </p>

//                 <button
//                     onClick={openAuthModal}
//                     className="mt-8 rounded-xl bg-secondary px-8 py-4 font-bold text-black transition hover:bg-teal-300"
//                 >
//                     Login / Register
//                 </button>
//             </section>

//             {/* Footer */}
//             <footer
//                 id="contact"
//                 className="bg-gray-900 px-6 py-10 text-center text-gray-400"
//             >
//                 <p>
//                     © 2026 SmartQueue AI · Government
//                     Digital Service Platform
//                 </p>
//             </footer>
//         </div>
//     );
// };

// export default Home;

// import React, { useState } from "react";

// export default function Home({ onOpenAuthModal }) {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

//       {/* 2. Hero Section */}
//       <header className="relative overflow-hidden bg-white px-4 sm:px-6 pt-16 pb-24 sm:pt-24 sm:pb-32 text-center border-b border-slate-200">
//         <div className="mx-auto max-w-4xl">
//           <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
//             Skip the Queue. <br className="block sm:hidden" />
//             <span className="text-blue-600">Save Hours.</span>
//           </h1>
//           <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg leading-7 sm:leading-8 text-slate-600">
//             AI-powered queue management for government offices, hospitals, municipal corporations, and RTOs. Book your token digitally and arrive exactly when it's your turn.
//           </p>
//           <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
//             <button
//               onClick={() => onOpenAuthModal('register')}
//               className="w-full sm:w-auto rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 transition"
//             >
//               Get Started
//             </button>
//             <a href="#how-it-works" className="transition text-base font-semibold text-slate-900 hover:text-blue-600 transition py-2">
//               Learn More <span aria-hidden="true">→</span>
//             </a>
//           </div>
//         </div>
//       </header>

//       {/* 3. Statistics Section */}
//       <section className="bg-blue-900 py-10 sm:py-12">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6">
//           <div className="grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
//             <div className="flex flex-col">
//               <span className="text-3xl sm:text-4xl font-bold text-white">2M+</span>
//               <span className="mt-2 text-sm font-medium text-blue-200">Citizens Served</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-3xl sm:text-4xl font-bold text-white">500+</span>
//               <span className="mt-2 text-sm font-medium text-blue-200">Government Offices</span>
//             </div>
//             <div className="flex flex-col">
//               <span className="text-3xl sm:text-4xl font-bold text-white">45 Min</span>
//               <span className="mt-2 text-sm font-medium text-blue-200">Average Time Saved</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* 4. Features Section */}
//       <section id="features" className="bg-slate-50 py-16 sm:py-24">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6">
//           <div className="mx-auto max-w-2xl text-center">
//             <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Everything you need to save time</h2>
//             <p className="mt-4 text-base sm:text-lg text-slate-600">No more standing in line. Manage your appointments and wait times from your smartphone.</p>
//           </div>
//           <div className="mx-auto mt-12 sm:mt-16 max-w-5xl grid grid-cols-1 gap-6 sm:grid-cols-2">
//             {[
//               { title: "Digital Tokens", desc: "Book your spot in line before you even leave your house." },
//               { title: "Live Tracking", desc: "Watch the queue move in real-time from our citizen dashboard." },
//               { title: "AI Wait Predictions", desc: "Get highly accurate wait time estimates powered by historical data." },
//               { title: "Paperless Experience", desc: "No need to print anything. Show your digital token QR code at the counter." }
//             ].map((feature, idx) => (
//               <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm transition hover:shadow-md">
//                 <h3 className="text-lg sm:text-xl font-semibold text-slate-900">{feature.title}</h3>
//                 <p className="mt-2 sm:mt-4 text-sm sm:text-base text-slate-600">{feature.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* 5. How It Works */}
//       <section id="how-it-works" className="bg-white py-16 sm:py-24 border-t border-slate-200">
//         <div className="mx-auto max-w-7xl px-4 sm:px-6">
//           <div className="mx-auto max-w-2xl text-center">
//             <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">How It Works</h2>
//             <p className="mt-4 text-base sm:text-lg text-slate-600">Four simple steps to a hassle-free public service experience.</p>
//           </div>
//           <div className="mx-auto mt-12 sm:mt-16 grid max-w-5xl grid-cols-1 gap-10 sm:grid-cols-4 text-center">
//             {[
//               { step: "1", title: "Search Office", desc: "Find your local RTO, hospital, or municipality." },
//               { step: "2", title: "Book Token", desc: "Select your service and generate a digital token." },
//               { step: "3", title: "Track Live", desc: "Monitor your turn and get AI time estimates." },
//               { step: "4", title: "Get Served", desc: "Arrive just in time and scan your token." }
//             ].map((item, idx) => (
//               <div key={idx} className="flex flex-col items-center">
//                 <div className="flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-blue-100 text-xl sm:text-2xl font-bold text-blue-600 mb-4 sm:mb-6">
//                   {item.step}
//                 </div>
//                 <h3 className="text-base sm:text-lg font-semibold text-slate-900">{item.title}</h3>
//                 <p className="mt-2 text-sm text-slate-600 max-w-[200px] sm:max-w-none">{item.desc}</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* 6. CTA Section */}
//       <section className="bg-slate-50 py-16 sm:py-24 border-t border-slate-200">
//         <div className="mx-auto max-w-4xl text-center px-4 sm:px-6">
//           <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Ready to take back your time?</h2>
//           <p className="mx-auto mt-4 max-w-xl text-base sm:text-lg text-slate-600">Join thousands of citizens who are already skipping the line at government offices.</p>
//           <div className="mt-8 flex justify-center">
//             <button
//               onClick={() => onOpenAuthModal('register')}
//               className="w-full sm:w-auto rounded-md bg-blue-600 px-8 py-3 text-base sm:text-lg font-semibold text-white shadow-sm hover:bg-blue-700 transition"
//             >
//               Create Free Account
//             </button>
//           </div>
//         </div>
//       </section>

//     </div>
//   );
// }

import React, { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { clsx } from "clsx";
import AuthDialog from "../components/auth/AuthDialog";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50 text-gray-900 ">
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <FeaturesSection />
        <HowItWorksSection />
        {/* <CtaSection /> */}
      </main>
    </div>
  );
}

// --- Sub-components (Can be extracted to src/components/ui or layout later) ---

function HeroSection() {
  return (
    <section className="pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden bg-white">
      <div className="container mx-auto px-4">
        {/* CSS Grid: 1 column on mobile, 2 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* --- LEFT COLUMN: Text Content --- */}
          {/* Centered on mobile, left-aligned on desktop */}
          <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-medium mb-6 border border-blue-100">
              <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
              Live in 50+ Government Centers
            </div>

            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              Skip the Queue. <br className="hidden lg:block" />
              <span className="text-blue-600">Save Hours.</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              AI-powered queue management for government offices, hospitals,
              municipal corporations, and RTOs. Book your token digitally and
              arrive exactly when you're needed.
            </p>

            {/* Flex container for buttons: centered on mobile, left-aligned on desktop */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                to="/book-token"
                className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
              >
                Book a Token Now
              </Link>
              <button className="w-full sm:w-auto px-8 py-3.5 text-base font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* --- RIGHT COLUMN: Image --- */}
          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            {/* Optional decorative background offset to make the image pop */}
            <div className="absolute -inset-4 bg-blue-50 rounded-3xl transform rotate-3 -z-10 hidden sm:block"></div>

            <img
              src="https://media.istockphoto.com/id/177129252/photo/waiting-in-line.jpg"
              alt="People waiting in a long queue"
              className="relative w-full h-auto object-cover rounded-2xl shadow-2xl aspect-[4/3] z-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { label: "Citizens Served", value: "2M+" },
    { label: "Average Time Saved", value: "45 mins" },
    { label: "Active Centers", value: "120+" },
    { label: "Accuracy Rate", value: "98%" },
  ];

  return (
    <section className="py-12 text-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-1 border rounded-2xl p-6 bg-[#222424] shadow-sm hover:shadow-md transition"
            >
              <span className="text-4xl font-bold tracking-tight">
                {stat.value}
              </span>
              <span className="text-blue-100 text-sm font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: "Digital Token Booking",
      description:
        "Book your spot in line from the comfort of your home. No more standing in the sun for hours.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      ),
    },
    {
      title: "Live Queue Status",
      description:
        "Monitor the line in real-time. Know exactly which token is currently being served at your selected counter.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      ),
    },
    {
      title: "AI Wait-Time Prediction",
      description:
        "Our AI analyzes current office speeds to predict exactly when your turn will come. Leave home just in time.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything you need to save time
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            SmartQueue AI brings transparency and predictability to public
            services, putting you in control of your schedule.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-lg transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const steps = [
    {
      num: "01",
      title: "Select Service",
      desc: "Choose your city and the specific government office or hospital.",
    },
    {
      num: "02",
      title: "Book Token",
      desc: "Get a digital token instantly on your phone via SMS or the portal.",
    },
    {
      num: "03",
      title: "Track Live",
      desc: "Watch the queue progress and get AI alerts on your expected turn time.",
    },
    {
      num: "04",
      title: "Arrive on Time",
      desc: "Walk straight to the counter without sitting in a crowded waiting room.",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-gray-50 border-t border-gray-200"
    >
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-gray-600">
            Four simple steps to a hassle-free experience.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div
              key={idx}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-16 h-16 bg-white border-2 border-blue-600 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold mb-4 z-10 shadow-sm">
                {step.num}
              </div>
              {/* Connector Line (hidden on mobile) */}
              {idx !== steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-blue-200"></div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-gray-600 text-sm px-4">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-4xl text-center bg-gray-900 rounded-3xl p-10 md:p-16 shadow-xl">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to reclaim your day?
        </h2>
        <p className="text-gray-300 mb-8 text-lg max-w-xl mx-auto">
          Create an account in 30 seconds and book your first digital token for
          the RTO, hospital, or municipal office.
        </p>
        <button className="px-8 py-4 text-base font-bold text-gray-900 bg-white rounded-xl hover:bg-gray-100 transition-colors shadow-lg">
          Create Citizen Account
        </button>
      </div>
    </section>
  );
}
